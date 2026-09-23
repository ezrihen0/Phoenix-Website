import "server-only";

import { z } from "zod";

import { getDeepSeekApiKey, requestDeepSeekJsonCompletion } from "@/lib/ai/deepseek-client";
import { aiSystemPrompt } from "@/lib/wett/knowledge/ai-reporting-rules";
import type { WettAiRewriteMode } from "@/lib/wett/schema";

const rewriteResponseSchema = z
  .object({
    rewrittenNote: z.string().trim().min(1).max(8000),
  })
  .strict();

export type WettAiRewriteResult =
  | { ok: true; originalNote: string; candidateNote: string; mode: WettAiRewriteMode }
  | { ok: false; unavailable?: boolean; message: string };

function systemPrompt(mode: WettAiRewriteMode) {
  return aiSystemPrompt(mode);
}

export async function rewriteWettTechnicianNote(
  originalNote: string,
  mode: WettAiRewriteMode,
  activeIdentification: Array<{ label: string; value: string }> = [],
  activeMeasurements: Array<{ label: string; value: string }> = [],
): Promise<WettAiRewriteResult> {
  const note = originalNote.trim();

  if (!note) {
    return { ok: false, message: "Add a note before asking for a rewrite." };
  }

  if (!getDeepSeekApiKey()) {
    return {
      ok: false,
      unavailable: true,
      message: "AI assistant unavailable. You can continue editing manually.",
    };
  }

  try {
    const content = await requestDeepSeekJsonCompletion({
      systemPrompt: systemPrompt(mode),
      userPrompt: JSON.stringify({
        note,
        activeIdentification,
        activeMeasurements,
      }),
    });
    const parsed = rewriteResponseSchema.parse(JSON.parse(content) as unknown);

    return {
      ok: true,
      originalNote: note,
      candidateNote: parsed.rewrittenNote,
      mode,
    };
  } catch {
    return {
      ok: false,
      message: "The rewrite could not be completed. Your original note is unchanged.",
    };
  }
}
