# Phoenix WETT Field Report Implementation Plan

Revision 3: finalization state machine, WETT workspace layout strategy, and local PII recovery policy corrected.

Revision 2:
WETT workspace moved from standalone /field authentication
to existing Phoenix /admin/office authentication and authorization.

Planning status: ready for owner review. Do not implement until approved.

## Pre-Planning Read Results

Required documents requested at project root:

- `AI_WORKFLOW_RULES.md`: not present at the requested path. Repository search found no matching file.
- `OWNER_FEATURE_CHECKLIST_EN.md`: not present at the requested path. Repository search found no matching file.
- `PHOENIX-WEBSITE-TECHNICAL-SOT.md`: not present at the requested root path. A glob result surfaced `docs/PHOENIX-WEBSITE-TECHNICAL-SOT.md`, but direct reads and targeted search reported the path as unavailable. Treat this as a documentation path discrepancy requiring cleanup.
- `PHOENIX_WETT_FIELD_REPORT_PRODUCT_DIRECTION.md`: present and read. It is the governing product direction for this plan.

Additional repository documents inspected:

- `README.md`
- `docs/sot/Phoenix_Project_SOT_V1.md`
- `docs/features/portal.md`
- `.env.example`

Local Next.js docs note: workspace rules say to read `node_modules/next/dist/docs/` before coding against Next.js. `node_modules/next/dist/docs/` was not present in this workspace, so implementation should re-check after dependencies are installed.

## A. Executive Implementation Summary

Build a protected, mobile-first Phoenix WETT Field Report workspace inside the existing Phoenix authenticated admin/Office surface at `/admin/office/wett`. The feature lets authorized Office and admin users create, autosave, resume, review, complete, generate, store, and email a premium Phoenix-branded WETT inspection report.

The tool stays isolated from the public marketing site because it handles customer PII, private home photos, inspection notes, measurements, and completed reports. It must not appear in public navigation, sitemap, public analytics, public evidence galleries, or search indexes.

The current Phoenix site is a Next.js 16 App Router application with TypeScript, Tailwind CSS v4, Zod, Vercel deployment, Vercel Blob, protected JSON storage, custom signed-cookie auth, Brevo email, DeepSeek AI, and React PDF. V1 should reuse these proven primitives where they fit:

- Use App Router pages, route handlers, server actions, and server-only services.
- Reuse the existing Phoenix `admin`/`office` roles, `phoenix_admin_session` cookie, `/admin` proxy protection, and permission architecture.
- Add a small WETT authorization helper so both admin users and authorized Office users can access reports and create reports without a second auth system.
- Store structured WETT drafts and completed reports as encrypted/protected JSON in Vercel Blob.
- Store WETT photos and generated PDFs as private Blob objects served only through authenticated route handlers.
- Use a dedicated DeepSeek rewrite service for WETT notes. Do not reuse article prompts.
- Use `@react-pdf/renderer` server-side PDF generation because it is already installed and used in production-style code.
- Keep public marketing SEO, articles, evidence, lead intake, sitemap, and city pages untouched.

Major technical recommendation: no SQL database for V1. The existing protected JSON plus Vercel Blob model is sufficient for a small internal WETT workflow if reports are stored per report plus a compact encrypted index. The plan must document scaling limits and keep the schema portable for future WizField migration.

## B. Current-State Repository Inventory

### Routing

- App Router pages live under `src/app`.
- Public city WETT marketing page: `src/app/[city]/wett/page.tsx`.
- Root `/wett` redirects to `/calgary/wett` through `next.config.ts`.
- Protected admin pages: `src/app/admin/...`.
- Portal shell: `src/app/portal/...`.
- Existing API route handlers:
  - `src/app/api/request-service/route.ts`
  - `src/app/api/contact/route.ts`
  - `src/app/admin/login/submit/route.ts`
  - `src/app/portal/finance/pdf/route.ts`

### Admin and Authentication

- Custom auth is implemented in:
  - `src/lib/auth/options.ts`
  - `src/lib/auth/token.ts`
  - `src/lib/auth/permissions.ts`
  - `src/lib/auth/types.ts`
- Session cookie name: `phoenix_admin_session`.
- Session token: HMAC-signed payload using Web Crypto in `src/lib/auth/token.ts`.
- Login route: `src/app/admin/login/submit/route.ts`.
- Login page: `src/app/admin/login/page.tsx`.
- Login form: `src/components/admin/admin-login-form.tsx`.
- Roles: `admin` and `office`.
- `office` access is restricted to approved admin paths. `admin` is denied `/admin/office`.
- Login rate limiting is in-memory per runtime instance in `src/lib/auth/options.ts`.

### Proxy and Route Protection

- Proxy file: `src/proxy.ts`.
- It protects `/admin` paths and redirects unauthenticated users to `/admin/login`.
- It applies special host handling for `portal.phoenixfireplace.ca`.
- Portal host behavior:
  - `/` redirects to `/portal`.
  - `/login` redirects to `/portal/login`.
  - non-portal paths return 404.
  - `robots.txt` disallows all.
  - all allowed portal-host responses get `X-Robots-Tag: noindex, nofollow, noarchive`.
- Current proxy already protects `/admin/:path*`, which includes `/admin/office/wett`.
- Current proxy allows `/admin/login` and `/admin/login/submit` unauthenticated, reads `phoenix_admin_session`, resolves the role, and checks `canAccessAdminPath()`.
- `canAccessAdminPath()` allows the `office` role under `/admin/office`, `/admin/articles`, `/admin/publish`, and `/admin/leads`.
- `requireOfficeDashboardAccess()` currently enforces `role === "office"` for `src/app/admin/office/page.tsx`.

### Sessions and Cookies

- Admin cookie options in `src/lib/auth/options.ts`:
  - `httpOnly`
  - `sameSite: "lax"`
  - `secure` in production
  - `path: "/"`
  - 14-day default max age
  - 90-day remember max age
- WETT must reuse the existing `phoenix_admin_session` cookie.
- Do not create separate WETT credentials, cookies, or session implementation.

### CMS and Storage

- Storage entrypoint: `src/lib/cms/storage.ts`.
- Local dev fallback: `data/cms`.
- Vercel runtime requires `BLOB_READ_WRITE_TOKEN` unless local fallback is explicitly allowed.
- Remote JSON keys currently include:
  - `cms/articles.json`
  - `cms/evidence.json`
  - `cms/leads.json`
  - `cms/settings.json`
  - `cms/office-daily-state.json`
- Protected data is used for settings, evidence metadata, leads, and office state.
- Current storage is list/file based, not database backed.

### Encryption / Protected JSON

- Encryption helper: `src/lib/cms/secure-json.ts`.
- Uses AES-256-GCM envelopes:
  - `version`
  - `iv`
  - `tag`
  - `ciphertext`
- Preferred key derives from `BLOB_READ_WRITE_TOKEN`; fallback key derives from `ADMIN_SESSION_SECRET` or `NEXTAUTH_SECRET`.
- Existing helper can be reused for WETT structured report JSON.

### Vercel Blob

- Blob package: `@vercel/blob`.
- Used by `src/lib/cms/storage.ts`.
- Base access is controlled by `BLOB_STORE_ACCESS`, defaulting to private for CMS JSON.
- Article and evidence uploads in `src/app/admin/actions.ts` explicitly upload with `access: "public"`.
- WETT private photos must not reuse the public evidence image upload behavior.

### Image Uploads

- Article upload action: `uploadArticleImageAction()` in `src/app/admin/actions.ts`.
- Evidence upload action: `uploadEvidenceImageAction()` in `src/app/admin/actions.ts`.
- Existing upload limits:
  - image only
  - max 8 MB
  - Blob key uses `crypto.randomUUID()`
  - `access: "public"`
- Evidence editor: `src/components/admin/evidence-editor.tsx`.
- Evidence records are private by default in metadata, but uploaded image URLs are public Blob URLs once uploaded. This is not acceptable for WETT private photos.

### Email / Brevo

- Email helper: `src/lib/email/lead-notifications.ts`.
- Brevo API support:
  - uses `BREVO_API_KEY`
  - sends to site notification recipient
  - endpoint `https://api.brevo.com/v3/smtp/email`
- Gmail SMTP fallback through `nodemailer` exists for lead notifications.
- Lead flow saves first, then sends email, then records delivery status. This is the correct reliability pattern for WETT completion.
- Existing helper is lead-notification-specific. WETT needs a dedicated report delivery email service.

### AI / DeepSeek

- DeepSeek client: `src/lib/ai/deepseek-client.ts`.
- Server-only, uses `DEEPSEEK_API_KEY` and `DEEPSEEK_MODEL`.
- Existing functions request JSON responses from `https://api.deepseek.com/chat/completions`.
- Existing AI code is article/content oriented:
  - `src/lib/ai/generate-article.ts`
  - `src/lib/ai/improve-article-from-notes.ts`
  - `src/lib/ai/guided-article.ts`
  - `src/lib/ai/prompt-shared.ts`
- WETT AI must use the shared DeepSeek transport but a dedicated WETT rewrite prompt and schema.

### Zod Validation

- Zod version: `zod` `^4.3.6`.
- Existing validation examples:
  - `src/lib/contact.ts`
  - `src/app/admin/actions.ts`
  - `src/app/admin/login/submit/route.ts`
  - AI output validation in `src/lib/ai/generate-article.ts`
- WETT should define dedicated schemas in `src/lib/wett/schema.ts`.

### Existing Admin UI Patterns

- Admin shell: `src/components/admin/admin-shell.tsx`.
- Storage status panels: `src/components/admin/admin-storage-status.tsx`.
- Evidence editor: `src/components/admin/evidence-editor.tsx`.
- Wizard field components: `src/components/admin/guided-wizard-steps.tsx`.
- Public request-service mobile multi-step form: `src/components/forms/request-service-form.tsx`.
- WETT should borrow interaction patterns but should not render the public site header/footer or admin navigation.

### PDF / Report-Related Libraries or Code

- Dependency installed: `@react-pdf/renderer`.
- Existing PDF renderer: `src/lib/portal/finance-pdf.tsx`.
- Existing PDF route: `src/app/portal/finance/pdf/route.ts`.
- Existing PDF uses:
  - `renderToBuffer`
  - `sharp` to convert Phoenix logo WebP to PNG data URL
  - A4 page geometry
  - Phoenix charcoal/copper brand palette
  - `X-Robots-Tag: noindex, nofollow, noarchive`
- Public logo asset exists at `public/images/brand/logo.webp`.

### Current Package Dependencies

Production dependencies in `package.json`:

- `next` `16.2.3`
- `react` `19.2.4`
- `react-dom` `19.2.4`
- `@react-pdf/renderer` `^4.8.1`
- `@vercel/analytics` `^2.0.1`
- `@vercel/blob` `^2.3.3`
- `lucide-react` `^1.8.0`
- `nodemailer` `^8.0.5`
- `react-markdown` `^10.1.0`
- `remark-gfm` `^4.0.1`
- `server-only` `^0.0.1`
- `sharp` `^0.34.5`
- `zod` `^4.3.6`

No new package is required for V1 if `@react-pdf/renderer`, `sharp`, Blob, and Brevo are sufficient.

### Deployment / Vercel Configuration

- `next.config.ts`:
  - `output: "standalone"` outside Vercel
  - `poweredByHeader: false`
  - public redirects, including `/wett` -> `/calgary/wett`
  - headers for `/portal`, `/request-service`, and global security headers
- `vercel.json`:
  - cron `/api/cron/publish-scheduled`
  - cron `/api/cron/refresh-weather`
- Health route: `src/app/api/health/route.ts`.

### Analytics Behavior

- Root layout: `src/app/layout.tsx` renders:
  - `GoogleAnalyticsHead`
  - `GoogleAnalyticsTracker`
  - `VercelAnalytics`
  - public `SiteHeader`
  - public `SiteFooter`
  - public `MobileActionDock`
- GA tracker excludes only `/admin` today: `src/components/google-analytics-tracker.tsx`.
- Vercel Analytics excludes only `/admin` today: `src/components/vercel-analytics.tsx`.
- Because WETT lives under `/admin/office/wett`, existing client analytics exclusion for `/admin` already covers WETT pages.
- Dedicated WETT report APIs must avoid logging PII and should not emit analytics events.

### Sitemap / Robots / Noindex

- Sitemap: `src/app/sitemap.ts`.
- Robots: `src/app/robots.ts`.
- Portal metadata noindex: `src/lib/portal/metadata.ts`.
- Portal headers: `next.config.ts` and `src/proxy.ts`.
- `/request-service` noindex exists in page metadata and headers.
- `src/app/robots.ts` already disallows `/admin` and `/admin/`, covering `/admin/office/wett`.
- `src/app/sitemap.ts` does not include `/admin` routes.
- Additional `/admin/office/wett` sitemap exclusion should be verified but no sitemap change is expected.

## C. Dependency Chain

Target chain:

```text
Technician UI
-> frontend state/forms
-> server actions/API
-> validation
-> WETT report service
-> storage
-> photo storage
-> AI rewrite
-> report renderer
-> PDF generation
-> email delivery
-> completed report storage
```

Detailed mapping:

- Technician UI: `src/app/admin/office/wett/...` pages plus focused WETT components under `src/components/admin/office/wett/...`.
- Frontend state/forms: `src/components/admin/office/wett/wett-report-builder.tsx` and section components.
- Server actions/API: `src/app/admin/office/wett/actions.ts`, `src/app/api/admin/wett/...`.
- Validation: `src/lib/wett/schema.ts`.
- WETT report service: `src/lib/wett/service.ts`.
- Structured storage: `src/lib/wett/storage.ts` using protected JSON.
- Photo storage: `src/lib/wett/photo-storage.ts` using private Blob keys.
- AI rewrite: `src/lib/wett/ai-rewrite.ts` using `src/lib/ai/deepseek-client.ts`.
- Report renderer/view model: `src/lib/wett/report-view-model.ts`, `src/components/admin/office/wett/report/...`.
- PDF generation: `src/lib/wett/report-pdf.tsx`.
- Email delivery: `src/lib/wett/email.ts`.
- Completed report storage: private Blob PDF plus completed structured JSON.

Missing infrastructure:

- WETT authorization helper, likely `requireWettReportAccess()`, reusing existing admin/office session.
- Office dashboard/nav entry for "WETT Reports".
- Private Blob photo upload and authenticated photo serving.
- WETT schemas and storage service.
- WETT report PDF renderer.
- WETT report email delivery with attachment support.
- Autosave client state and server draft persistence.
- AI rewrite endpoint/action dedicated to WETT.

## D. Proposed Route Architecture

Recommended routes:

```text
/admin/office/wett
/admin/office/wett/new
/admin/office/wett/[reportId]
/admin/office/wett/[reportId]/preview
/admin/office/wett/[reportId]/success
```

Recommended API / route handler endpoints:

```text
/api/admin/wett/reports/[reportId]/photos
/api/admin/wett/reports/[reportId]/photos/[photoId]
/api/admin/wett/reports/[reportId]/pdf
```

Recommended server actions:

```text
src/app/admin/office/wett/actions.ts
```

Authentication:

- Michael logs in once through the existing `/admin/login` flow.
- `/admin/office/wett` uses the existing `phoenix_admin_session` cookie.
- `/admin/office/wett` is already under the `/admin/:path*` proxy matcher.
- Do not create any standalone WETT login route, WETT credentials, or WETT session cookie.
- Server pages/actions must call a server-side WETT authorization helper.

Authorization:

- Existing `admin` and `office` roles are the correct base authorization boundary: Michael can use the Office workspace, and admin users must also be able to view, create, and manage WETT reports.
- Add `requireWettReportAccess()` in the existing auth/permission layer or a small WETT permission helper that calls `requireSession()` and allows `session.role === "admin"` or `session.role === "office"`.
- If Phoenix later wants named-user restriction, add optional `WETT_REPORT_USERNAMES` allowlist checked by `requireWettReportAccess()`. This is not a second auth system.
- Every report/photo/PDF route must check `requireWettReportAccess()`.
- Do not expose report IDs to unauthenticated users.

Noindex:

- `/admin` is already disallowed in `src/app/robots.ts` and not present in `src/app/sitemap.ts`.
- WETT pages are protected behind `/admin`.
- Add page metadata noindex in the WETT workspace layout/page only if implementation introduces a nested layout.
- API responses for private PDF/photo routes should use `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow, noarchive`.

Navigation isolation:

- Add an Office workspace entry labeled `WETT Reports`.
- From `/admin/office`, Michael can access New WETT Report, Draft Reports, and Completed Reports.
- Once inside `/admin/office/wett`, the WETT app can use a focused mobile inspection UI rather than the normal Office dashboard layout.
- No links from public navigation.

Sitemap exclusion:

- Do not add `/admin/office/wett` routes to `src/app/sitemap.ts`.
- Existing `/admin` robots disallow covers the WETT workspace.

### WETT Workspace Layout Architecture

Current layout behavior:

- `src/app/layout.tsx` is the root layout for the app.
- It currently renders `SiteHeader`, `SiteFooter`, and `MobileActionDock` around all route children.
- It also renders `StructuredData`, `VercelAnalytics`, and `GoogleAnalyticsTracker`.
- `src/app/admin/office/page.tsx` explicitly renders `AdminShell` inside that root layout.
- `AdminShell` appears only when a page imports and renders it; it is not automatically applied to every `/admin` route.

What would happen without a layout change:

- `/admin/office/wett/...` would be wrapped by the public `SiteHeader`, `SiteFooter`, and `MobileActionDock`.
- WETT pages would show `AdminShell` only if the WETT pages choose to render it.
- Therefore the plan cannot claim a dedicated mobile app feel unless the root public chrome is suppressed for WETT routes.

Smallest safe V1 strategy:

- Add a small client gate component, recommended `src/components/root-chrome-frame.tsx`, used by `src/app/layout.tsx`.
- `RootChromeFrame` receives `children` and public site settings.
- It uses `usePathname()` to detect `/admin/office/wett`.
- For `/admin/office/wett` and descendants, render a minimal full-height app frame without `SiteHeader`, `SiteFooter`, or `MobileActionDock`.
- For all other routes, render the existing public chrome exactly as today.
- Keep `StructuredData`, `VercelAnalytics`, and `GoogleAnalyticsTracker` behavior unchanged, relying on existing `/admin` analytics exclusion.
- WETT pages should not render `AdminShell` during the inspection builder; the WETT list/home may use a lightweight `WettWorkspaceShell` with a small "Back to Office" link.

Files affected:

- `src/app/layout.tsx`: replace the hardcoded chrome wrapper with `RootChromeFrame`.
- `src/components/root-chrome-frame.tsx`: new client component containing route-aware chrome gating.
- `src/components/admin/office/wett/wett-workspace-shell.tsx`: new focused WETT shell for list/builder/preview/success pages.

Why not a route-group refactor:

- Moving the public site and admin into separate route groups would touch many existing routes and create avoidable regression risk.
- A root chrome gate is the smallest scoped change that preserves public website and existing Office/Admin behavior.

Risk:

- Medium. It changes the root layout wrapper, so public pages, admin pages, portal pages, analytics, and mobile dock behavior must be regression-tested.
- Lower than a broad route-group migration.

Regression tests:

- Public homepage still shows `SiteHeader`, `SiteFooter`, and `MobileActionDock`.
- Existing `/admin`, `/admin/office`, `/admin/articles`, `/admin/leads` still show current expected chrome/AdminShell behavior.
- `/admin/office/wett` does not show public `SiteHeader`, `SiteFooter`, or `MobileActionDock`.
- WETT builder does not render `AdminShell` unless intentionally added.
- Existing analytics exclusion for `/admin` still works.

## E. Proposed Data Model

Create canonical schema in `src/lib/wett/schema.ts`. Store dates as ISO strings. Store measurements as numeric values plus unit metadata. Store all WETT-specific official fields as configurable schemas once owner supplies the official form.

```ts
type WettReport = {
  id: string;
  reportNumber: string;
  version: 1;
  status: "draft" | "ready-for-review" | "finalizing" | "finalizing-failed" | "completed" | "archived";
  deliveryStatus: "not-ready" | "pending" | "sent" | "failed" | "skipped";

  customer: {
    fullName: string;
    phone?: string;
    email: string;
  };

  property: {
    street: string;
    city: string;
    province: "AB" | string;
    postalCode: string;
    formattedAddress?: string;
  };

  inspection: {
    inspectionDate: string;
    inspectorName: string;
    wettInspectorNumber: string;
    inspectionType?: string; // OWNER / AUTHORITATIVE SOURCE INPUT REQUIRED
  };

  system: {
    applianceType?: string; // approved option list required
    fuelType?: string;
    manufacturer?: string;
    model?: string;
    serialNumber?: string;
    certificationListing?: string;
    installationType?: string;
    chimneyType?: string;
    connectorType?: string;
    linerInformation?: string;
    otherStructuredFields: Array<{ id: string; label: string; value: string }>;
  };

  measurements: {
    hearth: {
      frontExtensionInches?: number;
      leftExtensionInches?: number;
      rightExtensionInches?: number;
      conditionNotes?: string;
    };
    additional: Array<{
      id: string;
      group: string;
      label: string;
      value: number;
      unit: "in" | "ft" | "mm" | "cm" | string;
      notes?: string;
      sourceRequired?: boolean;
    }>;
  };

  checklist: Array<{
    id: string;
    section: string;
    label: string;
    state: "acceptable" | "deficiency" | "na" | "unable-to-verify";
    description?: string;
    recommendation?: string;
    measurementRefs: string[];
    photoIds: string[];
    findingIds: string[];
    component?: string;
    diagramRegionId?: string;
    requiredSource?: "OWNER / AUTHORITATIVE SOURCE INPUT REQUIRED";
  }>;

  findings: Array<{
    id: string;
    number: number;
    section: string;
    component: string;
    category?: "informational" | "maintenance" | "deficiency" | "safety-concern" | "further-evaluation";
    observation: string;
    recommendation?: string;
    measurementRefs: string[];
    photoIds: string[];
    diagramRegionIds: string[];
    originalTechnicianNote?: string;
    aiRewrittenNote?: string;
    aiRewriteMode?: "standard-professional" | "insurance-oriented" | "realtor-friendly";
    aiRewriteAcceptedAt?: string;
    aiRewriteModel?: string;
    createdAt: string;
    updatedAt: string;
  }>;

  maintenance: {
    cleaningRequired?: "yes" | "no" | "na";
    classification?: string; // OWNER / AUTHORITATIVE SOURCE INPUT REQUIRED
    comment?: string;
    recommendation?: string;
  };

  protectiveBarrier: {
    present?: "yes" | "no" | "na";
    condition?: string; // OWNER / AUTHORITATIVE SOURCE INPUT REQUIRED
    notes?: string;
    photoIds: string[];
  };

  photos: Array<{
    id: string;
    blobKey: string;
    filename: string;
    contentType: string;
    sizeBytes: number;
    width?: number;
    height?: number;
    caption?: string;
    findingIds: string[];
    checklistItemIds: string[];
    diagramRegionIds: string[];
    uploadedAt: string;
    uploadedBy: string;
    replacedByPhotoId?: string;
    deletedAt?: string;
  }>;

  diagrams: Array<{
    id: "exterior" | "fireplace-system" | string;
    label: string;
    selectedRegions: Array<{
      regionId: string;
      findingIds: string[];
      photoIds: string[];
      markerLabel?: string;
    }>;
  }>;

  notes: {
    generalTechnicianNote?: string;
    additionalComments?: string;
    originalTechnicianSummary?: string;
    aiRewrittenSummary?: string;
    aiRewriteMode?: "standard-professional" | "insurance-oriented" | "realtor-friendly";
  };

  signOff: {
    inspectorName?: string;
    wettInspectorNumber?: string;
    signedAt?: string;
    signatureText?: string;
    signatureImagePhotoId?: string;
    customerAcknowledgement?: {
      name?: string;
      signedAt?: string;
      signatureText?: string;
      wording?: string; // OWNER / AUTHORITATIVE SOURCE INPUT REQUIRED
    };
  };

  reportOutput: {
    previewGeneratedAt?: string;
    finalInspectionDataFrozenAt?: string;
    finalizingStartedAt?: string;
    finalizingFailedAt?: string;
    finalizingFailureReason?: string;
    completedJsonBlobKey?: string;
    pdfBlobKey?: string;
    pdfFilename?: string;
    pdfSizeBytes?: number;
    pdfGeneratedAt?: string;
  };

  delivery: {
    customerEmail?: string;
    senderEmail?: string;
    internalCopyEmail?: string;
    status: "not-ready" | "pending" | "sent" | "failed" | "skipped";
    sentAt?: string;
    provider?: "brevo" | "smtp";
    providerMessageId?: string;
    failureReason?: string;
    lastAttemptAt?: string;
    attemptCount: number;
  };

  audit: {
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy?: string;
    finalizingAt?: string;
    finalizingBy?: string;
    completedAt?: string;
    completedBy?: string;
    lockedAt?: string;
    autosaveRevision: number;
    sourceIpLastSave?: string;
    userAgentLastSave?: string;
  };
};
```

Status rules:

- `draft`: editable working report.
- `ready-for-review`: editable, all required fields are present enough for technician review.
- `finalizing`: server-owned transition state after the technician confirms completion; user editing is locked while finalization runs.
- `finalizing-failed`: PDF generation/storage or final data freeze failed; report is not completed and must be recoverable/retryable.
- `completed`: final inspection data is locked and final PDF has been generated and safely stored.
- `archived`: completed report hidden from normal active lists.

Completion boundary:

- A report must not enter `completed` until the PDF exists in private Blob and report metadata references it.
- Validation failure returns to `draft` or `ready-for-review`, depending on previous state.
- PDF generation/storage failure sets `finalizing-failed`; it does not set `completed`.
- Email delivery happens after `completed` and is tracked separately through `deliveryStatus`.

WizField migration notes:

- Keep `customer`, `property`, `inspection`, `system`, `measurements`, `checklist`, `findings`, `photos`, `delivery`, and `audit` as explicit objects.
- Do not store only HTML or only PDF.
- Keep `reportNumber` stable and human-readable.
- Preserve references between finding, photo, checklist item, measurement, and diagram region.

## F. Storage Architecture

Recommended V1 storage:

- Draft reports: protected JSON in private Blob, one file per report.
- Report index/list: protected JSON index with summary fields only.
- Completed structured reports: protected JSON snapshot in private Blob.
- Private customer data: protected JSON only, never public asset paths.
- Photos: private Blob objects, metadata stored inside report JSON.
- Generated PDFs: private Blob objects.
- Delivery metadata: stored in report JSON and index summary.

Proposed keys:

```text
wett/reports/index.json
wett/reports/{reportId}/report.json
wett/reports/{reportId}/completed.json
wett/reports/{reportId}/photos/{photoId}.{ext}
wett/reports/{reportId}/pdf/{reportNumber}.pdf
```

Use `protectJson()` and `unprotectJson()` from `src/lib/cms/secure-json.ts` for structured JSON.

V1 sufficiency:

- Sufficient for low-volume Phoenix WETT reporting.
- Avoids adding SQL/database infrastructure before there is clear operational need.
- Keeps deployment simple on the existing Vercel/Blob stack.

Scalability limits:

- JSON index writes are last-write-wins unless service implements optimistic revision checks.
- Listing and filtering are limited compared with SQL.
- Concurrent edits from multiple technicians can conflict.
- Large report bodies should not all be stored in one global JSON file.

Mitigation:

- Store each report in its own JSON blob.
- Store compact summaries in index.
- Include `autosaveRevision` and reject stale writes where practical.
- Add explicit report locks on completion.
- Leave a future migration path to WizField or SQL if volume grows.

## G. Private Photo Architecture

WETT photos are private evidence, not marketing evidence.

Upload method:

- Client uploads through authenticated route handler `POST /api/admin/wett/reports/[reportId]/photos`.
- Validate session server-side.
- Validate report status is editable.
- Validate file is image and size is within approved limit. Start with 8 MB to match existing upload behavior; optionally compress server-side with `sharp`.
- Store private Blob with `access: "private"`.

Storage privacy:

- Do not return public Blob URLs.
- Store `blobKey` and metadata only.
- Serve previews through authenticated route handler `GET /api/admin/wett/reports/[reportId]/photos/[photoId]`.
- Use `Cache-Control: private, no-store` for original private images.

File naming:

```text
wett/reports/{reportId}/photos/{photoId}.{safeExtension}
```

Report/photo association:

- Photo metadata lives in the report's `photos[]`.
- `photoIds` can be attached to findings, checklist items, diagram regions, hearth measurements, barrier observations, and maintenance notes.

Deletion/replacement:

- Before completion, allow soft delete in metadata and optionally delete Blob object.
- Replacement creates a new `photoId`; old photo gets `replacedByPhotoId` or `deletedAt`.
- After completion, V1 should lock photos. Amendments are out of scope unless owner approves revision workflow.

Final report access:

- Final report PDF embeds selected photos server-side.
- Customer receives PDF attachment in email for V1.
- Do not send unauthenticated private photo URLs.
- If protected link delivery is chosen later, it requires a separate customer-access token design.

## H. Mobile UX Architecture

Design principle: one clear task per screen, large touch targets, persistent progress, clear saved state, and no desktop-only interactions.

Layout note:

- Michael/admin signs in through existing Phoenix admin.
- Once inside `/admin/office/wett`, the WETT workspace uses `WettWorkspaceShell` and the root chrome gate described above.
- The inspection builder should not use `AdminShell`; it should use a focused mobile application frame with a compact report header, save status, progress navigation, and "Back to WETT Reports" action.
- If V1 temporarily keeps any existing admin chrome on the WETT list page, the builder route itself must still suppress public marketing chrome and avoid desktop admin table/form patterns.

1. Login
   - Michael uses existing `/admin/login`.
   - No WETT-specific login screen.
   - After login, Michael enters `/admin/office` and selects `WETT Reports`.

2. Reports home/list
   - Route: `/admin/office/wett`.
   - Cards for drafts and completed reports.
   - Show report number, customer, property city, inspection date, status, delivery status.
   - Primary action: "New WETT report".

3. New report
   - Route: `/admin/office/wett/new`.
   - Creates a draft server-side, generates report ID/report number, redirects to builder.

4. Customer/property
   - Required contact and address fields.
   - Mobile-friendly text/email/tel inputs.
   - Address structured by street, city, province, postal code.

5. Appliance/system
   - Structured appliance/system fields.
   - Approved options only where supplied.
   - Unknown/other values allowed where owner approves.

6. Measurements
   - Hearth front/left/right numeric inputs.
   - Unit labels visible beside fields.
   - Decimal support.
   - No compliance result.

7. WETT checklist
   - Sectioned checklist with segmented controls.
   - States: recommended base is `Acceptable`, `Deficiency`, `N/A`, plus `Unable to verify` if owner approves.
   - Checklist labels require owner/source input.

8. Findings
   - Add structured finding cards.
   - Associate component, note, recommendation, measurement refs, photo refs, diagram regions.

9. Photos
   - Camera-first upload.
   - Multiple photos.
   - Caption per photo.
   - Attach to finding/checklist/diagram.
   - Upload progress and retry.

10. Visual diagram
   - Region list plus SVG preview.
   - Technician selects predefined region, not freehand drawing.
   - Regions highlight and markers number linked findings.

11. Technician notes
   - Fast free text.
   - Preserve raw notes.
   - Offer "Rewrite with AI" but never overwrite original.

12. AI rewrite
   - Select mode.
   - Show original and AI version side by side.
   - Accept, reject, edit, retry.

13. Review
   - Missing required fields.
   - Measurements summary.
   - Findings/deficiencies summary.
   - Photos without captions warning.
   - Customer email.

14. Report preview
   - Route: `/admin/office/wett/[reportId]/preview`.
   - Branded report preview using web renderer from canonical view model.
   - Clearly show "Draft preview" unless completed.

15. Completion
   - Sticky "Complete report" CTA only from review/preview.
   - Confirmation modal with delivery email.
   - Runs completion transaction.

16. Success/delivery state
   - Route: `/admin/office/wett/[reportId]/success`.
   - Show completed status, PDF saved, email sent/failed.
   - If email failed, show "Report completed, email failed. Retry/resend available."

## I. Measurement Architecture

Mandatory V1 structured fields:

- `measurements.hearth.frontExtensionInches`
- `measurements.hearth.leftExtensionInches`
- `measurements.hearth.rightExtensionInches`

Validation:

- Numeric values only.
- Support decimals.
- Store as numbers.
- Minimum `0`.
- Reasonable maximum guard such as `0` to `240` inches for data-entry sanity, not compliance.
- Empty allowed until final required gate says otherwise. Required gate depends on owner-approved WETT form.

Mobile input:

- Use `inputMode="decimal"`.
- Use visible `in` suffix.
- Use large fields and labels.

Report rendering:

- Render in a Measurements table.
- Do not hide measurements only in narrative text.
- Do not compute compliant/non-compliant without approved ruleset.

Boundary:

- Measurements are factual observations only.
- No automatic compliance evaluation in V1.
- Any clearances or code rules are `OWNER / AUTHORITATIVE SOURCE INPUT REQUIRED`.

## J. Checklist / Findings Architecture

Recommended state model:

```text
Acceptable
Deficiency
N/A
Unable to verify, if owner-approved
```

When a technician selects `Deficiency`, the UI expands inline with:

- Description / observation.
- Recommendation.
- Related measurement selector.
- Add/take photo.
- Component selector.
- Diagram region selector.
- Optional category if owner approves presentation categories.

Data flow:

- Checklist item can create or link to a finding.
- Finding stores the richer report data.
- Checklist remains fast status tracking.
- Findings are the canonical location for detailed deficiencies.

WETT content boundary:

- Actual checklist sections and labels require Phoenix's real WETT form.
- Do not invent official WETT checklist items beyond product-required placeholders for architecture.

## K. AI Rewrite Architecture

Modes:

- Standard Professional
- Insurance-Oriented
- Realtor / Real-Estate Friendly

Service:

- Create `src/lib/wett/ai-rewrite.ts`.
- Reuse `requestDeepSeekJsonCompletion()` from `src/lib/ai/deepseek-client.ts`.
- Do not reuse article-generation prompts.
- Create action/API in `src/app/admin/office/wett/actions.ts` or `src/app/api/admin/wett/rewrite/route.ts`.

Input:

- Report ID.
- Target note scope: finding note, recommendation, general note, summary.
- Original technician note.
- Rewrite mode.
- Locked facts:
  - report number
  - customer/property omitted unless needed
  - measurements
  - checklist states
  - component
  - selected deficiency status
  - photo captions/ids if relevant
  - system fields relevant to the note

Output:

```ts
{
  rewrittenNote: string;
  mode: "standard-professional" | "insurance-oriented" | "realtor-friendly";
  warnings?: string[];
}
```

Hard rules:

- AI may only return improved wording.
- AI must not return modified structured facts.
- Original note always remains stored.
- Accepted rewrite is stored separately from original.
- Reject leaves original untouched.
- Retry creates a new candidate but does not overwrite accepted text unless technician accepts.

Factual locking:

- Do not ask AI to make decisions.
- Do not ask AI to classify compliance.
- Do not accept AI-returned measurements or statuses.
- Post-validate response shape with Zod.
- Limit output length.
- Show validation error if response is invalid.

Error handling:

- If DeepSeek key is missing, show "AI rewrite unavailable. Continue manually."
- If API fails, preserve current draft and show retry option.
- Log provider errors server-side without customer PII in client.

## L. Visual Diagram Architecture

Recommendation: use SVG diagrams with predefined regions.

Reasons:

- Scales cleanly on phone and PDF.
- Region IDs can map to findings.
- React PDF supports SVG primitives for report output.
- Avoids complex freehand drawing.

Initial region model:

Exterior:

- `cap`
- `crown`
- `termination`
- `masonry`
- `mortar`
- `flashing`
- `chase-cover`

Fireplace/System:

- `hearth`
- `firebox`
- `damper`
- `flue`
- `screen`
- `doors-glass`
- `mantel`
- `connector`
- `appliance`

Content warning:

- These are selectable UI regions, not official WETT checklist requirements.
- Exact labels and diagrams should be approved by owner or authoritative source.

Implementation:

- Define regions in `src/lib/wett/diagram-regions.ts`.
- Web SVG component in `src/components/admin/office/wett/diagrams/wett-diagram.tsx`.
- PDF SVG component or equivalent React PDF `Svg` in `src/lib/wett/report-pdf.tsx`.
- Store selected `diagramRegionIds` on findings and photos.
- Generate marker labels from finding numbers.

Mobile selection:

- Use large region buttons below/alongside diagram.
- Tap region button to highlight preview.
- Avoid precision tapping as the only input.

PDF rendering:

- Show diagram with highlighted regions.
- Include numbered markers.
- Cross-reference markers to findings.

## M. Phoenix Premium Report Architecture

The final report should be generated from a report view model, not directly from form state.

Recommended files:

- `src/lib/wett/report-view-model.ts`
- `src/components/admin/office/wett/report/wett-report-preview.tsx`
- `src/lib/wett/report-pdf.tsx`

Report contents:

- Phoenix logo.
- Charcoal/copper branding.
- Report number.
- Inspection date.
- Executive summary from structured data.
- Customer/property.
- Inspector information.
- System information.
- Measurements table.
- Checklist summary.
- Findings/deficiencies.
- Visual diagram.
- Photo evidence and captions.
- Recommendations.
- Sign-off.
- Scope/limitations area.
- Header/footer.
- Page numbers.

Scope/limitations:

- Dedicated data/config field.
- Text is `OWNER / AUTHORITATIVE SOURCE INPUT REQUIRED`.
- Do not invent legal disclaimer language.

Component architecture:

- View model builder creates display-ready strings, grouped sections, finding numbers, photo numbers, diagram markers, and summary counts.
- Web preview component renders the same semantic sections for technician review.
- PDF renderer reimplements layout using React PDF primitives, fed by the same view model.

## N. PDF Strategy

Current dependencies and code already support server-side PDF:

- `@react-pdf/renderer` in `package.json`.
- `src/lib/portal/finance-pdf.tsx` uses `renderToBuffer`.
- `sharp` is available for image/logo conversion.

Options considered:

- Browser Print-to-PDF: weakest reliability in Vercel, inconsistent pagination, harder server completion transaction.
- Headless Chromium/Puppeteer: strong HTML fidelity but adds deployment weight and Vercel runtime complexity.
- React PDF: already installed, deterministic server rendering, supports pages, text, images, SVG, headers/footers, and attachments.

Recommended architecture:

- Use `@react-pdf/renderer` in Node.js runtime.
- Create `src/lib/wett/report-pdf.tsx`.
- Generate PDF during completion in a server action/service.
- Fetch private Blob photos server-side and convert to data URLs or buffers for React PDF.
- Use fixed header/footer on each page.
- Use page number rendering.
- Use report view model to keep PDF and preview consistent.

Requirements:

- Preserve Phoenix design.
- Multiple pages.
- Photos.
- Diagrams.
- Tables.
- Page headers/footers.
- Vercel production reliability.

## O. Autosave & Field Reliability

Autosave is mandatory.

Recommended behavior:

- Local React state is canonical while editing.
- Save a minimal recovery draft locally, namespaced by authenticated username and report ID.
- Debounce server autosave at 1.5 to 2 seconds after field changes.
- Also save on section navigation.
- Also save on visibility change/page hide where possible.
- Show status: "Unsaved", "Saving", "Saved", "Save failed".
- Warn on refresh/close if dirty.

Local PII recovery policy:

- Server Blob storage is the authoritative persistent record.
- Local recovery exists only as temporary field-recovery protection for weak signal, refreshes, and phone interruptions.
- Namespace local recovery keys by authenticated user and report ID, for example `wettDraft:{username}:{reportId}`.
- Store only structured draft JSON needed to recover unsaved text/selection/numeric edits.
- Never store uploaded photo binary data in `localStorage`.
- Never store API keys, provider secrets, session cookies, or auth tokens in local recovery storage.
- Clear the local recovery draft after successful completion.
- Clear local recovery drafts on logout where technically practical by adding cleanup to the existing admin sign-out flow or WETT workspace cleanup hook.
- Add a TTL for abandoned local drafts. Recommended V1 TTL: 72 hours from `updatedAt`; expired local recovery is ignored and removed on next WETT workspace load.
- If server has a newer revision than local recovery, prefer server and discard or warn about stale local data.
- If local recovery has a newer revision/timestamp than server, ask the user whether to restore local unsaved changes.
- Show a shared-device warning in the WETT workspace: do not use the report builder on shared or untrusted devices because temporary recovery data may include customer PII until cleared or expired.

IndexedDB comparison:

- IndexedDB can store larger structured records and blobs more reliably than `localStorage`, but storing photo binaries locally increases PII exposure and complexity.
- V1 should use `localStorage` only for small structured recovery data and must not store photo binaries locally.
- If future offline mode is approved, revisit IndexedDB with encryption-at-rest expectations and explicit device policy.

Server persistence:

- Server action `autosaveWettReportAction(reportId, patch, revision)`.
- Validate patch with Zod partial schema.
- Reject saves to completed reports.
- Increment `audit.autosaveRevision`.
- Return next revision and updated timestamp.

Weak network:

- Keep local draft if server save fails.
- Retry with exponential backoff while page is open.
- Provide "Retry save" CTA.
- On load, compare local draft revision/timestamp with server and offer recovery if local is newer.

Photo upload failure:

- Photo upload is independent from text autosave.
- Failed upload keeps local pending photo card with retry/remove.
- Do not mark photo as attached until server confirms metadata.

No silent data loss:

- Never clear local recovery until server confirms save or the report is successfully completed.
- After successful completion, clear local recovery data for that report because the server-stored completed report/PDF is authoritative.

## P. Completion Transaction

When technician presses `COMPLETE REPORT`:

```text
draft / ready-for-review
-> finalizing
-> validate and freeze final inspection data
-> generate report view model
-> generate PDF
-> save PDF successfully
-> completed
-> attempt customer email
-> store delivery result
```

Recommended implementation:

1. Server loads latest report.
2. Confirm report is in `draft` or `ready-for-review`, not `completed` or `archived`.
3. Set `status: "finalizing"` and record `finalizingAt`/`finalizingBy`.
4. Validate required fields using completion schema.
5. If validation fails, restore previous editable state (`draft` or `ready-for-review`) and return section-linked errors.
6. Freeze final inspection data into a final structured snapshot.
7. Generate report view model from the frozen data.
8. Generate PDF buffer.
9. Save PDF to private Blob successfully.
10. Save completed structured JSON snapshot and PDF metadata.
11. Set `status: "completed"`, `lockedAt`, `completedAt`, and `completedBy`.
12. Clear local recovery draft for that report.
13. Attempt Brevo customer email.
14. Update `deliveryStatus` and delivery metadata.
15. Return completion result.

Failure handling:

- Validation failure: report returns to editable `draft` or `ready-for-review`.
- Final data freeze failure: set `finalizing-failed` with failure reason; allow retry.
- PDF generation failure: set `finalizing-failed`; do not mark completed; allow retry.
- Blob PDF save failure: set `finalizing-failed`; do not mark completed; allow retry.
- Completed JSON snapshot failure before completion status save: set `finalizing-failed`; do not mark completed; allow retry.
- Email failure: report remains `completed`; store `deliveryStatus = "failed"` and failure reason; allow resend.
- UI success state must distinguish report finalization/PDF completion from email delivery.
- `finalizing-failed` reports should show a recovery action: "Retry finalization" and, if needed, "Return to review".

Rollback point:

- Before phase release, no reports exist.
- After release, never delete completed report data during rollback.
- If app rollback occurs, existing Blob JSON/PDF remains recoverable.
- Reports in `finalizing` or `finalizing-failed` remain not completed and can be retried after fix.

## Q. Email Delivery

Existing lead email system:

- `src/lib/email/lead-notifications.ts`
- Brevo first, Gmail SMTP fallback.
- Lead-specific recipients and content.

WETT recommendation:

- Create dedicated `src/lib/wett/email.ts`.
- Use Brevo API directly for customer delivery.
- Reuse site settings for sender where appropriate.
- Add optional internal copy setting/env:
  - `WETT_INTERNAL_REPORT_EMAIL`
  - fallback to CMS notification email if owner approves.

Customer email:

- To: report customer email.
- From: Phoenix sender from CMS settings.
- Reply-To: Phoenix service email.
- Subject includes report number and Phoenix.
- Attach final PDF for V1.
- Do not include private photo links.

Attachment vs protected link:

- Recommended V1: PDF attachment.
- Reason: customer does not have auth; protected customer report links require a tokenized access feature not requested for V1.
- Risk: large PDFs can exceed Brevo attachment limits. Compress photos and store failure reason if email rejected.

Retry/resend:

- Add server action `resendWettReportEmailAction(reportId)`.
- Only allowed for completed reports with saved PDF.
- Increment attempt count and update delivery metadata.

## R. Authentication & Security

Login architecture:

- Reuse existing `/admin/login`.
- Reuse existing env-backed admin/office credentials:
  - `OFFICE_USERNAME`
  - `OFFICE_PASSWORD_HASH`
  - `OFFICE_PASSWORD`
  - `ADMIN_SESSION_SECRET`
- Reuse existing `phoenix_admin_session`.
- Do not create WETT-specific login credentials, cookie, or session implementation.

Session:

- Existing admin session cookie is httpOnly, signed, sameSite lax, secure in production, and scoped to `/`.
- WETT pages and `/api/admin/wett` routes can read the existing cookie server-side.
- Do not store PII in cookie.

Route authorization:

- `src/proxy.ts` already protects `/admin/:path*`, including `/admin/office/wett`.
- `canAccessAdminPath()` already allows `office` role under `/admin/office`.
- WETT server pages/actions should call `requireWettReportAccess()`.
- `requireWettReportAccess()` should allow `session.role === "admin"` or `session.role === "office"` and optionally check `WETT_REPORT_USERNAMES` if owner wants named-user restriction.
- Private photo/PDF route handlers require auth and verify report/photo membership.

Private report access:

- No public report page in V1.
- Customers receive PDF attachment only.
- Internal report preview/download requires Office WETT authorization.

Noindex:

- Existing `/admin` robots disallow and sitemap exclusion cover the WETT workspace.
- Private PDF/photo route handlers should set `X-Robots-Tag: noindex, nofollow, noarchive` and `Cache-Control: no-store`.

Sitemap exclusion:

- Do not add `/admin/office/wett` to sitemap.

Analytics exclusion:

- Existing GA and Vercel Analytics client components already ignore `/admin` routes.
- Verify no WETT client component sends GA events.
- Do not send customer/report data to GA.

PII protection:

- Protected JSON for structured data.
- Private Blob for photos/PDFs.
- No PII in URL query params.
- No PII in analytics.
- Server logs should use report IDs, not customer names/addresses.
- Local recovery may temporarily contain customer PII, so it must be namespaced by authenticated user/report ID, TTL-limited, and cleared after completion.
- Never store photo binaries, API keys, secrets, session cookies, or auth tokens in local recovery storage.
- Show a shared-device warning for the WETT workspace.

Server validation:

- Zod schemas for all actions and API routes.
- Validate status transitions.
- Validate report ownership/access by report ID.

AI API security:

- DeepSeek API key server-side only.
- Send only facts needed for rewrite.
- Do not allow AI output to update structured facts.

Protected-area changes:

- `src/lib/auth/permissions.ts` for `requireWettReportAccess()` and optional Office/admin nav entry.
- `src/app/admin/office/page.tsx` or Office dashboard component for `WETT Reports` entry.
- New `/admin/office/wett` pages.
- New `/api/admin/wett` route handlers with explicit server authorization.
- No expected `src/proxy.ts`, `next.config.ts`, `src/app/robots.ts`, GA, or Vercel Analytics changes unless verification proves a gap.

## S. Exact File Plan

| File | New/Existing | Purpose | Risk | Protected |
| ---- | ------------ | ------- | ---- | --------- |
| `.env.example` | Existing | Document optional `WETT_REPORT_USERNAMES`, WETT internal email, and report settings | Low | Yes |
| `src/lib/auth/permissions.ts` | Existing | Add `requireWettReportAccess()` and `WETT Reports` admin/Office nav/permission entry if needed | Medium | Yes |
| `src/app/admin/office/page.tsx` | Existing | Add Office workspace entry card/link for `WETT Reports` if not handled by nav alone | Medium | Yes |
| `src/components/admin/admin-shell.tsx` | Existing | Likely unchanged; only update if Office nav rendering needs WETT grouping | Low | Yes |
| `src/app/layout.tsx` | Existing | Replace hardcoded public chrome wrapper with route-aware `RootChromeFrame` | Medium | Yes |
| `src/components/root-chrome-frame.tsx` | New | Suppress `SiteHeader`, `SiteFooter`, and `MobileActionDock` for `/admin/office/wett` only | Medium | Yes |
| `src/app/admin/office/wett/page.tsx` | New | WETT reports home/list under Office | High | Yes |
| `src/app/admin/office/wett/new/page.tsx` | New | Create report draft and redirect | High | Yes |
| `src/app/admin/office/wett/[reportId]/page.tsx` | New | Main mobile report builder page | High | Yes |
| `src/app/admin/office/wett/[reportId]/preview/page.tsx` | New | Branded report preview | High | Yes |
| `src/app/admin/office/wett/[reportId]/success/page.tsx` | New | Completion result and delivery status | Medium | Yes |
| `src/app/admin/office/wett/actions.ts` | New | Autosave, status transitions, AI accept/reject, complete, resend | High | Yes |
| `src/app/api/admin/wett/reports/[reportId]/photos/route.ts` | New | Authenticated private photo upload/list with `requireWettReportAccess()` | High | Yes |
| `src/app/api/admin/wett/reports/[reportId]/photos/[photoId]/route.ts` | New | Authenticated private photo streaming/delete with no-store headers | High | Yes |
| `src/app/api/admin/wett/reports/[reportId]/pdf/route.ts` | New | Authenticated PDF download/stream with no-store/noindex headers | High | Yes |
| `src/lib/wett/schema.ts` | New | Zod schemas, TypeScript types, status enums | High | Yes |
| `src/lib/wett/storage.ts` | New | Protected JSON report/index persistence | High | Yes |
| `src/lib/wett/service.ts` | New | Report creation, autosave merge, completion orchestration | High | Yes |
| `src/lib/wett/report-number.ts` | New | Report number generation and collision handling | Medium | Yes |
| `src/lib/wett/photo-storage.ts` | New | Private Blob upload/get/delete helpers | High | Yes |
| `src/lib/wett/ai-rewrite.ts` | New | Dedicated WETT DeepSeek prompt/service | High | Yes |
| `src/lib/wett/diagram-regions.ts` | New | Region definitions for exterior/fireplace diagrams | Medium | Yes |
| `src/lib/wett/report-view-model.ts` | New | Shared preview/PDF display model | High | Yes |
| `src/lib/wett/report-pdf.tsx` | New | React PDF renderer for final report | High | Yes |
| `src/lib/wett/email.ts` | New | Brevo WETT report delivery with PDF attachment | High | Yes |
| `src/lib/wett/completion.ts` | New | Finalization state machine, PDF-before-completed transaction, failure recovery | High | Yes |
| `src/lib/wett/local-recovery.ts` | New | Browser-safe local recovery key/TTL policy helpers, no photo binary storage | Medium | Yes |
| `src/components/admin/office/wett/wett-report-builder.tsx` | New | Client builder shell, section state, autosave orchestration | High | Yes |
| `src/components/admin/office/wett/wett-progress-nav.tsx` | New | Mobile progress/section navigation | Medium | Yes |
| `src/components/admin/office/wett/wett-save-indicator.tsx` | New | Saved/saving/error status | Low | Yes |
| `src/components/admin/office/wett/wett-workspace-shell.tsx` | New | Focused mobile WETT shell inside Office workspace | Medium | Yes |
| `src/components/admin/office/wett/sections/customer-property-section.tsx` | New | Customer/property form section | Medium | Yes |
| `src/components/admin/office/wett/sections/system-section.tsx` | New | Appliance/system section | Medium | Yes |
| `src/components/admin/office/wett/sections/measurements-section.tsx` | New | Hearth/additional measurement UI | High | Yes |
| `src/components/admin/office/wett/sections/checklist-section.tsx` | New | Checklist status UI | High | Yes |
| `src/components/admin/office/wett/sections/findings-section.tsx` | New | Structured findings UI | High | Yes |
| `src/components/admin/office/wett/sections/photos-section.tsx` | New | Private photo upload/caption/association UI | High | Yes |
| `src/components/admin/office/wett/sections/diagram-section.tsx` | New | Diagram region selection UI | Medium | Yes |
| `src/components/admin/office/wett/sections/notes-ai-section.tsx` | New | Technician notes and AI rewrite UI | High | Yes |
| `src/components/admin/office/wett/sections/review-section.tsx` | New | Completion readiness and validation summary | High | Yes |
| `src/components/admin/office/wett/diagrams/exterior-diagram.tsx` | New | Exterior SVG diagram | Medium | Yes |
| `src/components/admin/office/wett/diagrams/fireplace-system-diagram.tsx` | New | Fireplace/system SVG diagram | Medium | Yes |
| `src/components/admin/office/wett/report/wett-report-preview.tsx` | New | Web preview renderer | High | Yes |
| `src/components/admin/office/wett/report/report-section.tsx` | New | Shared web report section primitives | Medium | Yes |
| `src/components/admin/office/wett/photo-thumbnail.tsx` | New | Authenticated thumbnail display | Medium | Yes |
| `src/components/admin/office/wett/complete-report-button.tsx` | New | Completion confirmation and action state | High | Yes |
| `src/components/admin/office/wett/resend-report-email-button.tsx` | New | Email resend action | Medium | Yes |
| `src/lib/cms/secure-json.ts` | Existing | Reuse encryption helpers; change only if export signatures need adjustment | Medium | Yes |
| `src/proxy.ts` | Existing | Expected unchanged because `/admin/:path*` already protects Office routes | Low | Yes |
| `next.config.ts` | Existing | Expected unchanged unless noindex/header verification finds a gap | Low | Yes |
| `src/app/robots.ts` | Existing | Expected unchanged because `/admin` is already disallowed | Low | Yes |
| `src/components/google-analytics-tracker.tsx` | Existing | Expected unchanged because `/admin` is already excluded | Low | Yes |
| `src/components/vercel-analytics.tsx` | Existing | Expected unchanged because `/admin` is already excluded | Low | Yes |
| `README.md` | Existing | Optional post-implementation note for Office WETT env/deployment | Low | No |

Expected no package change for V1. Add a dependency only if implementation proves `@react-pdf/renderer` cannot satisfy WETT report needs.

## T. Build Phases

### Phase 0 - Safety and Final Inputs Check

Objective: confirm docs, env, and owner inputs before code.

Files:

- No production code changes.
- Confirm missing docs.
- Confirm official WETT form availability.

Dependencies:

- Owner supplies required WETT form/checklist or approves placeholders as non-production.

Implementation work:

- Re-check `node_modules/next/dist/docs/` after install.
- Confirm Vercel Blob private object behavior.
- Confirm Brevo attachment limit.

Tests:

- `npm run build` baseline.
- Existing public pages smoke check.

Done condition:

- Owner approves plan and missing inputs list.

Rollback point:

- No code changed.

### Phase 1 - WETT Schema and Storage

Objective: create structured, WizField-ready data model and protected persistence.

Files:

- `src/lib/wett/schema.ts`
- `src/lib/wett/storage.ts`
- `src/lib/wett/report-number.ts`
- `src/lib/wett/service.ts`

Dependencies:

- Existing `src/lib/cms/secure-json.ts`.
- Existing Blob token.

Implementation work:

- Define Zod schemas.
- Implement report index and per-report storage.
- Implement draft create/list/get/save.
- Implement report number generation.

Tests:

- Unit-level service tests if test setup exists; otherwise targeted manual route/action checks.
- Validate encrypted JSON read/write locally and with Blob when configured.

Done condition:

- Can create/list/load/save draft server-side.

Rollback point:

- Remove `src/lib/wett/*`; no routes exposed yet.

### Phase 2 - Office WETT Workspace Integration

Objective: register WETT inside the existing Office surface, verify admin/Office authorization, add workspace entry points, and create the focused mobile WETT workspace shell.

Files:

- `.env.example`
- `src/lib/auth/permissions.ts`
- `src/app/layout.tsx`
- `src/app/admin/office/page.tsx`
- `src/app/admin/office/wett/page.tsx`
- `src/components/root-chrome-frame.tsx`
- `src/components/admin/office/wett/wett-workspace-shell.tsx`

Dependencies:

- Existing `/admin/login`.
- Existing `phoenix_admin_session`.
- Existing `office` role.

Implementation work:

- Add `requireWettReportAccess()` using existing session and role checks.
- Allow both `admin` and `office` roles to view reports and create reports.
- Optionally support `WETT_REPORT_USERNAMES` allowlist without creating a second auth system.
- Add `WETT Reports` Office entry/nav, and add or expose an admin entry if the existing admin navigation should link directly to WETT reports.
- Add WETT workspace shell under `/admin/office/wett`.
- Add route-aware root chrome gate so WETT routes suppress public `SiteHeader`, `SiteFooter`, and `MobileActionDock`.
- Verify no `src/proxy.ts`, `next.config.ts`, `robots.ts`, GA, or Vercel Analytics change is required.

Tests:

- Unauthenticated `/admin/office/wett` redirects to `/admin/login`.
- Office user can access `/admin/office/wett`.
- Admin user can access `/admin/office/wett`, create reports, and manage reports.
- Non-office/admin behavior follows the chosen authorization rule.
- WETT entry appears in Office workspace for authorized user.
- `/admin/office/wett` does not render public `SiteHeader`, `SiteFooter`, or `MobileActionDock`.
- Existing public and admin pages retain their expected chrome.
- Public navigation remains unchanged.

Done condition:

- Michael can log in once through `/admin/login`, open `/admin/office`, and enter `WETT Reports`.

Rollback point:

- Remove WETT Office nav/entry and `/admin/office/wett` route files; existing Office auth remains untouched.

### Phase 3 - Reports Home and Draft Creation

Objective: allow technician to start and resume drafts.

Files:

- `src/app/admin/office/wett/page.tsx`
- `src/app/admin/office/wett/new/page.tsx`
- `src/app/admin/office/wett/[reportId]/page.tsx`
- `src/app/admin/office/wett/actions.ts`
- `src/components/admin/office/wett/wett-report-builder.tsx`
- `src/components/admin/office/wett/wett-progress-nav.tsx`
- `src/components/admin/office/wett/wett-save-indicator.tsx`

Dependencies:

- Phase 1 and 2.

Implementation work:

- Reports list.
- New draft creation.
- Builder shell with empty sections.
- Autosave status plumbing.

Tests:

- Create draft.
- Resume draft.
- Unauthorized report ID blocked.
- Refresh reloads latest draft.

Done condition:

- A protected user can create and reopen a draft.

Rollback point:

- Hide `WETT Reports` Office entry; keep stored draft data if any.

### Phase 4 - Core Form Sections

Objective: implement customer/property, system, measurements, checklist, maintenance, screen/barrier, findings.

Files:

- `src/components/admin/office/wett/sections/customer-property-section.tsx`
- `src/components/admin/office/wett/sections/system-section.tsx`
- `src/components/admin/office/wett/sections/measurements-section.tsx`
- `src/components/admin/office/wett/sections/checklist-section.tsx`
- `src/components/admin/office/wett/sections/findings-section.tsx`
- `src/components/admin/office/wett/sections/review-section.tsx`
- `src/lib/wett/schema.ts`
- `src/app/admin/office/wett/actions.ts`

Dependencies:

- Phase 3.

Implementation work:

- Build section forms.
- Add Zod validation.
- Add deficiency expansion.
- Store measurement/finding relationships.

Tests:

- Numeric decimal measurements.
- Required draft fields save.
- Deficiency expansion persists.
- No compliance labels generated.

Done condition:

- Main structured report can be entered and autosaved.

Rollback point:

- Revert section components and schema additions.

### Phase 5 - Private Photos

Objective: add private photo upload, preview, captions, and associations.

Files:

- `src/lib/wett/photo-storage.ts`
- `src/app/api/admin/wett/reports/[reportId]/photos/route.ts`
- `src/app/api/admin/wett/reports/[reportId]/photos/[photoId]/route.ts`
- `src/components/admin/office/wett/sections/photos-section.tsx`
- `src/components/admin/office/wett/photo-thumbnail.tsx`
- `src/lib/wett/schema.ts`

Dependencies:

- Phase 1 to 4.

Implementation work:

- Private Blob upload.
- Authenticated streaming.
- Photo metadata.
- Caption and association UI.
- Delete/replace before completion.

Tests:

- Upload from phone.
- Uploaded photo is not public URL.
- Unauthenticated photo request fails.
- Photo failure does not lose draft.
- Finding/photo linkage persists.

Done condition:

- Photos are private and report-linked.

Rollback point:

- Disable upload UI; existing private blobs remain inaccessible except through auth route.

### Phase 6 - Autosave Hardening and Recovery

Objective: make weak network and refresh recovery safe.

Files:

- `src/components/admin/office/wett/wett-report-builder.tsx`
- `src/components/admin/office/wett/wett-save-indicator.tsx`
- `src/app/admin/office/wett/actions.ts`
- `src/lib/wett/service.ts`
- `src/lib/wett/local-recovery.ts`

Dependencies:

- Phase 3 to 5.

Implementation work:

- Debounced save.
- LocalStorage recovery.
- Local recovery keys namespaced by authenticated username and report ID.
- TTL cleanup for abandoned local recovery data.
- Clear local recovery after completion and on logout where practical.
- Never store photo binaries or secrets locally.
- Retry/backoff.
- Dirty unload warning.
- Revision conflict messaging.

Tests:

- Refresh recovery.
- Simulated save failure.
- Resume draft on another load.
- Photo upload failure with text save success.
- Local recovery expires after TTL.
- Completion clears local recovery data.
- Logout clears local recovery data where practical.
- Photo binaries are never written to local recovery storage.

Done condition:

- No silent data loss in expected field interruptions.

Rollback point:

- Keep server autosave; disable local recovery if it causes conflicts.

### Phase 7 - AI Rewrite

Objective: add safe WETT-only AI note rewriting.

Files:

- `src/lib/wett/ai-rewrite.ts`
- `src/components/admin/office/wett/sections/notes-ai-section.tsx`
- `src/app/admin/office/wett/actions.ts`
- `src/lib/wett/schema.ts`

Dependencies:

- Phase 4.
- DeepSeek env key.

Implementation work:

- Prompt modes.
- Locked facts input.
- Zod output validation.
- Accept/reject/retry.
- Preserve original note.

Tests:

- Missing DeepSeek key.
- AI failure.
- AI cannot mutate measurement data.
- Original note preserved after accept/reject.

Done condition:

- Technician can safely improve wording without data mutation.

Rollback point:

- Hide AI UI; manual notes remain.

### Phase 8 - Visual Diagrams

Objective: add predefined visual region selection and finding markers.

Files:

- `src/lib/wett/diagram-regions.ts`
- `src/components/admin/office/wett/sections/diagram-section.tsx`
- `src/components/admin/office/wett/diagrams/exterior-diagram.tsx`
- `src/components/admin/office/wett/diagrams/fireplace-system-diagram.tsx`
- `src/lib/wett/schema.ts`

Dependencies:

- Phase 4 findings.

Implementation work:

- Region definitions.
- Mobile region selector.
- Finding associations.
- Marker numbering.

Tests:

- Region selection on phone.
- Finding-to-region persists.
- Markers match findings.

Done condition:

- Diagrams enhance findings without freehand drawing.

Rollback point:

- Hide diagram section; findings remain usable.

### Phase 9 - Premium Preview, PDF, and Finalization

Objective: generate professional Phoenix report, run the finalization state machine, store the PDF, and mark completed only after PDF storage succeeds.

Files:

- `src/lib/wett/report-view-model.ts`
- `src/components/admin/office/wett/report/wett-report-preview.tsx`
- `src/components/admin/office/wett/report/report-section.tsx`
- `src/lib/wett/report-pdf.tsx`
- `src/lib/wett/completion.ts`
- `src/app/admin/office/wett/[reportId]/preview/page.tsx`
- `src/app/api/admin/wett/reports/[reportId]/pdf/route.ts`
- `src/components/admin/office/wett/complete-report-button.tsx`

Dependencies:

- Phase 1 to 8.

Implementation work:

- View model.
- Web preview.
- React PDF renderer.
- PDF private Blob save.
- `finalizing` / `finalizing-failed` / `completed` transitions.
- Freeze final inspection data.
- Generate and store PDF before `completed`.
- Lock completed inspection data.

Tests:

- Preview renders.
- PDF renders multi-page.
- Photos render.
- Diagrams render.
- PDF generation/storage failure leaves report in `finalizing-failed`, not `completed`.
- Finalization retry works.
- Completed report cannot autosave-edit.

Done condition:

- Completed report always has saved PDF metadata.

Rollback point:

- Keep drafts enabled; disable completion button.

### Phase 10 - Email Delivery and Resend

Objective: send completed PDF to customer and record delivery.

Files:

- `src/lib/wett/email.ts`
- `src/lib/wett/completion.ts`
- `src/components/admin/office/wett/resend-report-email-button.tsx`
- `src/app/admin/office/wett/[reportId]/success/page.tsx`
- `.env.example`

Dependencies:

- Phase 9.
- Brevo key and sender configured.

Implementation work:

- Brevo email with PDF attachment.
- Delivery status.
- Retry/resend.
- Internal copy if approved.

Tests:

- Email sent.
- Email failure leaves report completed.
- Resend works.
- Attachment opens.

Done condition:

- Completion can deliver report and record result.

Rollback point:

- Disable email send; allow authenticated PDF download/manual send.

### Phase 11 - QA, Privacy, and Production Release

Objective: prove mobile workflow and public-site stability.

Files:

- Potential README/env notes only.

Dependencies:

- All phases.

Implementation work:

- Full testing matrix.
- Preview deployment.
- First technician smoke test.

Tests:

- Full matrix in Section U.
- `npm run build`.
- Public site regression.

Done condition:

- Owner approves production release.

Rollback point:

- Vercel rollback to prior deployment; Blob data retained.

## U. Testing Matrix

| Area | Test |
| ---- | ---- |
| Phone layout | Complete main workflow on phone viewport |
| iPhone viewport | Test 390x844 and 375x667 |
| Android viewport | Test 360x800 and 412x915 |
| Desktop fallback | Builder usable on desktop |
| WETT layout | `/admin/office/wett` suppresses public `SiteHeader`, `SiteFooter`, and `MobileActionDock` |
| Existing layout regression | Public pages and existing admin pages keep expected chrome |
| Numeric measurements | Decimal inches save and render |
| Validation | Missing required fields block completion |
| Autosave | Draft saves after edits |
| Refresh recovery | Refresh restores latest draft/local newer draft |
| Local PII policy | Local recovery is namespaced by username/report ID and expires after TTL |
| Local photo policy | Uploaded photo binaries are never stored in local recovery storage |
| Local cleanup | Successful completion clears local recovery for the report |
| Logout cleanup | Logout clears local recovery where technically practical |
| Report resume | Draft appears in `/admin/office/wett` list and reopens |
| Photo upload | Camera/gallery image uploads privately |
| Photo failure | Failed upload shows retry and does not lose text |
| Findings | Add/edit/delete finding before completion |
| Finding/photo relationship | Link photo to finding and render in preview/PDF |
| Diagram mapping | Region selection maps to finding marker |
| AI factual preservation | AI rewrite cannot change measurements/status fields |
| AI failure | Missing key/API failure preserves original note |
| Preview | Preview reflects structured report |
| PDF | PDF generated server-side |
| Finalizing state | Completing moves report to `finalizing` before PDF generation |
| PDF failure state | PDF generation/storage failure leaves report `finalizing-failed`, not `completed` |
| Finalization retry | `finalizing-failed` report can retry finalization |
| Completed invariant | Completed report always has saved PDF metadata |
| Multi-page report | Long findings/photos paginate cleanly |
| Email | Customer receives PDF attachment |
| Email failure | Report remains completed and resend is available |
| Auth | `/admin/office/wett` requires existing `/admin/login` session |
| Authorization | `requireWettReportAccess()` allows admin/office and blocks unauthorized roles/users |
| Unauthorized report access | Unauthenticated private report/photo/PDF blocked |
| Noindex | `/admin` robots/sitemap exclusion remains valid; private APIs add no-store/noindex headers |
| Analytics privacy | GA/Vercel continue skipping `/admin` pages |
| Frontend build | `npm run build` passes |
| Public regression | Public pages, request-service, admin, portal still work |
| Sitemap | `/admin/office/wett` not present |
| Robots | existing `/admin` disallow covers WETT workspace |
| Evidence privacy regression | Existing public evidence behavior unchanged |

## V. Release & Rollback Plan

Local verification:

- Configure local `.env.local` with existing Office auth, Blob, DeepSeek, Brevo test credentials if available.
- Run baseline `npm run build`.
- Exercise complete workflow locally.
- Verify root chrome gating: WETT has focused app frame, public/admin/portal pages keep expected layout.
- Verify local recovery TTL and cleanup behavior on a test report.

Preview/staging deployment:

- Deploy to Vercel preview.
- Use existing preview Office credentials.
- Confirm `/admin/office/wett` requires `/admin/login`.
- Confirm `/admin/office/wett` is absent from sitemap and covered by robots disallow.
- Confirm private Blob access.
- Confirm finalization cannot mark completed unless PDF Blob save succeeds.
- Send test email to owner/internal email only.

Production deployment:

- Add env vars in Vercel.
- Deploy during low-traffic period.
- Add only Office workspace entry, not public navigation.
- First production smoke test with test report.

First technician smoke test:

- Login on phone.
- Create draft.
- Add measurements.
- Add finding and photo.
- Use AI rewrite.
- Preview PDF.
- Complete test report.
- Confirm delivery behavior.

Rollback:

- Use Vercel rollback to previous deployment if public site or auth breaks.
- Do not delete Blob-stored WETT data.
- If WETT only breaks, remove/hide the `WETT Reports` entry or gate `requireWettReportAccess()` with an env flag while retaining data.
- If root chrome gating causes layout regression, rollback `src/app/layout.tsx` and `src/components/root-chrome-frame.tsx`, then temporarily accept existing admin chrome until a safer layout fix is approved.
- Do not mark `finalizing-failed` reports as completed during rollback; retry finalization after the fix.

Monitoring:

- Check `/api/health`.
- Watch Vercel function logs for `/admin/office/wett` and `/api/admin/wett`.
- Watch Brevo errors.
- Monitor for reports stuck in `finalizing` or `finalizing-failed`.
- Confirm no WETT PII appears in logs or analytics.
- Confirm public lead intake still saves and emails.

## W. Owner Decisions / Missing Inputs

The architecture can proceed, but production content/compliance requires owner or authoritative source input.

Required:

- Real Phoenix WETT form/checklist.
- Official checklist sections and item labels.
- Required fields for completion.
- Approved inspection type/level values.
- Approved appliance/system option lists.
- Approved screen/protective barrier statuses.
- Approved cleaning/maintenance classifications.
- Official scope/limitations/disclaimer wording.
- Customer acknowledgement wording, if used.
- Inspector name, WETT inspector number, and signature/sign-off method.
- Report numbering format, e.g. final approval for `PHX-WETT-YYYY-#####`.
- Customer email subject/body wording.
- Internal copy recipient policy.
- Whether PDF attachment is approved vs building a protected customer link.
- Final diagram style and region labels.
- Phoenix logo/report branding asset approval.
- Whether `admin` plus `office` role access is sufficient authorization or whether `WETT_REPORT_USERNAMES` should restrict access to named users.
- Whether completed reports can ever be amended; V1 recommendation is locked completed reports with no amendment workflow.

Important WETT boundary:

- No legal WETT requirements, code clearances, pass/fail logic, compliance rules, insurance guarantees, or disclaimer language should be invented during implementation.
- Any missing WETT-specific value is `OWNER / AUTHORITATIVE SOURCE INPUT REQUIRED`.

## X. AI API Credential and Secret Handling

Planning assumption: the owner has provided a valid AI API key separately. Do not write the literal secret into this plan, source code, report data, logs, or Git.

Current AI implementation inspected:

- `src/lib/ai/deepseek-client.ts` is marked `server-only`.
- It reads the provider key through `process.env.DEEPSEEK_API_KEY`.
- It reads the model through `process.env.DEEPSEEK_MODEL`, defaulting to `deepseek-chat`.
- It sends server-side requests to `https://api.deepseek.com/chat/completions`.
- It exports `requestDeepSeekJsonCompletion({ systemPrompt, userPrompt })`.
- Article AI code in `src/lib/ai/generate-article.ts` and `src/lib/ai/improve-article-from-notes.ts` imports the shared DeepSeek client but supplies article-specific prompts.
- `src/app/admin/actions.ts` already checks `process.env.DEEPSEEK_API_KEY` and returns a safe user-facing unavailable message instead of exposing the key.

Credential decision:

- Use existing environment variable `DEEPSEEK_API_KEY`.
- Do not introduce a second WETT-specific AI key unless the owner later requires provider/account separation.
- Keep `DEEPSEEK_MODEL` as the model selector unless implementation discovers a strong reason to add a WETT-specific model env var.

Server-side WETT service:

- Create `src/lib/wett/ai-rewrite.ts`.
- Mark it `server-only`.
- Import `requestDeepSeekJsonCompletion()` from `src/lib/ai/deepseek-client.ts`.
- Define WETT-only system prompts inside `src/lib/wett/ai-rewrite.ts`.
- Do not import article prompts from `src/lib/ai/prompt-shared.ts`.
- Validate WETT AI output with a dedicated Zod schema before returning anything to the UI.

Rewrite endpoint/action flow:

```text
Client component
-> server action or route handler
-> requireWettReportAccess()
-> validate input
-> load report facts server-side
-> call src/lib/wett/ai-rewrite.ts
-> src/lib/ai/deepseek-client.ts reads DEEPSEEK_API_KEY
-> provider returns JSON
-> validate output
-> return rewritten note candidate only
```

Secret isolation rules:

- No `NEXT_PUBLIC_*` variable for AI.
- No API key in TypeScript/JavaScript source.
- No API key in WETT report JSON.
- No API key in browser props, client state, or localStorage.
- No API key in logs or error messages.
- No API key in PDF output or email.
- Only server-side code under `src/lib/ai/*`, `src/lib/wett/ai-rewrite.ts`, and the WETT server action/route should participate in provider calls.

Prompt isolation:

- WETT rewrite prompts must be separate from article-generation prompts.
- The WETT prompt must describe the AI as a writing assistant only.
- It must prohibit changing measurements, checklist states, appliance facts, deficiency existence, photos, customer/property data, or compliance conclusions.
- It must return only rewritten wording and optional warnings, not modified structured facts.

Failure behavior when the key is unavailable:

- If `DEEPSEEK_API_KEY` is missing, WETT AI returns a safe failure such as `AI rewrite unavailable. Continue manually.`
- The original technician note remains unchanged.
- The draft remains saved.
- The UI keeps manual editing available.
- Completion must not depend on AI availability.
- Server logs may record that AI is unavailable, but must not include report PII or secrets.

