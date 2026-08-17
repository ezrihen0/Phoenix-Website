# Website Rebuild Plan

## Goal

Recreate https://fireplacerepairscalgary.ca/ as a faster, cleaner, easier-to-maintain marketing site while preserving the current business goals:

- generate calls
- generate form leads through Request Service and the contact form
- keep every website lead in Admin Leads, with Gmail notification when configured
- maintain local SEO for Calgary fireplace and chimney services

## Current Site Audit

The existing site is a small WordPress + Elementor build with these public pages:

- `/`
- `/services/`
- `/about/`
- `/contact/`
- `/wett/`

The current experience is built around a few repeated patterns:

- top info bar with phone, hours, and `Book now`
- simple main navigation
- service-focused hero sections
- repeated trust/value blocks
- service overview sections
- contact form on home and contact pages
- contact info block with map embed
- repeated booking and call CTAs

## Important Findings From The Existing Site

- The live site no longer uses Workiz. Primary CTAs go to Request Service, and forms save into Admin Leads.
- The site has inconsistent contact data that should be fixed during rebuild:
  - `(825) 425-0050` appears in multiple places
  - `403-679-8236` also appears on the homepage
  - one contact-page phone link shows `825-425-0050` but points to `tel:+14036798236`
- Business hours are not fully consistent across sections.
- The WETT page is important and should be included in scope even though it is not part of the main top-level navigation on every page.

## Recommended Build Approach

Recommended stack for a clean rebuild:

- Next.js with TypeScript
- Tailwind CSS for layout and reusable UI
- Vercel or Cloudflare Pages for deployment
- GA4 + Google Tag Manager for conversion tracking
- server-side form handler for lead capture

Why this approach:

- the site is mostly static marketing content
- performance and SEO will be better than the current WordPress/Elementor build
- future improvements will be easier to maintain

Alternative if non-technical editing is the top priority:

- WordPress rebuild with a lighter theme and less plugin bloat

## Scope

### Shared Site Features

- announcement/info bar with phone, hours, and booking CTA
- responsive header and footer
- sticky mobile CTA behavior for `Call` and `Book`
- reusable CTA components
- reusable service section/card components
- global contact block
- map embed on contact page
- form confirmation and error handling
- spam protection on forms

### Page Inventory

#### Home

- hero section
- trust/value statements
- featured service highlights
- WETT inspection highlight
- company positioning and service area copy
- lead form
- contact info section

#### Services

- gas fireplace repair and maintenance
- wood stove maintenance and repair
- chimney sweep and repair
- chimney relining
- chimney replacement and masonry

#### About

- company story
- why choose Phoenix section
- service coverage area
- promise / brand trust copy

#### Contact

- lead form
- service selector dropdown
- business hours
- phone and email
- map embed
- backup CTA for users who prefer calling

#### WETT

- WETT-focused hero
- inspection reasons and benefits
- insurance / real-estate value proposition
- fast-turnaround and documentation messaging
- booking and call CTAs

## Lead Intake

Website requests go to Admin Leads. Gmail notification is optional and must not block lead storage. Workiz is not used.

## Content And Data Needed Before Build

- final approved phone number
- final business hours
- final email address for leads
- logo and brand assets
- photography or approved stock image direction
- final service descriptions
- service area list
- review/testimonial content if we want to improve conversion vs the current site

## SEO And Local Search Requirements

- preserve the existing page URLs where possible
- add proper title tags and meta descriptions for each page
- add LocalBusiness and Service schema
- add clear Calgary and area service targeting
- optimize headings so each page has a single clear keyword target
- set up redirects if any slugs change

## Implementation Phases

### Phase 1: Discovery And Content Lock

- confirm pages in scope
- confirm branding direction
- clean up contact information inconsistencies
- finalize copy and images

### Phase 2: Design System And Layout

- build typography, color, spacing, and CTA system
- create desktop and mobile layout for shared components
- define form styles and conversion blocks

### Phase 3: Page Build

- implement home page
- implement services page
- implement about page
- implement contact page
- implement WETT page

### Phase 4: Lead Integration

- connect CTAs to Request Service
- save form submissions in Admin Leads
- send Gmail notifications when SMTP is configured
- add conversion tracking

### Phase 5: SEO, QA, And Launch

- mobile QA
- cross-browser QA
- performance pass
- form testing
- phone link testing
- analytics verification
- launch and post-launch validation

## Rough Delivery Order

1. Lock content and business data
2. Build shared layout and navigation
3. Build the home page first
4. Build the remaining four pages
5. Wire Request Service and lead handling
6. Add analytics, SEO, and QA
7. Launch

## Risks To Resolve Early

- inconsistent business phone data from the current site
- missing media assets
- unclear ownership of current domain, analytics, and hosting
- no defined source of truth for future content updates

## Recommended Immediate Next Step

Before writing code, lock these four items:

- final platform choice: Next.js or WordPress
- final approved phone/email/hours
- final page copy and imagery

Once those are confirmed, the next deliverable should be a sitemap plus wireframe, followed by the actual project scaffold.