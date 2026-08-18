"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireLeadsAccess } from "@/lib/auth/permissions";
import { listLeads, saveLead } from "@/lib/cms/storage";
import type { LeadDispositionReason } from "@/lib/cms/types";
import { isLeadHandled } from "@/lib/leads/handling";

const dispositionSchema = z.discriminatedUnion("outcome", [
  z.object({
    leadId: z.string().uuid(),
    outcome: z.literal("added-to-calendar"),
  }),
  z.object({
    leadId: z.string().uuid(),
    outcome: z.literal("not-added"),
    dispositionReason: z.enum([
      "customer-no-response",
      "customer-declined",
      "service-not-accepted",
    ]),
    officeNote: z.string().trim().max(500).optional(),
  }),
]);

export type UpdateLeadDispositionResult =
  | { ok: true }
  | { ok: false; message: string };

export async function updateLeadDispositionAction(
  input: z.infer<typeof dispositionSchema>,
): Promise<UpdateLeadDispositionResult> {
  const session = await requireLeadsAccess();
  const parsed = dispositionSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, message: "Invalid lead disposition request." };
  }

  const leads = await listLeads();
  const existingLead = leads.find((lead) => lead.id === parsed.data.leadId);

  if (!existingLead) {
    return { ok: false, message: "Lead not found." };
  }

  if (isLeadHandled(existingLead)) {
    return { ok: false, message: "This lead has already been handled." };
  }

  const handledAt = new Date().toISOString();

  if (parsed.data.outcome === "added-to-calendar") {
    await saveLead({
      ...existingLead,
      disposition: "added-to-calendar",
      handledAt,
      handledBy: session.username,
    });
  } else {
    await saveLead({
      ...existingLead,
      disposition: "not-added",
      dispositionReason: parsed.data.dispositionReason as LeadDispositionReason,
      officeNote: parsed.data.officeNote || undefined,
      handledAt,
      handledBy: session.username,
    });
  }

  revalidatePath("/admin/leads");

  return { ok: true };
}

export async function markLeadAddedToCalendarAction(leadId: string): Promise<UpdateLeadDispositionResult> {
  return updateLeadDispositionAction({
    leadId,
    outcome: "added-to-calendar",
  });
}

export async function markLeadNotAddedAction(payload: {
  leadId: string;
  dispositionReason: LeadDispositionReason;
  officeNote?: string;
}): Promise<UpdateLeadDispositionResult> {
  return updateLeadDispositionAction({
    leadId: payload.leadId,
    outcome: "not-added",
    dispositionReason: payload.dispositionReason,
    officeNote: payload.officeNote,
  });
}
