import "server-only";

import { requestDeepSeekJsonCompletion, getDeepSeekApiKey } from "@/lib/ai/deepseek-client";
import {
  AI_HELP_UNAVAILABLE,
  readTechnicianHelpAnswer,
  technicianHelpSystemPrompt,
  type TechnicianHelpAnswer,
  type TechnicianHelpContext,
} from "@/lib/wett/knowledge/help";

export type TechnicianHelpResult =
  | { ok: true; answer: TechnicianHelpAnswer }
  | { ok: false; unavailable?: boolean; message: string };

export async function askTechnicianHelp(context: TechnicianHelpContext, question: string): Promise<TechnicianHelpResult> {
  const asked = question.trim() || "What should I check here, and what should I verify before a conclusion?";

  if (!getDeepSeekApiKey()) {
    return { ok: false, unavailable: true, message: AI_HELP_UNAVAILABLE };
  }

  try {
    const content = await requestDeepSeekJsonCompletion({
      systemPrompt: technicianHelpSystemPrompt(),
      userPrompt: JSON.stringify({ context, question: asked }),
    });
    const answer = readTechnicianHelpAnswer(JSON.parse(content) as unknown);
    if (!answer) {
      return { ok: false, unavailable: true, message: AI_HELP_UNAVAILABLE };
    }
    return { ok: true, answer };
  } catch {
    return { ok: false, unavailable: true, message: AI_HELP_UNAVAILABLE };
  }
}
