# Customer portal contract

**Status:** Implementation note (not a second SOT)  
**Authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md) §31–36

Canonical public host: `https://portal.phoenixfireplace.ca`. Same Vercel project as the marketing site. Do not add a second portal app.

On that host, `/` redirects same-host to `/portal` and `/login` redirects same-host to `/portal/login`. Marketing, admin, and sitemap routes return 404. Portal-host `robots.txt` is `Disallow: /`. All portal-host responses send `X-Robots-Tag: noindex, nofollow, noarchive`.

`https://phoenixfireplace.ca/portal` remains a temporary fallback. Apex marketing SEO stays on `NEXT_PUBLIC_SITE_URL`. Future magic-link URLs must use `PORTAL_URL`, never `NEXT_PUBLIC_SITE_URL`. Future portal session cookies must be host-only on `portal.phoenixfireplace.ca` — never `Domain=.phoenixfireplace.ca`.

`/portal` and `/portal/login` are a noindex shell. They must not appear in the sitemap.

## Integration status

| Layer | Status |
|---|---|
| Phoenix portal UI shell + preview view-model | **Live** (layout work) |
| WizField Request Service intake sync | **Live** on marketing site ([wizfield-integration.md](wizfield-integration.md)) |
| WizField portal session + read API (Phase 3) | **Live on WizField backend** — not consumed by Phoenix UI yet |
| Phoenix → WizField portal adapter | **DEFERRED** |

`getPortalConnectionStatus()` reports `deferred` until the adapter is explicitly connected.

## Locked shape

- Job-centric. There is no Property entity on this website.
- Passwordless/magic-link auth is later, via WizField session on the portal host.
- Do not restore a mock customer through `getPortalSnapshot()`.
- Do not query WizField from the frontend or from production website code while the portal adapter is **DEFERRED**.

The `/portal` profile shell may render an isolated **UI preview** view-model (`src/lib/portal/ui-preview.ts`) so layout work can proceed. That preview is labeled on the page, is not a live customer, and must never be returned from the WizField adapter.

The Finance tab (`/portal?tab=finance`) is part of that preview. Invoice and estimate PDFs are generated from the preview document, not from WizField.

## WizField Phase 3 read contract (target for future adapter)

When the Phoenix adapter is connected, it should consume WizField session-scoped reads only (org + customer from portal session cookie — never from URL params):

| Route | Purpose |
|---|---|
| `GET /api/portal/home` | Dashboard: customer, pending request, upcoming appointment, job summaries; legacy snake_case keys for existing WizField portal UI |
| `GET /api/portal/jobs` | Job history + upcoming appointment |
| `GET /api/portal/finance` | Estimates, invoices, payments |
| `GET /api/portal/documents` | Aggregated document refs |
| `GET /api/portal/invoices/:invoiceId/pdf` | Session-scoped invoice PDF |
| `GET /api/portal/inspections/:inspectionId/pdf` | Session-scoped inspection PDF |
| Warranty routes | Unchanged on WizField |

Pending request comes from the latest non-converted Lead (`new_lead` / `contacted`). Converted leads disappear from pending; the Job is authoritative.

New DTO fields are camelCase. Technician on new DTOs is `{ displayName }` only (no phone). Payments omit staff notes and processor references.

Phoenix website production code must not call these routes until the owner opens portal adapter work.

## Adapter boundary (`src/lib/portal/adapter.ts`)

- `getPortalConnectionStatus()` — reports deferred / preparing / connected
- `requestPortalMagicLink()` — future; must target WizField via server-only adapter
- `getPortalSnapshot()` — future; maps WizField read contract to Phoenix portal types

WizField production coupling for portal **reads** is out of scope on this website until the owner explicitly opens it.
