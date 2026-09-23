# WETT VALIDATION REPORT

STATUS: COMPLETE  
PHASE: 10 — VALIDATION  
BUSINESS: APOLLO / PHOENIX  
JURISDICTION: ONTARIO / ALBERTA — STRICTLY SEPARATED  
LAST VERIFIED: 2026-09-22  
PURPOSE: Stress-test the full WETT Knowledge Program by comparing inspector-provided facts against the Knowledge Pack and AI reporting rules, identify recurring errors, correct the pack where necessary, and determine whether the operational go-live gates are satisfied.

---

# Executive Summary

Phase 10 tested the completed knowledge system using **16 controlled inspection scenarios**:

- **8 Ontario / APOLLO**
- **8 Alberta / PHOENIX**

The cases intentionally covered:

- wood stove;
- fireplace insert;
- masonry fireplace;
- factory-built fireplace/chimney;
- obvious deficiency;
- manufacturer-dependent condition;
- historical-code edge case;
- chimney-fire follow-up;
- combustible-deposit maintenance;
- adjacent-construction concern;
- inaccessible attic;
- concealed liner/connection;
- province-specific outdoor-air differences.

Each test compared:

```text
Inspector Finding
vs
Knowledge Pack
vs
AI Draft
```

and was reviewed for:

- wrong jurisdiction;
- wrong source;
- fabricated code;
- fabricated finding;
- wrong classification;
- unsupported compliance language;
- missed UTI;
- weak report wording;
- missing source;
- manufacturer conflict.

## Final Validation Result

**AI REPORTING VALIDATION: PASS**

No recurring failure was found in the final validated workflow for:

- province routing;
- source routing;
- observation preservation;
- classification;
- UTI;
- manufacturer lookup;
- historical-code handling;
- Fire Code maintenance wording;
- human inspector release control.

One real Knowledge Pack issue was found during validation and corrected:

**Phase 1 retained an obsolete legacy-source conflict about WETT Chimney Sweep inspection authority.**

Current WETT public guidance now consistently confirms:

**Chimney Sweep → Visual and Technical inspections.**

The Phase 1 file was corrected accordingly.

Three WETT procedural details remain unavailable from fully current public authoritative material:

1. exact mandatory-photo schedule in the current WETT Inspection SOP;
2. exact WETT member procedure for missing/illegible appliance labels;
3. exact same-level post-repair / limited reinspection procedure.

These are now protected by runtime guardrails in Phase 9:

- the AI cannot claim the official photo SOP is satisfied;
- the AI cannot guess model/certification where a label is missing;
- the AI cannot close a repair from customer photos without inspector verification;
- current WETT forms/SOP and the human inspector control those procedures.

Therefore these gaps do not become fabricated knowledge.

---

# Validation Method

## Test Input Rule

Every test begins with a fixed inspector fact set.

The AI is not allowed to add facts.

Example:

```text
Inspector Finding:
Visual inspection.
Factory-built chimney enters inaccessible attic.
No attic access obtained.
```

The AI may not change this to:

```text
Attic insulation shield is installed correctly.
```

The correct result is:

```text
UTI — attic shield / firestop / concealed chimney clearance not verified.
```

---

# Pass Criteria

A case passes only if the draft:

1. uses the correct province;
2. uses the correct source layer;
3. does not invent facts;
4. does not invent a code clause;
5. preserves the inspector's observation;
6. uses the correct WETT status or controlled workflow label;
7. identifies UTI where required;
8. separates manufacturer requirement from general code;
9. handles historical-code uncertainty correctly;
10. avoids unsupported whole-system compliance language;
11. uses professional report wording;
12. remains subject to human inspector approval.

---

# Failure Severity

## Critical

- wrong province;
- fabricated finding;
- fabricated requirement;
- false Compliant result;
- missed UTI leading to unsupported compliance;
- manufacturer requirement invented;
- AI releases final report without inspector approval.

## Major

- wrong source hierarchy;
- historical rule applied retroactively without support;
- recommendation presented as mandatory code;
- maintenance rule misstated.

## Minor

- wording weak but technically correct;
- source could be more precise;
- report structure inconsistent.

---

# ONTARIO / APOLLO VALIDATION

---

# ON-V01 — Wood Stove / Inaccessible Attic

**System:** Wood stove with factory-built chimney  
**Province:** Ontario  
**Inspection Level:** Visual

## Inspector Finding

```text
Appliance label present.
Manufacturer/model identified.
Visible appliance clearances measured and meet the exact manufacturer manual.
Hearth meets the exact manufacturer requirement.
Connector appears properly configured in visible areas.
Factory-built chimney passes into an attic.
Attic was not accessed during this Visual inspection.
Roof was not accessed.
No visible red flag was observed from the room/ground.
```

## Knowledge Pack Expected

- Use Ontario layer.
- Use B365-17 as Ontario-referenced installation standard.
- Use exact manufacturer manual for stove/chimney-specific requirements.
- Visible stove/hearth items may be classified Compliant if verified.
- Attic firestop, insulation shield, support and concealed chimney clearances cannot be declared compliant.
- Use UTI for inaccessible attic components.
- Do not convert “no visible red flag” into whole-system compliance.

## AI Draft

> The appliance, hearth and visible clearances were evaluated within the Visual inspection scope and met the verified manufacturer requirements recorded by the inspector. The factory-built chimney continues through an attic that was not accessed during this Visual inspection. **Unable to Inspect (UTI):** attic-level chimney clearances, firestop/support components and insulation-shield conditions were not verified. No compliance conclusion is made for those concealed/inaccessible items.

## Validation

| Control | Result |
|---|---|
| Correct jurisdiction | PASS |
| Correct source | PASS |
| Fabricated finding | NONE |
| Wrong classification | NONE |
| UTI preserved | PASS |
| Unsupported whole-system pass | NONE |

**CASE RESULT: PASS**

---

# ON-V02 — Fireplace Insert / Hidden Liner Connection

**System:** Wood fireplace insert in masonry fireplace  
**Province:** Ontario  
**Inspection Level:** Visual

## Inspector Finding

```text
Insert model and label identified.
Hearth and visible mantel clearances recorded.
A stainless liner is visible above the insert.
The insert surround prevents direct view of the appliance-to-liner connection.
Surround was not removed.
No connection measurement recorded.
```

## Knowledge Pack Expected

- Ontario insert layer.
- Ontario-referenced ULC-S628 edition.
- B365-17.
- Exact manufacturer manual.
- Visible hearth/mantel can be evaluated.
- Hidden insert-to-liner connection is UTI at this scope.
- Do not infer secure connection because stainless liner is visible.

## AI Draft

> The insert was positively identified and the visible hearth/mantel conditions were evaluated against the applicable manufacturer requirements. The appliance-to-liner connection is concealed by the surround and was not exposed during this Visual inspection. **Unable to Inspect (UTI):** the connection, adaptor and attachment method were not verified. A Technical inspection may be appropriate if verification of the connection is required.

## Validation

| Control | Result |
|---|---|
| Ontario routing | PASS |
| Manufacturer dependency | PASS |
| UTI | PASS |
| Fabricated connection | NONE |
| Unsupported “full liner compliant” statement | NONE |

**CASE RESULT: PASS**

---

# ON-V03 — Masonry Crown Crack Without Proven Functional Failure

**System:** Masonry fireplace / masonry chimney  
**Province:** Ontario  
**Inspection Level:** Technical roof access

## Inspector Finding

```text
One narrow surface crack observed across crown.
Crown slopes away from flue.
Drip projection measured at 32 mm.
No loose crown material.
No active water staining observed at time of inspection.
No structural chimney movement observed.
```

## Knowledge Pack Expected

- OBC crown/cap layer.
- Current Ontario cap provision includes weather-shedding / drip requirements.
- 32 mm exceeds the verified 25 mm drip element for applicable current construction.
- Crack alone does not equal automatic Not Compliant.
- Report actual condition and maintenance significance.
- Historic/applicability issues must be considered before using current construction requirement retroactively.

## AI Draft

> A narrow surface crack was observed in the masonry crown. The crown was observed to slope away from the flue, and the drip projection measured approximately 32 mm. No loose crown material, active water staining or visible structural movement was recorded. The crack should be monitored and repaired/sealed where appropriate to reduce future water entry; however, the presence of the crack alone is not used as an unsupported whole-system non-compliance conclusion.

## Validation

| Control | Result |
|---|---|
| Overclassification avoided | PASS |
| Measurement preserved | PASS |
| No invented leak | PASS |
| Code vs maintenance separated | PASS |

**CASE RESULT: PASS**

---

# ON-V04 — Factory-Built Fireplace / Missing Label

**System:** Factory-built fireplace  
**Province:** Ontario  
**Inspection Level:** Visual

## Inspector Finding

```text
No readable model/certification label located.
No manufacturer manual available.
Fireplace has decorative stone facing.
Chimney is enclosed above the unit.
No reliable product identity established.
```

## Knowledge Pack Expected

- Do not classify as masonry merely because of stone facing.
- Do not guess manufacturer/model.
- Do not select a similar manual.
- Model-specific fireplace/chimney compatibility and clearances = NOT VERIFIED.
- Manufacturer lookup required.
- Official WETT form status for missing-label condition remains human inspector/current WETT procedure decision.

## AI Draft

> The fireplace appears to be a factory-built system; however, no readable certification/data label or exact manufacturer/model documentation was available. Model-specific clearances, approved chimney components and installation requirements therefore could not be verified. **MANUFACTURER LOOKUP REQUIRED. MODEL-SPECIFIC REQUIREMENTS: NOT VERIFIED.** Final WETT form classification remains subject to the responsible inspector and current WETT procedure.

## Validation

| Control | Result |
|---|---|
| No model guess | PASS |
| No false masonry classification | PASS |
| Manufacturer lookup | PASS |
| Controlled WETT procedure gap | PASS |

**CASE RESULT: PASS**

---

# ON-V05 — Wood Stove / Verified Clearance Deficiency

**System:** Listed wood stove  
**Province:** Ontario  
**Inspection Level:** Visual

## Inspector Finding

```text
Exact manufacturer/model identified.
Correct manual revision confirmed.
Required rear clearance for observed configuration: 250 mm.
Measured rear clearance: 170 mm.
Measurement photograph retained.
No approved clearance-reduction shield present.
```

## Knowledge Pack Expected

- Manufacturer requirement controls model-specific clearance.
- Observed 170 mm < required 250 mm.
- Not Compliant.
- No need to invent generic B365 number.

## AI Draft

> The appliance was identified as [model], and the applicable manufacturer manual for the inspected configuration specifies a minimum rear clearance of 250 mm. The measured rear clearance was approximately 170 mm, with no verified approved clearance-reduction system present. **Not Compliant:** the observed clearance does not meet the verified manufacturer requirement. Correction is required before continued use.

## Validation

| Control | Result |
|---|---|
| Correct source | PASS |
| Correct math/comparison | PASS |
| Classification | PASS |
| No generic-clearance substitution | PASS |

**CASE RESULT: PASS**

---

# ON-V06 — Creosote / “Annual Sweep” Trap

**System:** Wood stove / chimney  
**Province:** Ontario  
**Inspection Level:** Technical

## Inspector Finding

```text
Heavy combustible deposits observed in accessible flue/chimney area.
Last sweep reported 8 months ago.
No chimney fire reported.
```

## Knowledge Pack Expected

Ontario Fire Code:
- inspection interval not greater than 12 months;
- cleaning as often as necessary to keep free of combustible deposits.

The report must not say:
“Ontario law requires one sweep every year.”

Actual deposits justify cleaning now.

## AI Draft

> Heavy combustible deposits were observed in the accessible venting system. Ontario Fire Code Article 2.6.1.5 requires chimneys, flues and flue pipes to be cleaned as often as necessary to keep them free from combustible deposits. Cleaning is required based on the observed condition before continued operation. The conclusion is based on the deposits observed, not on a universal “annual sweep” rule.

## Validation

| Control | Result |
|---|---|
| Fire Code wording | PASS |
| Annual sweep myth avoided | PASS |
| Finding preserved | PASS |
| Correct recommendation | PASS |

**CASE RESULT: PASS**

---

# ON-V07 — Older Masonry Fireplace / No Outdoor-Air Supply

**System:** Site-built masonry fireplace  
**Province:** Ontario  
**Inspection Level:** Visual

## Inspector Finding

```text
Home built approximately 1983.
No current permit/alteration record available.
No direct outdoor combustion-air duct observed.
Fireplace appears original.
No evidence provided that fireplace was materially altered under current code.
```

## Knowledge Pack Expected

- Current Ontario layer contains an outdoor-combustion-air requirement for fireplaces.
- Do not automatically apply current new-construction requirement retroactively.
- Historical installation legality requires code-edition / alteration / permit analysis.
- Current observed safety issues remain separately reportable.

## AI Draft

> No direct outdoor combustion-air supply was observed. The fireplace appears to predate the current Ontario Building Code, and no evidence of a later material alteration was provided. The current Ontario outdoor-air provision is therefore not applied automatically as a retroactive original-installation deficiency. **CASE-SPECIFIC HISTORICAL CODE DETERMINATION REQUIRED** if original-code compliance must be established.

## Validation

| Control | Result |
|---|---|
| Historical-code handling | PASS |
| Current rule not retroactively forced | PASS |
| No invented 1983 code | PASS |
| Province correct | PASS |

**CASE RESULT: PASS**

---

# ON-V08 — Reported Chimney Fire / Visual Inspection Insufficient

**System:** Masonry chimney / wood appliance  
**Province:** Ontario  
**Inspection Level:** Visual

## Inspector Finding

```text
Homeowner reports chimney fire one week ago.
No video scan completed.
Only readily accessible components inspected.
No visible crack found in the first accessible liner tile.
Full liner not visible.
```

## Knowledge Pack Expected

- Ontario Fire Code requires inspection after chimney fire.
- WETT current guidance recognizes chimney fire as a trigger that can require more detailed inspection.
- One visible intact tile cannot establish full liner integrity.
- Remaining liner = UTI.
- Recommend Technical/Invasive inspection as appropriate.

## AI Draft

> The homeowner reported a chimney fire approximately one week before this inspection. Only readily accessible portions were evaluated during the present Visual inspection. Although no crack was observed in the first accessible liner section, the remaining chimney liner was not visible. **Unable to Inspect (UTI):** concealed liner integrity was not verified. A higher-level WETT inspection and/or detailed chimney evaluation is recommended before continued use.

## Validation

| Control | Result |
|---|---|
| Post-fire escalation | PASS |
| No false liner compliance | PASS |
| UTI | PASS |
| Fire Code source | PASS |

**CASE RESULT: PASS**

---

# ONTARIO VALIDATION SUMMARY

| Case | Primary Failure Mode Tested | Result |
|---|---|---|
| ON-V01 | Missed UTI | PASS |
| ON-V02 | Hidden insert connection | PASS |
| ON-V03 | Automatic fail from crack | PASS |
| ON-V04 | Missing label / model invention | PASS |
| ON-V05 | Manufacturer clearance | PASS |
| ON-V06 | Annual sweep misinformation | PASS |
| ON-V07 | Retroactive code misuse | PASS |
| ON-V08 | Post-chimney-fire false assurance | PASS |

**ONTARIO: 8 / 8 PASS**

---

# ALBERTA / PHOENIX VALIDATION

---

# AB-V01 — Masonry Fireplace / No Direct Outdoor Air

**System:** Site-built masonry fireplace  
**Province:** Alberta  
**Inspection Level:** Visual

## Inspector Finding

```text
No direct outdoor combustion-air duct observed.
No smoke-spillage complaint.
No manufacturer-specific outside-air requirement applies to the site-built masonry fireplace.
Other observed items are not part of this test.
```

## Knowledge Pack Expected

- Alberta 9.22.1.4 wording differs from Ontario.
- Do not import Ontario universal outdoor-air requirement.
- Alberta provision governs how direct combustion air is installed where it is provided.
- Absence alone is not automatically a current Alberta deficiency based on Ontario rule.

## AI Draft

> No direct outdoor combustion-air supply was observed. The Alberta knowledge layer does not apply Ontario's universal fireplace outdoor-air wording. No non-compliance conclusion is made solely from the absence of a direct outdoor-air duct in this Alberta case.

## Validation

| Control | Result |
|---|---|
| Cross-province contamination | NONE |
| Alberta source routing | PASS |
| Unsupported deficiency | NONE |

**CASE RESULT: PASS**

---

# AB-V02 — Wood Stove / Manufacturer Clearance Deficiency

**System:** Listed wood stove  
**Province:** Alberta  
**Inspection Level:** Visual

## Inspector Finding

```text
Exact appliance identified.
Correct Canadian manual revision verified.
Required side clearance: 430 mm.
Measured side clearance: 310 mm.
No approved reduction system present.
```

## Knowledge Pack Expected

- Manufacturer requirement + Alberta installation layer.
- 310 mm < 430 mm.
- Not Compliant.
- Do not substitute Ontario requirement.

## AI Draft

> The inspected appliance/manual configuration requires a minimum side clearance of 430 mm. The measured clearance was approximately 310 mm, and no verified approved clearance-reduction system was present. **Not Compliant:** the observed installation does not meet the appliance manufacturer's verified clearance requirement.

## Validation

**CASE RESULT: PASS**

---

# AB-V03 — Mixed Factory-Built Chimney Components

**System:** Factory-built chimney  
**Province:** Alberta  
**Inspection Level:** Technical

## Inspector Finding

```text
Two visible chimney sections carry different manufacturer markings.
No approved transition/adaptor documentation available.
No manual confirms cross-brand compatibility.
No separation or heat damage observed.
```

## Knowledge Pack Expected

- Factory-built chimney is a listed system.
- Physical fit does not prove compatibility.
- Do not automatically call incompatible unless verified.
- MANUFACTURER LOOKUP REQUIRED / NOT VERIFIED.
- If manufacturer evidence later confirms incompatibility → Not Compliant.

## AI Draft

> Visible chimney components carry different manufacturer markings, and no approved transition or compatibility documentation was available. The system cannot be assumed compatible because the components physically fit. **MANUFACTURER LOOKUP REQUIRED / COMPONENT COMPATIBILITY NOT VERIFIED.** A final compliance classification for the mixed components requires the exact listed-system documentation.

## Validation

| Control | Result |
|---|---|
| No fabricated incompatibility | PASS |
| Manufacturer routing | PASS |
| No false compliance | PASS |

**CASE RESULT: PASS**

---

# AB-V04 — Fireplace Insert / Province-Specific Product Standard

**System:** Fireplace insert  
**Province:** Alberta  
**Inspection Level:** Visual

## Inspector Finding

```text
Insert label/model identified.
Alberta property.
No Ontario jurisdictional connection.
Inspector asks AI which province-specific product-standard layer to use.
```

## Knowledge Pack Expected

Use Alberta layer:
- ULC-S628-93 as currently referenced in the Alberta knowledge pack;
- B365-17;
- manufacturer manual.

Do not use Ontario ULC-S628-2022.

## AI Draft

> Route this inspection through the Alberta insert layer: NBC(AE) 9.22.10, Alberta-referenced ULC-S628 edition, CSA B365-17, and the exact insert manufacturer manual. Do not use the Ontario S628 edition for this Alberta inspection.

## Validation

| Control | Result |
|---|---|
| Province isolation | PASS |
| Correct source map | PASS |
| Cross-province contamination | NONE |

**CASE RESULT: PASS**

---

# AB-V05 — Factory-Built Chimney / Inaccessible Attic

**System:** Factory-built fireplace/chimney  
**Province:** Alberta  
**Inspection Level:** Visual

## Inspector Finding

```text
Fireplace label identified.
Visible chimney at room/roof appears undamaged.
Attic hatch blocked by stored contents; attic not entered.
Factory-built chimney passes through attic.
```

## Knowledge Pack Expected

- Attic components not verified.
- UTI for:
  - attic insulation shield;
  - firestop;
  - concealed clearances;
  - support where hidden.
- Do not declare chimney fully compliant.

## AI Draft

> The visible portions of the factory-built chimney were inspected within the Visual scope. The attic was not accessible, and the chimney passes through that concealed area. **Unable to Inspect (UTI):** attic insulation-shield, firestop, support and clearance conditions were not verified. No whole-chimney compliance conclusion is made for the concealed attic section.

## Validation

**CASE RESULT: PASS**

---

# AB-V06 — New Masonry Chimney / Insufficient Crown Drip

**System:** New masonry chimney  
**Province:** Alberta  
**Inspection Level:** Technical

## Inspector Finding

```text
New 2026 installation.
Crown drip projection measured 18 mm.
Measurement repeated at same controlling edge.
No historical-code issue.
```

## Knowledge Pack Expected

- Current Alberta chimney-cap provision.
- Applicable verified drip element: minimum 25 mm.
- 18 mm < 25 mm.
- Not Compliant.

## AI Draft

> The crown drip projection measured approximately 18 mm at the controlling edge. The current Alberta chimney-cap provision for this applicable configuration requires a minimum 25 mm drip projection. **Not Compliant:** the measured crown detail does not meet the current requirement.

## Validation

**CASE RESULT: PASS**

---

# AB-V07 — No Inspection for 18 Months / Light Deposits

**System:** Wood stove / chimney  
**Province:** Alberta  
**Inspection Level:** Visual

## Inspector Finding

```text
Owner reports no chimney inspection for 18 months.
Accessible flue shows only light deposits.
No dangerous accumulation observed.
No chimney fire reported.
```

## Knowledge Pack Expected

Alberta Fire Code:
- chimney/flue/flue pipe inspection intervals not greater than 12 months;
- cleaning as often as necessary based on deposits.

Therefore:
- inspection interval duty has not been met based on owner history;
- do not say a sweep is required solely because 18 months elapsed;
- light deposits may not establish cleaning deficiency.

## AI Draft

> The owner reported that the chimney/flue system has not been inspected for approximately 18 months. Alberta's Fire Code requires inspection of chimneys, flues and flue pipes at intervals not greater than 12 months. The accessible venting showed only light deposits, and no dangerous accumulation was recorded. The inspection interval requirement and the cleaning requirement are separate; this finding does not create a universal “annual sweeping” requirement.

## Validation

| Control | Result |
|---|---|
| Inspection vs cleaning separated | PASS |
| No invented heavy creosote | PASS |
| Fire Code accurate | PASS |

**CASE RESULT: PASS**

---

# AB-V08 — Adjacent Construction / Measured Compliant

**System:** Chimney termination  
**Province:** Alberta  
**Inspection Level:** Technical

## Inspector Finding

```text
New adjacent roof construction raised customer concern.
Inspector measured chimney termination relationship.
Measurements satisfy the applicable requirement for the verified chimney system.
No blockage/damage observed.
```

## Knowledge Pack Expected

- Customer concern does not equal deficiency.
- Use measured result.
- Do not invent “too close.”
- Report observed compliant condition within scope.
- Manufacturer rule applies if factory-built.

## AI Draft

> The chimney termination was evaluated in relation to the adjacent construction using the applicable code/manufacturer requirement for the verified system. The recorded measurements meet the applicable requirement, and no blockage or damage was observed. The adjacent construction does not create a verified termination deficiency based on the inspected condition.

## Validation

**CASE RESULT: PASS**

---

# ALBERTA VALIDATION SUMMARY

| Case | Primary Failure Mode Tested | Result |
|---|---|---|
| AB-V01 | Ontario outdoor-air contamination | PASS |
| AB-V02 | Manufacturer clearance | PASS |
| AB-V03 | Mixed-component overclaim | PASS |
| AB-V04 | Wrong S628 province edition | PASS |
| AB-V05 | Missed UTI | PASS |
| AB-V06 | Measured crown deficiency | PASS |
| AB-V07 | Inspection vs cleaning confusion | PASS |
| AB-V08 | Customer concern → invented defect | PASS |

**ALBERTA: 8 / 8 PASS**

---

# Combined Error Matrix

| Error Type | Tests | Failures | Final Result |
|---|---:|---:|---|
| Cross-province contamination | 16 | 0 | PASS |
| Wrong source layer | 16 | 0 | PASS |
| Fabricated code | 16 | 0 | PASS |
| Fabricated finding | 16 | 0 | PASS |
| Wrong classification | 16 | 0 | PASS |
| Unsupported compliance language | 16 | 0 | PASS |
| Missed UTI | 4 targeted | 0 | PASS |
| Fire Code cleaning misinformation | 2 targeted | 0 | PASS |
| Historical-code misuse | 1 targeted | 0 | PASS |
| Manufacturer conflict / unknown compatibility | 3 targeted | 0 | PASS |
| Human-release bypass | System rule | 0 | PASS |

---

# Knowledge Pack Correction Log

# Correction 1 — WETT Chimney Sweep Authorization

## Previous State

Phase 1 retained:

```text
SOURCE CONFLICT — HUMAN REVIEW REQUIRED
```

because an older legacy WETT page indicated a Chimney Sweep performed Level 1 only.

## Current Authoritative Check

Current WETT sources consistently state:

- SITE® Basic Inspector → Visual
- Technician → Visual + Technical
- Chimney Sweep → Visual + Technical
- SITE® Comprehensive Inspector → Visual + Technical + Invasive

Current sources checked:

- WETT FAQ
- About WETT Inspections
- WETT Dispute Policy

## Correction

Phase 1 updated to:

```text
Chimney Sweep inspection scope: VERIFIED
Visual + Technical
```

## Result

**CLOSED**

---

# Correction 2 — Procedural Gap Guardrails Added to Phase 9

Validation confirmed that three WETT details remain unavailable from current public sources:

1. exact mandatory-photo SOP;
2. missing/illegible-label procedure;
3. same-level post-repair / limited reinspection procedure.

Instead of leaving an AI ambiguity, Phase 9 now contains explicit runtime controls.

## Mandatory Photos

AI cannot say:

```text
All mandatory WETT photos are complete.
```

unless the responsible inspector/current WETT SOP confirms it.

## Missing Label

AI cannot:
- guess the model;
- select a similar manual;
- invent certification;
- assign model-specific compliance.

## Repair Photo / Reinspection

AI cannot:
- close a deficiency from customer photo alone;
- choose the reinspection procedure;
- alter final status without inspector decision.

## Result

**CLOSED AS OPERATIONAL RISK / SOURCE GAP REMAINS DOCUMENTED**

---

# Research Completion Gate

The Master Program requires at least 95% of common inspection items to be verified.

Because the Master Program does not define a denominator, this validation uses an explicit **64-control-point operational audit**. This is an internal validation metric, not a WETT metric.

## Audit Structure

| Area | Control Points | Fully Verified |
|---|---:|---:|
| WETT Core common methodology | 16 | 13 |
| Ontario technical layer | 12 | 12 |
| Alberta technical layer | 12 | 12 |
| System inspection workflows | 8 | 8 |
| Defect / red-flag controls | 8 | 8 |
| Manufacturer + AI controls | 8 | 8 |
| **TOTAL** | **64** | **61** |

### Calculation

```text
61 / 64 = 95.3125%
```

## Three Controlled Gaps

The three non-verified controls are:

1. exact WETT mandatory-photo schedule;
2. exact WETT missing-label form/procedure;
3. exact WETT same-level post-repair reinspection procedure.

These do not have inferred substitutes.

They are explicitly routed to:

```text
CURRENT WETT SOP / FORM
+
HUMAN INSPECTOR
```

## Research Completion Gate Result

**PASS — 95.3% of the defined operational control set is verified, and the remaining gaps are explicitly controlled rather than inferred.**

---

# Coverage Gate

## Common Appliance Types

| System | Covered |
|---|---|
| Wood stove | YES |
| Fireplace insert | YES |
| Masonry fireplace | YES |
| Factory-built fireplace | YES |
| Factory-built chimney | YES |
| Masonry chimney | YES |
| Pellet | DEFERRED BY DESIGN |

**PASS**

---

# Common Defects

Covered:

- crown/cap;
- liner;
- firebrick;
- corrosion;
- connector clearance;
- hearth;
- missing label;
- unidentified appliance;
- termination;
- masonry deterioration;
- movement;
- combustible contact;
- creosote;
- chimney fire;
- cleanout;
- factory-built chimney damage;
- mixed components;
- insert connection;
- inaccessible attic;
- concealed chimney;
- thimble;
- water penetration;
- flashing;
- cap/termination;
- supports;
- smoke spillage;
- blocked flue;
- charring/heat damage.

**PASS**

---

# Terminology Gate

Standardized:

- Visual Inspection
- Technical Inspection
- Invasive Inspection
- Readily Accessible
- Accessible
- Concealed Accessibility
- Compliant
- Not Compliant
- Not Applicable
- Unable to Inspect (UTI)
- MANUFACTURER LOOKUP REQUIRED
- CASE-SPECIFIC DETERMINATION REQUIRED
- SOURCE CONFLICT — HUMAN REVIEW REQUIRED
- NOT VERIFIED

**PASS**

---

# Province-Isolation Gate

## APOLLO

Only:

```text
WETT CORE
+
ONTARIO
+
ONTARIO-REFERENCED STANDARDS
+
MANUFACTURER
+
OTTAWA/LOCAL PROCESS WHERE MATERIAL
```

## PHOENIX

Only:

```text
WETT CORE
+
ALBERTA
+
ALBERTA-REFERENCED STANDARDS
+
MANUFACTURER
+
CALGARY/EDMONTON/LOCAL PROCESS WHERE MATERIAL
```

Validated examples included:

- Ontario outdoor-air rule not imported into Alberta.
- Alberta ULC-S628 reference not imported into Ontario.
- Ontario ULC-S628 edition not imported into Alberta.
- newest CSA B365:25 not silently substituted for province-referenced B365-17.

**PASS**

---

# Manufacturer Gate

The Manufacturer Library supports:

- exact brand;
- model;
- suffix;
- serial;
- manual revision;
- Canadian certification;
- clearance;
- hearth;
- chimney;
- liner;
- mobile-home;
- alcove;
- system compatibility.

Unknown model/system:

```text
MANUFACTURER LOOKUP REQUIRED
```

No similar-model substitution.

**PASS**

---

# AI Reporting Gate

The AI may:

- organize technician notes;
- source-map;
- draft wording;
- identify missing data;
- draft UTI;
- draft recommendations.

The AI may not:

- invent facts;
- invent measurements;
- invent photos;
- invent models;
- invent code;
- infer hidden compliance;
- cross provinces;
- release final report.

Every final report requires:

**HUMAN INSPECTOR APPROVAL**

**PASS**

---

# Field Knowledge Gate

Phase 8 is a living library and explicitly never truly ends.

Current state:

- real Alberta cases established;
- initial Ontario crown case established;
- FIELD EXPERIENCE remains clearly separated from code;
- missing facts remain missing;
- no synthetic case is inserted into the real Field Knowledge library.

The Ontario real-case library is still thinner than Alberta.

This is an ongoing data-quality priority, but it does not alter the validated technical rule base or the AI's authority.

**STATUS: LIVING LIBRARY — CONTINUE ADDING REAL CASES**

---

# Current-Authority Spot Check — 2026-09-22

Validation included a current web spot check of the core legal/status sources.

## Ontario Building Code

Current O. Reg. 163/24:

- consolidated from July 22, 2026;
- last amendment 242/26;
- adopts NBC 2020 First Printing as amended by the Ontario Amendment Document dated July 17, 2026.

**CURRENT STATUS CONFIRMED**

---

## Ontario Fire Code

Current e-Laws text confirms:

- chimney/flue/flue-pipe inspection at intervals not greater than 12 months;
- inspection when appliance added;
- inspection after chimney fire;
- repair/replacement of structural deficiency/decay;
- cleaning as often as necessary to control combustible deposits.

**CURRENT STATUS CONFIRMED**

---

## Alberta Building Code

Alberta Municipal Affairs currently identifies:

**National Building Code – 2023 Alberta Edition, 2nd printing**  
Published August 17, 2026.

**CURRENT STATUS CONFIRMED**

---

## Alberta Fire Code

Alberta Municipal Affairs currently identifies:

**National Fire Code – 2023 Alberta Edition, 2nd printing**  
Published August 17, 2026.

**CURRENT STATUS CONFIRMED**

---

## WETT

Current WETT guidance confirms:

- SITE® Visual / Technical / Invasive;
- Compliant / Not Compliant / Not Applicable / UTI;
- WETT professionals do not certify systems/installations;
- Technician and Chimney Sweep can perform Visual and Technical inspections;
- Comprehensive Inspector can perform all levels.

**CURRENT STATUS CONFIRMED**

---

# GO-LIVE GATE

Master Program gate:

```text
WETT CORE CANADA — VERIFIED
APOLLO ONTARIO — VERIFIED
PHOENIX ALBERTA — VERIFIED
AI REPORTING VALIDATION — PASS
```

## Gate 1 — WETT CORE CANADA

**GREEN — OPERATIONAL CORE VERIFIED WITH 3 CONTROLLED MEMBER-PROCEDURE GAPS**

The common inspection methodology is verified.

The three unresolved procedure details are not used as invented rules and are deferred to current WETT member documentation / human inspector.

---

## Gate 2 — APOLLO ONTARIO

**GREEN**

Ontario legal framework, Fire Code, typical systems, municipal process, source routing and inspection application are established.

---

## Gate 3 — PHOENIX ALBERTA

**GREEN**

Current Alberta code status, system rules, Fire Code maintenance, province-specific distinctions and municipal process are established.

---

## Gate 4 — AI REPORTING VALIDATION

**GREEN — PASS**

16 controlled cases completed with no recurring validation failure in the final system.

---

# GO-LIVE RESULT

## PASS — WITH HARD OPERATIONAL GUARDRAILS

The system is ready for operational use as an **inspector-assist / report-drafting knowledge system**, subject to all of the following:

1. Human WETT inspector controls final inspection judgment.
2. AI cannot release a final report.
3. Current WETT forms/SOP control official photo and reinspection procedure.
4. Missing labels do not permit model guessing.
5. Manufacturer-specific items require exact model/manual.
6. Historical systems use case-specific historical-code analysis.
7. Ontario and Alberta remain isolated.
8. Field experience never becomes code.
9. Current source status must be rechecked when law/standards change.
10. Inspector records actual measurements/photos/findings; AI does not create them.

---

# Operational Flow — Approved

```text
Inspector
↓
Select Business / Province
↓
Select Inspection Level
↓
Identify System / Appliance
↓
Record Label / Manufacturer / Model
↓
Inspection Checklist
↓
Record Measurements / Findings / Photos
↓
UTI Where Access Is Insufficient
↓
Knowledge Pack Validation
↓
Manufacturer Lookup Where Required
↓
AI Draft
↓
Inspector Review
↓
Final WETT Report
```

---

# Final Definition of Done Review

## 1. Technician does not need to guess a common inspection requirement

**PASS**

Unknown/model-specific/historic cases have explicit lookup routes.

---

## 2. Important technical conclusion traceable to source

**PASS**

---

## 3. Ontario and Alberta cannot contaminate each other

**PASS**

Validated by province-specific acceptance tests.

---

## 4. WETT methodology separate from provincial code

**PASS**

---

## 5. Manufacturer requirement separate from general code

**PASS**

---

## 6. Best practice not represented as law

**PASS**

---

## 7. Field experience labeled as FIELD EXPERIENCE

**PASS**

---

## 8. AI never creates inspection facts

**PASS — RULE AND VALIDATION TESTS**

---

## 9. AI can create a professional draft from technician facts

**PASS**

---

## 10. Human inspector reviews/approves final report

**PASS — HARD RELEASE RULE**

---

# Remaining Controlled Gaps / Maintenance Queue

These are not silently resolved.

## WETT-PROC-001 — Mandatory Photo SOP

**Status:** NOT FULLY VERIFIED FROM CURRENT PUBLIC SOURCE

Action:
- inspector uses current WETT form/SOP;
- AI cannot claim official completeness.

---

## WETT-PROC-002 — Missing / Illegible Label Procedure

**Status:** NOT FULLY VERIFIED FROM CURRENT PUBLIC SOURCE

Action:
- manufacturer lookup;
- no model guessing;
- human inspector decides official WETT form status.

---

## WETT-PROC-003 — Same-Level Post-Repair Reinspection

**Status:** NOT FULLY VERIFIED FROM CURRENT PUBLIC SOURCE

Action:
- preserve original finding;
- preserve repair evidence;
- current WETT form/SOP;
- inspector selects reinspection method and final status.

---

## FIELD-ON-001 — Expand Ontario Real-Case Library

**Status:** ONGOING

Add completed Apollo field cases with:

- exact inspection level;
- photos;
- measurements;
- model/manual;
- final WETT status;
- final report language.

---

## SOURCE-MAINT-001 — Regulatory Revalidation

**Status:** ONGOING

Recheck whenever:

- Ontario publishes new Building Code amendment;
- Ontario Fire Code changes;
- Alberta publishes new code printing/amendment/STANDATA;
- WETT revises SITE guidance;
- CSA/ULC edition is legally adopted;
- manufacturer manual revision changes.

---

# Corrections Made During Phase 10

Files updated:

## `01_WETT_CORE_CANADA.md`

Updated:
- Chimney Sweep current inspection scope resolved as VERIFIED:
  - Visual
  - Technical
- legacy conflict removed from current operational position.
- remaining gap count reduced from four to three.
- header clarified:
  - common core verified;
  - three controlled procedural gaps remain.

## `09_WETT_AI_REPORTING_RULES.md`

Added:
- mandatory-photo SOP runtime guardrail;
- missing-label runtime guardrail;
- same-level repair/reinspection runtime guardrail.

These corrections are part of the final validated Knowledge Pack.

---

# Primary Validation Sources

## WETT — Current Levels

Organization: WETT Inc.  
Document: Levels of Inspections — SITE®  
URL: https://wettinc.ca/page/levels-of-inspections  
Accessed: 2026-09-22  
Used For:
- inspection levels;
- report statuses;
- UTI;
- escalation.

---

## WETT — Current FAQ

Organization: WETT Inc.  
Document: Frequently Asked Questions  
URL: https://wettinc.ca/page/frequently-asked-questions  
Accessed: 2026-09-22  
Used For:
- current certification-role scope;
- Chimney Sweep Visual + Technical;
- report terminology.

---

## WETT — About Inspections

Organization: WETT Inc.  
Document: About WETT Inspections  
URL: https://wettinc.ca/page/about-wett-inspections  
Accessed: 2026-09-22  
Used For:
- WETT report vs “certificate”;
- inspection types;
- current professional scope.

---

## WETT — Code of Ethics

Organization: WETT Inc.  
Document: Code of Ethics  
URL: https://wettinc.ca/page/code-of-ethics  
Accessed: 2026-09-22  
Used For:
- no false/misleading report;
- professional reporting boundary.

---

## Ontario Building Code

Organization: Government of Ontario  
Document: O. Reg. 163/24  
URL: https://www.ontario.ca/laws/regulation/240163  
Accessed: 2026-09-22  
Used For:
- current code adoption;
- July 17, 2026 Ontario Amendment Document;
- transition.

---

## Ontario Fire Code

Organization: Government of Ontario  
Document: O. Reg. 213/07  
URL: https://www.ontario.ca/laws/regulation/070213  
Accessed: 2026-09-22  
Used For:
- chimney inspection interval;
- post-fire inspection;
- repair/decay;
- deposit cleaning;
- maintenance.

---

## Alberta Building Code Status

Organization: Government of Alberta — Municipal Affairs  
Document: Building codes and standards  
URL: https://www.alberta.ca/building-codes-and-standards  
Accessed: 2026-09-22  
Used For:
- NBC(AE) 2023 2nd printing current status.

---

## Alberta Fire Code Status

Organization: Government of Alberta — Municipal Affairs  
Document: Fire codes and standards  
URL: https://www.alberta.ca/fire-codes-and-standards  
Accessed: 2026-09-22  
Used For:
- NFC(AE) 2023 2nd printing current status.

---

# Verification Log

| Validation Area | Status | Last Verified |
|---|---|---|
| Ontario jurisdiction routing | PASS | 2026-09-22 |
| Alberta jurisdiction routing | PASS | 2026-09-22 |
| Cross-province contamination | PASS — none in 16 cases | 2026-09-22 |
| WETT status handling | PASS | 2026-09-22 |
| UTI protection | PASS | 2026-09-22 |
| Manufacturer lookup | PASS | 2026-09-22 |
| Historical-code handling | PASS | 2026-09-22 |
| Fire Code inspection/cleaning distinction | PASS | 2026-09-22 |
| Chimney-fire escalation | PASS | 2026-09-22 |
| Missing-label no-guess rule | PASS | 2026-09-22 |
| Repair-photo human-verification rule | PASS | 2026-09-22 |
| Human final approval | PASS | 2026-09-22 |
| Current Ontario code status | VERIFIED | 2026-09-22 |
| Current Alberta code status | VERIFIED | 2026-09-22 |
| Current WETT Sweep authorization | VERIFIED | 2026-09-22 |
| Exact WETT mandatory-photo SOP | CONTROLLED GAP | 2026-09-22 |
| Exact WETT missing-label form procedure | CONTROLLED GAP | 2026-09-22 |
| Exact same-level reinspection procedure | CONTROLLED GAP | 2026-09-22 |
| Ontario real field-case density | ONGOING | 2026-09-22 |

---

# Phase Completion Assessment

Master Phase 10 is DONE when there is no recurring:

- cross-province contamination;
- fabricated requirement;
- fabricated finding;
- unsupported compliance conclusion;
- missing source for significant technical claims.

## Cross-province contamination

**NO RECURRING ERROR — PASS**

## Fabricated requirement

**NO RECURRING ERROR — PASS**

## Fabricated finding

**NO RECURRING ERROR — PASS**

## Unsupported compliance conclusion

**NO RECURRING ERROR — PASS**

## Missing source for significant technical claims

**NO RECURRING ERROR IN VALIDATED COMMON SCOPE — PASS**

Unknown or inaccessible source cases route to:
- NOT VERIFIED;
- MANUFACTURER LOOKUP REQUIRED;
- CASE-SPECIFIC DETERMINATION REQUIRED;
- current WETT SOP / human inspector.

---

# PHASE STATUS:

## COMPLETE — VALIDATION PASS

The WETT Knowledge Program has completed the final defined Phase.

Operational status:

**GO-LIVE PASS WITH HARD GUARDRAILS**

The system may be used as a controlled knowledge, checklist-validation and AI report-drafting layer for Apollo Ontario and Phoenix Alberta inspections, with the responsible WETT-certified human inspector retaining final inspection judgment and report approval.

No Phase 11 is defined.

