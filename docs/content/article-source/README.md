# Article source files

Approved editorial sources for Phoenix articles. The coding agent implements only files marked `STATUS: APPROVED`, without changing technical meaning, and publishes only when instructed.

**Program:** [PHOENIX_ARTICLE_RESEARCH_PROGRAM_V1.md](../PHOENIX_ARTICLE_RESEARCH_PROGRAM_V1.md)  
**Live site notes:** [content-engine.md](../../features/content-engine.md)  
**Inventory:** [_inventory.md](_inventory.md)  
**Template:** [_template.md](_template.md)

## Rules

- Default geography is general Alberta. City files are allowed only when geography changes the answer.
- Do not fabricate Phoenix jobs, photos, ratings, or code requirements.
- Two reserved image positions: real Phoenix first, AI educational second. Never present AI as field evidence.
- Government / code / WETT reader links use descriptive anchor text (for example “Click here”), never a raw URL on the page.
- Request Service links in published articles use `/request-service?service=…&cta=article&from=/articles/{slug}`.
- Existing live seed articles are listed in the inventory. Where the inventory says `UPGRADE EXISTING`, keep the live slug.
- DRAFT placeholders are not imported into the CMS.

## Handoff to the coding agent

When `STATUS` becomes `APPROVED`, the Publishing Instructions section must include slug, related services, image instructions, and whether to publish immediately or schedule. CMS import happens only after `STATUS: APPROVED`.
