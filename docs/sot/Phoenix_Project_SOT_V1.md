# PHOENIX CHIMNEY & FIREPLACE --- PROJECT SOT V1

**Status:** AUTHORITATIVE\
**Market:** Alberta, Canada\
**Role:** Primary revenue website\
**Parent:** Canadian Global SOT + Province-Wise Addendum\
**Priority:** Production-grade implementation now

## 1. Business Mission

Phoenix is not an "SEO website".

The website is an engine connecting:

**Search → Education → Trust → Diagnosis → Service → Lead → Job →
Revenue**

Professional positioning:

> **Understand the system first. Diagnose properly. Explain clearly.
> Present the options.**

The customer should understand that Phoenix can evaluate the
fireplace/chimney system as a whole, rather than simply selling an
isolated action.

------------------------------------------------------------------------

## 2. Alberta Scope

Phoenix serves Alberta through primary service hubs.

**Active hubs:** - Calgary - Edmonton - Red Deer

Each hub may serve approximately 100 km where operationally appropriate.

The 100 km radius is **service-area logic**, not automatic justification
for creating dozens of location pages.

Do not create a page for every town merely because it falls inside the
radius.

------------------------------------------------------------------------

## 3. Geographic Architecture

City-first architecture is retained.

``` text
/
├── calgary/
├── edmonton/
└── red-deer/
```

The root represents Phoenix/Alberta and routes users toward the
appropriate market.

The city is the local revenue authority.

Province/general resources may exist when they serve a genuine purpose,
but they should not unnecessarily compete with city pages.

------------------------------------------------------------------------

## 4. Service Architecture

Three primary service families:

### Gas Fireplace

Phoenix can address a broad lifecycle:

**Maintenance → Service → Diagnosis → Repair → Parts → Rebuild/Upgrade →
Installation/Replacement**

Capabilities may include ignition, pilot, valves, controls, blower,
cleaning/maintenance, venting/liner, and other relevant system work.

Not every capability receives its own URL.

### Chimney

Includes:

**Sweep / Service / Maintenance / Inspection / Repair / Rebuild / Crown
/ Flashing / Tuckpointing / Wood Chase / Chase Cover / Liner / Caps /
Firebox Rebuild**

Capability does not automatically equal landing page.

### WETT

**Inspections + clear customer-facing reporting**, including insurance
and real-estate use cases where relevant.

Do not represent insurer, lender, or real-estate requirements as
universal when they are not.

------------------------------------------------------------------------

## 5. General vs City Pages

General pages provide broad authority.

City pages receive priority when search intent is local.

Example:

``` text
WETT General Resource
        ↓
Calgary WETT
Edmonton WETT
Red Deer WETT
```

The general page should not aggressively compete with city pages.

City pages should carry stronger local meaning through applicable
factors such as:

-   local service information
-   climate
-   relevant local conditions
-   actual evidence
-   service availability
-   customer questions
-   conversion context

Do not use simple city-name substitution to manufacture "unique"
content.

------------------------------------------------------------------------

## 6. Trust Architecture

Phoenix does not claim:

> "We are the only company that understands your fireplace."

Phoenix **demonstrates expertise**.

Trust is built through:

**Real Work + Diagnosis + Technical Explanation + Before/After + From
the Field + Reviews + Clear Process**

Service pages should show, where applicable:

**Problem → What we inspect → What we found in real situations →
Possible solutions → Customer options**

Desired customer perception:

> **"They actually understand this system."**

------------------------------------------------------------------------

## 7. Diagnostic Philosophy

Phoenix does not assume what must be replaced before diagnosis.

``` text
Clean
↓
Inspect
↓
Diagnose
↓
Explain
↓
Repair / Maintain / Replace component / Rebuild / Replace system
↓
Customer chooses
```

Do not use "not worth repairing" as a default sales framing.

Phoenix explains professional options and allows the customer to make an
informed decision.

------------------------------------------------------------------------

## 8. Pricing Policy

Complex repairs are not priced by guessing over the phone.

When the problem is unknown:

> **\$99 diagnostic/inspection visit → assessment → findings → options →
> accurate quote**

Customer-facing principle:

> What sounds simple over the phone may involve several different
> components or conditions. We inspect the system first so we can
> properly identify the issue and explain the appropriate options.

Standardized services may use an approved fixed price or price range.

### Chimney Sweep

A range may be displayed when commercially approved.

Required qualifier:

> **Final pricing depends on the system, condition, level of buildup,
> and chimney height/accessibility.**

------------------------------------------------------------------------

## 9. Conversion Architecture

Primary CTA:

**Request Service**

Secondary CTA:

**Call Phoenix**

Do not create unnecessary separate funnels.

Phoenix uses **one Smart General Form**.

------------------------------------------------------------------------

## 10. Smart Service Form

Customer can choose:

**City → Service → Problem → Urgency**

The system also preserves available context automatically:

-   province
-   city
-   service
-   source page
-   CTA location
-   UTM attribution

Do not ask the customer to repeat information already known reliably
from page context.

------------------------------------------------------------------------

## 11. Address + Map

The form must be map-ready.

Desired flow:

``` text
Enter Address
↓
Autocomplete
↓
Map + Pin
↓
Customer confirms
↓
Structured address + coordinates
↓
Service-area evaluation
↓
Lead
```

Future routing:

**Coordinates → nearest Phoenix hub → coverage logic → lead routing →
WizField**

Map failure must never block lead submission.

Manual address entry remains the fallback.

------------------------------------------------------------------------

## 12. Lead Authority

For now, the Phoenix Lead System is the source of truth for web leads.

Email is notification only.

CRM authority remains **DEFERRED** until WizField integration.

The website must not depend on email delivery to preserve a lead.

------------------------------------------------------------------------

## 13. Successful Conversion

``` text
Form
↓
Server validation
↓
Lead persisted
↓
Success
↓
/thank-you
↓
Conversion recorded
```

A submit click alone is not a conversion.

Do not pass PII through analytics or URL parameters where inappropriate.

------------------------------------------------------------------------

## 14. Analytics

Authority:

-   **GSC → Organic Search**
-   **GA4 → Website/Conversion behaviour**
-   **Phoenix Leads → Lead authority**
-   **Operational/financial records → Revenue**

Core events:

-   `cta_click`
-   `phone_click`
-   `form_start`
-   `lead_submitted`
-   `thank_you_view`

Weather Intelligence may additionally measure:

-   `weather_banner_view`
-   `weather_banner_cta`
-   `weather_module_cta`
-   `weather_source_click`
-   `weather_article_strip_impression`
-   `weather_article_strip_click`

------------------------------------------------------------------------

## 15. Weather Intelligence

Phoenix is **city-aware**.

The Canadian weather source is Environment and Climate Change Canada
(MSC GeoMet City Page Weather).

The website must not call the upstream Weather Provider on every page
view.

Architecture:

``` text
ECCC GeoMet
      ↓
Hourly Scheduled Refresh
      ↓
Phoenix Server Cache / Store
      ↓
City Weather State
      ↓
City-page service-context panel
and (when enabled) Rules Engine → Recommendation banner
      ↓
Website
```

Minimum active city records:

-   Calgary
-   Edmonton
-   Red Deer

Relevant data may include:

-   temperature
-   feels-like
-   precipitation
-   wind
-   humidity
-   condition
-   applicable weather alert/state
-   official source URL
-   updated_at

Only data actually required by the product should be retained/processed.

The city-page panel shows factual observations and Phoenix **service
context**. It must not present ECCC data as a chimney, masonry, leak, or
fireplace risk rating. Recommendation-engine rules remain off until
thresholds are technically validated.

------------------------------------------------------------------------

## 16. Weather Caching

Server refresh target:

**Once per hour.**

Visitors do not trigger upstream Weather API calls from the browser.

A server-side cache miss may fill one city snapshot with a short timeout.
If that fill fails, the page still renders.

The client may cache current recommendation/weather state for
approximately 30--60 minutes.

Prefer lightweight browser storage rather than sending unnecessary
weather data as cookies with every request.

``` text
Provider
→ hourly server cache
→ Phoenix endpoint/state
→ client cache
→ UI
```

If the provider fails:

**The website remains operational.**

If weather data is older than the approved freshness threshold:

**Do not show time-sensitive recommendations.**

------------------------------------------------------------------------

## 17. Weather Recommendation Engine

Weather data is not decorative.

It should provide customer value.

Potential rule families:

-   **Extreme Cold** → relevant fireplace guidance
-   **First Cold Snap** → seasonal fireplace preparation
-   **Heavy Rain** → chimney/leak awareness
-   **Freeze/Thaw Conditions** → masonry/chimney awareness
-   **Relevant Wind Conditions** → appropriate venting/draft education
    where technically justified

Thresholds are **not invented inside this SOT**.

Before activation, every rule requires technical validation.

------------------------------------------------------------------------

## 18. Dynamic Customer Recommendations

A weather trigger does not automatically create an article.

The system may display:

**Banner / Recommendation Card / Contextual CTA / City-page conditions panel**

Example:

> Cold weather has arrived in Calgary. Starting your gas fireplace for
> the first time this season? See what you can safely check before
> requesting service.

`View Recommendations` → relevant educational content.

Desired funnel:

**Weather → Context → Education → Relevant Service**

Not:

**Weather → Fear → Call Us**

------------------------------------------------------------------------

## 19. Content Philosophy

Phoenix content starts with a real customer situation.

Every article should answer:

> **What situation is the customer currently dealing with?**

Do not begin with:

> "Which keyword have we not targeted yet?"

SEO research helps identify demand, but content is written for the
person behind the search.

------------------------------------------------------------------------

## 20. General vs Local Articles

Default:

**One authoritative general article.**

Do not duplicate the same article across Calgary, Edmonton, and Red
Deer.

A city-specific article is justified only when geography materially
changes the answer.

General content may link to local resources.

Local content may link back to general technical authority.

These are **internal links**, not backlinks.

------------------------------------------------------------------------

## 21. Article Perspective Rule

The same facts may support separate content when the reader's position
materially differs.

### Seller

**Selling a Home With a Wood-Burning Fireplace? You May Need a WETT
Inspection**

Focus on the seller's needs.

### Buyer

**Buying a Home With a Wood-Burning Fireplace? Here's Why a WETT
Inspection Matters**

Focus on the buyer's needs.

Facts remain objective.

Explanation and priorities may be adapted to the reader.

**Same facts. Different customer perspective.**

------------------------------------------------------------------------

## 22. 90-Day Content Engine

Phoenix uses a **rolling 90-day backlog**.

Operational target:

**Up to one quality article per day.**

No publishing quota overrides the quality gate.

Topic sources:

-   GSC
-   Google Ads Search Terms
-   real customer questions
-   field observations
-   seasonality/weather
-   service demand
-   validated search research

Reprioritize approximately monthly.

------------------------------------------------------------------------

## 23. Initial Approved Article Seeds

### #1 --- Insurance / WETT

**Did Your Home Insurance Company Suddenly Ask for a WETT Inspection?
Here's What They're Actually Looking For**

### #2 --- Seller / WETT

**Selling a Home With a Wood-Burning Fireplace? You May Need a WETT
Inspection**

### #3 --- Buyer / WETT

**Buying a Home With a Wood-Burning Fireplace? Here's Why a WETT
Inspection Matters**

### #4 --- Gas Fireplace / Winter

**Turning On Your Gas Fireplace Before Winter? Here's What You Can Check
Yourself --- and When to Call a Technician**

### #5 --- Blower

**Is Your Gas Fireplace Blower Not Working? Here's What It Actually Does
and What Can Go Wrong**

### #6 --- Chimney Sweep

**Haven't Had Your Chimney Swept in Years? Here's What to Check Before
Using Your Fireplace Again**

These are **seed topics**, not immutable titles.

Research and editorial review occur before publication.

------------------------------------------------------------------------

## 24. Chimney Sweep Content Principle

When buildup prevents adequate observation:

``` text
Sweep
↓
Improve visibility
↓
Inspect
↓
Explain findings
↓
Recommend appropriate next step
```

Phoenix should not position chimney sweeping merely as passing a brush
through a flue.

The customer should understand the relationship between cleanliness,
visibility, and assessment.

------------------------------------------------------------------------

## 25. Content Safety / Technical Accuracy

DIY guidance must clearly distinguish:

**Safe customer checks** from **work requiring qualified service**.

Gas, combustion, venting, electrical, and fire-safety guidance must not
encourage unsafe intervention.

AI cannot invent technical thresholds, regulatory requirements, or
manufacturer procedures.

------------------------------------------------------------------------

## 26. Reviews

**Google Reviews = primary social-proof authority.**

The real rating is displayed even when imperfect.

A real rating such as **4.6** is acceptable.

Never manufacture a 5.0 representation.

Reviews must:

-   be genuine
-   remain materially faithful to the customer's review
-   not be fabricated
-   link back to Google where appropriate

When reliably known, a review may be associated with:

**City + Service**

------------------------------------------------------------------------

## 27. Evidence

Evidence hierarchy:

``` text
Real Work
+
Before / After
+
From the Field
+
Google Reviews
+
Technical Explanation
```

AI-generated images may support presentation/education where
appropriate.

They are never represented as real Phoenix jobs.

No fake local evidence.

------------------------------------------------------------------------

## 28. SEO Architecture

Phoenix inherits all Canadian Global SEO rules.

Key project rules:

-   city-first revenue architecture
-   one canonical service taxonomy
-   no competing duplicate service models
-   deliberate canonicals
-   qualified indexability
-   meaningful internal linking
-   centralized metadata/schema
-   no mass city substitution
-   no keyword-variant URL generation

------------------------------------------------------------------------

## 29. Indexability

Existing pages awaiting indexing are not justification for uncontrolled
mass changes.

Architecture is corrected deliberately.

Every future indexable page must pass its quality gate.

New cities:

``` text
PLANNED
→ BUILDING / NOINDEX
→ QA READY
→ FULL / INDEXABLE
→ SITEMAP
```

------------------------------------------------------------------------

## 30. Sitemap

Only qualified indexable URLs enter the Phoenix sitemap.

Exclude:

-   unfinished cities
-   admin
-   APIs
-   portal/private routes
-   thank-you
-   noindex content
-   placeholders

City launch triggers sitemap inclusion/update.

------------------------------------------------------------------------

## 31. Portal

Phoenix Customer Portal is a **real product architecture**, not a
disposable mock.

The frontend remains independent from WizField.

``` text
Phoenix Portal
      ↓
Stable Portal API Contract
      ↓
WizField Adapter/API
      ↓
WizField
```

The Portal does not directly query WizField's database.

------------------------------------------------------------------------

## 32. WizField Portal Contract Foundation

Current WizField model is job-centric:

``` text
Organization
└── Customer
    ├── Job
    │   ├── Quote
    │   └── Invoice
    │       └── Payment
    ├── Inspection
    ├── Warranty
    └── Portal Access
```

There is currently **no Property entity**.

Phoenix Portal V1 must not invent a dependency on one.

------------------------------------------------------------------------

## 33. Portal Authentication

Passwordless authentication is preferred.

Customer experience:

``` text
/portal/login
↓
Email / approved identifier
↓
Magic Link
↓
Validate
↓
Portal Session
↓
/portal
```

WizField already provides the underlying magic-link/session
architecture.

Future API work should extend this rather than unnecessarily duplicating
authentication systems.

------------------------------------------------------------------------

## 34. Portal Security

Simple UX does not mean zero authorization.

Portal access must preserve:

-   strong tokens
-   expiry
-   customer binding
-   organization binding
-   server authorization
-   session handling
-   revocation/reuse protection
-   resource-level authorization

Staff authentication remains separate.

------------------------------------------------------------------------

## 35. Portal Future Data

The Portal contract should be capable of consuming:

-   customer identity
-   service address
-   jobs/service history
-   quotes
-   invoices
-   payment ledger
-   inspections
-   reports
-   photos
-   warranty certificates

Internal notes, staff information, and cost data are never exposed
accidentally.

Portal-safe file routes are required for private documents/photos.

------------------------------------------------------------------------

## 36. CRM Status

WizField operational integration is currently:

**DEFERRED / PREPARING**

Do not tightly couple Phoenix production website behaviour to unfinished
WizField functionality.

Design stable boundaries now.

Connect later.

------------------------------------------------------------------------

## 37. Content Ownership

### Owner

Controls business truth and approves strategic changes.

### Architect

Maintains architecture, SEO strategy, taxonomy, standards, and SOT
proposals.

### Engineering Agent

Implements approved decisions.

Cannot independently redefine architecture/business truth.

### Office

Can operate approved content workflows, articles, images, and leads.

Cannot independently modify:

-   service taxonomy
-   city architecture
-   canonical strategy
-   URLs
-   schema architecture
-   SOT

------------------------------------------------------------------------

## 38. Documentation Authority

Hierarchy:

``` text
Canadian Global SOT
↓
Phoenix Project SOT
↓
Feature / Technical Docs
↓
README
↓
Historical Documents
```

Old planning documents remain historical only.

Mark where appropriate:

**HISTORICAL --- NOT AUTHORITATIVE**

------------------------------------------------------------------------

## 39. Documentation Sync

Approved implementation changes that alter documented behaviour require
documentation updates in the same work unit.

**Code ≠ Docs = incomplete work.**

------------------------------------------------------------------------

## 40. Ontario Boundary

Phoenix SOT is focused on Alberta.

Ontario/Apollo receives only the foundation required for future
implementation.

Do not consume Phoenix development time performing unnecessary Ontario
optimization, research, or content production.

Apollo gets its own Project SOT.

------------------------------------------------------------------------

## 41. Success Measurement

Phoenix does not optimize for page count.

Ultimately, we want to know:

``` text
Query
↓
Landing Page
↓
Customer Education
↓
CTA
↓
Lead
↓
Booked Job
↓
Revenue
```

And eventually:

``` text
Province
→ City
→ Service
→ Query/Channel
→ Lead
→ Job
→ Revenue
```

That is the business measurement model.

------------------------------------------------------------------------

## 42. Phoenix Prime Directive

When choosing between:

**More pages** and **better pages** → better pages.

**More keywords** and **better intent** → better intent.

**Aggressive sales claim** and **demonstrated expertise** → demonstrated
expertise.

**Guessing the problem** and **diagnosing the system** → diagnose.

**AI speed** and **business truth** → business truth.

**Traffic** and **profitable qualified work** → profitable qualified
work.

------------------------------------------------------------------------

**PHOENIX PROJECT SOT V1 --- OWNER APPROVED BASELINE**
