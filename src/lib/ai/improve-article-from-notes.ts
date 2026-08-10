import "server-only";

import { z } from "zod";

import { getCityBySlug, type CitySlug } from "@/lib/cities";
import type { GeneratedArticleDraft } from "@/lib/cms/types";
import { requestDeepSeekJsonCompletion } from "@/lib/ai/deepseek-client";

const aiDraftSchema = z.object({
  title: z.string().min(12),
  excerpt: z.string().min(40),
  body: z.string().min(120),
  seoTitle: z.string().min(12),
  seoDescription: z.string().min(40),
  keywords: z.array(z.string()).min(3).max(8),
});

const SYSTEM_PROMPT = `You are a professional writing assistant for a fireplace and chimney service company in Alberta, Canada.

Your job is to transform the owner's raw field notes into a clear, useful homeowner-facing article draft.

Return ONLY valid JSON matching this shape:
{
  "title": "string",
  "excerpt": "string",
  "body": "markdown string with H2/H3 headings, bullet lists where helpful, and optional FAQ only if supported by the notes",
  "seoTitle": "string",
  "seoDescription": "string",
  "keywords": ["string"]
}

CRITICAL FACT RULES — you must follow all of these:
- Use ONLY factual information supplied in the owner's notes.
- NEVER invent measurements, dimensions, or quantities.
- NEVER invent customer statements or quotes.
- NEVER invent causes, diagnoses, or findings not supplied in the notes.
- NEVER invent certifications, permits, WETT status, gas licensing, code compliance, inspections, or approvals unless explicitly provided.
- NEVER invent prices or cost estimates.
- NEVER invent locations, neighborhoods, or addresses beyond the selected city context.
- NEVER invent completed repairs or outcomes that were not supplied.
- If important information is missing, write around the gap safely OR briefly note what additional detail would strengthen the article.
- Preserve the owner's real-world experience and observations.
- Do not add generic SEO filler, keyword stuffing, or repetitive city name spam.
- Write naturally; length should match the useful information available — do not pad.
- Be professional, clear, homeowner-friendly, technically accurate, and easy to scan on mobile.
- Do not claim to be the homeowner; write as helpful guidance from the service company's perspective based on the supplied notes.`;

export async function improveArticleFromNotes(
  notes: string,
  city: CitySlug,
): Promise<GeneratedArticleDraft> {
  const cityConfig = getCityBySlug(city);

  if (!cityConfig) {
    throw new Error(`Unsupported city: ${city}`);
  }

  const content = await requestDeepSeekJsonCompletion({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: JSON.stringify({
      city: cityConfig.name,
      province: cityConfig.province,
      audience: cityConfig.articleAudience,
      ownerNotes: notes,
      instructions:
        "Transform these notes into one genuinely useful article draft. Use markdown in the body field. Do not publish or save anything — return JSON only.",
    }),
  });

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(content);
  } catch {
    throw new Error("DeepSeek returned invalid JSON.");
  }

  const parsed = aiDraftSchema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new Error("DeepSeek returned an incomplete article draft.");
  }

  return parsed.data;
}
