# Website Rebuild Plan

## Goal

Recreate https://fireplacerepairscalgary.ca/ as a faster, cleaner, easier-to-maintain marketing site while preserving the current business goals:

- generate calls
- generate form leads
- push users into online booking through Workiz
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

- Workiz is currently used through direct links to an online booking page, not a visible embedded widget on the homepage.
- The booking URL appears multiple times and should be treated as a shared global config value in the rebuild.
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
- Workiz integration is straightforward because the current booking flow is link-based
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

## Workiz Support Plan

This should be treated as a required integration, not an afterthought.

### Minimum Required Workiz Support

- add a global Workiz booking URL in site configuration
- use that same URL for every `Book now`, `Book online`, and inspection CTA
- expose booking CTA in the top bar, hero, service sections, WETT page, and contact page
- track every Workiz click as a conversion event in GA4

### Lead Handling Strategy

Two viable approaches:

1. Fastest launch path

- website form submits to site backend
- confirmation email is sent to the business
- form payload is forwarded into Workiz through whatever Workiz-friendly automation is available, such as Zapier or Make

2. Tighter Workiz integration

- if Workiz provides API, webhook, or supported lead intake tooling for this account, submit new leads directly from the site into Workiz

### Recommended Decision

Start with this unless we confirm better native Workiz support:

- keep booking as direct Workiz link
- keep a site-side contact form for users who do not want to book immediately
- push form submissions into Workiz through automation if direct API intake is not available

### Optional Workiz Enhancements

- embedded booking modal if Workiz supports it cleanly
- service-specific booking links prefilled by CTA context
- hidden tracking fields to identify which page or service created the lead
- Workiz conversion event tracking in GTM

## Content And Data Needed Before Build

- final approved phone number
- final business hours
- final email address for leads
- final Workiz booking URL and any widget/API details
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
- confirm Workiz access details
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

### Phase 4: Workiz And Lead Integration

- centralize Workiz booking URL
- connect CTAs to Workiz
- connect form submission flow
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
5. Wire Workiz and lead handling
6. Add analytics, SEO, and QA
7. Launch

## Risks To Resolve Early

- unclear Workiz API or automation support for this account
- inconsistent business phone data from the current site
- missing media assets
- unclear ownership of current domain, analytics, and hosting
- no defined source of truth for future content updates

## Recommended Immediate Next Step

Before writing code, lock these four items:

- final platform choice: Next.js or WordPress
- final approved phone/email/hours
- final Workiz integration method
- final page copy and imagery

Once those are confirmed, the next deliverable should be a sitemap plus wireframe, followed by the actual project scaffold.