# PHOENIX WETT RUNTIME KNOWLEDGE PACK

**STATUS:** IMPLEMENTATION INPUT — V1  
**BUSINESS:** PHOENIX CHIMNEY & FIREPLACE  
**JURISDICTION:** ALBERTA, CANADA  
**PRIMARY USE:** Phoenix `/admin/office/wett` mobile field-report system  
**LAST SOURCE VERIFICATION:** 2026-09-22  
**SOURCE PACKAGE:** `docs/WETT_package/01` through `10`  
**DO NOT USE FOR:** Ontario / Apollo runtime decisions

---

# 1. Purpose

This file converts the verified WETT research package into an implementation-ready runtime model for the Phoenix WETT field-report application.

The source research remains authoritative for technical detail.

This runtime file exists to answer implementation questions such as:

- What should the technician see?
- What fields should be captured?
- Which fields are measurements?
- Which fields are evidence?
- Which items can be N/A?
- Which conditions should create a finding?
- When should UTI be available?
- When is manufacturer lookup required?
- Which source layer controls the conclusion?
- What may AI rewrite?
- What may AI never decide?
- What is required before a report can be finalized?

This file is **not** an independent building code, fire code, CSA standard, manufacturer manual, or WETT SOP.

---

# 2. Hard Runtime Locks

## 2.1 Business / Province Lock

Phoenix runtime is:

```text
Business = PHOENIX
Province = Alberta
```

If runtime input identifies another province:

```text
STOP TECHNICAL CLASSIFICATION
PROVINCE SOURCE CONFLICT — HUMAN REVIEW REQUIRED
```

Do not import Ontario-specific rules, amendments, standards editions, Ottawa processes, or Apollo field logic into Phoenix.

---

## 2.2 Current Alberta Source Lock

For Phoenix, source routing must use:

1. WETT common methodology
2. Alberta legal/code layer
3. Alberta-referenced standards
4. Exact manufacturer documentation
5. Applicable municipal process where material
6. Phoenix field experience, clearly identified as field experience

Current Alberta source framework from the verified package:

- National Building Code — 2023 Alberta Edition, 2nd printing
- National Fire Code — 2023 Alberta Edition, 2nd printing
- CSA B365-17 as the Alberta-referenced B365 edition
- CAN/ULC-S610:2018 for factory-built fireplace systems
- ULC-S628-93 for fireplace inserts
- CAN/ULC-S629:2016 for 650°C factory-built chimneys
- CAN/ULC-S639-M87 where applicable to steel liner assemblies

**Do not substitute the newest commercial standard edition merely because it is newer.**

---

## 2.3 Manufacturer Lock

For listed/certified appliances and systems:

```text
Appliance label
→ exact brand/model/suffix
→ serial/manufacturing data where relevant
→ exact manual revision
→ certification/listing
→ model-specific requirement
→ Alberta legal layer
→ inspector finding
```

Never use:

- another model's manual;
- a retailer summary;
- a forum;
- visual resemblance;
- AI-generated specifications

as the controlling source.

If exact identification cannot be established:

```text
MANUFACTURER LOOKUP REQUIRED
```

If the requirement still cannot be established:

```text
NOT VERIFIED
```

If label/manual sources conflict:

```text
SOURCE CONFLICT — MANUFACTURER REVIEW REQUIRED
```

---

# 3. Human Authority / Release Control

## 3.1 AI Is Not the Inspector

AI may:

- organize facts;
- identify missing data;
- identify the source route;
- rewrite technician notes;
- draft professional wording;
- draft UTI wording;
- draft recommendations;
- produce customer-facing summaries.

AI may not:

- invent facts;
- invent measurements;
- invent photos;
- invent models;
- invent code clauses;
- invent manufacturer requirements;
- infer compliance from missing evidence;
- silently alter the technician's observation;
- release a final report.

---

## 3.2 Final Release

Every final WETT inspection report requires approval by the responsible WETT-certified human inspector.

The software must distinguish:

```text
FIELD CAPTURE
```

from:

```text
INSPECTOR CLASSIFICATION / FINAL RELEASE
```

A user may assist with data capture if Phoenix permits it operationally, but the system must not represent an unapproved data-capture record as a final WETT inspection report.

Suggested runtime capabilities:

```text
capture
classify
finalize
```

The person performing final classification/release must be recorded in:

```text
inspection.responsibleInspector
inspection.wettNumber
audit.completedBy
signOff
```

---

# 4. WETT SITE® Inspection Levels

Runtime selection is mandatory before technical classification.

Allowed values:

```text
visual
technical
invasive
```

Display labels:

### Visual Inspection — Readily Accessible

Typical runtime boundary:

- visible/readily accessible components;
- visible clearances;
- ground-accessible dampers/cleanouts;
- chimney observation from ground;
- basic tools;
- no required destructive access.

### Technical Inspection — Accessible

May include recorded access through:

- ladders;
- roof access;
- attic access;
- panels/doors;
- flue-pipe disassembly;
- cleanout access;
- hand tools.

### Invasive Inspection — Concealed Accessibility

May include:

- opening walls/ceilings;
- invasive chimney access;
- specialty equipment;
- destructive access;
- work requiring explicit client agreement.

## Critical Runtime Rule

The software must never infer inspection level from:

- photo count;
- amount of detail;
- technician notes;
- apparent access.

It must be explicitly selected and stored.

---

# 5. WETT Report Status Vocabulary

For applicable WETT report items, only these WETT statuses are allowed:

```text
compliant
not-compliant
not-applicable
unable-to-inspect
```

Display:

- Compliant
- Not Compliant
- Not Applicable
- Unable to Inspect (UTI)

The following are **workflow states**, not WETT report statuses:

```text
NOT VERIFIED
MANUFACTURER LOOKUP REQUIRED
CASE-SPECIFIC DETERMINATION REQUIRED
SOURCE CONFLICT — HUMAN REVIEW REQUIRED
BUSINESS / PROVINCE CONFLICT — HUMAN REVIEW REQUIRED
INCOMPLETE INPUT
```

Do not turn workflow states into a fifth WETT status.

---

# 6. Core Evidence Model

Every material inspection item should support these evidence states:

```text
OBSERVED
MEASURED
DOCUMENTED
PHOTO-SUPPORTED
SOURCE-VERIFIED
CLASSIFIED BY INSPECTOR
UTI
N/A
NOT VERIFIED
MANUFACTURER LOOKUP REQUIRED
CASE-SPECIFIC DETERMINATION REQUIRED
SOURCE CONFLICT
```

Runtime rule:

```text
Observation != Requirement
Requirement != Classification
Classification != Recommendation
```

These layers must remain separate in storage and report generation.

---

# 7. Runtime Item Schema

Every configurable inspection item should conceptually support:

```yaml
id:
systemTypes: []
section:
label:
shortInstruction:
detailedInstruction:
inspectionLevels: []
inputType:
unit:
requiredForCapture:
requiredForFinalization:
statusAllowed: true
photoPolicy:
measurementPolicy:
manufacturerDependent:
historicalApplicabilitySensitive:
authorityRoute: []
conditional:
findingOn:
utiAllowed:
naAllowed:
reportSection:
sourceRefs: []
```

Recommended `inputType` values:

```text
boolean
yes-no-na
select
multi-select
text
long-text
number
measurement
status
photo
document
date
```

---

# 8. Universal Report Intake

These fields should exist before system-specific inspection begins.

## 8.1 Client / Property

```text
Customer name
Customer phone
Customer email
Inspection address
Municipality
Province = Alberta
Business = Phoenix
```

Province should be fixed to Alberta for Phoenix runtime unless an admin intentionally creates a non-Phoenix test record.

---

## 8.2 Inspection Context

Capture:

```text
Inspection date
Inspection level
Reason for inspection
Responsible inspector
WETT number
```

Reason options:

```text
Insurance
Real Estate
Personal / Peace of Mind
AHJ / Authority Request
Post-Fire
Follow-Up
Other
```

Do not infer inspection level from reason.

---

## 8.3 System Intake

Capture:

```text
System type
Appliance type
Manufacturer
Model
Model suffix
Serial
Manufacturing date if available
Certification/data label status
Certification/listing information
Manufacturer manual available?
Manual title/part/revision if established
Installation date:
  known
  estimated
  unknown
Last major alteration
Chimney type
Chimney manufacturer/series if applicable
Liner type
Connector type
Prior WETT report available?
Permit information available?
Known chimney fire?
Known smoke spillage?
Known water leak?
Known repair?
```

Unknown values remain unknown.

Do not auto-fill appliance identity from appearance.

---

# 9. System Types Supported in Phoenix V1

The verified system library provides four primary workflows:

```text
wood-stove
fireplace-insert
masonry-fireplace
factory-built-fireplace
```

Display:

1. Wood Stove
2. Fireplace Insert / Hearth-Mounted Stove
3. Masonry Fireplace
4. Factory-Built Fireplace

Pellet / other solid-fuel systems remain deferred unless Phoenix explicitly adds them.

Do not reuse the wood-stove workflow for pellet equipment.

---

# 10. Universal Field Sequence

For every system, guide the user through:

```text
1. Confirm inspection level
2. Confirm safe inspection conditions
3. Client/system intake
4. Identify appliance/system
5. Determine authority route
6. Inspect system-specific sections
7. Record measurements
8. Capture evidence/photos
9. Classify applicable items
10. Record UTI where access prevented inspection
11. Record manufacturer lookup / not verified where source is missing
12. Create findings
13. Review missing data
14. Inspector review
15. Final report
```

The application should not jump directly from a visual symptom to pass/fail.

---

# 11. Pre-Inspection Safety Gate

Before ordinary checklist work, capture:

```text
Appliance actively burning? yes/no
System cool enough for inspection? yes/no
Safe access available? yes/no
Roof/ladder conditions acceptable if required? yes/no/na
Immediate hazard observed? yes/no
```

If an immediate hazard is observed:

- record condition;
- attach photo where safely possible;
- allow explicit "Discontinue use recommended" only when inspector supports it;
- allow escalation to Technical/Invasive/specialist evaluation;
- do not invent concealed damage.

---

# 12. Universal Photo Evidence Policy

The research package establishes an internal Phoenix evidence set.

This is **not to be represented as the official current WETT mandatory-photo SOP**.

Internal evidence should normally include where applicable:

1. Wide system overview
2. Appliance/fireplace opening
3. Certification/data label
4. Flue-pipe / connector route
5. Chimney exterior
6. Termination
7. Hearth/floor protection
8. Critical combustible clearances
9. Each material deficiency
10. Photographable UTI/access limitation
11. Manufacturer/chimney-system labels
12. Crown/cap/flashing for masonry chimney

Runtime label should say:

```text
Phoenix Evidence Photo
```

not:

```text
WETT Mandatory Photo
```

unless Phoenix later imports the official current WETT Inspection SOP photo schedule.

---

# 13. Photo Capture Model

Every photo record should support:

```text
photoId
reportId
caption
component
section
findingIds[]
checklistItemIds[]
diagramRegionIds[]
evidenceType
uploadedAt
uploadedBy
```

Suggested `evidenceType` values:

```text
overview
identification-label
measurement
component
deficiency
access-limitation
manufacturer-label
chimney-exterior
termination
hearth
other
```

Photo binary data remains private.

---

# 14. System Workflow — Wood Stove

## 14.1 Sections

Use these sections in order:

1. Identify Appliance
2. Overall Installation Configuration
3. Hearth / Floor Protection
4. Walls / Appliance Clearances
5. Flue Pipe / Connector
6. Masonry Chimney Branch
7. Factory-Built Chimney Branch
8. Chimney Termination
9. Appliance Physical Condition
10. Combustion Air / Depressurization
11. Fire Code / Ongoing Maintenance
12. Measurements
13. Photos
14. Findings / Escalation
15. Final Item Status Review

---

## 14.2 Identify Appliance

Capture:

```text
Brand
Model
Model suffix
Serial
Fuel type
Certification label present?
Certification label legible?
Certification/test standard if readable
Manufacturer manual identified?
Manual revision identified?
Mobile-home approval relevant?
Alcove approval relevant?
```

Evidence:

```text
Full appliance photo
Data/certification label photo
Model/serial photo
```

Conditional:

If label/model cannot be established:

```text
MANUFACTURER LOOKUP REQUIRED
```

Do not create model-specific clearance conclusions.

---

## 14.3 Overall Installation Configuration

Capture:

```text
Freestanding position
Wall / corner / alcove
Room type
Floor material
Nearby wall materials
Connector type
Chimney type
Chimney route
Number of appliances on chimney if known/observable
```

Evidence:

- wide photo including stove, walls, floor and connector.

---

## 14.4 Hearth / Floor Protection

Capture structured observations:

```text
Noncombustible protection present?
Continuity intact?
Gaps/joints observed?
Combustible floor exposed?
Raised appliance?
Product label visible?
Thermal protection requirement established?
Ember protection requirement established?
R-value requirement established?
```

Measurements:

```text
Front extension — inches
Left-side extension — inches
Right-side extension — inches
Rear extension — inches, when applicable
Pad thickness/height — only when technically relevant
```

Photos:

- whole hearth;
- front measurement;
- side measurement;
- exposed edge/layers where relevant;
- product label where present.

Critical runtime rule:

```text
Noncombustible appearance != proof of thermal adequacy
```

Do not automatically classify tile, sheet metal, masonry, or a large pad as adequate without the governing requirement.

---

## 14.5 Walls / Appliance Clearances

Nearby surfaces may include:

```text
drywall over wood framing
wood panel
trim
shelf
corner framing
ceiling
alcove surfaces
other combustible construction
```

Capture:

```text
Rear clearance
Left clearance
Right clearance
Corner clearance
Ceiling / alcove clearance where applicable
Shield present?
Shield type
Shield spacing/air gap
Shield ventilation
Manufacturer-approved shield?
```

Measurement photos should show controlling clearances.

Manufacturer certified clearance controls where applicable.

Do not substitute generic B365 values where model-specific certified values control.

---

## 14.6 Flue Pipe / Connector

Capture:

```text
Single-wall / listed double-wall / other
Manufacturer if listed system
Diameter
Material
Route
Horizontal run
Elbows
Wall/chimney entry
Joint condition
Joint orientation
Fastening
Support
Slope/rise where material
Corrosion
Holes
Deformation
Leakage staining
Cleaning access
Clearance to combustibles
Wall penetration / thimble configuration
```

Measurements where material:

```text
Diameter
Controlling combustible clearance
Horizontal run
Slope/rise
Ceiling/wall distance
```

Photos:

- full route;
- representative joint;
- wall/thimble pass-through;
- critical clearance;
- damage/corrosion if present.

If connector transition disappears into concealed construction and cannot be verified:

```text
UTI
```

or:

```text
MANUFACTURER / SYSTEM LOOKUP REQUIRED
```

depending on the actual missing information.

---

## 14.7 Masonry Chimney Branch

Apply when chimney type is masonry.

Capture:

```text
Visible masonry construction
Liner presence/type where visible
Liner condition where visible
Thimble
Cleanout
Abandoned openings
Masonry condition
Stability
Crown/cap
Flashing
Roof termination
Visible combustible clearance
Water evidence
```

Critical rule:

Most liner length and framing clearances may be concealed.

Do not mark concealed liner/framing compliant from exterior appearance.

UTI must be available.

---

## 14.8 Factory-Built Chimney Branch

Apply when chimney is factory-built.

Capture:

```text
Manufacturer
Series/model
Diameter
Labels
Support components
Ceiling support
Wall support
Attic insulation shield
Firestop
Roof support
Flashing
Storm collar
Termination
Component compatibility
```

If components appear mixed or cannot be identified:

```text
MANUFACTURER LOOKUP REQUIRED
```

and where compatibility cannot be established:

```text
NOT VERIFIED
```

---

## 14.9 Wood Stove Fire Code / Maintenance

Capture:

```text
Combustible deposits observed?
Deposit severity description
Cleaning recommended?
Known chimney fire?
Known smoke spillage?
Evidence of dangerous condition?
```

Alberta rule:

- chimney/flue/flue pipe inspection duty is tied to intervals not greater than 12 months, appliance addition, and after chimney fire;
- cleaning is as often as necessary to prevent dangerous combustible deposit accumulation.

Do not generate:

```text
Alberta law requires one sweep every year
```

---

# 15. System Workflow — Fireplace Insert / Hearth-Mounted Stove

## 15.1 Sections

1. Identify Insert
2. Identify Original Fireplace
3. Original Fireplace Suitability
4. Permanent / Warning Label
5. Liner Identification
6. Liner Connection at Insert
7. Top Termination
8. Hearth / Floor Protection
9. Surround / Facing / Mantel
10. Original Damper / Fireplace Modification
11. Chimney
12. Cleaning / Inspection Access
13. Hidden / Concealed Areas
14. Measurements
15. Photos
16. Findings / Escalation
17. Final Item Status Review

---

## 15.2 Identify Insert

Capture:

```text
Brand
Model
Serial
Certification label
Listing standard
Manual
Manual revision
Insert vs hearth-mounted configuration
```

If model cannot be positively identified:

```text
MANUFACTURER LOOKUP REQUIRED
```

Do not use a similar model manual.

---

## 15.3 Identify Original Fireplace

Capture:

```text
Original fireplace type
Masonry / factory-built
Original firebox condition
Original chimney type
Opening dimensions where material
Evidence of previous modifications
```

If factory-built original fireplace:

Exact insert compatibility may depend on both insert and original fireplace manufacturer/listing.

---

## 15.4 Permanent / Warning Label

Capture:

```text
Required label present?
Label wording/type identifiable?
Label accessible?
```

Do not invent a missing-label procedure beyond verified source material.

Where exact current WETT procedure is unresolved:

```text
HUMAN REVIEW REQUIRED
```

---

## 15.5 Liner Identification

Capture:

```text
Liner present?
Liner material
Diameter
Manufacturer/system identity if available
Continuous liner established?
Visible condition
Top condition
Connection method visible?
```

Concealed portions remain UTI unless inspection level/access supports evaluation.

---

## 15.6 Liner Connection at Insert

Capture:

```text
Connection visible?
Adaptor type
Fastening visible?
Secure attachment verified?
Seal/fit condition
Connection modified?
```

If surround prevents visibility at Visual level:

```text
UTI
```

Do not infer connection quality because a stainless liner is visible above the insert.

---

## 15.7 Hearth / Floor Protection — Insert

Capture:

```text
Existing hearth type
Front protection
Side protection
Continuity
Combustible exposure
Manufacturer requirement established?
Thermal vs ember requirement established?
```

Measurements:

```text
Front extension
Left extension
Right extension
Other manufacturer-specific geometry
```

Photos:

- whole hearth;
- front measurement;
- side measurement;
- edge/construction where relevant.

---

## 15.8 Surround / Facing / Mantel

Capture:

```text
Surround installed
Facing material
Mantel present
Combustible trim present
Sidewall condition
Measured clearances
Manufacturer-required geometry established?
```

Manufacturer instructions are primary for model-specific requirements.

---

## 15.9 Original Damper / Fireplace Modification

Capture:

```text
Damper present / removed / modified
Modification visible
Permanent modification documented
Original fireplace damage
Alteration needed for insert/liner route
```

Do not assume modification is acceptable without source support.

---

## 15.10 Hidden / Concealed Areas

Examples:

```text
liner behind surround
liner through chimney
insert connection
original smoke chamber
original damper area
hidden factory-built fireplace cavity
```

Use UTI when access is outside the contracted level.

Do not use N/A simply because the area is hidden.

---

# 16. System Workflow — Masonry Fireplace

## 16.1 Sections

1. Confirm Site-Built Masonry System
2. Firebox
3. Hearth
4. Fireplace Opening / Combustible Trim
5. Damper
6. Smoke Chamber
7. Flue / Liner
8. Chimney Masonry
9. Crown / Cap
10. Rain Cap / Termination Device
11. Flashing / Roof Intersection
12. Chimney Height / Termination
13. Cleanout
14. Chimney Clearance to Combustibles
15. Water-Related Deterioration
16. Alberta Combustion-Air Gate
17. Measurements
18. Photos
19. Findings / Escalation
20. Final Item Status Review

---

## 16.2 Confirm Site-Built Masonry

Do not classify a unit as masonry simply because it has stone/brick facing.

Capture:

```text
System construction identified?
Factory-built components observed?
Metal firebox/chassis observed?
Certification label found?
```

If uncertain:

```text
SYSTEM TYPE NOT VERIFIED
HUMAN REVIEW REQUIRED
```

---

## 16.3 Firebox

Inspect/capture:

```text
Firebrick/refractory condition
Mortar joints
Cracks
Missing units
Spalling
Loose material
Exposed backing
Structural movement
Evidence of overheating
```

Not every firebrick crack is automatically Not Compliant.

Classification depends on actual function, system construction and applicable requirement.

---

## 16.4 Hearth

Capture:

```text
Hearth construction
Continuity
Cracks/gaps
Combustible exposure
Extension dimensions
Condition
Alterations
```

Measurements:

```text
Front
Left
Right
Other applicable geometry
```

Do not import stove-specific hearth dimensions automatically.

Use Alberta fireplace code layer and applicable historical/install context.

---

## 16.5 Fireplace Opening / Combustible Trim

Capture:

```text
Opening width/height where relevant
Mantel
Combustible trim
Adjacent combustible finish
Clearance measurements
Shielding if present
```

Classification may depend on applicable code edition and historical installation context.

---

## 16.6 Damper

Capture:

```text
Present
Accessible
Operable where scope permits
Condition
Damage
Modification
Obstruction
```

Ground/readily accessible damper may be part of Visual scope.

Inaccessible conditions may be UTI.

---

## 16.7 Smoke Chamber

Capture only what is accessible within inspection level.

Possible observations:

```text
Visible condition
Parge/lining condition
Cracking
Open joints
Deposits
Obstruction
Transition geometry observable?
```

Do not classify concealed smoke-chamber construction from partial visibility.

---

## 16.8 Flue / Liner

Capture:

```text
Liner present/visible
Liner type
Visible cracks
Displacement
Missing sections
Open joints
Spalling
Heat damage
Creosote/deposits
Chimney-fire history
```

Where only a small portion is visible:

```text
Observed portion = record condition
Remaining concealed liner = UTI
```

One visible intact tile does not establish full liner integrity.

---

## 16.9 Chimney Masonry

Capture:

```text
Cracking
Spalling
Mortar deterioration
Loose units
Leaning
Separation
Movement
Water staining
Freeze-thaw deterioration
Visible structural concern
```

Structural movement is an escalation trigger.

---

## 16.10 Crown / Cap

Capture:

```text
Crown/cap present
Crown type
Cracking
Spalling
Loose material
Slope/drainage condition
Drip projection
Overhang
Liner/crown interface
Water staining
Movement/displacement
```

Measurements:

```text
Crack width where material
Drip projection
Displacement where present
```

Verified Alberta source route:

```text
NBC(AE) Section 9.21
Article 9.21.4.6
```

The verified common measurable drip element for the applicable cap construction is:

```text
25 mm minimum projection from chimney wall
```

Historical applicability remains case-specific where original installation legality is being assessed.

A crack alone does not automatically mean whole-system Not Compliant.

---

## 16.11 Flashing / Roof Intersection

Capture:

```text
Step/counterflashing visible
Gaps
Lifted flashing
Corrosion
Sealant-only repairs
Water staining
Roof intersection condition
```

Finding should distinguish:

- current water-shedding defect;
- maintenance recommendation;
- code requirement where established.

---

## 16.12 Masonry Chimney Height / Termination

Verified Alberta Part 9 route includes the masonry chimney flue height rule.

Capture measurements needed to assess:

```text
Height above roof contact point
Relationship to roof surfaces/structures within 3 m
Nearby ridge/additions/dormers
```

Verified Alberta dimensions in the source package:

```text
at least 900 mm above the highest point of roof contact
and
at least 600 mm above the highest roof surface or structure within 3 m horizontally
```

Do not automatically apply this masonry rule to a factory-built chimney without checking the listed system/manufacturer.

---

## 16.13 Cleanout

Capture where applicable:

```text
Cleanout required for configuration?
Present?
Accessible?
Door intact?
Tight-fitting?
Debris condition?
Combustible clearance concern?
```

Do not assume a masonry fireplace flue requires the same cleanout configuration as every appliance flue.

---

## 16.14 Alberta Combustion-Air Gate

Critical Alberta rule:

Do not import Ontario's fireplace outdoor-air wording.

For Phoenix/Alberta, absence of direct outdoor combustion air is not automatically a deficiency solely because Ontario may require something different.

Capture:

```text
Direct outdoor air present?
Configuration observable?
Smoke spillage complaint?
Applicable manufacturer requirement?
```

Use applicable Alberta provision and manufacturer source.

---

# 17. System Workflow — Factory-Built Fireplace

## 17.1 Sections

1. Model Identification
2. Manufacturer Manual
3. Listed Chimney System
4. Fireplace Face / Surround / Combustibles
5. Hearth / Ember Protection
6. Refractory / Firebox Components
7. Chase
8. Supports
9. Firestops
10. Attic Insulation Shield
11. Chimney Sections / Joints
12. Offsets
13. Flashing
14. Storm Collar
15. Termination
16. Component Compatibility Audit
17. Alberta Outdoor-Air / Combustion-Air Gate
18. Measurements
19. Photos
20. Findings / Escalation
21. Final Item Status Review

---

## 17.2 Model Identification

Mandatory capture attempt:

```text
Manufacturer
Model
Serial
Certification label
Listing
Manual
Revision/date
Chimney system identity
```

If no reliable product identity:

```text
MANUFACTURER LOOKUP REQUIRED
MODEL-SPECIFIC REQUIREMENTS: NOT VERIFIED
```

Do not identify by decorative facing.

---

## 17.3 Listed Chimney System

Capture:

```text
Chimney manufacturer
Series/model
Diameter
Certification labels
Supports
Firestops
Attic insulation shield
Roof support
Flashing
Storm collar
Termination
```

Component compatibility is manufacturer-specific.

Mixed or unidentified components:

```text
MANUFACTURER LOOKUP REQUIRED
```

and potentially:

```text
NOT VERIFIED
```

until compatibility is established.

---

## 17.4 Chase

Capture within access level:

```text
Chase accessible?
Clearance visibility
Firestop visibility
Insulation condition
Water intrusion
Support
Unapproved contact/material
```

If concealed:

```text
UTI
```

Do not assume concealed chase clearances are compliant.

---

## 17.5 Firestops / Attic Insulation Shield

At Visual level, if attic is not accessed:

```text
UTI
```

Do not infer presence/condition from the room below.

At Technical level, record actual attic access and observations.

---

## 17.6 Fireplace Face / Surround / Combustibles

Capture:

```text
Facing material
Combustible trim
Mantel
Sidewall
Manufacturer clearances
Standoff/trim restrictions
Modification
```

Exact manufacturer manual controls model-specific requirements.

---

# 18. Universal Measurement Model

All measurements must be stored as numeric values plus units.

Recommended object:

```yaml
id:
component:
label:
value:
unit:
method:
photoId:
sourceRequirement:
sourceVerified:
technicianNote:
```

Supported units initially:

```text
in
ft
mm
cm
```

Do not store a critical measurement only inside narrative text.

---

# 19. Hearth Measurement UX

For applicable system workflows, provide dedicated mobile cards.

Example:

```text
HEARTH / FLOOR PROTECTION

Front Extension
[ 18.0 ] in

Left Side
[ 8.0 ] in

Right Side
[ 8.0 ] in

Rear
[      ] in   (only when applicable)
```

Requirements:

- numeric input;
- decimal input mode;
- visible unit;
- optional photo link per measurement;
- no automatic compliance result unless the applicable requirement has been source-verified for that configuration.

---

# 20. Findings Model

Every material finding should store:

```text
Finding ID
System
Section
Component
Raw technician observation
Normalized observation
Measurement references
Photo references
Diagram region
Inspection level
Access status
Source route
Applicable requirement reference
Verification state
Inspector classification
Recommendation
AI candidate wording
Inspector-approved wording
```

Do not collapse observation, requirement and classification into one field.

---

# 21. Defect / Red-Flag Runtime Library

The source defect library contains 28 standard defect families.

Runtime IDs should support at least:

```text
cracked-chimney-crown
missing-damaged-chimney-crown
insufficient-drip-detail
damaged-chimney-liner
missing-chimney-liner
damaged-firebrick-firebox-lining
rust-corrosion
connector-clearance
incorrect-hearth-dimensions
missing-data-label
unidentified-appliance
termination-height
deteriorated-mortar-masonry
chimney-movement
combustible-clearance-intrusion
creosote-deposits
suspected-chimney-fire
cleanout-defect
damaged-factory-built-chimney
mixed-incompatible-chimney-components
insert-liner-connection
inaccessible-attic
concealed-chimney-section
thimble-wall-pass-through
water-penetration
flashing-defect
termination-cap-defect
unsupported-component
```

These defect types are **finding helpers**, not automatic compliance conclusions.

---

# 22. Defect Conditional Logic

## 22.1 Crown Crack

When selected:

Request:

```text
Crack width
Crack length/extent
Water evidence
Slope/drainage observation
Drip projection
Loose material?
Movement/displacement?
Photo overview
Photo close-up with scale
Photo drip/edge where accessible
```

Do not auto-set Not Compliant from "cracked".

---

## 22.2 Liner Damage

Request:

```text
Liner type
Visible location/depth
Crack width where measurable
Displacement
Missing section
Chimney-fire history
Visible deposit condition
Video scan used?
Remaining liner visible?
```

If full condition is not observable:

- observed defect may be documented;
- concealed remainder may remain UTI.

---

## 22.3 Hearth Dimension Concern

Request:

```text
System type
Exact appliance/model
Manufacturer requirement available?
Front measurement
Left measurement
Right measurement
Rear if applicable
Protection function:
  ember
  thermal
  unknown
Photo of pad
Measurement photos
```

Do not auto-use one generic hearth dimension across all systems.

---

## 22.4 Missing Label / Unidentified Appliance

Request:

```text
Any manufacturer marking?
Any model marking?
Any serial?
Any manual/document available?
Any prior permit/report?
Photo of suspected label location
Photo of full appliance
```

Workflow:

```text
MANUFACTURER LOOKUP REQUIRED
```

Do not guess.

---

## 22.5 Creosote / Deposit Buildup

Request:

```text
Location
Observed severity
Accessible extent
Cleaning history if reported
Chimney-fire history
Photo
```

Report logic:

Cleaning is based on observed dangerous deposit accumulation / maintenance requirement.

Do not state a universal annual sweeping law.

---

## 22.6 Suspected Previous Chimney Fire

Request:

```text
Who reported fire?
Approximate date
Visible liner condition
Visible connector condition
Full liner visible?
Video scan?
Inspection level
```

A Visual inspection after a reported chimney fire must not use one intact visible liner section to clear the whole liner.

Escalation may be appropriate.

---

## 22.7 Inaccessible Attic

Request:

```text
Attic exists?
Hatch exists?
Access attempted?
Reason not accessed:
  outside inspection level
  unsafe
  blocked
  inaccessible
What components may exist there?
```

Status:

```text
Unable to Inspect (UTI)
```

for relevant attic-level components.

---

# 23. UTI Engine

UTI is appropriate where:

- item exists;
- condition matters;
- agreed inspection level did not permit access;
- access was unsafe;
- item was concealed;
- technician explicitly could not inspect;
- evidence is insufficient because component was physically inaccessible.

UTI is **not** for:

- technician forgot to measure;
- manual is missing;
- model is unknown;
- source is unresolved.

Those become:

```text
INCOMPLETE INPUT
MANUFACTURER LOOKUP REQUIRED
NOT VERIFIED
```

---

## 23.1 UTI Required Data

Every UTI record should capture:

```text
Component
Why inaccessible
Inspection level
What was not verified
Recommended next action if verification is required
Photo of access limitation if useful/possible
```

Report wording model:

```text
Unable to Inspect (UTI): The [component] was [concealed/inaccessible/unsafe to access] within the agreed [inspection level] scope. The condition of [specific item] was not verified, and no compliance conclusion is made for that item. [Higher-level inspection/additional access] is recommended if verification is required.
```

---

# 24. N/A Engine

Use N/A only when an item genuinely does not apply.

Example:

```text
Masonry fireplace
Factory-built attic insulation shield
→ N/A
```

Do not use N/A because:

- item could not be seen;
- inspector omitted it;
- documentation is missing.

---

# 25. Compliant Draft Rule

AI/system may prepare a Compliant draft only when:

### Path A — Inspector Classified

Responsible inspector explicitly classified the item Compliant.

AND

No internal evidence conflict exists.

OR

### Path B — Fully Supported Rule

The record contains:

- observed configuration;
- required measurement where applicable;
- source-verified governing requirement;
- installation history where material;
- no conflicting evidence.

Even then:

```text
FINAL HUMAN APPROVAL REQUIRED
```

---

# 26. Not Compliant Draft Rule

A Not Compliant draft requires:

- observed condition;
- verified applicable requirement;
- measurement/configuration showing requirement is not met;

or:

- responsible inspector classification supported by source/evidence.

Recommended report structure:

```text
Observation
Measurement / Evidence
Applicable Requirement
Assessment
Recommended Action
```

---

# 27. Historical Installation Gate

Existing installations require separation of:

```text
A. Original installation legality
B. Current alteration
C. Current condition
```

Capture:

```text
Approximate installation date
Known permit date
Known alteration/relining/replacement date
Current observed condition
```

Do not automatically apply every current new-construction requirement retroactively.

Where history controls and cannot be established:

```text
CASE-SPECIFIC DETERMINATION REQUIRED
```

---

# 28. Alberta Fire Code Runtime Items

For relevant systems capture:

```text
Last known inspection date
Appliance added since prior inspection?
Known chimney fire?
Combustible deposits observed?
Cleaning required based on condition?
Structural deficiency/decay observed?
Dangerous clearance condition observed?
```

Do not convert "inspection at intervals not greater than 12 months" into "legally sweep every year."

Inspection and cleaning are separate concepts.

---

# 29. Manufacturer Lookup Runtime

When manufacturer lookup is triggered, capture:

```text
Brand
Model
Suffix
Serial
Manufacturing date
Certification label
Manual title
Manual part/document number
Manual revision
Effective date
Serial applicability
Official source URL
Last verified
```

The source library currently includes starter coverage for:

- Napoleon
- Regency
- Pacific Energy
- Drolet
- Jøtul
- Vermont Castings
- Osburn
- Enviro
- Quadra-Fire

This is not an exhaustive catalogue.

---

# 30. AI Rewrite Modes

UI modes:

```text
Standard Professional
Insurance-Oriented
Realtor / Real-Estate Friendly
```

All modes operate on the same locked facts.

## Standard Professional

Use:

- concise technical wording;
- clear observation;
- clear recommendation;
- no exaggeration.

## Insurance-Oriented

Use:

- objective condition language;
- measurements;
- source-supported deficiency wording;
- explicit UTI/access limits;
- no marketing;
- no guarantee language.

## Realtor / Real-Estate Friendly

Use:

- plain language;
- preserve actual status;
- explain what requires action;
- distinguish maintenance from deficiency;
- no minimization;
- no alarmism.

---

# 31. AI Locked Facts

The AI rewrite service must receive facts as immutable context.

At minimum:

```text
Province = Alberta
Business = Phoenix
Inspection level
System type
Component
Raw observation
Measurements
Checklist/status state
Photos/evidence refs
Manufacturer identity
Source route
Inspector classification if supplied
```

AI output must not update those structured fields.

---

# 32. AI Missing-Information Responses

If knowledge/source is missing:

```text
NOT VERIFIED
```

If model-specific rule required:

```text
MANUFACTURER LOOKUP REQUIRED
```

If installation history controls:

```text
CASE-SPECIFIC DETERMINATION REQUIRED
```

If sources conflict:

```text
SOURCE CONFLICT — HUMAN REVIEW REQUIRED
```

If business/province mismatch:

```text
BUSINESS / PROVINCE CONFLICT — HUMAN REVIEW REQUIRED
```

---

# 33. AI Prohibited Transformations

Examples:

```text
"crown cracked"
```

must not become:

```text
"5 mm structural crack causing active leakage"
```

unless those facts were recorded.

```text
"hearth appears short"
```

must not become:

```text
"hearth measures 300 mm"
```

unless measured.

```text
"no visible deficiency"
```

must not automatically become:

```text
Compliant
```

---

# 34. Phoenix Field Experience

Field experience is useful for:

- training;
- recognizing patterns;
- practical inspection workflow;
- report wording examples;
- avoiding overclassification.

Field experience is not code.

Runtime labels must preserve:

```text
PHOENIX FIELD EXPERIENCE
```

separately from:

```text
CODE REQUIREMENT
CSA / ULC REFERENCED STANDARD
MANUFACTURER REQUIREMENT
WETT PROCEDURE
```

---

# 35. Diagrams / Visual Pinning

The field-report UI should support predefined diagram regions.

## Masonry / Exterior Chimney

Suggested regions:

```text
rain-cap
crown
liner-top
masonry
mortar
flashing
roof-intersection
cleanout
termination
```

## Fireplace / Appliance

Suggested regions:

```text
hearth
firebox
damper
smoke-chamber
flue
screen
doors-glass
mantel
sidewall
connector
appliance
```

## Factory-Built System

Suggested regions:

```text
fireplace-body
face
standoff
chase
firestop
attic-shield
chimney-section
offset
roof-support
flashing
storm-collar
termination
```

Selecting a region should associate:

```text
finding
measurement
photo
report marker
```

Diagram selection must not itself create a deficiency.

---

# 36. Review Quality Gate

Before final inspector review, the application should check for missing operational data.

At minimum:

```text
Business = Phoenix
Province = Alberta
Inspection date
Inspection level
Responsible inspector
WETT number
System type
Inspection address
System identification attempts completed
Every applicable checklist item has:
  status OR controlled workflow state
Every Not Compliant item has:
  observation
  source route
  supporting evidence/measurement where required
Every UTI item has:
  reason
Every manufacturer-dependent unresolved item is marked:
  MANUFACTURER LOOKUP REQUIRED / NOT VERIFIED
Every material finding has:
  observation
Relevant measurements are recorded
Required Phoenix internal evidence warnings are resolved
AI output, if used, remains separate from raw technician note
```

---

# 37. Finalization Gate

The final software state machine remains:

```text
draft
→ ready-for-review
→ finalizing
→ validate/freeze inspection data
→ generate view model
→ generate PDF
→ save PDF
→ completed
→ attempt email
```

Knowledge-based finalization must additionally require:

```text
Human inspector approval
Inspector name
WETT number
Final classification review
Scope/limitations review
No unresolved critical source conflict
No unsupported auto-generated compliance conclusion
```

Email failure does not invalidate a completed report.

PDF generation/storage failure must not produce `completed`.

---

# 38. Report Architecture

Final Phoenix report should include:

1. Phoenix branded cover/header
2. Report number
3. Property / client
4. Inspection date
5. Inspector + WETT number
6. Inspection level
7. Reason for inspection
8. System identification
9. Executive summary
10. Measurements
11. Inspection section results
12. Findings / deficiencies
13. UTI / scope limitations
14. Diagram / visual markers
15. Photo evidence
16. Recommendations
17. Inspector sign-off
18. Approved scope/limitations language
19. Phoenix footer / contact information

Do not use the term "WETT certificate" for the deliverable.

Use:

```text
WETT Inspection Report
```

---

# 39. Executive Summary Logic

The summary must be derived only from structured data.

Allowed examples:

```text
System Type
Inspection Level
Findings Count
Not Compliant Item Count
UTI Item Count
Maintenance Recommendations
Manufacturer Lookup Required
```

Do not generate:

```text
System Passed
System Failed
Safe to Use
Certified
```

as unsupported whole-system labels.

---

# 40. Professional Wording Principles

Preferred:

```text
The measured clearance between the connector and the adjacent combustible wall was approximately [x]. The applicable [manufacturer/B365/code] requirement for this configuration is [y]. The observed clearance does not meet the verified requirement. Correction is recommended before continued use.
```

Avoid unsupported alarm language such as:

```text
This is extremely dangerous and could burn the house down.
```

unless an actual immediate hazard has been documented and the human inspector supports the wording.

---

# 41. Runtime Source Provenance

Every rule/configuration item should preserve source metadata.

Recommended object:

```yaml
sourceType:
sourceFile:
sourceSection:
jurisdiction:
verificationStatus:
lastVerified:
```

Suggested source types:

```text
WETT PROCEDURE
CODE REQUIREMENT — ALBERTA
CSA / ULC REFERENCED STANDARD
MANUFACTURER REQUIREMENT
MUNICIPAL PROCESS
INDUSTRY BEST PRACTICE
PHOENIX FIELD EXPERIENCE
```

---

# 42. Do Not Encode Copyrighted Standard Tables

The CSA B365 knowledge file is a navigation map.

Do not reproduce complete copyrighted B365 tables into runtime configuration unless Phoenix possesses and is permitted to use the required licensed material in that way.

For model-specific values:

- prefer exact manufacturer documentation;
- use verified Alberta code values where lawfully sourced in the knowledge pack;
- use the licensed standard during inspection where required.

---

# 43. Known Knowledge Gaps / Guardrails

The validation package identifies three WETT procedural details that remain unavailable from fully current public authoritative material:

1. exact mandatory-photo schedule in the current WETT Inspection SOP;
2. exact WETT member procedure for missing/illegible appliance labels;
3. exact same-level post-repair / limited reinspection procedure.

Runtime behavior:

## Photo SOP

Do not claim:

```text
Official WETT photo requirements satisfied
```

based only on the Phoenix internal evidence set.

## Missing Label

Do not guess model/certification.

Use:

```text
MANUFACTURER LOOKUP REQUIRED
```

and responsible inspector/current WETT procedure.

## Repair Verification / Reinspection

Do not close a WETT compliance item solely from customer photos unless the responsible inspector and current WETT procedure support that process.

---

# 44. Validation Scenarios to Convert Into Automated Tests

The existing validation package passed 16 controlled scenarios.

At minimum, software test fixtures should preserve these classes of behavior:

1. Visual inspection + inaccessible attic → UTI
2. Insert + hidden liner connection → UTI
3. Crown crack without proven functional failure → no automatic Not Compliant
4. Factory-built fireplace + missing label → manufacturer lookup / not verified
5. Verified manufacturer clearance deficiency → Not Compliant draft supported
6. Heavy deposits → cleaning based on condition, not annual-sweep myth
7. Historical fireplace condition → no automatic retroactive current-code deficiency
8. Reported chimney fire + concealed liner → UTI/escalation
9. Alberta no direct outdoor air → do not import Ontario rule
10. Manufacturer clearance deficiency in Alberta → use exact manufacturer requirement
11. Factory-built chimney concealed in inaccessible area → UTI
12. Mixed/unknown listed components → manufacturer lookup / not verified
13. Customer concern without measured deficiency → no automatic finding
14. Missing measurement → incomplete input, not UTI
15. No visible deficiency → not automatic Compliant
16. AI release attempt without human approval → blocked

---

# 45. Suggested Runtime Config Files

The coding agent should consider splitting the implementation into data/config modules rather than hardcoding every rule in React components.

Suggested structure:

```text
src/lib/wett/knowledge/
  phoenix-alberta.ts
  common-site.ts
  systems/
    wood-stove.ts
    fireplace-insert.ts
    masonry-fireplace.ts
    factory-built-fireplace.ts
  defects.ts
  evidence.ts
  manufacturer-routing.ts
  ai-reporting-rules.ts
```

The exact file structure may differ, but the knowledge should remain separate from presentation components.

---

# 46. Minimum V1 UI Sections

The first production UI should expose:

```text
1. Inspection Setup
2. Customer / Property
3. System Identification
4. System-Specific Inspection
5. Measurements
6. Findings
7. Photos / Evidence
8. UTI / Access Limitations
9. Technician Notes
10. AI Rewrite
11. Review
12. Inspector Approval
13. Preview / PDF
```

The system-specific inspection section is dynamically generated from selected system type.

---

# 47. Initial Phoenix V1 Completion Philosophy

The objective is not to make an unqualified person "perform a WETT inspection by rote."

The objective is to make the software:

- difficult to forget required data;
- difficult to lose measurements;
- difficult to omit evidence;
- difficult to confuse UTI with N/A;
- difficult to mix jurisdictions;
- difficult to invent manufacturer requirements;
- difficult for AI to change facts;
- easy for the responsible inspector to review and release a complete professional report.

---

# 48. Source Package Mapping

This runtime file is derived from:

```text
01_WETT_CORE_CANADA.md
→ WETT methodology, SITE levels, statuses, UTI, report boundaries

02_CSA_B365_KNOWLEDGE_MAP.md
→ B365 subject routing and scope map

04_PHOENIX_ALBERTA_WETT_KNOWLEDGE.md
→ Alberta legal/code/standard layer

05_WETT_SYSTEM_INSPECTION_LIBRARY.md
→ system-by-system field workflows

06_WETT_DEFECT_RED_FLAG_LIBRARY.md
→ defect workflows and evidence requirements

07_WETT_MANUFACTURER_LIBRARY.md
→ manufacturer/model lookup system

08_APOLLO_PHOENIX_FIELD_KNOWLEDGE.md
→ Phoenix field experience

09_WETT_AI_REPORTING_RULES.md
→ AI safety/reporting contract

10_WETT_VALIDATION_REPORT.md
→ validated scenarios and runtime guardrails
```

`03_APOLLO_ONTARIO_WETT_KNOWLEDGE.md` remains intentionally excluded from Phoenix technical runtime decisions.

---

# 49. Implementation Instruction to Coding Agent

Read this file together with the existing WETT architecture implementation.

Do not replace the architecture.

Use this file to populate the currently-empty inspection content layer.

Before coding:

1. map the existing `WettReport` schema to this runtime model;
2. identify fields already present;
3. identify minimal schema extensions required;
4. create configuration-driven system checklists;
5. preserve all existing authentication/storage/autosave/private-photo/PDF architecture;
6. do not introduce a new database;
7. do not hardcode Ontario logic into Phoenix;
8. do not invent missing WETT SOP rules;
9. preserve source provenance for technical rules;
10. keep final report release under responsible human inspector approval.

---

# 50. Product Rule

> **The technician records facts.  
> The knowledge layer identifies what must be checked.  
> Sources determine requirements.  
> The inspector classifies.  
> AI improves language.  
> Phoenix produces the report.**

That rule is the operating contract for the Phoenix WETT runtime.
