# Phoenix Chimney & Fireplace Services

Alberta revenue website for Phoenix Chimney & Fireplace: Calgary, Edmonton, and Red Deer.

**Authority:** [Phoenix Project SOT V1](docs/sot/Phoenix_Project_SOT_V1.md). Older planning notes under `docs/Historical/` are not authoritative. The [pre-SOT audit](docs/Audit/phoenix-pre-sot-audit.md) is a 2026-08-24 snapshot, not live architecture.

Canadian Global SOT and Province Architecture files are not in this repository (INVESTIGATE). Until the owner supplies them, inherit those rules only as summarized in Phoenix SOT V1.

The site connects search → education → diagnosis → Request Service → lead → job. It is city-first. Do not add town pages merely because they fall inside the 100 km service radius.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS v4
- Centralized metadata and schema in `src/lib/seo.ts`
- Leads persist first in the Phoenix admin inbox; email (Brevo or Gmail) is notification only
- Signed-cookie admin sessions (`admin` and `office` roles)
- Local JSON under `data/cms/` in development; Vercel Blob in production
- Scheduled publish cron only (`/api/cron/publish-scheduled`). AI article auto-generation is disabled.

## Public URL pattern

- `/` — Alberta organization hub / city chooser
- `/services` — general Alberta service hub
- `/services/[slug]` — general service resource
- `/articles` and `/articles/[slug]` — general articles
- `/calgary`, `/edmonton`, `/red-deer` — city homes and nested revenue pages
- `/request-service` — one global Smart Form (noindex); `/{city}/request-service` 301s here with city context
- `/thank-you` — post-conversion (noindex)
- `https://portal.phoenixfireplace.ca` — customer portal host (noindex; WizField deferred). Same Vercel project; `/` and `/login` redirect same-host to `/portal` and `/portal/login`.
- `/portal/login` — apex fallback for the portal foundation (noindex; WizField deferred)

Canonical city service URLs and redirect policy: [docs/features/url-and-taxonomy.md](docs/features/url-and-taxonomy.md).

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Production build check:

```bash
npm run build
```

## Lead intake

One Request Service funnel posts to `/api/request-service` (and the contact API remains a compatibility path). Leads are stored before any email is sent. Office staff disposition them in `/admin/leads`.

## Admin and CMS

Env-based credentials create an httpOnly signed session. Admin can edit site settings, articles, evidence, and leads. Office can operate approved content and lead workflows but cannot change taxonomy, URLs, or SOT.

## Deployment

- Vercel: Next.js preset, set `NEXT_PUBLIC_SITE_URL=https://phoenixfireplace.ca`, `PORTAL_URL=https://portal.phoenixfireplace.ca`, and secrets from `.env.example`
- Docker / Node: standalone output, health check at `/api/health`
- `vercel.json` schedules `/api/cron/publish-scheduled` at 15:05 UTC and hourly `/api/cron/refresh-weather`. Weather data comes from Environment and Climate Change Canada (MSC GeoMet). City home pages can show a conditions panel. Recommendation rules stay off until thresholds are validated.

Do not re-enable `/api/cron/generate-article`. Articles require human review.

## Content notes

- Phone `(825) 823-9556` is shared across Alberta hubs unless a city override is set
- Hours and NAP live in CMS settings (`src/lib/cms/defaults.ts`) and optional env for LocalBusiness schema
- Google rating is an owner-editable verified field — never fabricate 5.0
- Articles follow the [Article Research Program](docs/content/PHOENIX_ARTICLE_RESEARCH_PROGRAM_V1.md). Approved Markdown sources live in `docs/content/article-source/`. The coding agent implements approved files only and does not invent code claims or Phoenix jobs.
