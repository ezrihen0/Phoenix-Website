# Customer portal contract

**Status:** Implementation note (not a second SOT)  
**Authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md)

Canonical public host: `https://portal.phoenixfireplace.ca`. Same Vercel project as the marketing site. Do not add a second portal app.

On that host, `/` redirects same-host to `/portal` and `/login` redirects same-host to `/portal/login`. Marketing, admin, and sitemap routes return 404. Portal-host `robots.txt` is `Disallow: /`. All portal-host responses send `X-Robots-Tag: noindex, nofollow, noarchive`.

`https://phoenixfireplace.ca/portal` remains a temporary fallback. Apex marketing SEO stays on `NEXT_PUBLIC_SITE_URL`. Future magic-link URLs must use `PORTAL_URL`, never `NEXT_PUBLIC_SITE_URL`. Future portal session cookies must be host-only on `portal.phoenixfireplace.ca` — never `Domain=.phoenixfireplace.ca`.

`/portal` and `/portal/login` are a noindex shell. They must not appear in the sitemap.

## Locked shape

- Job-centric. There is no Property entity on this website.
- Passwordless/magic-link auth is later, after a real WizField adapter exists.
- Do not restore a mock customer.
- Do not query WizField from the frontend or from production website code while the adapter is **DEFERRED**.
- `getPortalConnectionStatus()` reports `deferred` until that adapter is real.

The `/portal` profile shell may render an isolated **UI preview** view-model (`src/lib/portal/ui-preview.ts`) so layout work can proceed. That preview is labeled on the page, is not a live customer, and must never be returned from the WizField adapter. Do not restore a mock customer through `getPortalSnapshot()`.

WizField production coupling is out of scope until the owner explicitly opens it.
