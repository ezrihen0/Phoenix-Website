# Phoenix Article Research & Publishing Program V1

**Status:** Active operating plan  
**Scope:** Phoenix Chimney & Fireplace — Alberta  
**Repo path:** `docs/content/`  
**Purpose:** Define how ChatGPT and the owner research, write, approve, and hand off authoritative articles for implementation on the Phoenix website.

This file is the working copy of the program. Implementation notes live in [docs/features/content-engine.md](../features/content-engine.md). Approved Markdown sources live in [docs/content/article-source/](article-source/).

---

## 1. Operating Model

The article workflow is intentionally split into two layers.

### Editorial / Research Layer

ChatGPT + Owner:

1. Select one real homeowner question.
2. Research the topic using current authoritative sources.
3. Separate code requirements from guidance, manufacturer requirements, best practice, and Phoenix field experience.
4. Ask the owner for field knowledge where first-hand experience materially improves the article.
5. Draft one complete Markdown source file.
6. Review technical claims, safety boundaries, geography, service relevance, and sources.
7. Mark the article `APPROVED` only after owner approval.

### Publishing / Implementation Layer

Coding Agent:

1. Receive the approved Markdown source.
2. Import/adapt it into the existing Phoenix article/CMS architecture.
3. Preserve approved technical meaning.
4. Add approved metadata, schema, images, and internal links.
5. Run article/site QA.
6. Publish or schedule only when instructed.

**The Coding Agent is not the primary article author and must not silently rewrite technical claims.**

---

## 2. Initial Authority Target

Build the first **30 high-quality articles**.

| Category | Initial Target | Primary Purpose |
| --- | --- | --- |
| Gas Fireplace | 10 | Problems, maintenance, components, startup, upgrades |
| Chimney / Masonry | 8 | Crown, flashing, liners, leaks, masonry, firebox, inspection |
| WETT / Wood Burning | 6 | Inspection, safety, reports, insurance, buying/selling |
| Alberta Seasonal / Weather | 4 | Winter preparation, cold, freeze/thaw, seasonal risk |
| Home / Insurance | 2 | Homeowner decisions, insurance and real-estate situations |
| **Total** | **30** | |

The distribution is a planning target, not a quota. Do not create a weak article merely to fill a category.

---

## 3. Article Types

### A. Phoenix Authority Articles

**Target:** approximately 10–12 of the first 30.

Deep technical articles combining: authoritative sources; applicable code/guidance where relevant; plain-English interpretation; Phoenix field knowledge; real Phoenix evidence when available; clear service relevance.

Example candidate: **What Alberta Building Code Requires for a Masonry Chimney Crown**

### B. Problem Articles

**Target:** approximately 12.

Start with a real symptom or homeowner question.

### C. Decision Articles

**Target:** approximately 6.

Help the homeowner make a decision without manufacturing urgency.

---

## 4. Research Priority

For each article, research current sources in this order where applicable:

1. Alberta Government / applicable Alberta building or fire code sources
2. Relevant municipality: City of Calgary, City of Edmonton, City of Red Deer
3. WETT official material for WETT-related subjects
4. Manufacturer installation/service documentation for equipment-specific claims
5. Other authoritative technical or regulatory sources
6. Phoenix field knowledge and approved real-job evidence
7. Search Console / Google Ads search-term evidence when available for demand and wording

Do not invent a code requirement because a municipal page is silent.

When the municipal source does not answer the question, continue to the applicable provincial/code-level authority.

---

## 5. Evidence Classification

Every important technical claim must be understood as one of:

- **CODE REQUIREMENT** — supported by an applicable code or regulation
- **OFFICIAL GUIDANCE** — governmental, municipal, regulator, or recognized authority guidance not represented as a mandatory code provision
- **MANUFACTURER REQUIREMENT** — tied to a specific listed appliance/component/system
- **INDUSTRY BEST PRACTICE** — defensible professional practice, not falsely described as law
- **PHOENIX FIELD EXPERIENCE** — first-hand observations supplied or approved by Phoenix

**Never blend these categories in a way that makes a recommendation appear legally mandatory when it is not.**

---

## 6. Phoenix Field-Knowledge Interview

For articles where first-hand experience adds material value, ask the owner a small number of focused questions before final approval.

---

## 7. Safety Boundary

Every technical article must clearly distinguish **safe homeowner observation** from **qualified inspection / service**. Do not turn educational articles into hazardous DIY instructions.

---

## 8. Geographic Strategy

Default to **general Alberta authority content**.

Create a city-specific article only when geography materially changes the answer. Do not create Calgary / Edmonton / Red Deer clones merely by changing city names.

City and service pages should internally link to relevant Alberta authority articles.

---

## 9. Conversion Philosophy

Articles educate first.

**Homeowner Question → Direct Answer → Evidence → Explanation → Phoenix Field Knowledge → Options → Relevant Service → Request Service**

Avoid aggressive or artificial urgency.

---

## 10. Real Evidence

When available, identify opportunities for real Phoenix job photos, before/after, defective components, field notes, or diagnostic observations.

If real evidence does not exist, use a placeholder during drafting. Do not fabricate a Phoenix job, customer, result, photograph, or testimonial.

---

## 11. Source Markdown Structure

Approved article source files live under:

`docs/content/article-source/`

Naming:

`001-topic-slug.md`  
`002-topic-slug.md`  
`003-topic-slug.md`

Use the template in `docs/content/article-source/_template.md`.

---

## 12. Per-Article Workflow

Select → Research → Source Map → Field Input → Draft → Stress Test → Owner Review → Lock (`STATUS: APPROVED`) → Agent Handoff → QA.

Publish or schedule only when instructed.

---

## 13. Content Quality Gate

Do not approve an article unless it answers the ten quality-gate questions in the original program (real question, Phoenix value, supported claims, code vs recommendation, useful interpretation, correct geography, DIY boundary, no city clones, service link, technician-ready).

---

## 14. Paid Awareness Preparation

After sufficient inventory exists, identify approximately **8–12 Hero Articles**. Do not advertise every article. Paid awareness and revenue campaigns remain separate.

---

## 15. Initial Category Research Directions

Follow the gas, chimney/masonry, WETT/wood, seasonal/weather, and home/insurance question lists in the source program. Weather recommendations must use technically validated thresholds where a numerical trigger is claimed.

---

## 16. First Article Candidate

**Article 001 — Alberta Masonry Chimney Crown / Cap Requirements**

Type: `AUTHORITY`

Source file: `docs/content/article-source/001-alberta-masonry-chimney-crown-requirements.md`

---

## 17. Core Principle

Phoenix is not publishing articles to manufacture page count.

Phoenix is building a technical homeowner knowledge library that supports:

**Authority → Trust → Search Visibility → Brand Recognition → Qualified Service Demand**

Quality and defensible expertise outrank publishing volume.
