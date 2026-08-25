export const FACTUAL_BOUNDARY_RULES = `
CRITICAL FACT RULES:
- Use ONLY factual information supplied by the owner or labeled sources in the brief.
- NEVER invent measurements, dimensions, customer quotes, diagnoses, causes, certifications, permits, WETT status, gas licensing, code compliance, inspections, approvals, prices, locations, neighborhoods, or completed repairs.
- NEVER invent search volume, ranking difficulty, CPC, traffic potential, or any other SEO metric.
- If information is missing, write around the gap safely or note what additional detail would help.
- Preserve the owner's real-world observations when supplied.
- Do not add generic SEO filler, keyword stuffing, or repetitive city-name spam.
- Length should follow the amount of useful evidence available. Do not inflate content.
- Classify important technical claims as code requirement, official guidance, manufacturer requirement, industry best practice, or Phoenix field experience. Never present a recommendation as law.
- Distinguish safe homeowner observation from work that needs a qualified person. Do not write hazardous DIY steps (gas, combustion, electrical, climbing, disassembly).
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

export const ORIGINALITY_RULES = `
ORIGINALITY RULES:
- Shared industry facts are allowed.
- Default to one general Alberta article. Do NOT produce the same article with city-name substitution.
- A city article is allowed only when supplied facts show geography materially changes the answer.
- Each local article must add independently useful local decision context using only supplied facts.
- Do NOT invent regulations, climate effects, or neighborhood details for artificial uniqueness.
- Do not reuse paragraph structure from sibling-city articles supplied in context.
`.trim();

export const EDITORIAL_STANDARD_PROMPT = [
  FACTUAL_BOUNDARY_RULES,
  ARTICLE_STRUCTURE_RULES,
  ORIGINALITY_RULES,
].join("\n\n");

export const GUIDED_JSON_ONLY_RULE =
  "Return ONLY valid JSON matching the requested output shape. Do not wrap JSON in markdown fences.";
