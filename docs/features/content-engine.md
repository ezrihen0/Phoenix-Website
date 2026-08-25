# Content engine

**Status:** Implementation note (not a second SOT)  
**Authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md)

Quality over quota. Do not recreate city-cloned articles.

## Live general seeds

Nine general articles (SOT topics plus spring checklist, WETT booking timing, and gas not turning on). They live under `/articles/[slug]`.

City articles are allowed only when geography materially changes the answer. Nearby towns inside 100 km are not article or landing-page identities.

## Process

- Editorial QA of the nine seeds: DIY vs qualified-work distinction in every gas/chimney article.
- Monthly topic list from Search Console, ads, and field notes — a rolling 90-day backlog, not a publish quota.
- Overlap checker stays in admin.
- `/api/cron/generate-article` stays disabled (HTTP 410). Drafts are created in admin for human review.

## Conversion links

Request Service links in articles go to `/request-service` with service context (`cta=article`). Do not hardcode `/calgary/request-service`.
