# Next.js Admin + Workiz Architecture

## Recommendation

Use Next.js only for the first version, including:

- public marketing site
- Workiz API integration
- contact/booking endpoints
- internal admin area

An admin page for website info does not require NestJS.

An admin page for managing the Workiz API token also still does not require NestJS, but it raises the security bar. That means proper auth, encrypted secret storage, and audit logging become mandatory.

## Best Practical Split

Use two kinds of configuration:

### 1. Website Settings

Store editable business info in a database table.

Examples:

- business name
- phone number
- email
- hours
- service area text
- booking URL
- hero copy
- CTA labels

These are safe to manage through an admin UI.

### 2. Secrets

Examples:

- Workiz API token
- email provider API key
- database credentials

These should ideally stay in environment secrets managed by the hosting platform.

If you absolutely need to manage the Workiz token from an admin page, do not store it as plain text in the database. Store it encrypted and only decrypt it server-side.

## Recommended Architecture

### Public App

- Next.js App Router
- statically rendered pages where possible
- server-side data loading for settings
- route handlers or server actions for forms

### Admin App

- `/admin` section inside the same Next.js app
- protected with Auth.js or Clerk
- admin-only role check on every admin route and mutation

### Data Layer

- PostgreSQL
- Prisma or Drizzle

Suggested tables:

- `site_settings`
- `service_pages` if service content becomes editable
- `audit_logs`
- `encrypted_secrets` only if token must be editable in-app
- `lead_submissions` if you want delivery history and retry visibility

### Workiz Integration Layer

- server-only client wrapper
- request validation
- retry/error logging
- webhook verification if Workiz supports signed webhooks

Suggested structure:

- `app/api/contact/route.ts`
- `app/api/workiz/webhook/route.ts`
- `app/api/admin/workiz/test/route.ts`
- `lib/workiz/client.ts`
- `lib/workiz/service.ts`
- `lib/workiz/types.ts`
- `lib/settings/service.ts`
- `lib/security/encryption.ts`

## Token Management Guidance

### Preferred Option

Do not manage the Workiz token through the website admin panel.

Instead:

- keep token in hosting provider secret storage
- expose a `Test Workiz Connection` button in admin that checks the current token
- let admin users manage only non-secret website settings

Why this is better:

- simpler
- safer
- fewer breach paths
- easier deployment model

### If Admin Token Editing Is Required

This is still possible in Next.js, but implement it properly:

- require authenticated admin access
- require role-based authorization
- encrypt the token before storing it
- keep encryption key in environment secret storage
- never return the raw token to the browser after save
- provide `Replace token` flow, not `view token` flow
- add audit logs for token changes
- add `Test connection` after update

In that model, the browser submits the new token once, the server encrypts it, stores it, and uses it only on server-side requests to Workiz.

## What Still Does Not Justify NestJS Yet

These are all still fine inside Next.js:

- admin settings page
- editable phone/hours/content
- direct Workiz API calls
- Workiz webhook handling
- lead logging
- simple retry flow
- test-connection action

## What Would Start Justifying NestJS

Consider splitting to NestJS if the backend becomes its own system with things like:

- complex job syncing with Workiz
- background workers and queues
- scheduled reconciliation jobs
- multiple third-party integrations
- advanced admin workflows and permissions
- internal CRM-like features
- a separate API used by multiple clients
- heavy operational logic unrelated to page rendering

That is the boundary: not "we have an admin page," but "we now have a backend product."

## Concrete Recommendation For This Project

Build version 1 like this:

- Next.js for frontend and backend
- PostgreSQL for settings, logs, and optional lead records
- Auth.js for admin authentication
- Workiz integration in server-only modules
- website info editable through `/admin`
- Workiz token kept in environment secrets if possible

Only move the token into admin-managed encrypted storage if there is a real business need for non-technical staff to rotate it without deployment access.

## Decision Summary

If you want an admin page for content and business info, stay on Next.js.

If you also want an admin page for the Workiz token, you can still stay on Next.js.

That requirement alone is not enough reason to introduce NestJS.