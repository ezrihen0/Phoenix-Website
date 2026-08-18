# Phoenix Fireplace — Technical SEO Audit Report

Generated after implementing the Technical SEO Fix Pack.

## Before / After

| Metric | Before (production) | After (local production build) |
|--------|---------------------|--------------------------------|
| Sitemap URL count | 56 | 47 |
| Sitemap audit failures | 10 | 0 |
| Non-200 sitemap URLs | 1 (`/gas-fireplace-repair`) | 0 |
| Redirecting sitemap URLs | 8 | 0 |
| Duplicate article URLs in sitemap | 3 Calgary duplicates | 0 (one `/{city}/articles/{slug}` each) |

## Removed from sitemap

- `/about` (308 → `/calgary/about`)
- `/wett` (308 → `/calgary/wett`)
- `/contact` (308 → `/calgary/contact`)
- `/articles` (308 → `/calgary/articles`)
- `/services` (308 → `/calgary/services`)
- `/gas-fireplace-repair` (404; now 301 → `/calgary/gas-fireplace-repair` but not listed)
- `/articles/{slug}` legacy paths (301 → `/calgary/articles/{slug}`)

## Canonical changes

- Legacy article metadata in `src/app/articles/[slug]/page.tsx` now canonicalizes to `/calgary/articles/{slug}` (matches 301 target).
- City article routes unchanged (already self-referencing).

## Redirect added

- `/gas-fireplace-repair` → `/calgary/gas-fireplace-repair` (301) in `next.config.ts`

## Pages set to noindex

- `/thank-you` — `robots: { index: false, follow: true }`

## Schema modifications

- `buildLocalBusinessSchema()` in `src/lib/seo.ts` now supports optional env-gated fields only:
  - `BUSINESS_STREET_ADDRESS`, `BUSINESS_ADDRESS_LOCALITY`, `BUSINESS_ADDRESS_REGION`, `BUSINESS_ADDRESS_POSTAL_CODE`, `BUSINESS_ADDRESS_COUNTRY`
  - `BUSINESS_GEO_LATITUDE`, `BUSINESS_GEO_LONGITUDE` (only when address is set)
  - `GOOGLE_BUSINESS_PROFILE_URL`, `BUSINESS_SAME_AS_URLS`
- No fabricated address, geo, reviews, or ratings added.

## Google Search Console

- Code ready: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → metadata verification tag in `src/app/layout.tsx`
- **Manual after deploy:**
  1. Set env var in Vercel Production
  2. Verify domain in Google Search Console
  3. Submit `https://phoenixfireplace.ca/sitemap.xml`
  4. URL Inspection: `/`, `/calgary`, `/calgary/gas-fireplace-repair`, `/edmonton/wett`, 3 articles

## GA4

- Code ready: `NEXT_PUBLIC_GA_MEASUREMENT_ID` loads `src/components/google-analytics.tsx`
- Events: `phone_click`, `contact_form_submit`, `request_service_submit`, `thank_you_view`
- **Manual after deploy:** set measurement ID in Vercel and verify events in GA4 DebugView / Realtime

## Internal link audit

- Seed articles use `relatedServiceSlugs` mapped correctly via `resolveRelatedServiceLink()`:
  - WETT articles → `/{city}/wett`
  - Gas troubleshooting → `/{city}/gas-fireplace-repair`
  - Maintenance articles → service landing pages
- No code changes required.

## Validation commands

```bash
# Production baseline (saved)
# scripts/audit-sitemap-before.txt

# After deploy / local production server
SITEMAP_AUDIT_BASE_URL=http://localhost:3001 node scripts/audit-sitemap.mjs --sample-canonicals
# scripts/audit-sitemap-after.txt
```

## Definition of done status

- [x] Clean sitemap (200-only, no duplicates, no thank-you)
- [x] One canonical article URL per article
- [x] `/thank-you` excluded from index
- [x] GSC verification infrastructure ready
- [x] GA4 conversion infrastructure ready
- [x] Audit script passes locally
- [ ] GSC verified + sitemap submitted (manual post-deploy)
- [ ] GA4 events verified (manual post-deploy)
- [ ] Production audit re-run after deploy

After deploy, run:

```bash
node scripts/audit-sitemap.mjs
node scripts/audit-sitemap.mjs --sample-canonicals
```

Expected: **47 URLs**, **0 failures** on production.
