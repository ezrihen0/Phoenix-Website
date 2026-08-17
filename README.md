# Phoenix Chimney & Fireplace Services

Next.js marketing site rebuild for the Calgary fireplace and chimney business, using the existing live-site media locally and capturing website requests through Phoenix Request Service.

The project now also includes a lightweight article CMS, a simple credential-based admin login, and a scheduled AI article generator designed for Vercel deployment.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Local image assets copied from the live site
- Server-side contact and Request Service routes that save leads into the Phoenix admin inbox
- Signed cookie admin sessions with env-based credentials and basic brute-force throttling
- Local JSON fallback plus Vercel Blob storage for articles and editable site settings
- OpenAI-powered daily article generation via a protected cron route

## Routes

- `/`
- `/services`
- `/wett`
- `/about`
- `/contact`
- `/articles`
- `/articles/[slug]`
- `/admin`
- `/admin/login`

## SEO Included

- page-level metadata and canonicals
- robots.txt
- sitemap.xml
- manifest.webmanifest
- Open Graph and Twitter image routes
- LocalBusiness, WebSite, Service, FAQ, and Breadcrumb structured data
- article pages with SEO metadata and article schema

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Copy the env template:

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

## Lead Intake

Website requests go to `/[city]/request-service` and `/api/request-service`. Contact form submissions go to `/api/contact`. Both save into the existing Admin Leads inbox and can email `phoenixfireplace0@gmail.com`.

## Admin and CMS

Admin access is handled with a direct username and password stored in environment variables. Successful logins create a signed, httpOnly session cookie and repeated failed attempts are rate-limited before the admin panel is accessible.

The admin area supports:

- site setting updates for business details and contact data
- article create, edit, delete, and publish flows
- manual AI article generation for review

Content storage works in two modes:

- local development: JSON files under `data/cms/`
- Vercel: `@vercel/blob` using `BLOB_READ_WRITE_TOKEN`

## AI Article Automation

The route `/api/cron/generate-article` generates one SEO article per day when called with `Authorization: Bearer ${CRON_SECRET}`.

The included `vercel.json` schedules that route daily at `08:05 UTC`. Generated articles are saved as published posts and linked back into service pages and recent articles for internal-linking coverage.

## Deployment Readiness

The project now includes deployment wiring for both managed and self-hosted setups:

- standalone Next.js output enabled in `next.config.ts`
- `sharp` installed for production image optimization
- Docker multi-stage build via `Dockerfile`
- health endpoint at `/api/health`
- runtime deployment version support via `DEPLOYMENT_VERSION`
- configurable site URL via `NEXT_PUBLIC_SITE_URL`
- original live-site favicon assets restored and wired into metadata/manifest
- `vercel.json` daily cron for automated article generation

### Required Environment Variables

Use `.env.example` as the template. The main deployment variables are:

- `NEXT_PUBLIC_SITE_URL`: canonical public URL used for metadata and sitemap generation
- `DEPLOYMENT_VERSION`: deployment identifier used by Next.js to reduce version-skew issues during rollouts
- `ADMIN_USERNAME`: username allowed into `/admin`
- `ADMIN_PASSWORD_HASH`: preferred password format, generated as a scrypt hash
- `ADMIN_PASSWORD`: optional plain-text fallback for local setup only if you do not want to pre-hash the password
- `ADMIN_SESSION_SECRET`: session signing secret used for the admin cookie
- `BLOB_READ_WRITE_TOKEN`: required on Vercel if admin edits and generated articles must persist
- `OPENAI_API_KEY`: required for AI article generation
- `OPENAI_MODEL`: optional OpenAI model override, defaults to `gpt-4.1`
- `CRON_SECRET`: shared secret for the scheduled article route

### Vercel Deployment

1. Import the GitHub repository into Vercel.
2. Keep the framework preset as Next.js.
3. Add the variables from `.env.example` in the Vercel project settings.
4. Set `NEXT_PUBLIC_SITE_URL` to the production domain before the production build.
5. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET`, `BLOB_READ_WRITE_TOKEN`, `OPENAI_API_KEY`, and `CRON_SECRET`.
6. Deploy.

The included `vercel.json` enables daily scheduled AI article generation.

### Docker / Node Deployment

Build the container:

```bash
docker build -t papoon-fireplacerepair .
```

Run it:

```bash
docker run --rm -p 3000:3000 --env-file .env.production.local papoon-fireplacerepair
```

If you prefer a plain Node host instead of Docker:

```bash
npm run build
npm run start:standalone
```

### Health Check

Use this endpoint for container or platform health probes:

```txt
/api/health
```

## Content Notes

- The site uses `(825) 823-9556` as the business phone across Calgary, Edmonton, and Red Deer.
- Business hours and contact info are seeded from `src/lib/cms/defaults.ts` and become editable through `/admin/settings`.

## Suggested Next Build Steps

1. Confirm final business phone, hours, and email.
2. Configure admin credentials, Blob storage, and OpenAI secrets in Vercel.
3. Review the seeded articles and tune the AI system prompt for brand voice.
4. Add analytics IDs and conversion tracking once the production property is ready.
