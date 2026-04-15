# Phoenix Chimney & Fireplace Services

Next.js marketing site rebuild for the Calgary fireplace and chimney business, using the existing live-site media locally and keeping the booking flow centered on Workiz.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Local image assets copied from the live site
- Server-side contact route with a clean seam for future Workiz API delivery

## Routes

- `/`
- `/services`
- `/wett`
- `/about`
- `/contact`

## SEO Included

- page-level metadata and canonicals
- robots.txt
- sitemap.xml
- manifest.webmanifest
- Open Graph and Twitter image routes
- LocalBusiness, WebSite, Service, FAQ, and Breadcrumb structured data

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy the env template if you want to wire contact submissions into Workiz:

```bash
cp .env.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

4. Build for production verification:

```bash
npm run build
```

## Workiz Integration

The current public booking buttons point to the Workiz online-booking URL stored in `src/lib/site-data.ts`.

The contact form posts to `/api/contact` and supports two modes:

- `WORKIZ_API_TOKEN` and `WORKIZ_LEAD_ENDPOINT` configured: submit leads server-side to Workiz
- no production config present: return a clear fallback so the site can direct users to call or book online

This keeps the current project Next.js-only while leaving a clean backend seam if a future NestJS service takes over lead routing.

## Content Notes

- The original site contains inconsistent phone numbers. The rebuild currently uses `(825) 425-0050` as the single source of truth until business data is confirmed.
- Business hours, booking link, and contact info are centralized in `src/lib/site-data.ts`.

## Suggested Next Build Steps

1. Confirm final business phone, hours, and email.
2. Wire real Workiz API credentials into the contact route.
3. Add a protected admin/settings layer if non-technical editing is needed.
4. Add analytics IDs and conversion tracking once the production property is ready.
