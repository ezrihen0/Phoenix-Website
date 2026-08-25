# Content engine

**Status:** Implementation note (not a second SOT)  
**Authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md)  
**Editorial program:** [Phoenix Article Research Program V1](../content/PHOENIX_ARTICLE_RESEARCH_PROGRAM_V1.md)

Quality over quota. Do not recreate city-cloned articles.

## Two layers

1. **Editorial / research** (ChatGPT + owner): one homeowner question, source hierarchy, evidence classification, field interview, Markdown source under `docs/content/article-source/`. `STATUS: APPROVED` only after owner approval.
2. **Publishing / implementation** (coding agent): import the approved source into the existing CMS, preserve technical meaning, add metadata/schema/links, QA, publish **only when instructed**. The coding agent is not the primary author and must not silently rewrite technical claims.

`STATUS: APPROVED` is required before CMS implementation. DRAFT and OWNER REVIEW files are not imported.

## Live general seeds

Nine general articles (SOT topics plus spring checklist, WETT booking timing, and gas not turning on). They live under `/articles/[slug]`. Inventory and remaining first-30 research directions: [article-source/_inventory.md](../content/article-source/_inventory.md).

City articles are allowed only when geography materially changes the answer. Nearby towns inside 100 km are not article or landing-page identities.

`article-calendar.json` is an office scheduling artifact. It must not be read as a city-clone publish quota.

## Process

- Source files: `docs/content/article-source/NNN-topic-slug.md`
- Evidence labels: CODE REQUIREMENT, OFFICIAL GUIDANCE, MANUFACTURER REQUIREMENT, INDUSTRY BEST PRACTICE, PHOENIX FIELD EXPERIENCE — never blend a recommendation into fake law
- DIY vs qualified-work distinction in every gas/chimney article
- Monthly topic list from Search Console, ads, and field notes — a rolling 90-day backlog, not a publish quota
- Overlap checker stays in admin
- `/api/cron/generate-article` stays disabled (HTTP 410). Drafts are created in admin for human review
- First authority standard-setter: [001 masonry chimney crown/cap](../content/article-source/001-alberta-masonry-chimney-crown-requirements.md) (owner review, not live)
- Articles 002–030 currently exist as DRAFT source placeholders only. Do not create new `/articles/...` routes or rewrite seed articles until a source is `STATUS: APPROVED` and the owner asks for implementation.

## Images

Each article source reserves **two image positions**:

1. **Real Phoenix image first.** Use an approved field photo. If none exists, keep a clearly marked placeholder. Do not fabricate a job.
2. **AI educational image second.** Use it only to explain a component or concept. Never present AI as Phoenix field evidence.

Live CMS pages still have a single `coverImage`. Two-slot rendering is implemented later, only when an approved source is handed off: real figure first in the body, AI second, captions stating educational vs field.

## Authority links

Government, code, municipal, and WETT reader links use descriptive anchor text (for example “Click here”). Never display a raw URL on the published page.

## Conversion links

Request Service links in articles go to `/request-service` with service context (`cta=article`). Do not hardcode `/calgary/request-service`.
