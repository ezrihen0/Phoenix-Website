# Phoenix URL and Service Taxonomy

**Status:** Implementation note (not a second SOT)  
**Authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md)

Parent documents **not in this repo** (INVESTIGATE — owner to supply before reopening architecture):

- Canadian Global SOT
- Canadian Province Architecture / Province-Wise Addendum

Until those files are present, inherit city-first, one taxonomy, qualified indexability, no scaled city substitution, and the Ontario boundary from Phoenix SOT V1 only.

Do not reintroduce a second service array, hash-anchor service URLs, or city-cloned province landings.

The [pre-SOT audit](../Audit/phoenix-pre-sot-audit.md) is a 2026-08-24 snapshot, not live architecture.

## Canonical revenue URLs

City is the local revenue authority (`calgary` | `edmonton` | `red-deer`):

- `/{city}/gas-fireplace-repair`
- `/{city}/services/gas-fireplace-maintenance`
- `/{city}/services/gas-fireplace-installation`
- `/{city}/services/chimney-sweeping-inspection`
- `/{city}/services/chimney-repair-masonry`
- `/{city}/wett`

## Canonical service slugs

| Slug | Family | Route kind |
|------|--------|------------|
| `gas-fireplace-repair` | Gas fireplace | Dedicated city page |
| `gas-fireplace-maintenance` | Gas fireplace | Service landing |
| `gas-fireplace-installation` | Gas fireplace | Service landing |
| `chimney-sweeping-inspection` | Chimney | Service landing |
| `chimney-repair-masonry` | Chimney | Service landing |
| `wett-inspections` | WETT | Dedicated city page (`/wett`) |

Retired as URL identities (legacy aliases only): `chimney-sweep-repair`, `masonry-rebuilds`, `wood-stove-service`.

## General (Alberta) vs city

- `/` — organization hub / city chooser
- `/services` — Alberta service hub (not a Calgary clone)
- `/services/[slug]` — general resource for a landing-page slug; links down to city pages
- `/articles` and `/articles/[slug]` — general articles
- `/{city}/articles/[slug]` — city article only when geography changes the answer

## Conversion URLs (noindex)

- `/request-service` — one global Smart Form. Not in the sitemap. Page robots + `X-Robots-Tag`.
- `/thank-you` — post-submit confirmation (noindex).
- `/portal`, `/portal/login` — portal shell (noindex). WizField remains deferred.

City pages send users to `/request-service` with allowlisted query context (`city`, `service`, `cta`, `from`). The customer can change a preselected city or service. Do not put street address or coordinates on inbound query strings.

## Redirects

Keep (legacy equity → Calgary):

- `/about` → `/calgary/about`
- `/contact` → `/calgary/contact`
- `/wett` → `/calgary/wett`
- `/gas-fireplace-repair` → `/calgary/gas-fireplace-repair`

Request Service consolidation (already noindex; not SERP equity):

- `/calgary/request-service` → `/request-service?city=calgary`
- `/edmonton/request-service` → `/request-service?city=edmonton`
- `/red-deer/request-service` → `/request-service?city=red-deer`

Changed:

- `/services` is a live Alberta hub (no longer 301 to Calgary)
- `/articles` and `/articles/:slug` are live general article routes

## Sitemap

Include only qualified indexable URLs. Exclude admin, APIs, portal, thank-you, request-service, unfinished cities, and noindex pages.

## General vs city service pages

General `/services/[slug]` pages use Alberta titles and link down to Calgary, Edmonton, and Red Deer. They must not use city-name titles. Do not 301 a general service URL to a city, and do not canonical general → Calgary, without Search Console query review (INVESTIGATE — owner GSC access).

## Weather and portal (boundaries)

- Weather: see [weather.md](weather.md). Cache may refresh hourly. Recommendation rules stay disabled until thresholds are owner-validated. Do not invent temperature or precipitation cutoffs in code.
- Portal: see [portal.md](portal.md). Noindex job-centric contract. Do not restore a mock customer, a Property entity, or frontend queries to WizField.
- Content: see [content-engine.md](content-engine.md). No city article clones. Generate-article cron stays disabled.
