export const FACTUAL_BOUNDARY_RULES = `
CRITICAL FACT RULES:
- Use ONLY factual information supplied by the owner.
- NEVER invent measurements, dimensions, customer quotes, diagnoses, causes, certifications, permits, WETT status, gas licensing, code compliance, inspections, approvals, prices, locations, neighborhoods, or completed repairs.
- NEVER invent search volume, ranking difficulty, CPC, traffic potential, or any other SEO metric.
- If information is missing, write around the gap safely or note what additional detail would help.
- Preserve the owner's real-world observations when supplied.
- Do not add generic SEO filler, keyword stuffing, or repetitive city-name spam.
- Length should follow the amount of useful evidence available. Do not inflate content.
`.trim();

export const ARTICLE_STRUCTURE_RULES = `
ARTICLE STRUCTURE RULES:
- Write for humans first with clear semantic structure.
- Use one descriptive H1 concept in the title field; use descriptive H2/H3 headings in the body.
- Put a short direct answer near the beginning.
- One main idea per section; short paragraphs; lists where helpful.
- Prefer descriptive headings such as "Why Flashing Repairs Do Not Fix Every Chimney Leak" instead of vague headings like "Introduction" or "Conclusion".
- When answering a homeowner question, give a concise direct answer first, then supporting explanation.
- Do not repeat the same answer artificially across sections.
- Do not split content into tiny fragments solely for AI retrieval.
`.trim();

export const GUIDED_JSON_ONLY_RULE =
  "Return ONLY valid JSON matching the requested output shape. Do not wrap JSON in markdown fences.";
