# Phoenix WETT Field Report — Product Direction & Build Brief

**Document Type:** Product Direction / Feature Brief  
**Project:** Phoenix Chimney & Fireplace Website  
**Feature:** Mobile WETT Field Report Builder  
**Status:** Direction Approved for Planning  
**Purpose:** Give the coding agent a complete product direction so the agent can inspect the existing Phoenix website architecture and produce a safe, detailed implementation plan before any coding begins.

---

# 1. Executive Summary

Phoenix Chimney & Fireplace needs a dedicated, mobile-first WETT field reporting tool that allows a technician to complete a professional inspection report directly at the job site.

This is not a CRM replacement.

This is not an invoicing system.

This is not a scheduling tool.

This is a focused operational tool whose job is to remove the current reporting bottleneck: the technician should be able to inspect, measure, document, photograph, review, complete, and deliver a polished Phoenix-branded WETT report without waiting for the owner or office to recreate the report later.

The tool will temporarily live inside the Phoenix website infrastructure while the broader WizField workflow continues to mature.

The final experience must feel like a professional inspection workstation, not a basic web form.

---

# 2. Business Objective

The feature must improve Phoenix operations in the following ways:

1. Allow the technician to complete the WETT report while still on site.
2. Reduce customer wait time for inspection documentation.
3. Remove the owner as a reporting bottleneck.
4. Standardize the quality and wording of inspection reports.
5. Reduce missing measurements, missing photos, and incomplete inspection notes.
6. Produce a polished document suitable for homeowners, insurers, real-estate professionals, and internal Phoenix records.
7. Preserve structured inspection data so the workflow can later migrate into WizField without rebuilding the entire reporting model.
8. Improve the perceived professionalism of Phoenix Chimney & Fireplace.

---

# 3. Core Product Principle

The product should be treated as:

> **A mobile WETT inspection workstation that produces a premium Phoenix inspection report.**

It must not feel like:

- a Google Form;
- a generic checklist;
- a basic note-taking page;
- an invoice builder;
- a CRM;
- a customer portal;
- a general technician app.

The technician should interact with structured inspection controls.

The customer should receive a professional report.

Those are two different experiences and both must be designed intentionally.

---

# 4. Scope

## 4.1 Included in V1

V1 should include:

- Protected technician access
- Mobile-first report creation
- New WETT report
- Draft autosave
- Resume draft
- Customer information
- Property information
- Inspection date
- Inspector information
- WETT inspector number
- Appliance/system information
- Structured inspection checklist
- Structured measurement fields
- Hearth measurements in inches
- Protective screen / spark screen observations
- Cleaning requirement / maintenance recommendation
- Condition observations
- Deficiencies
- Technician notes
- Additional comments
- Photo capture/upload
- Photo captions
- Photo-to-finding association
- Visual fireplace/chimney diagrams
- Defect-location highlighting / visual pinning
- AI-assisted professional rewrite
- AI rewrite modes for different audiences
- Final technician review
- Premium Phoenix-branded report preview
- Final report generation
- Professional PDF output
- Customer email delivery
- Phoenix/internal saved copy
- Previous report access
- Report completion state
- Audit fields for original vs AI-rewritten text

---

# 5. Explicit Non-Goals

Do not expand this feature into unrelated systems.

V1 must not include:

- Invoices
- Estimates
- Payments
- Scheduling
- Calendar management
- General CRM features
- Customer relationship management
- Technician payroll
- Inventory
- General job management
- Sales pipeline
- Quoting
- Generic service reports
- Gas fireplace reports
- Chimney repair reports unrelated to this WETT workflow
- Full WizField integration
- Customer portal
- Marketing automation

The feature is **WETT-only**.

---

# 6. Temporary Product Location

Suggested route direction:

`/field/wett`

Possible supporting routes may include:

- `/field/login`
- `/field/wett`
- `/field/wett/new`
- `/field/wett/[reportId]`
- `/field/wett/[reportId]/preview`

The coding agent must inspect the existing Phoenix routing and authentication architecture before deciding the final route structure.

The route must:

- not appear in normal public website navigation;
- not appear in the sitemap;
- be `noindex`;
- be protected from unauthorized public access.

---

# 7. User

Primary user:

**Phoenix WETT technician in the field using a phone.**

Secondary user:

**Phoenix owner/office reviewing completed reports.**

Recipient:

**Homeowner, insurer, real-estate professional, or other authorized recipient.**

---

# 8. Device Priority

The primary device is a smartphone.

The interface must therefore prioritize:

- one-hand operation where practical;
- large touch targets;
- strong spacing;
- minimal typing;
- numeric keypad for measurement fields;
- camera-first photo capture;
- fast section navigation;
- persistent draft saving;
- clear progress state;
- clear unsaved/saved state;
- readable controls outdoors;
- no desktop-only interactions.

Desktop support is useful, but mobile usability is the primary acceptance criterion.

---

# 9. Recommended Workflow

The intended technician flow is:

```text
Technician Login
    ↓
WETT Reports Home
    ↓
New WETT Report
    ↓
Customer & Property
    ↓
Inspection / System Information
    ↓
Measurements
    ↓
Inspection Checklist
    ↓
Findings / Deficiencies
    ↓
Photos / Visual Evidence
    ↓
Technician Notes
    ↓
AI Rewrite (optional)
    ↓
Final Review
    ↓
Phoenix Report Preview
    ↓
Complete Report
    ↓
Generate PDF
    ↓
Save Internal Copy
    ↓
Email Customer
```

The technician must be able to move backward without losing entered data.

---

# 10. Report State Model

Recommended conceptual states:

- `draft`
- `ready-for-review`
- `completed`
- `delivery-failed` or equivalent delivery status
- optional `archived`

A completed report should not silently change after completion.

If editing a completed report is later allowed, the system should preserve revision history or a clear amended-report workflow.

The planning agent should decide whether V1 needs amendment support or whether completed reports should be locked.

---

# 11. Customer & Property Information

The report should support at minimum:

## Customer

- Full name
- Phone
- Email

## Property

- Full street address
- City
- Province
- Postal code

## Inspection

- Inspection date
- Report number
- Inspector name
- WETT inspector number
- Optional inspection type / level if required by the actual Phoenix workflow

Do not invent WETT terminology that is not supported by Phoenix's real inspection process.

---

# 12. Appliance / System Information

The application must contain a structured section for appliance and system information.

Potential fields may include:

- Appliance type
- Fuel type
- Manufacturer
- Model
- Serial number
- Certification / listing information
- Installation type
- Chimney type
- Connector type
- Liner information
- Other identifying information

**Important:** This document defines the product direction, not the final legal/technical WETT checklist.

The coding agent must not invent mandatory WETT fields.

The final field list must be derived from the actual WETT report/form used by Phoenix and any approved inspection requirements supplied by the owner.

---

# 13. Measurement System

Measurements are a major part of the user experience and must be structured, not hidden inside notes.

## 13.1 Hearth Protection

The technician should be able to enter values such as:

- Front hearth extension — inches
- Left-side hearth extension — inches
- Right-side hearth extension — inches

Example mobile UI:

```text
HEARTH PROTECTION

Front Extension
[ 18.0 ] in

Left Side
[ 8.0 ] in

Right Side
[ 8.0 ] in
```

Requirements:

- numeric input;
- support decimals where needed;
- visible unit;
- preferably numeric keypad on mobile;
- values stored as structured numeric data;
- values rendered clearly in the final report.

## 13.2 Other Measurements

The architecture should support additional measurement groups in the future, for example:

- clearances;
- mantel clearances;
- connector clearances;
- appliance clearances;
- chimney-related dimensions;
- other WETT-required measurements.

However, do not create unsupported measurement rules during implementation planning.

---

# 14. Measurement Evaluation Rule

V1 must separate:

**Observed fact**  
from  
**Compliance interpretation**

Example:

```text
Observed:
Front hearth extension = 14 in
```

The system must not automatically label the value compliant/non-compliant unless the applicable requirement has been explicitly defined from an approved source.

This is critical.

The software must never infer a WETT/code result from a measurement based only on generic AI knowledge.

Any future automated compliance evaluation must use an approved ruleset tied to the correct appliance/system/context.

---

# 15. Inspection Checklist

The inspection checklist should be optimized for fast technician use.

Recommended item states:

- Acceptable
- Deficiency
- Not Applicable
- Not Observed / Unable to Verify, if required by the real workflow

Example:

```text
Protective Screen
○ Acceptable
○ Deficiency
○ N/A
```

Selecting `Deficiency` should reveal contextual fields such as:

- Finding description
- Recommendation
- Add photo
- Add measurement
- Severity/category if used
- Additional comment

The checklist should minimize unnecessary typing.

---

# 16. Required Example Inspection Items

The product direction specifically requires support for the following items:

## Hearth

- Front measurement in inches
- Left-side measurement in inches
- Right-side measurement in inches
- Condition notes
- Photo support

## Protective Screen / Spark Screen

- Present: Yes / No / N/A
- Condition: Good / Damaged / Missing / other approved status
- Notes
- Photo support

## Cleaning / Maintenance

- Does the fireplace/appliance require cleaning?
- Yes / No
- Optional maintenance classification
- Technician comment
- Recommendation

## Notes

- General technician notes
- Additional comments
- Finding-specific notes
- Report summary notes

These are product requirements.

The full WETT checklist must still come from the approved Phoenix inspection form/workflow.

---

# 17. Findings and Deficiencies

Findings must be structured records rather than one giant text field.

Each finding should conceptually support:

- Finding ID
- Inspection section
- Component/area
- Observation
- Measurement(s)
- Status/category
- Technician recommendation
- Photo(s)
- Visual diagram location
- Original technician wording
- AI-rewritten wording
- Created timestamp
- Updated timestamp

Possible categories for presentation may include:

- Informational
- Maintenance
- Deficiency
- Safety Concern
- Further Evaluation Recommended

The coding agent must verify whether these category labels are appropriate before treating them as official WETT terminology.

They may be presentation categories rather than WETT classifications.

---

# 18. Technician Notes

The technician needs a fast free-text area.

Field conditions often require short notes such as:

```text
crown has cracks
screen missing
fireplace dirty
hearth front 14 in
recommend cleaning
```

The system must preserve the original technician text.

The technician must never lose the raw field note after using AI rewrite.

---

# 19. AI Professional Rewrite

AI is a writing assistant only.

It is not an inspector.

It is not a compliance engine.

It is not allowed to make inspection decisions.

## 19.1 Rewrite Modes

The application should support at least:

### Standard Professional

Technical, clear, concise, professional field-report language.

### Insurance-Oriented

Formal and objective language emphasizing:

- observed conditions;
- measurements;
- documented deficiencies;
- recommended corrective action;
- inspection limitations;
- factual wording.

### Realtor / Real-Estate Friendly

Professional but easier to understand for:

- homeowner;
- buyer;
- seller;
- realtor.

It should explain the finding clearly without changing its technical meaning.

---

# 20. AI Hard Rules

The AI feature must follow strict constraints.

The AI must not:

- change a measurement;
- invent a measurement;
- change Yes/No values;
- create a deficiency that the technician did not record;
- remove a deficiency;
- change appliance information;
- change manufacturer/model/serial data;
- invent a code requirement;
- invent a WETT requirement;
- declare a system compliant;
- declare a system non-compliant;
- declare a pass/fail result unless explicitly supported by structured technician input and an approved workflow;
- fabricate inspection evidence;
- fabricate photos;
- fabricate customer information;
- fabricate corrective work performed;
- make legal or insurance guarantees.

The AI may:

- improve grammar;
- improve clarity;
- organize technician wording;
- make text more professional;
- make text more concise;
- adapt tone to the selected audience;
- turn shorthand into structured professional sentences.

---

# 21. AI Audit Trail

The system should preserve at minimum:

- `originalTechnicianNote`
- `aiRewrittenNote`
- `aiRewriteMode`
- `aiRewriteTimestamp`
- optional AI model/provider metadata if useful

The technician should be able to:

- accept the rewrite;
- edit it;
- revert to original;
- request another rewrite.

AI output should never silently overwrite the original note.

---

# 22. AI Technical Direction

The existing Phoenix site already contains server-side AI infrastructure.

The planning agent should inspect the current implementation and decide whether to:

- reuse the existing provider/client safely;
- create a dedicated WETT rewrite service;
- isolate the WETT system prompt from article-generation prompts.

The API key must remain server-side.

The rewrite endpoint must validate input and must not expose provider secrets to the browser.

---

# 23. Photos

Photo evidence is a core feature.

The technician should be able to:

- take a photo directly from the phone;
- upload an existing photo;
- preview the photo;
- delete/replace before completion;
- add a caption;
- assign a photo to a finding;
- assign a photo to a diagram area where relevant.

Examples:

- Hearth measurement
- Missing screen
- Crown cracking
- Chimney termination
- Firebox condition
- Flue/connector issue
- Appliance identification plate

---

# 24. Photo Captions

Every final-report image should support a meaningful caption.

Example:

> Photo 2 — Front hearth extension measurement.

or:

> Photo 4 — Cracking observed at chimney crown.

Avoid dumping unlabeled photographs into the report.

---

# 25. Photo Privacy

Inspection photos may contain:

- private property;
- addresses;
- interior home images;
- identifying information.

Therefore:

- WETT report photos should not be treated as public website assets;
- they must not automatically appear in public evidence galleries;
- storage/access architecture must consider privacy;
- report access must be protected;
- public Blob behavior must be reviewed carefully.

The planning agent must inspect the existing storage implementation before proposing the final photo-storage method.

---

# 26. Visual Inspection Diagrams

The final product should include professional visual diagrams.

The goal is to make the report easier to understand and visually stronger.

Recommended diagram types:

## Exterior Chimney Diagram

Possible selectable areas:

- Chimney cap
- Crown
- Flue termination
- Masonry
- Mortar joints
- Flashing
- Chase cover
- Other exterior area

## Fireplace / Wood-Burning System Diagram

Possible selectable areas:

- Hearth
- Firebox
- Damper
- Smoke chamber
- Flue
- Lintel
- Doors / glass
- Protective screen
- Mantel / combustible trim
- Connector
- Appliance body
- Other area

The exact diagrams should be designed around the real Phoenix WETT workflow.

---

# 27. Visual Defect Pinning

This is a premium feature and an important part of the product direction.

When a technician creates a finding, the technician should be able to associate that finding with a visual area.

Example:

```text
Finding #3
Area: Hearth
Observation: Front hearth extension measured at 14 in
Photo: IMG_003
Diagram Marker: A
```

The final report may show:

- highlighted component;
- numbered marker;
- corresponding finding number;
- related photo.

This allows a homeowner, insurer, or realtor to understand the location of a concern quickly.

---

# 28. Diagram Interaction — Mobile

The interaction must remain simple.

Possible workflow:

```text
Add Finding
    ↓
Choose Area
    ↓
[ Hearth ]
[ Firebox ]
[ Damper ]
[ Chimney Crown ]
[ Flashing ]
...
    ↓
Area highlighted on diagram
    ↓
Enter observation
    ↓
Attach photo
```

Avoid requiring precise CAD-like drawing on a phone.

The technician should select logical predefined regions, not perform complex annotation.

---

# 29. Professional Phoenix Report Design

The output report must be premium.

It should visually represent Phoenix Chimney & Fireplace as a professional inspection company.

It must not resemble a browser printout.

## Branding Direction

Use:

- Phoenix logo
- Phoenix brand identity
- dark charcoal / black
- copper / bronze accent
- white or warm-white document background
- restrained professional typography
- consistent spacing
- clear hierarchy
- clean tables
- subtle icons
- page numbering
- branded footer

Avoid:

- excessive color;
- oversized decorative elements;
- consumer-marketing layouts;
- clutter;
- cheap form styling.

---

# 30. Report Cover / Header

Recommended information:

- Phoenix logo
- Phoenix Chimney & Fireplace
- WETT Inspection Report
- Report number
- Inspection date
- Prepared for
- Property address
- Prepared by / Inspector
- WETT inspector number

The first impression must be strong and immediately identifiable.

---

# 31. Executive Summary Page

The report should start with a high-level summary.

Possible summary cards:

- Property
- Inspection date
- Inspector
- System type
- Number of findings
- Number of deficiencies
- Cleaning recommendation
- Further service recommendation

Then show:

## Key Findings

A concise list of major observations.

The summary must be generated from structured technician data, not invented by AI.

---

# 32. Detailed Report Sections

Recommended report organization:

1. Report Header
2. Customer & Property
3. Inspector Information
4. Appliance/System Information
5. Inspection Scope
6. Measurements
7. Inspection Checklist
8. Findings / Deficiencies
9. Maintenance Recommendations
10. Visual Diagram
11. Photo Evidence
12. Additional Comments
13. Inspector Sign-Off
14. Customer Acknowledgement, if used
15. Inspection Scope / Limitation Notice
16. Phoenix Footer / Contact Information

The planning agent may improve the order if there is a strong UX/reporting reason.

---

# 33. Measurement Presentation in Report

Measurements should appear in structured tables.

Example:

| Hearth Measurement | Value |
|---|---:|
| Front extension | 18 in |
| Left side | 8 in |
| Right side | 8 in |

Avoid embedding critical measurements only inside narrative text.

---

# 34. Finding Presentation in Report

Recommended finding format:

```text
Finding 03
Area: Hearth
Category: Deficiency

Observation:
Front hearth extension measured at 14 in.

Recommendation:
[technician-approved wording]

Photo Evidence:
Photo 03

Visual Reference:
Diagram marker C
```

The report must make it easy to connect:

**finding → component → measurement → photo → recommendation**

---

# 35. Inspection Scope / Disclaimer Area

The report should contain a professionally designed scope/limitations section appropriate to the actual WETT inspection being performed.

Do not invent legal text.

Do not invent WETT disclaimers.

The final wording must be supplied or approved from an authoritative/approved source before production use.

The software should provide a dedicated location for this language.

---

# 36. Inspector Sign-Off

The final report should include:

- Inspector name
- WETT inspector number
- Signature or approved sign-off method
- Completion date/time

Optional future support:

- technician credential information;
- digital signature image;
- inspector profile data.

---

# 37. Customer Acknowledgement

If used, customer acknowledgement should be clearly distinguished from:

- technical approval;
- WETT certification;
- legal acceptance of defects.

Possible fields:

- Customer name
- Signature
- Date/time

The final wording should be intentionally drafted and approved.

---

# 38. Autosave

Autosave is mandatory.

Field conditions may involve:

- poor cellular service;
- browser refresh;
- accidental closing;
- phone interruptions;
- camera switching.

The technician must not lose 20–30 minutes of inspection data.

Requirements:

- automatic draft saving;
- visible `Saved` state;
- retry behavior if network fails;
- ability to resume an incomplete report;
- no silent data loss.

The planning agent must decide the safest V1 autosave architecture.

---

# 39. Offline / Weak-Signal Consideration

True offline mode is not mandatory unless the planning agent determines it can be implemented safely within scope.

However, V1 must at least handle weak connectivity gracefully.

The plan should evaluate:

- local temporary state;
- retry queues;
- upload retry;
- unsaved-data warning;
- network-error feedback.

Do not silently discard photos or measurements when connectivity fails.

---

# 40. Final Review

Before completion, the technician must see a review screen containing:

- missing required fields;
- measurements;
- findings;
- deficiencies;
- photos;
- AI-rewritten notes;
- customer email;
- inspector information.

The technician should be able to return to the relevant section to correct issues.

---

# 41. Completion Gate

The report should not complete if required information is missing.

The final required-field list must be derived from the approved WETT workflow.

Potential gate examples:

- property address present;
- inspector present;
- inspection date present;
- required checklist complete;
- required measurements present;
- deficiency description present where deficiency selected;
- required inspector sign-off completed.

Do not invent mandatory WETT fields without owner/approved-source confirmation.

---

# 42. Completion Behavior

On final completion, the intended system behavior is:

1. Validate report
2. Save final structured report
3. Mark report completed
4. Generate final Phoenix report
5. Generate/download PDF
6. Save internal Phoenix copy
7. Send customer email
8. Record delivery status
9. Show technician success confirmation

The planning agent should define transaction/error behavior so that partial failures are recoverable.

Example:

If PDF succeeds but email fails, the completed report must not disappear.

---

# 43. Email Delivery

The customer email should be professional and simple.

Possible content:

- Phoenix branding
- customer name
- property address
- inspection date
- report number
- short delivery message
- PDF attachment or protected report link, depending on implementation

The system must record:

- delivery status;
- failure reason if relevant;
- timestamp.

The existing Phoenix email infrastructure should be inspected and reused where appropriate.

---

# 44. Previous Reports

The technician/authorized Phoenix user should have a simple report list.

Recommended display:

- Report number
- Customer name
- Property
- Inspection date
- Status
- Delivery status

Actions may include:

- View
- Continue draft
- Open completed report
- Download PDF
- Resend email, if approved for V1

Keep this simple.

This is not a CRM customer database.

---

# 45. Report Numbering

The system should generate a Phoenix-specific report identifier.

Example format direction:

`PHX-WETT-2026-00152`

The final format should be decided during planning.

Requirements:

- unique;
- stable;
- readable;
- not dependent on client-side random generation only;
- suitable for customer communication and internal lookup.

---

# 46. Data Architecture Direction

The data structure should be intentionally designed so the information can later migrate into WizField.

Conceptual shape:

```text
report
  id
  reportNumber
  status
  version

customer
  name
  phone
  email

property
  address
  city
  province
  postalCode

inspection
  date
  inspector
  wettNumber
  type

system
  applianceType
  manufacturer
  model
  serial
  fuelType
  chimneyData
  otherStructuredFields

measurements
  hearthFront
  hearthLeft
  hearthRight
  additionalMeasurements[]

checklist[]

findings[]
  id
  area
  category
  observation
  recommendation
  measurements[]
  photoIds[]
  diagramRegion
  originalTechnicianNote
  aiRewrittenNote
  aiRewriteMode

photos[]

signOff

delivery
  emailStatus
  sentAt

audit
  createdAt
  updatedAt
  completedAt
```

This is a direction, not the final schema.

The planning agent should propose the final data model after inspecting the current site architecture.

---

# 47. Future WizField Compatibility

V1 should remain isolated from WizField operationally.

However, design choices should make future migration straightforward.

Avoid:

- storing everything as one HTML blob;
- storing measurements only in prose;
- storing findings only in PDF;
- using report structure that cannot be mapped to jobs/customers/inspection records.

Prefer:

- stable structured fields;
- stable report IDs;
- normalized findings;
- measurement objects;
- photo metadata;
- timestamps;
- explicit status values.

---

# 48. Security

This feature handles customer PII and private property information.

Security requirements include:

- protected route;
- authenticated access;
- secure session handling;
- server-side authorization;
- no public report enumeration;
- no sitemap inclusion;
- no search indexing;
- no public exposure of private photo assets;
- server-side validation;
- safe email/report access;
- no AI API secrets in the client;
- no sensitive data exposed through analytics.

The planning agent must inspect the existing Phoenix authentication and storage architecture before proposing implementation details.

---

# 49. Analytics

This is an internal operational tool.

Public marketing analytics should not collect private report details.

Avoid sending:

- customer name;
- address;
- email;
- inspection notes;
- report content;
- measurements;
- photo information

to GA or public analytics platforms.

If operational events are useful, they should contain non-sensitive event metadata only.

---

# 50. Performance

Field use must be fast.

Targets should include:

- fast mobile load;
- minimal unnecessary JavaScript;
- efficient photo handling;
- image compression where appropriate;
- no full-page reload after every field;
- responsive autosave;
- clear upload progress;
- graceful handling of large mobile photos.

---

# 51. UX Quality Standard

The technician UI should feel:

- fast;
- calm;
- structured;
- premium;
- obvious;
- hard to misuse.

The report output should feel:

- authoritative;
- professional;
- visually organized;
- insurance-friendly;
- real-estate-friendly;
- Phoenix-branded.

The tool is successful only if both sides are strong.

---

# 52. Visual Design Direction

## Technician Interface

Use:

- cards;
- section progress;
- large segmented controls;
- large numeric fields;
- sticky navigation where useful;
- clear Save state;
- large Add Photo buttons;
- minimal unnecessary text;
- high contrast;
- clear error states.

## Report

Use:

- A4/Letter-compatible report layout;
- Phoenix header;
- structured information blocks;
- measurement tables;
- finding cards;
- photo grids;
- diagram callouts;
- page footer;
- page number;
- report number repeated where useful.

The planning agent should determine whether the final canonical format should target Letter, A4, or a layout compatible with both based on Phoenix operations in Canada.

---

# 53. Premium Features That Should Be Preserved in the Plan

The implementation plan must account for these product-defining features:

1. Mobile-first technician workflow
2. Hearth measurement inputs in inches
3. Screen/protective barrier observations
4. Cleaning/maintenance requirement
5. Structured findings
6. Photo evidence with captions
7. Finding-to-photo association
8. Chimney/fireplace visual diagrams
9. Visual defect pinning / component highlighting
10. AI professional rewrite
11. Insurance rewrite mode
12. Realtor rewrite mode
13. Original-note preservation
14. Premium Phoenix-branded report
15. Executive summary
16. Professional PDF
17. Autosave/resume
18. Secure report storage
19. Customer email delivery
20. WizField-ready structured data

Do not silently remove these to simplify the build.

If any item creates a major technical risk, the planning agent should flag it and propose a phased implementation rather than deleting it.

---

# 54. Important Technical Boundary

The existing Phoenix website is a production marketing site.

The WETT tool must be implemented as an isolated operational surface.

Do not casually refactor:

- public pages;
- SEO architecture;
- lead flow;
- article system;
- marketing components;
- sitemap;
- city system;
- unrelated admin features.

Use the smallest safe integration footprint possible.

---

# 55. Existing Phoenix Architecture — Planning Context

The agent must inspect the current Phoenix Source of Truth and production code before planning.

Known current architecture includes:

- Next.js App Router
- React
- TypeScript
- Tailwind
- Zod validation
- existing custom auth/session patterns
- Vercel deployment
- Vercel Blob storage
- existing encrypted operational JSON storage
- existing email infrastructure
- existing server-side AI infrastructure
- existing admin/office route protection patterns

The plan should reuse proven infrastructure where safe instead of introducing unnecessary new platforms.

However, the agent must not assume every existing mechanism is suitable for private WETT reports or private photos.

---

# 56. Things the Planning Agent Must Not Invent

The agent must not invent:

- WETT legal requirements;
- mandatory inspection checklist items;
- pass/fail criteria;
- code clearances;
- appliance-specific requirements;
- certification wording;
- insurance guarantees;
- official disclaimer language;
- inspector credential rules;
- automatic compliance decisions.

Where product implementation depends on those items, the agent must mark them as:

**OWNER / SOURCE INPUT REQUIRED**

and design the software so those approved values can be inserted cleanly.

---

# 57. Planning Phase — Required Agent Task

After reading this document, the coding agent must **NOT immediately build the feature**.

The next task is to create a separate implementation plan Markdown file.

Suggested filename:

`PHOENIX_WETT_FIELD_REPORT_IMPLEMENTATION_PLAN.md`

The plan must be based on:

1. This Product Direction document
2. `PHOENIX-WEBSITE-TECHNICAL-SOT.md`
3. `AI_WORKFLOW_RULES.md`
4. `OWNER_FEATURE_CHECKLIST_EN.md`
5. Inspection of the actual current repository/code
6. The real WETT form/checklist supplied by the owner, if available

---

# 58. Required Contents of the Implementation Plan

The implementation plan must include:

## A. Current-State Inventory

- relevant routes;
- auth system;
- storage system;
- upload system;
- email system;
- AI system;
- report/PDF capabilities if any;
- admin patterns;
- protected files;
- relevant dependencies.

## B. Proposed Architecture

- route structure;
- component structure;
- server/API structure;
- storage strategy;
- report data model;
- photo storage strategy;
- AI rewrite architecture;
- PDF/report generation strategy;
- email delivery flow;
- auth/authorization strategy;
- autosave strategy.

## C. Exact File Plan

For every file:

- path;
- new or existing;
- purpose;
- risk level;
- protected area: yes/no;
- reason it is required.

## D. Data Model

Full proposed report schema, including:

- customer;
- property;
- inspection;
- measurements;
- checklist;
- findings;
- photos;
- diagrams;
- AI note versions;
- sign-off;
- delivery;
- audit metadata.

## E. UX Plan

Screen-by-screen:

- login;
- report list;
- new report;
- each inspection section;
- measurements;
- findings;
- photos;
- AI rewrite;
- preview;
- completion;
- success state.

## F. Premium Report Plan

Define:

- report pages;
- Phoenix branding;
- executive summary;
- data tables;
- finding cards;
- diagram system;
- photo layout;
- footer/header;
- sign-off;
- page numbering;
- PDF technology.

## G. AI Rewrite Plan

Define:

- endpoint;
- input;
- output;
- system prompt rules;
- factual-lock behavior;
- audit behavior;
- modes;
- validation;
- failure behavior.

## H. Visual Diagram Plan

Define:

- diagram source/assets;
- regions;
- selection model;
- highlighting;
- finding association;
- PDF rendering.

## I. Security Plan

Include:

- authentication;
- authorization;
- route protection;
- private photos;
- PII;
- indexing;
- analytics;
- AI privacy;
- report access.

## J. Reliability Plan

Include:

- autosave;
- upload retry;
- network interruption;
- partial completion;
- email failure;
- PDF failure;
- recovery behavior.

## K. Testing Plan

At minimum:

- mobile layout;
- numeric inputs;
- autosave;
- draft recovery;
- photo upload;
- finding-photo linking;
- AI rewrite factual preservation;
- PDF generation;
- report layout;
- email delivery;
- auth;
- unauthorized access;
- noindex;
- build;
- regression against public website.

## L. Release Plan

Include:

- development/staging verification;
- rollback point;
- production deployment;
- smoke test;
- first live technician test.

## M. Open Questions / Owner Decisions

The agent must separate:

- technical decisions it can recommend;
- product decisions requiring owner approval;
- WETT content requiring authoritative input.

---

# 59. Plan Quality Requirement

The implementation plan must be detailed enough that a strong coding AI can execute it phase by phase without redesigning the feature during implementation.

The plan must not be vague.

Bad:

> Build the WETT form and add AI.

Good:

> Create the mobile report shell, define draft persistence, implement the structured measurement group, build finding records, add private photo upload, add AI rewrite endpoint with immutable source facts, build branded report renderer, then add final completion/delivery flow.

---

# 60. Recommended Build Phasing

The planning agent should decide the final phases after repository inspection, but the likely direction is:

### Phase 0 — Inventory / Safety
Understand current code and protected surfaces.

### Phase 1 — WETT Data Model & Storage
Create structured report model and persistence.

### Phase 2 — Auth & WETT Route Shell
Protected field area.

### Phase 3 — Mobile Report Builder
Customer/property/system/measurements/checklist.

### Phase 4 — Findings & Photos
Structured findings and private evidence.

### Phase 5 — Autosave & Draft Recovery
Field reliability.

### Phase 6 — AI Rewrite
Professional/insurance/realtor modes.

### Phase 7 — Visual Diagrams
Component mapping and problem highlighting.

### Phase 8 — Phoenix Report Renderer
Premium branded report.

### Phase 9 — PDF & Delivery
PDF generation, email, status tracking.

### Phase 10 — QA & Production Release
Mobile field test and production verification.

The planning agent may reorganize these phases based on dependencies discovered in the codebase.

---

# 61. Definition of Done

The feature is complete when a Phoenix WETT technician can:

1. Open the protected WETT field tool on a phone.
2. Start a report.
3. Enter customer/property information.
4. Record system information.
5. Enter hearth measurements in inches.
6. Record screen/protective-barrier status.
7. Record cleaning/maintenance requirements.
8. Complete the approved WETT checklist.
9. Create structured findings.
10. Take and attach photos.
11. Associate findings with system/chimney diagram regions.
12. Write field notes.
13. Use AI to rewrite notes professionally without changing facts.
14. Review the complete report.
15. See a premium Phoenix-branded report preview.
16. Complete and lock the report.
17. Generate a professional PDF.
18. Send the report to the customer.
19. Confirm delivery status.
20. Reopen the saved Phoenix copy later.

And the public Phoenix website must continue operating normally.

---

# 62. Final Product Standard

This feature should make Phoenix look more professional than a typical small chimney/fireplace contractor.

The technician experience must reduce work.

The report must increase trust.

The structured data must support future automation.

The system must protect customer information.

The AI must improve language without becoming the inspector.

The product should feel like a focused professional inspection platform temporarily hosted inside Phoenix's existing website infrastructure.

---

# 63. Instruction to the Coding Agent

**Do not code yet.**

Read this document and the project Source of Truth.

Inspect the current repository.

Then create:

`PHOENIX_WETT_FIELD_REPORT_IMPLEMENTATION_PLAN.md`

The plan must explain exactly how to build this feature safely inside the existing Phoenix website.

Identify all files that will be created or modified.

Identify protected areas.

Identify risks.

Identify owner decisions.

Identify WETT-content gaps that require the real inspection form or authoritative source.

Propose the implementation phases.

Propose the testing and rollback plan.

Only after the owner approves that implementation plan should coding begin.

---

# 64. Product Rule

> **The technician records facts.  
> The system organizes facts.  
> AI improves language.  
> The report communicates the facts professionally.**

That rule must remain true throughout the implementation.
