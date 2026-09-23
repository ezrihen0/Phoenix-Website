"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { requireWettReportAccess } from "@/lib/auth/permissions";
import { rewriteWettTechnicianNote } from "@/lib/wett/ai-rewrite";
import type { TechnicianHelpAnswer, TechnicianHelpContext } from "@/lib/wett/knowledge/help";
import { askTechnicianHelp } from "@/lib/wett/technician-help";
import { runManufacturerLookup } from "@/lib/wett/manufacturer-lookup";
import { measurementOutputLines } from "@/lib/wett/measurements";
import { editableFromReport, type WettAiRewriteMode, type WettEditableDraft, type WettReport } from "@/lib/wett/schema";
import { identificationLines } from "@/lib/wett/system-profile";
import { finalizeWettReport, resendCompletedWettReport } from "@/lib/wett/completion";
import {
  createWettDraft,
  getWettReport,
  saveWettEditableDraft,
  setWettReviewStatus,
  updateWettAiNotes,
  updateWettPhotoCaption,
  WettReportError,
} from "@/lib/wett/service";

export type WettActionResult = {
  ok: boolean;
  message?: string;
  code?: "not-found" | "conflict" | "locked" | "invalid";
  unavailable?: boolean;
  report?: WettReport | null;
};

async function failure(error: unknown, reportId?: string): Promise<WettActionResult> {
  if (error instanceof WettReportError) {
    const report = error.code === "conflict" && reportId ? await getWettReport(reportId) : undefined;
    return {
      ok: false,
      message: error.message,
      code: error.code,
      report,
    };
  }

  if (error instanceof ZodError) {
    return {
      ok: false,
      code: "invalid",
      message: error.issues[0]?.message || "Check the report fields and try again.",
    };
  }

  return {
    ok: false,
    code: "invalid",
    message: "The report could not be saved.",
  };
}

export async function createWettDraftAction() {
  const session = await requireWettReportAccess();
  const report = await createWettDraft(session.username);
  revalidatePath("/admin/office/wett");
  redirect(`/admin/office/wett/${report.id}`);
}

export async function autosaveWettReportAction(
  reportId: string,
  expectedRevision: number,
  editable: WettEditableDraft,
): Promise<WettActionResult> {
  try {
    const session = await requireWettReportAccess();
    const report = await saveWettEditableDraft(reportId, session.username, expectedRevision, editable);
    return { ok: true, report };
  } catch (error) {
    return failure(error, reportId);
  }
}

export async function setWettReviewStatusAction(
  reportId: string,
  status: "draft" | "ready-for-review",
): Promise<WettActionResult> {
  try {
    const session = await requireWettReportAccess();
    const report = await setWettReviewStatus(reportId, session.username, status);
    return { ok: true, report };
  } catch (error) {
    return failure(error, reportId);
  }
}

export async function updateWettPhotoCaptionAction(
  reportId: string,
  expectedRevision: number,
  photoId: string,
  caption: string,
): Promise<WettActionResult> {
  try {
    const session = await requireWettReportAccess();
    const report = await updateWettPhotoCaption(reportId, session.username, expectedRevision, photoId, caption);
    return { ok: true, report };
  } catch (error) {
    return failure(error, reportId);
  }
}

export async function rewriteWettWordingAction(
  reportId: string,
  text: string,
  mode: WettAiRewriteMode,
): Promise<{ ok: boolean; candidate?: string; message?: string }> {
  try {
    await requireWettReportAccess();
    const current = await getWettReport(reportId);
    if (!current) return { ok: false, message: "Report not found." };
    const result = await rewriteWettTechnicianNote(text, mode, identificationLines(current.system), []);
    if (!result.ok) return { ok: false, message: result.message };
    return { ok: true, candidate: result.candidateNote };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "The rewrite could not be completed." };
  }
}

export async function lookupManufacturerRequirementAction(
  reportId: string,
  expectedRevision: number,
  requestedRequirement: string,
): Promise<WettActionResult> {
  try {
    const session = await requireWettReportAccess();
    const current = await getWettReport(reportId);
    if (!current) return { ok: false, code: "not-found", message: "Report not found." };
    const result = runManufacturerLookup({ requestedRequirement, system: current.system });
    const report = await saveWettEditableDraft(reportId, session.username, expectedRevision, {
      ...editableFromReport(current),
      manufacturerLookups: [
        ...current.manufacturerLookups,
        {
          id: crypto.randomUUID(),
          requestedRequirement,
          status: result.status,
          manufacturer: result.manufacturer,
          model: result.model,
          modelSuffix: result.modelSuffix,
          serial: result.serial,
          sourcesSearched: result.sourcesSearched,
          auditNote: result.auditNote,
          requirementValue: result.requirementValue,
          requirementUnit: result.requirementUnit,
          sourceDocument: result.sourceDocument,
          pageSection: result.pageSection,
          technicianAccepted: false,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    return { ok: true, report };
  } catch (error) {
    return failure(error, reportId);
  }
}

export async function askWettTechnicianHelpAction(
  context: TechnicianHelpContext,
  question: string,
): Promise<{ ok: boolean; answer?: TechnicianHelpAnswer; message?: string }> {
  try {
    await requireWettReportAccess();
    const result = await askTechnicianHelp(context, question);
    if (!result.ok) return { ok: false, message: result.message };
    return { ok: true, answer: result.answer };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "AI help is currently unavailable. The field guide remains available." };
  }
}

export async function rewriteWettNoteAction(
  reportId: string,
  expectedRevision: number,
  mode: WettAiRewriteMode,
): Promise<WettActionResult> {
  try {
    const session = await requireWettReportAccess();
    const current = await getWettReport(reportId);

    if (!current) {
      return { ok: false, code: "not-found", message: "Report not found." };
    }

    const source = current.notes.generalTechnicianNote || "";
    const result = await rewriteWettTechnicianNote(
      source,
      mode,
      identificationLines(current.system),
      measurementOutputLines(current.system, current.measurements.items),
    );

    if (!result.ok) {
      return {
        ok: false,
        message: result.message,
        unavailable: result.unavailable,
        report: current,
      };
    }

    const report = await updateWettAiNotes(reportId, session.username, expectedRevision, {
      ...current.notes,
      generalTechnicianNote: current.notes.generalTechnicianNote,
      aiOriginalNote: result.originalNote,
      aiCandidateNote: result.candidateNote,
      aiCandidateMode: result.mode,
      aiCandidateAt: new Date().toISOString(),
    });
    return { ok: true, report };
  } catch (error) {
    return failure(error, reportId);
  }
}

export async function acceptWettAiNoteAction(reportId: string, expectedRevision: number): Promise<WettActionResult> {
  try {
    const session = await requireWettReportAccess();
    const current = await getWettReport(reportId);

    if (!current?.notes.aiCandidateNote) {
      return { ok: false, message: "There is no AI candidate to accept." };
    }

    const report = await updateWettAiNotes(reportId, session.username, expectedRevision, {
      ...current.notes,
      generalTechnicianNote: current.notes.aiCandidateNote,
      aiAcceptedAt: new Date().toISOString(),
    });
    return { ok: true, report };
  } catch (error) {
    return failure(error, reportId);
  }
}

export async function rejectWettAiNoteAction(reportId: string, expectedRevision: number): Promise<WettActionResult> {
  try {
    const session = await requireWettReportAccess();
    const current = await getWettReport(reportId);

    if (!current) {
      return { ok: false, code: "not-found", message: "Report not found." };
    }

    const report = await updateWettAiNotes(reportId, session.username, expectedRevision, {
      ...current.notes,
      aiCandidateNote: undefined,
      aiCandidateMode: undefined,
      aiCandidateAt: undefined,
    });
    return { ok: true, report };
  } catch (error) {
    return failure(error, reportId);
  }
}

export async function finalizeWettReportAction(reportId: string): Promise<WettActionResult> {
  try {
    const session = await requireWettReportAccess();
    const result = await finalizeWettReport(reportId, session.username);
    return result.ok
      ? { ok: true, report: result.report }
      : { ok: false, message: result.message, report: result.report };
  } catch (error) {
    return failure(error, reportId);
  }
}

export async function resendWettReportAction(reportId: string): Promise<WettActionResult> {
  try {
    const session = await requireWettReportAccess();
    const result = await resendCompletedWettReport(reportId, session.username);
    return {
      ok: result.ok,
      message: result.message,
      report: result.report,
    };
  } catch (error) {
    return failure(error, reportId);
  }
}
