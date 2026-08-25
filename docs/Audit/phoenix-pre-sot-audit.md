# Phoenix Website — Pre-SOT Read-Only Audit

> **HISTORICAL SNAPSHOT — NOT LIVE ARCHITECTURE**
>
> Audited 2026-08-24 against the pre-migration codebase. Several findings are stale (dual taxonomies, `/articles` 301s, mock portal, missing SOT, orphaned `/thank-you`).
>
> Do not use this file to decide URLs, redirects, canonicals, or taxonomy.
>
> **Current authority:** [Phoenix Project SOT V1](../sot/Phoenix_Project_SOT_V1.md)  
> **Live URL/taxonomy note:** [url-and-taxonomy.md](../features/url-and-taxonomy.md)
>
> **INVESTIGATE:** Canadian Global SOT and Canadian Province Architecture / Province-Wise Addendum are **not in this repository**. Until the owner supplies those files, inherit their rules only as summarized in Phoenix SOT V1 (§28–30, §38, §40, §42).

**Audit date:** 2026-08-24  
**Repository:** `papoon_fireplacerepair`  
**Production domain (configured):** `https://phoenixfireplace.ca`  
**Scope:** Read-only diagnosis at audit time. No code, content, SEO, or deployment changes were made during the audit.

---

## Audit Method

This audit is based on static analysis of the repository, including:

- App Router pages under `src/app/`
- Shared libraries (`src/lib/`), components (`src/components/`), and configuration
- Existing documentation under `docs/` and `README.md`
- Local sitemap audit artifacts in `scripts/audit-sitemap-after.txt` (47 public URLs, 0 failures)

Production runtime behavior (env vars, Blob contents, live Search Console data, Core Web Vitals) was **not** directly verified unless noted as **INVESTIGATE**.

---

# 1. SEO Audit

## 1.1 URL Structure

| Finding | Current implementation | File(s) | Route(s) | Evidence | Classification | Risk | Recommended direction |
|--------|------------------------|---------|----------|----------|----------------|------|------------------------|
| City-scoped public URLs | Primary revenue URLs live under `/{city}/…` for Calgary, Edmonton, Red Deer | `src/lib/cities.ts`, `src/app/[city]/` | `/calgary`, `/edmonton`, `/red-deer` + nested routes | Three cities defined; all `launchStage: "full"` | **KEEP** | LOW | Make city-first URLs the permanent SOT pattern |
| Organization hub at `/` | Root is a city chooser, not a city landing page | `src/app/page.tsx` | `/` | Metadata targets Alberta org positioning; no city phone in hero | **KEEP** | LOW | Keep `/` as org/dispatch hub; do not merge with city home |
| Legacy root → Calgary 301s | `/about`, `/contact`, `/wett`, `/articles`, `/articles/:slug`, `/gas-fireplace-repair`, `/services` redirect permanently to `/calgary/*` | `next.config.ts` | See redirect list | 301 redirects in `redirects()` | **IMPROVE** | MEDIUM | Decide whether legacy URLs should redirect to chooser, nearest city, or stay Calgary-only; document in SOT |
| Province-wide service URLs remain indexable | `/services` and `/services/[slug]` are **not** redirected | `src/app/services/page.tsx`, `src/app/services/[slug]/page.tsx`, `src/app/sitemap.ts` | `/services`, `/services/gas-fireplace-maintenance`, etc. | Included in sitemap with priority up to 0.82 | **INVESTIGATE** | MEDIUM | Decide if province pages are supporting index targets or should canonical to city pages |
| Request-service URLs omitted from sitemap | City request pages exist but are not listed in sitemap | `src/app/sitemap.ts`, `src/app/[city]/request-service/page.tsx` | `/[city]/request-service` | Sitemap flatMap omits request-service | **IMPROVE** | LOW | Add to sitemap if indexable; otherwise add explicit noindex policy |
| Mock portal route exists | Customer portal preview page | `src/app/portal/[portalId]/page.tsx` | `/portal/[portalId]` | `robots: { index: false, follow: false }` | **REMOVE** (from indexation concern) / **KEEP** (if internal preview) | LOW | Exclude from sitemap; confirm robots block in production |

## 1.2 Sitemap, robots, indexability

| Finding | Current implementation | File(s) | Route(s) | Evidence | Classification | Risk | Recommended direction |
|--------|------------------------|---------|----------|----------|----------------|------|------------------------|
| Dynamic sitemap generation | Async sitemap builds root, province services, per-city static routes, and CMS articles | `src/app/sitemap.ts` | `/sitemap.xml` | `revalidate = 3600`; article URLs from `listArticles()` | **KEEP** | LOW | Formalize inclusion rules in SOT |
| robots.txt | Allows `/`, disallows `/admin`, `/api/`, parameterized `/feed.xml?*` | `src/app/robots.ts` | `/robots.txt` | Host + sitemap declared | **KEEP** | LOW | Keep; document admin/api disallow as permanent |
| Thank-you page noindex | Confirmation page blocked from indexing | `src/app/thank-you/page.tsx` | `/thank-you` | `robots.index: false` | **KEEP** | LOW | Keep noindex on post-conversion pages |
| Placeholder city noindex hook | Cities with `launchStage !== "full"` get `noindex` metadata | `src/app/[city]/page.tsx` and siblings | `/[city]/*` | Pattern exists; all cities currently `full` | **KEEP** | LOW | Retain for future city rollouts |
| Sitemap audit health | 47 URLs, all 200, no redirects, no noindex in sample | `scripts/audit-sitemap-after.txt` | Production URLs | Script output | **KEEP** | LOW | Use as baseline QA check in SOT change control |

## 1.3 Canonicals, metadata, structured data

| Finding | Current implementation | File(s) | Route(s) | Evidence | Classification | Risk | Recommended direction |
|--------|------------------------|---------|----------|----------|----------------|------|------------------------|
| Central metadata helper | Title, description, canonical, OG, Twitter via `createPageMetadata()` | `src/lib/seo.ts` | All pages using helper | `alternates.canonical` set to absolute URL | **KEEP** | LOW | Make this the single SEO metadata authority |
| `metadataBase` from site URL | Root layout sets `metadataBase` from `siteConfig.url` | `src/app/layout.tsx`, `src/lib/site-data.ts` | Global | Uses `NEXT_PUBLIC_SITE_URL` fallback `https://phoenixfireplace.ca` | **KEEP** | LOW | Require env at deploy; add SOT check |
| LocalBusiness / Service / FAQ / Breadcrumb / Article / Organization / WebSite schema | JSON-LD builders composed per page | `src/lib/seo.ts`, page files | City + service + article pages | Multiple schema types emitted | **KEEP** | LOW | Document which page types must emit which schema |
| LocalBusiness address/geo conditional | Physical address and geo only included when env vars present | `src/lib/seo.ts` | Pages using `buildLocalBusinessSchema()` | `getVerifiedPostalAddress()` returns undefined without env | **INVESTIGATE** | MEDIUM | Verify production env supplies complete NAP; incomplete schema can mislead |
| Same `@id`/telephone across cities | LocalBusiness uses org legal name; phone from city or default; `@id` is city URL when city passed | `src/lib/seo.ts` | `/[city]/*` | All cities share same `phoneHref` today | **IMPROVE** | MEDIUM | Decide multi-location vs single-dispatch schema model |
| Article schema includes full `articleBody` | Entire markdown body embedded in JSON-LD | `src/lib/seo.ts` → `buildArticleSchema()` | `/[city]/articles/[slug]` | `articleBody: article.body` | **IMPROVE** | LOW | Consider excerpt-only or URL reference if body bloats HTML |
| Opening hours in schema | Sunday–Friday 09:00–18:00 hardcoded | `src/lib/seo.ts` | LocalBusiness schema | Same hours for all cities | **IMPROVE** | LOW | Align hours with editable site settings if they diverge |
| RSS feed exposed | `/feed.xml` linked in layout alternates | `src/app/feed.xml/route.ts`, `src/app/layout.tsx` | `/feed.xml` | RSS for published articles | **KEEP** | LOW | Keep; document as supplemental discovery, not primary SEO |

## 1.4 Duplicate / scaled-content risk (Google alignment)

| Finding | Current implementation | File(s) | Route(s) | Evidence | Classification | Risk | Recommended direction |
|--------|------------------------|---------|----------|----------|----------------|------|------------------------|
| Triplicated city page sets | Same page types generated for 3 cities | `src/app/[city]/`, `src/lib/site-data.ts` | 3× (home, services, wett, about, contact, articles, etc.) | Sitemap lists parallel Edmonton/Red Deer/Calgary URLs | **IMPROVE** | **HIGH** | Ensure each city page has materially unique local proof, not just string substitution |
| Service landing templates | Large shared `serviceLandingPages` config with city functions for titles/FAQs/highlights | `src/lib/site-data.ts` | `/[city]/services/[slug]` | Body copy mostly shared; `cityHighlights` adds one localized paragraph | **IMPROVE** | **HIGH** | Expand verifiable local differentiation; leverage Evidence system |
| Seed articles replicated per city | 9 seed articles = 3 topics × 3 cities | `src/lib/cms/seed-articles/index.ts` | `/[city]/articles/*` | Templated localization pattern | **IMPROVE** | **HIGH** | Treat as starter content; avoid automated scale without editorial gate |
| Dual service taxonomies | Legacy `services` array (5 slugs) vs newer `serviceLandingPages` (4 slugs) with different slugs/names | `src/lib/site-data.ts` | `/services` index vs `/[city]/services/[slug]` | e.g. `chimney-sweep-repair` vs `chimney-sweeping-inspection` | **REPLACE** | **HIGH** | Consolidate service slug/name model in SOT to reduce overlap and internal-link confusion |
| Province + city service URL pairs | Both `/services/[slug]` and `/[city]/services/[slug]` indexable | `src/app/services/[slug]/page.tsx`, `src/app/[city]/services/[slug]/page.tsx` | Both patterns in sitemap | Near-duplicate intent targeting Alberta + city keywords | **INVESTIGATE** | **HIGH** | Pick canonical tier (city vs province) per service type |

## 1.5 Internal linking, breadcrumbs, images

| Finding | Current implementation | File(s) | Route(s) | Evidence | Classification | Risk | Recommended direction |
|--------|------------------------|---------|----------|----------|----------------|------|------------------------|
| Contextual internal link helpers | Central link resolution for services/articles | `src/lib/internal-links.ts` | Used on city home, WETT, gas repair, service landings | `ContextualLinksGrid`, related services | **KEEP** | LOW | Formalize link rules (required links per page type) |
| Breadcrumb schema | Built on most revenue pages | `src/lib/seo.ts` | City/service/article pages | JSON-LD BreadcrumbList | **KEEP** | LOW | Add visible breadcrumb UI if SEO/SOT requires parity |
| Visible breadcrumbs | Schema present; on-page breadcrumb nav not consistently rendered | Page components | — | JSON-LD only on sampled pages | **IMPROVE** | LOW | Decide if visible breadcrumbs are required |
| Image alt text pattern | Next `<Image>` uses descriptive alts on major pages; service pages use configured `imageAlt` | `src/lib/site-data.ts`, page components | Service/city pages | Alt strings present in config | **KEEP** | LOW | Enforce alt on all CMS/evidence uploads |
| Article overlap checker | Jaccard similarity + slug collision detection for new articles | `src/lib/article-workflow/overlap-check.ts` | Admin workflow | Threshold 0.35 | **KEEP** | LOW | Keep as editorial guardrail in SOT |

---

# 2. Content Audit

## 2.1 Templates and uniqueness

| Area | Structure | Shared vs unique | Classification | Risk |
|------|-----------|------------------|----------------|------|
| **Homepage `/`** | City chooser + province “What we do” | Fully unique org-level content | **KEEP** | LOW |
| **City home `/[city]`** | Hero, trust metrics, services grid, guides, FAQs, gallery, contact form | ~80% template via `getTrustMetrics`, `getValuePillars`, `getHomeFaqs`; city name + service areas injected | **IMPROVE** | HIGH |
| **Service directory `/[city]/services`** | Lists legacy `services` cards + links to landing pages | Shared structure; city string in metadata | **IMPROVE** | MEDIUM |
| **Service landings `/[city]/services/[slug]`** | Long-form landing template | Shared body; unique meta via `cityMetaTitle`; one `cityHighlights` paragraph; optional `ServiceLocalContext` | **IMPROVE** | HIGH |
| **Gas repair `/[city]/gas-fireplace-repair`** | Dedicated page (not under `/services/`) | Shared template; city-interpolated FAQs | **IMPROVE** | MEDIUM |
| **WETT `/[city]/wett`** | Dedicated page | Shared template; city FAQs | **IMPROVE** | MEDIUM |
| **About `/[city]/about`** | City-localized about points via `getAboutPoints(cityName)` | Mostly shared | **IMPROVE** | MEDIUM |
| **Articles `/[city]/articles/[slug]`** | CMS-driven markdown | Seed articles localized per city; quality checks in `article-quality.ts` | **IMPROVE** | HIGH |
| **Evidence “From the field”** | Pulled from verified job records when public | Genuinely unique when populated | **KEEP** | LOW |

## 2.2 Search intent and value

| Finding | Evidence | Classification | Risk | Recommended direction |
|--------|----------|----------------|------|------------------------|
| Service pages match transactional intent | Clear CTAs, direct-answer blocks, FAQs, scope lists | **KEEP** | LOW | Preserve intent-first structure in SOT |
| Articles add explanatory value | Seed articles cover seasonal checklist, WETT timing, gas troubleshooting | **KEEP** | LOW | Maintain editorial review before publish |
| AI daily cron disabled | `/api/cron/generate-article` returns 410 disabled | **KEEP** | LOW | Keep human-in-the-loop publishing as SOT rule |
| Root legacy pages still Calgary-centric | `/about`, `/wett`, `/articles` pages render Calgary copy before redirect | `src/app/about/page.tsx`, etc. | **IMPROVE** | MEDIUM | Legacy pages are redundant with redirects; clarify whether they should remain |
| Local evidence thin in production | `FromTheField` returns null when no public evidence | `src/components/services/from-the-field.tsx` | **INVESTIGATE** | MEDIUM | Populate evidence store or reduce claims of “real examples” |

## 2.3 Imagery

| Finding | Evidence | Classification | Risk |
|--------|----------|----------------|------|
| Photography stored locally under `public/images/photos/` | Copied from prior live site per README | **KEEP** | LOW |
| City chooser uses city PNG assets | `public/images/cities/` | **KEEP** | LOW |
| CMS article cover images | Optional per article in Blob/storage | **KEEP** | LOW |
| Evidence images may use Blob uploads | `EvidenceImageSource`: `site-asset` \| `blob-upload` | **KEEP** | LOW |
| No automated AI image pipeline observed on public pages | Admin tracks `aiImageProvidedAt` / `realImageProvidedAt` in office workflow | **KEEP** | LOW |

---

# 3. Site Architecture Audit

## 3.1 Actual hierarchy (as implemented)

```text
/                                    → Organization hub / city chooser
├── /services                        → Province-wide service index (indexable)
├── /services/[slug]                 → Province-wide service landing (4 slugs)
├── /about                           → Legacy Calgary about (301 → /calgary/about)
├── /contact                         → Legacy (301 → /calgary/contact)
├── /wett                            → Legacy (301 → /calgary/wett)
├── /articles                        → Legacy (301 → /calgary/articles)
├── /articles/[slug]                 → Legacy (301 → /calgary/articles/[slug])
├── /gas-fireplace-repair            → Legacy (301 → /calgary/gas-fireplace-repair)
├── /thank-you                       → Post-conversion (noindex)
├── /portal/[portalId]               → Mock portal preview (noindex)
├── /feed.xml                        → RSS
├── /sitemap.xml
├── /robots.txt
│
└── /[city]/                         → City home (calgary | edmonton | red-deer)
    ├── /[city]/services             → Service directory
    ├── /[city]/services/[slug]    → Service landing (4 slugs)
    ├── /[city]/gas-fireplace-repair → Dedicated gas repair landing
    ├── /[city]/wett                 → Dedicated WETT landing
    ├── /[city]/about
    ├── /[city]/contact
    ├── /[city]/articles
    ├── /[city]/articles/[slug]
    └── /[city]/request-service      → Primary conversion form page

/admin/*                             → Authenticated admin (robots disallowed)
/api/*                               → Server routes (robots disallowed)
```

## 3.2 Architecture findings

| Finding | File(s) | Classification | Risk | Recommended direction |
|--------|---------|----------------|------|------------------------|
| City param is primary content scope | `src/lib/cities.ts`, `src/app/[city]/` | **KEEP** | LOW | SOT should define city as mandatory scope for all revenue content |
| Two parallel service models | `services[]` vs `serviceLandingPages[]` in `site-data.ts` | **REPLACE** | HIGH | Unify slugs, nav, footer links, and forms |
| `getServiceDetailPath()` inconsistent routing | Some slugs → dedicated pages, others → `/services#anchor` | `src/lib/site-data.ts` | **REPLACE** | HIGH | One routing function for all services |
| Header nav scoped by pathname | Chooser shows limited nav; city pages show full nav | `src/components/site-header.tsx` | **KEEP** | LOW | Document nav modes (hub vs city) |
| Footer hidden off hub/city pages | Footer returns null when not `/` or city route | `src/components/site-footer.tsx` | **IMPROVE** | LOW | Confirm intentional on province `/services` |
| Internal link resolver bridges slug mismatches | Maps `chimney-sweep-repair` → `chimney-sweeping-inspection` | `src/lib/internal-links.ts` | **IMPROVE** | MEDIUM | Temporary bridge; remove after slug unification |
| Orphan risk: `/thank-you` | Forms show inline success; no redirect to thank-you observed | Form components | **INVESTIGATE** | LOW | Wire conversion flow or deprecate page |
| Legacy duplicate page files at root | Root and `[city]` routes both exist for about/contact/wett/articles | `src/app/about/page.tsx` vs `src/app/[city]/about/page.tsx` | **IMPROVE** | MEDIUM | Root pages mainly serve redirects; consider removal to reduce drift |

---

# 4. Design / UX Audit

## 4.1 Design system (current)

| Element | Implementation | File(s) | Classification |
|---------|----------------|---------|----------------|
| **Color system** | CSS vars: paper, ink, ember, gold, forest, muted, border | `src/app/globals.css` | **KEEP** |
| **Typography** | Bricolage Grotesque (sans) + Cormorant Garamond (display) | `src/app/layout.tsx`, `globals.css` | **KEEP** |
| **Spacing/layout** | `.page-frame`, `.page-bleed`, `.section-pad` utilities | `globals.css` | **KEEP** |
| **Header** | Sticky; info bar (city/hours/phone/CTA); services mega-menu | `src/components/site-header.tsx` | **KEEP** |
| **Hero** | Full-bleed rounded card, gradient overlay, highlight pills | City home, service landings | **KEEP** |
| **Buttons/CTAs** | Rounded-full; ember primary; forest secondary on desktop header | Multiple components | **KEEP** |
| **Cards** | Rounded 2–2.8rem, border, soft shadow, glass panels | Service cards, articles, FAQs | **KEEP** |
| **Forms** | Glass panel styling; multi-step for request service | `contact-form.tsx`, `request-service-form.tsx` | **KEEP** |
| **Motion** | `Reveal` animation wrapper on sections | `src/components/motion/reveal.tsx` | **KEEP** |
| **Mobile dock** | Fixed bottom Call / Request / Articles on city pages only | `src/components/mobile-action-dock.tsx` | **KEEP** |
| **Footer** | Dark ink background; city-aware links | `src/components/site-footer.tsx` | **KEEP** |

## 4.2 Inconsistencies

| Issue | Evidence | Classification | Risk |
|-------|----------|----------------|------|
| Hub vs city header capabilities differ | Chooser lacks full nav and phone bar CTAs | **KEEP** (intentional) | LOW |
| Thank-you page uses different visual language | Slate/emerald styling vs brand ember/gold | **IMPROVE** | LOW |
| Province `/services` page footer absent | Footer component returns null | **IMPROVE** | LOW |
| Phoenix logo easter egg only on Calgary home | `site-header.tsx` `easterEggPath` | **KEEP** | LOW |
| Contact form success stays inline | No shared thank-you component | **IMPROVE** | LOW |

---

# 5. Conversion Audit

## 5.1 Customer journeys

```text
Search / direct
  → / (chooser) OR /[city] OR /[city]/services/[slug] OR article
    → Primary CTA: Request Service (header, hero, mobile dock, page endings)
    → Secondary CTA: tel: link (header, hero, mobile dock)
      → /[city]/request-service (multi-step)  OR  inline ContactForm on city home
        → POST /api/request-service  OR  POST /api/contact
          → Lead saved to CMS storage
          → Email via Brevo or Gmail SMTP (optional)
          → Admin /admin/leads
            → Disposition: pending → added-to-calendar | not-added
```

## 5.2 Conversion findings

| Finding | File(s) | Route(s) | Classification | Risk | Recommended direction |
|--------|---------|----------|----------------|------|------------------------|
| Request Service is primary CTA | Header, hero, service pages, mobile dock | `/[city]/request-service` | **KEEP** | LOW | Preserve as primary conversion action |
| Contact form on city home | Lower-page dark section embeds `ContactForm` | `/[city]` | **KEEP** | LOW | Document when to use contact vs request-service |
| Request-service captures UTM + source URL | Form attribution logic | `request-service-form.tsx` | **KEEP** | LOW | Keep attribution schema in SOT |
| Inline success UX (no redirect) | Both forms render success state in place | Form components | **IMPROVE** | MEDIUM | Decide standard: inline vs `/thank-you` for GA funnel |
| `/thank-you` may be disconnected | Page exists with `trackThankYouView` but forms don't navigate there | `thank-you/page.tsx`, `google-analytics-tracker.tsx` | **INVESTIGATE** | MEDIUM | Align analytics funnel with actual UX |
| reCAPTCHA optional | Skipped when env keys absent | `src/lib/contact.ts`, `recaptcha.ts` | **IMPROVE** | MEDIUM | Production should enforce bot protection |
| Phone click tracking partial | `trackPhoneClick` exists but not wired on all tel links | `src/lib/analytics/events.ts` | **IMPROVE** | LOW | Standardize phone event tracking |
| GA4 optional via env | `NEXT_PUBLIC_GA_MEASUREMENT_ID`; manual page views | `google-analytics.tsx`, `google-analytics-tracker.tsx` | **KEEP** | LOW | Document required prod env |
| Vercel Analytics included | `@vercel/analytics` | `src/components/vercel-analytics.tsx` | **KEEP** | LOW | Note as secondary analytics source |
| Portal mock not in funnel | `/portal/[portalId]` is demo only | `portal/[portalId]/page.tsx` | **REMOVE** or gate | LOW | Remove from public routes if unused |

## 5.3 Revenue page conversion objective

| Page type | Clear objective? | Notes |
|-----------|------------------|-------|
| City home | Yes | Request Service + Call + contact form |
| Service landings | Yes | Book/CTA + Call |
| Gas repair / WETT | Yes | Request + Call |
| Articles | Partial | Educational; related services linked |
| About / Contact | Yes | Request Service / form |
| Province `/services` | Yes | Request + Call |
| Org hub `/` | Partial | City selection, not direct lead capture |

---

# 6. Engineering Audit

| Finding | File(s) | Classification | Risk | Recommended direction |
|--------|---------|----------------|------|------------------------|
| Next.js 16 App Router + TS + Tailwind 4 | `package.json`, `src/app/` | **KEEP** | LOW | Baseline stack for SOT |
| SEO centralized in `src/lib/seo.ts` | Single metadata/schema module | **KEEP** | LOW | Protect from duplication |
| Content split: static vs CMS | `site-data.ts` vs `cms/storage.ts` | **IMPROVE** | HIGH | Define authoritative source per content type |
| Storage modes: local JSON vs Vercel Blob | `src/lib/cms/storage.ts` | **KEEP** | MEDIUM | Document production requirement for Blob |
| Admin auth via signed cookie + roles | `src/proxy.ts`, `src/lib/auth/` | **KEEP** | LOW | Document roles: admin vs office |
| Admin protected by matcher on `/admin/:path*` | `src/proxy.ts` | **KEEP** | LOW | Keep out of public routes |
| Image optimization via `next/image` + sharp | `package.json`, page components | **KEEP** | LOW | Enforce in content SOT |
| Article pages `force-dynamic` | `[city]/articles/[slug]/page.tsx` | **KEEP** | LOW | Needed for CMS freshness |
| Scheduled publish cron active | `vercel.json` → `/api/cron/publish-scheduled` | **KEEP** | LOW | Document schedule (15:05 UTC) |
| Generate-article cron disabled (410) | `api/cron/generate-article/route.ts` | **KEEP** | LOW | Align docs with reality |
| Health endpoint | `/api/health` | **KEEP** | LOW | Use for deployment probes |
| Docker standalone build | `Dockerfile`, `next.config.ts` | **KEEP** | LOW | Document deployment options |
| AI-agent drift risk: dual service definitions | `site-data.ts` | **REPLACE** | HIGH | Single module for service taxonomy |
| AI-agent drift risk: root + city duplicate pages | Parallel `src/app/*` and `src/app/[city]/*` | **IMPROVE** | HIGH | Mark deprecated paths clearly |
| AI-agent drift risk: README outdated | Mentions OpenAI cron, old route list | `README.md` | **REMOVE** (stale claims) | HIGH | Do not treat README as SOT until updated |
| Accessibility fundamentals | Semantic headings on key pages; alt text present; forms labeled | Components | **IMPROVE** | MEDIUM | Formal a11y checklist in QA SOT |
| Error handling on APIs | Zod validation + generic 500 messages | `api/contact`, `api/request-service` | **KEEP** | LOW | Preserve user-safe errors |

---

# 7. Lead / CRM Audit

## 7.1 Lifecycle

```text
Visitor
  → ContactForm (source: contact-form) OR RequestServiceForm (source: website)
    → POST /api/contact OR /api/request-service
      → routeLeadSubmission / routeServiceRequestSubmission (src/lib/contact.ts)
        → validate (Zod) + honeypot + optional reCAPTCHA
        → saveLead() → local JSON or Vercel Blob (cms/leads.json)
        → sendLeadNotificationEmail() → Brevo API OR Gmail SMTP
        → update lead emailDeliveryStatus
        → revalidatePath(/admin/leads)
          → Office reviews in /admin/leads
            → disposition + reason + officeNote + handledAt/By
```

## 7.2 Lead schema and workflow

| Field / behavior | Implementation | Classification | Risk |
|------------------|----------------|--------------|------|
| Core identity fields | firstName, lastName, phone, email, service, message | **KEEP** | LOW |
| City attribution | `city: CitySlug` on every lead | **KEEP** | LOW |
| Request-service extended fields | address*, urgency, urgencyDetail, preferredContactMethod, UTM*, sourceUrl | **KEEP** | LOW |
| Timestamps | `createdAt` ISO; optional `handledAt` | **KEEP** | LOW |
| Dispositions | `pending`, `added-to-calendar`, `not-added` + reasons | **KEEP** | LOW |
| Email delivery audit | `emailDeliveryStatus`, `emailDeliveryNote` | **KEEP** | LOW |
| No external CRM sync | Admin inbox is the system of record | **KEEP** | LOW |
| Lead storage encryption option | `secure-json` helpers for protected envelopes | `src/lib/cms/secure-json.ts` | **INVESTIGATE** | MEDIUM |
| Failure: email fails but lead saved | Explicit try/catch with status update | `contact.ts` | **KEEP** | LOW |
| No calendar integration in code | Disposition label only | Admin UI | **INVESTIGATE** | MEDIUM |

---

# 8. Governance / Documentation Audit

| Document | Status | Classification | Risk |
|----------|--------|----------------|------|
| `docs/website-rebuild-plan.md` | Pre-rebuild WordPress audit; outdated phones; pre-dates multi-city architecture | **REMOVE** as authority | HIGH |
| `README.md` | Partially accurate but contradictions: OpenAI cron, route list, AI automation | **IMPROVE** | HIGH |
| `AGENTS.md` / `CLAUDE.md` | Next.js breaking-change notice only | **KEEP** | LOW |
| **No formal SOT exists** | — | **REPLACE** (gap) | CRITICAL |
| Code-implemented rules not documented | Article quality checks, overlap checker, evidence approval, role permissions | — | **IMPROVE** | HIGH |
| Documented rules not implemented | Rebuild plan references Workiz removal (done) but also GA/GTM setup unclear | — | **INVESTIGATE** | MEDIUM |

---

# Google Alignment Summary

| Google guidance area | Alignment | Notes |
|---------------------|-----------|-------|
| Search Essentials | Mostly aligned | Indexable HTML, clear titles, crawlable links |
| Helpful / people-first content | Partial | Strong service intent; city/article scaling needs unique local value |
| Spam / scaled content policy | **At risk** | 3-city replication of templates and seed articles |
| Crawling & indexing | Strong | Sitemap, robots, canonicals, selective noindex |
| Canonicalization | **Needs decision** | Province vs city service URLs both indexable |
| Structured data | Strong with gaps | Conditional LocalBusiness address; verify prod completeness |
| LocalBusiness / Organization | Implemented | Multi-city modeling needs owner decision |
| Image SEO | Good baseline | Alt text present; evidence images need discipline |
| Core Web Vitals | Not measured in audit | **INVESTIGATE** in Search Console / field data |
| AI Overviews | Neutral | Direct-answer blocks help; quality depends on uniqueness |
| Search Console measurement | Env hook for verification tag | **INVESTIGATE** prod configuration |

---

# A. Executive Summary (15 findings)

1. **City-first architecture is live and coherent** — `/[city]/…` is the real revenue site; `/` is an org chooser. (**KEEP**)
2. **Legacy root URLs 301 to Calgary**, creating implicit Calgary primacy for old bookmarks and backlinks. (**IMPROVE**)
3. **Two parallel service taxonomies** (`services[]` vs `serviceLandingPages[]`) with different slugs increase duplication and internal-link complexity. (**REPLACE** — HIGH)
4. **Province and city service URLs can both index**, risking near-duplicate SERP targets. (**INVESTIGATE** — HIGH)
5. **Triplicated city templates** (Calgary, Edmonton, Red Deer) rely heavily on string substitution; scaled-content risk is real under Google guidance. (**IMPROVE** — HIGH)
6. **SEO infrastructure is strong**: centralized metadata, sitemap, robots, schema, RSS, selective noindex. (**KEEP**)
7. **Evidence / “From the field” system exists** but public sections hide when empty — local proof is structurally ready, content-dependent. (**KEEP** / **INVESTIGATE**)
8. **Lead capture is self-contained and reliable**: Zod validation, storage-first, optional Brevo/Gmail notification, admin inbox with disposition. (**KEEP**)
9. **Conversion UX favors inline form success**; `/thank-you` may be orphaned from primary flows, weakening analytics funnels. (**IMPROVE**)
10. **AI scheduled publishing is disabled**; human editorial gates (quality checks, overlap detection) exist. (**KEEP**)
11. **Design system is consistent** (color, type, CTA patterns, mobile dock) with minor thank-you/footer inconsistencies. (**KEEP**)
12. **Documentation is not authoritative** — rebuild plan and README contradict the implementation. (**REMOVE** stale docs as SOT — HIGH)
13. **LocalBusiness schema omits address/geo unless env configured** — must verify production completeness. (**INVESTIGATE**)
14. **Request-service pages missing from sitemap** despite being key conversion URLs. (**IMPROVE**)
15. **No permanent SOT exists yet** — this audit is the pre-requisite for one. (**REPLACE** gap — CRITICAL)

---

# B. Architecture Map

See Section 3.1 for the full tree.

**Navigation modes**

| Context | Header | Footer | Mobile dock |
|---------|--------|--------|-------------|
| `/` (chooser) | City links in info bar | City chooser footer | Hidden |
| `/[city]/*` | Full nav + services menu | Full city footer | Call / Request / Articles |
| `/services*` (province) | Reduced nav | Hidden | Hidden |

**Content authority (actual, not ideal)**

| Content type | Primary source |
|--------------|----------------|
| Service marketing copy | `src/lib/site-data.ts` (static) |
| Business contact/hours | CMS settings (`defaults.ts` + admin) with city overrides in `cities.ts` |
| Articles | CMS JSON/Blob |
| Leads | CMS JSON/Blob |
| Evidence | CMS JSON/Blob |
| SEO metadata/schema | `src/lib/seo.ts` + per-page calls |

---

# C. SOT Gap Map

### 1. SEO
- Canonical tier rules (province vs city)
- Sitemap inclusion policy (request-service, thank-you, portal)
- Schema requirements per page type
- Multi-location LocalBusiness policy
- Scaled-content thresholds for city/article pages

### 2. Content
- Minimum unique local content per city page
- Service slug/name canonical list
- Article editorial standards (quality checker already in code)
- Evidence publication rules
- Image sourcing (real vs stock vs AI)

### 3. Design / UX
- Token definitions (`globals.css` vars)
- CTA hierarchy and labels
- Header/footer modes by route class
- Mobile dock rules
- Form success vs thank-you page policy

### 4. Conversion
- Primary vs secondary CTA placement standards
- Form field requirements (contact vs request-service)
- Analytics event map (GA4)
- reCAPTCHA production requirement
- Phone tracking standards

### 5. Site Architecture
- URL patterns and redirect table
- City rollout stages (`launchStage`, `noindex`)
- Deprecated root routes
- Internal linking requirements per page type

### 6. Engineering
- Env var contract (`.env.example`)
- Storage mode (Blob required in prod)
- Cron jobs (publish-scheduled only)
- Admin roles and permissions
- AI-agent safe-edit zones

### 7. Lead / CRM
- Lead schema and disposition workflow
- Email provider priority (Brevo vs Gmail)
- Failure handling (storage before notify)
- Office SLA expectations (not in code)

### 8. Change Control / QA
- Pre-deploy sitemap audit (`scripts/audit-sitemap.mjs`)
- Article overlap + quality gates
- Evidence approval workflow
- Documentation sync requirement (README currently unsafe)

---

# D. Top 10 Risks (ranked)

| Rank | Risk | Risk level | Domain |
|------|------|------------|--------|
| 1 | No Source of Truth — agents and editors lack authoritative rules | **CRITICAL** | Governance |
| 2 | Scaled / near-duplicate city + service pages across 3 markets | **HIGH** | SEO / Content |
| 3 | Dual service taxonomies causing URL, nav, and content drift | **HIGH** | Architecture / Engineering |
| 4 | Province + city service URLs both indexable without documented canonical strategy | **HIGH** | SEO |
| 5 | Stale documentation (README, rebuild plan) contradicts production behavior | **HIGH** | Governance |
| 6 | LocalBusiness schema may ship incomplete without verified NAP env vars | **MEDIUM** | SEO |
| 7 | Conversion analytics funnel misaligned if `/thank-you` unused | **MEDIUM** | Conversion |
| 8 | reCAPTCHA optional — spam risk if prod env omitted | **MEDIUM** | Conversion / Engineering |
| 9 | Evidence system empty → “real field examples” claims weaken trust | **MEDIUM** | Content |
| 10 | Legacy root pages duplicate `[city]` implementations | **MEDIUM** | Engineering |

---

# E. SOT Candidates (strong enough to consider permanent)

1. **`createPageMetadata()` + `src/lib/seo.ts` schema builders** — de facto SEO standard today.
2. **City-first routing under `/[city]/`** with `getCityHref()` helper.
3. **`src/lib/contact.ts` lead pipeline** — validate → store → notify → admin disposition.
4. **Design tokens in `globals.css`** and layout primitives (`.page-frame`, `.section-pad`, `.eyebrow`, `.display-title`).
5. **Header/mobile dock CTA pattern** — Request Service primary, Call secondary.
6. **`src/lib/cms/article-quality.ts` + overlap checker** — editorial guardrails.
7. **Evidence model** (`src/lib/evidence.ts`) with public approval flags.
8. **Admin role separation** (`admin` vs `office`) in `permissions.ts`.
9. **Sitemap + robots implementation** as baseline crawl policy.
10. **Disabled auto-publish AI cron** — human review default.

---

# F. Decisions Required (OWNER / ARCHITECT)

1. **Canonical geography model**: Is Phoenix one business with one dispatch number, or three local entities for SEO/schema?
2. **Province vs city URL strategy**: Should `/services/[slug]` support indexing, or canonicalize strictly to `/[city]/services/[slug]`?
3. **Legacy URL policy**: Should all former root paths continue redirecting to Calgary, or to chooser / geo-detected city?
4. **Service taxonomy unification**: What is the final slug list — merge `services[]` and `serviceLandingPages[]` how?
5. **Minimum unique local content bar** per city page before indexation (word count, evidence, photos, FAQs).
6. **Article scale policy**: Max articles per city, required human review steps, allowed AI assistance level.
7. **Conversion confirmation UX**: Inline success vs mandatory `/thank-you` redirect for measurement.
8. **Analytics stack of record**: GA4 only, Vercel Analytics, Cloudflare gateway — what is required in prod?
9. **Lead notification authority**: Brevo vs Gmail — single supported path?
10. **External CRM**: Will admin inbox remain system of record indefinitely?
11. **Physical address publication**: What NAP data is approved for JSON-LD and public pages?
12. **Mock `/portal/*` routes**: Keep, protect, or remove from production builds?
13. **Documentation retirement**: Which existing docs are historical only vs authoritative?
14. **City rollout playbook**: Future cities — placeholder/noindex rules and launch checklist.
15. **Ownership of content edits**: Who may change `site-data.ts` vs CMS vs evidence records?

---

# Appendix: Key File Index

| Area | Path |
|------|------|
| Cities config | `src/lib/cities.ts` |
| Site content + services | `src/lib/site-data.ts` |
| SEO | `src/lib/seo.ts` |
| Sitemap | `src/app/sitemap.ts` |
| Robots | `src/app/robots.ts` |
| Redirects | `next.config.ts` |
| Leads | `src/lib/contact.ts`, `src/lib/cms/storage.ts` |
| Lead email | `src/lib/email/lead-notifications.ts` |
| Articles seed | `src/lib/cms/seed-articles/index.ts` |
| Article quality | `src/lib/cms/article-quality.ts` |
| Evidence | `src/lib/evidence.ts` |
| Internal links | `src/lib/internal-links.ts` |
| Layout / global chrome | `src/app/layout.tsx`, `src/components/site-header.tsx`, `src/components/site-footer.tsx` |
| Forms | `src/components/forms/contact-form.tsx`, `src/components/forms/request-service-form.tsx` |
| Admin auth | `src/proxy.ts`, `src/lib/auth/permissions.ts` |
| Env template | `.env.example` |
| Existing planning doc (stale) | `docs/website-rebuild-plan.md` |

---

**End of audit.** No SOT files were created. No fixes were implemented. No deployments were made.
