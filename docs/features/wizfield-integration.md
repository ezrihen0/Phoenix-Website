# WizField Request Service integration

**Status:** Implementation note (not a second SOT)  
**Authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md) §12.1, §36

Phase 1 only: server-only intake sync after Request Service submit. Portal UI, portal auth, and WizField read APIs are out of scope on this website until explicitly opened (see [portal.md](portal.md)).

## Boundary

| Allowed | Not allowed |
|---|---|
| Server-only POST after `saveLead` | Browser or `NEXT_PUBLIC_*` WizField calls |
| Store sync metadata on Phoenix leads | Fail customer submit on WizField error |
| Admin + office email sync visibility | Send `organizationId` in payload |
| Health boolean `wizfieldConfigured` | Query WizField from portal preview UI |

## Flow

```text
POST /api/request-service
  → validate + reCAPTCHA
  → saveLead (Phoenix inbox) — always first
  → sendRequestServiceToWizField (4s timeout, best effort)
  → saveLead (sync metadata)
  → office notification email
  → { ok: true } + redirect to /thank-you
```

`requestId` in the WizField payload equals the persisted Phoenix `lead.id`. That supports WizField replay idempotency for **one saved lead**. It does not dedupe browser double-submits (each submit creates a new Phoenix lead).

## Configuration

Server-only env (see `.env.example`):

- `WIZFIELD_API_BASE_URL` — WizField backend origin, no trailing slash required
- `WIZFIELD_INTEGRATION_SECRET` — Bearer token; organization is resolved on WizField from the credential

When either is unset, sync status is `not_attempted` and intake still succeeds.

`/api/health` exposes `wizfieldConfigured: boolean` (both vars present).

## WizField endpoint

```http
POST {WIZFIELD_API_BASE_URL}/api/integrations/phoenix/request-service
Authorization: Bearer {WIZFIELD_INTEGRATION_SECRET}
Content-Type: application/json
```

Success envelope: `{ data: { requestId, customerId, leadId, portalAccess? } }`.

Phoenix accepts HTTP 200 as `synced` only when `data.requestId` matches the local lead id (case-insensitive UUID compare).

## Service mapping

| Phoenix `service` title | WizField `service.type` |
|---|---|
| Gas Fireplace Repair | `repair` |
| Gas Fireplace Maintenance | `cleaning` |
| Gas Fireplace Installation | `repair` (`originalService` keeps Phoenix title) |
| Chimney Sweeping & Inspection | `cleaning` |
| Chimney Repair & Masonry | `repair` |
| WETT Inspections | `inspection` |

## Lead sync fields

On `Lead` (`src/lib/cms/types.ts`):

| Field | Meaning |
|---|---|
| `wizfieldSyncStatus` | `not_attempted` \| `synced` \| `failed` |
| `wizfieldCustomerId` | WizField customer id when synced |
| `wizfieldLeadId` | WizField lead id when synced |
| `wizfieldPortalAccessStatus` | Portal email outcome from intake (`sent`, `pending_email`, etc.) |
| `wizfieldPortalAccessExpiresAt` | Magic-link expiry when returned |
| `wizfieldLastSyncAt` | ISO timestamp of last sync attempt |
| `wizfieldSyncError` | Operator-facing error when failed |

Admin lead card shows a status pill and short sync line. Office email includes the same sync summary (no secrets).

## Code map

- `src/lib/wizfield/map-request-service.ts` — payload build, service map, response interpreter, office email lines
- `src/lib/wizfield/client.ts` — server-only fetch, timeout, logging
- `src/lib/contact.ts` — `routeServiceRequestSubmission` wires sync after first save
- `scripts/verify-wizfield-phoenix-intake.ts` — local contract checks (mapping, idempotency key, no org in payload)

Run verification:

```bash
npx tsx scripts/verify-wizfield-phoenix-intake.ts
```

## Related WizField work (not in this repo)

WizField Phase 3 added session-scoped portal read routes on the WizField backend. Phoenix portal UI still uses the isolated preview until the adapter is connected. See [portal.md](portal.md).
