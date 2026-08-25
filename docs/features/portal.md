# Customer portal contract

**Status:** Implementation note (not a second SOT)  
**Authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md)

`/portal` and `/portal/login` are a noindex shell. They must not appear in the sitemap.

## Locked shape

- Job-centric. There is no Property entity on this website.
- Passwordless/magic-link auth is later, after a real WizField adapter exists.
- Do not restore a mock customer.
- Do not query WizField from the frontend or from production website code while the adapter is **DEFERRED**.
- `getPortalConnectionStatus()` reports `deferred` until that adapter is real.

WizField production coupling is out of scope until the owner explicitly opens it.
