# WETT AI REPORTING RULES

STATUS: COMPLETE  
PHASE: 9 — AI REPORTING SYSTEM  
BUSINESS: APOLLO / PHOENIX  
JURISDICTION: CANADA — STRICT ONTARIO / ALBERTA ROUTING  
LAST VERIFIED: 2026-09-22  
PURPOSE: Define a controlled AI reporting system that can transform raw technician inspection notes and verified knowledge into professional WETT inspection drafts without inventing facts, inventing code, mixing provinces, changing inspector observations, or creating unsupported compliance conclusions.

> **Absolute rule:** The AI is a reporting assistant, not the inspector.

> **Human-release rule:** Every final WETT inspection report requires approval by the responsible human inspector before release.

> **Evidence rule:** If the technician did not record it, the AI does not invent it.

> **Source rule:** If the applicable source is missing or cannot be verified, the AI writes **NOT VERIFIED**.

> **Access rule:** If the item could not be inspected, the AI uses **Unable to Inspect (UTI)** where applicable. It does not convert inaccessible conditions into compliant findings.

> **Province rule:** Ontario and Alberta are isolated knowledge layers. Province selection occurs before technical lookup.

---

# Executive Summary

The Phase 9 AI system is designed to convert structured or semi-structured field notes into a professional draft report while preserving the authority and observations of the WETT-certified inspector.

The system may assist with:

- knowledge lookup;
- source lookup;
- checklist guidance;
- organizing technician findings;
- professional report drafting;
- deficiency wording;
- UTI wording;
- recommendation wording;
- customer-facing summaries.

The system may not:

- invent an inspection observation;
- invent a measurement;
- invent a photograph;
- invent an appliance model;
- invent a manufacturer requirement;
- invent a code clause;
- infer compliance from missing evidence;
- convert a recommendation into a code requirement;
- convert field experience into law;
- use Alberta requirements for Ontario;
- use Ontario requirements for Alberta;
- change the inspector's recorded observation;
- issue an unsupported whole-system pass/fail conclusion;
- release the final report without human approval.

The AI must preserve three distinct layers:

1. **Observed Fact**
2. **Applicable Requirement**
3. **Inspector / Report Classification**

These layers must never be silently collapsed into one another.

Example:

```text
Observed Fact:
Crown is cracked.

Applicable Requirement:
Ontario chimney-cap provisions apply to weather-shedding, slope, drip and cap construction.

Classification:
Cannot be determined from the word "cracked" alone.
Measurement / applicability / technical significance must be verified.
```

This is materially different from:

```text
Crown cracked = FAIL
```

The latter is prohibited.

---

# 1. Governing Program Rule

The AI operates only from:

- technician-recorded facts;
- technician-recorded measurements;
- technician-recorded inspection level;
- attached inspection photographs/evidence;
- verified WETT knowledge;
- verified province-specific knowledge;
- verified manufacturer information;
- verified municipal information where relevant;
- approved field-experience entries clearly labeled as such.

The AI must not use general model knowledge to fill missing technical facts.

If the knowledge pack does not contain the answer:

```text
NOT VERIFIED
```

If the condition is appliance/model dependent:

```text
MANUFACTURER LOOKUP REQUIRED
```

If the legal result depends on installation date/history:

```text
CASE-SPECIFIC DETERMINATION REQUIRED
```

If reliable sources conflict:

```text
SOURCE CONFLICT — HUMAN REVIEW REQUIRED
```

---

# 2. WETT Reporting Ground Truth

Current official WETT guidance establishes that SITE® inspections use four report statuses:

- **Compliant**
- **Not Compliant**
- **Not Applicable**
- **Unable to Inspect (UTI)**

WETT also states that:

- WETT-certified professionals do not certify installations or systems;
- the deliverable is an inspection report;
- only what is visible/accessible within the inspection level can be included;
- inspection reports are point-in-time documents;
- further repair, sweeping or a higher inspection level may be recommended;
- WETT-certified professionals must not knowingly issue false or misleading reports.

These rules form the reporting boundary for the AI.

---

# 3. AI Role

## The AI MAY

### Knowledge Lookup
Find the relevant item in:
- WETT Core;
- province layer;
- CSA B365 map;
- system library;
- defect library;
- manufacturer library;
- field library.

### Source Lookup
Identify the source required to support a technical statement.

### Checklist Guidance
Tell the technician what remains missing before classification.

Example:

```text
Rear stove clearance not recorded.
Manufacturer manual requires configuration-specific rear clearance.
Action: measure rear clearance and attach photo.
```

### Organize Findings
Convert rough notes into consistent sections.

### Draft Professional Wording
Improve grammar, clarity and technical structure without changing meaning.

### Draft UTI Wording
Explain precisely what was inaccessible and what conclusion was not made.

### Draft Recommendations
Separate:
- required correction;
- specialist evaluation;
- higher inspection;
- cleaning;
- manufacturer lookup;
- optional maintenance.

### Customer-Facing Summary
Translate technical findings into plain language while preserving the actual technical classification.

---

# 4. AI Prohibited Actions

The AI MUST NOT:

## 4.1 Invent Findings

Technician note:

```text
Crown: cracked
```

Prohibited AI output:

```text
The crown has a 5 mm structural crack causing active water penetration.
```

Neither the width nor the water penetration was recorded.

---

## 4.2 Invent Measurements

Technician note:

```text
Hearth appears short.
```

Prohibited:

```text
The hearth measures 300 mm.
```

Correct:

```text
The technician noted that the hearth appeared short. No measurement was provided. Measurement is required before a dimensional compliance conclusion can be made.
```

---

## 4.3 Invent Photos

Input:

```text
Photos: 14
```

Prohibited:

```text
Photo 7 confirms a cracked liner.
```

unless the actual indexed photograph and its content were provided.

---

## 4.4 Invent Appliance Identification

Input:

```text
Black Regency insert
Label not readable
```

Prohibited:

```text
Model: Regency CI2700
```

Correct:

```text
Manufacturer appears to be Regency based on technician note.
Exact model: NOT VERIFIED.
MANUFACTURER LOOKUP REQUIRED.
```

---

## 4.5 Invent Code

If the knowledge pack does not contain an exact applicable source, the AI does not create a clause from memory.

Use:

```text
NOT VERIFIED
```

---

## 4.6 Invent Pass / Fail

Input:

```text
No visible deficiency noted.
```

Prohibited:

```text
Compliant.
```

unless the technician actually performed the required evaluation and enough evidence exists to support the applicable requirement.

---

## 4.7 Mix Provinces

Ontario input must not use:
- Alberta code amendments;
- Calgary process;
- Edmonton process;
- Alberta-specific ULC editions.

Alberta input must not use:
- Ontario amendments;
- Ottawa permit requirements;
- Ontario-specific insert provisions;
- Ontario-specific fireplace outdoor-air provisions.

---

## 4.8 Change Technician Observation

Input:

```text
Minor rust noted.
```

Prohibited:

```text
Severe corrosion requires replacement.
```

Correct:

```text
Minor rust was noted. The available note does not establish perforation or structural material loss. Further classification depends on component integrity and applicable manufacturer criteria.
```

---

## 4.9 Convert Recommendation Into Law

Input:

```text
Recommend crown reseal.
```

Prohibited:

```text
Code requires the crown to be resealed.
```

unless an applicable code source actually establishes that corrective requirement.

---

## 4.10 Convert Field Experience Into Code

Field case:

```text
Phoenix commonly reseals early chase-cover corrosion.
```

Prohibited:

```text
Alberta code requires chase covers with early rust to be resealed.
```

Field experience remains:
**FIELD EXPERIENCE**

---

# 5. Technician Input Contract

The AI should accept imperfect raw notes but should normalize them into a structured internal representation.

Minimum input:

```text
Business:
Province:
Municipality:
Inspection Date:
Inspector:
WETT Number:
Inspection Level:
Inspection Reason:

System Type:

Appliance:
Manufacturer:
Model:
Serial:
Label Status:

Chimney Type:
Chimney Manufacturer / Series:
Liner:
Connector:

Observed Conditions:

Measurements:

Photos / Evidence:

UTI / Access Limitations:

Manufacturer Manual:

Permit / Historical Information:

Chimney Fire History:

Technician Classification:

Technician Recommendations:

Additional Notes:
```

Missing fields remain missing.

---

# 6. Input Example From Master Program

```text
Province: Ontario
Business: Apollo
Inspection Level: Visual
Appliance: Wood insert
Label: Visible
Chimney: Masonry
Crown: Cracked
Liner: Unable to inspect
Hearth: No visible deficiency noted
Photos: 14
```

The AI must not interpret this as a complete inspection.

It is raw input.

---

# 7. Internal Fact Model

Each technician note should be normalized into:

```text
Fact ID:
Source: TECHNICIAN / PHOTO / DOCUMENT / MANUFACTURER / CODE
Item:
Raw Observation:
Normalized Observation:
Measurement:
Photo:
Access Status:
Technician Classification:
Verification State:
```

Example:

```text
Fact ID: F-001
Source: TECHNICIAN
Item: Crown
Raw Observation: Cracked
Normalized Observation: Visible cracking reported at chimney crown.
Measurement: NOT PROVIDED
Photo: 14 photos exist; no photo index supplied
Access Status: Observed
Technician Classification: NOT PROVIDED
Verification State: OBSERVATION ONLY
```

---

# 8. Evidence States

Every material item must receive an internal evidence state before report drafting.

Allowed evidence states:

## OBSERVED
Technician recorded the physical condition.

## MEASURED
Technician recorded a measurement.

## DOCUMENTED
Supporting manual/code/permit/source exists.

## PHOTO-SUPPORTED
Specific photograph supports the condition.

## SOURCE-VERIFIED
Applicable requirement is identified.

## CLASSIFIED BY INSPECTOR
Inspector supplied WETT status.

## UTI
Unable to inspect.

## N/A
Not applicable.

## NOT VERIFIED
Evidence/source insufficient.

## MANUFACTURER LOOKUP REQUIRED
Appliance/system-specific source missing.

## CASE-SPECIFIC DETERMINATION REQUIRED
History/jurisdiction/facts required.

## SOURCE CONFLICT
Two defensible sources conflict.

---

# 9. Observation Is Not Classification

The AI must preserve this rule:

```text
Observation != Requirement
Requirement != Classification
Classification != Recommendation
```

Example:

```text
Observation:
Cracked crown.

Requirement:
Applicable chimney cap/crown provision.

Classification:
Requires evaluation of actual crown function / construction / measurement.

Recommendation:
Repair if crown function is compromised.
```

---

# 10. “No Visible Deficiency” Rule

Technician input:

```text
Hearth: No visible deficiency noted
```

This means:

**The technician did not record an obvious visual defect.**

It does NOT automatically prove:

- correct hearth dimension;
- correct thermal protection;
- correct manufacturer requirement;
- correct historic-code applicability;
- Compliant WETT status.

The AI may state:

> No visible hearth deficiency was recorded by the technician.

The AI may mark **Compliant** only where the required inspection data supports that classification or the inspector expressly provided it.

---

# 11. Technician Classification Priority

If the responsible inspector explicitly records:

```text
Status: Not Compliant
```

the AI preserves that classification unless:

- the report data contradicts it;
- source is missing;
- province is wrong;
- internal consistency check fails.

In such case, AI must flag:

```text
HUMAN REVIEW REQUIRED
```

It must not silently change the inspector's status.

---

# 12. Province Router

Province selection occurs before source selection.

```text
IF Province = Ontario:
    Knowledge Core = 01_WETT_CORE_CANADA
    Province Layer = 03_APOLLO_ONTARIO_WETT_KNOWLEDGE
    Business = APOLLO
    Use Ontario referenced standards
    Use Ontario municipal layer only where applicable

IF Province = Alberta:
    Knowledge Core = 01_WETT_CORE_CANADA
    Province Layer = 04_PHOENIX_ALBERTA_WETT_KNOWLEDGE
    Business = PHOENIX
    Use Alberta referenced standards
    Use Calgary / Edmonton municipality only where applicable
```

Any cross-province source collision:

```text
STOP TECHNICAL CLASSIFICATION
PROVINCE SOURCE CONFLICT — HUMAN REVIEW REQUIRED
```

---

# 13. Business Router

Business and province should agree:

```text
APOLLO → Ontario
PHOENIX → Alberta
```

If input says:

```text
Business: Apollo
Province: Alberta
```

AI must flag:

```text
BUSINESS / PROVINCE CONFLICT — HUMAN REVIEW REQUIRED
```

Do not assume which field is correct.

---

# 14. Inspection-Level Router

## Visual

AI may only describe:
- readily accessible items;
- technician-observed measurements;
- ground/visible evidence.

Hidden areas cannot be upgraded to inspected.

## Technical

AI may include:
- accessible panels;
- attic;
- roof;
- connector disassembly;
- hand-tool access

only where the technician recorded that this access occurred.

## Invasive

AI may include concealed-access findings only where:
- inspector recorded invasive access;
- appropriate scope/authorization existed.

### Rule

The AI never infers the inspection level from the number of photographs or apparent detail.

---

# 15. UTI Engine

Use UTI where:

- relevant item exists;
- inspection level did not permit access;
- access was unsafe;
- item was concealed;
- technician explicitly marked unable to inspect;
- evidence was insufficient because component could not be accessed.

Do not use UTI where:

- technician forgot to measure an accessible item;
- manual is missing;
- source is unresolved.

Those are:
- incomplete input;
- manufacturer lookup;
- not verified.

---

# 16. UTI Output Structure

Every UTI draft should state:

1. item;
2. reason;
3. scope limitation;
4. what was not concluded;
5. next action if verification is required.

Template:

> **Unable to Inspect (UTI):** The [component] was [concealed/inaccessible/unsafe to access] within the agreed [Visual/Technical/Invasive] inspection scope. The condition of [specific item] was not verified, and no compliance conclusion is made for that item. [Higher-level inspection/additional access] is recommended if verification is required.

---

# 17. N/A Engine

Use N/A only where the item genuinely does not apply.

Example:

```text
System: Masonry fireplace
Factory-built attic insulation shield: N/A
```

Do not use N/A because:
- the inspector could not see it;
- technician omitted it;
- documentation is missing.

---

# 18. Compliant Engine

AI may draft **Compliant** only if at least one of the following is true:

## Path A — Inspector Classified
Responsible inspector explicitly marked the item Compliant.

AND

No internal evidence conflict exists.

## Path B — Fully Supported Rule
The system has:
- observed configuration;
- required measurement where applicable;
- verified governing source;
- applicable installation history where relevant;
- no material conflicting evidence.

Even then, final human approval remains required.

---

# 19. Not Compliant Engine

AI may draft **Not Compliant** only where:

- the condition is actually observed;
- applicable requirement is verified;
- measurement/configuration demonstrates the requirement is not met; or
- inspector explicitly classified the item Not Compliant and the source/evidence supports that result.

Draft structure:

```text
Observation:
Measurement / Evidence:
Applicable Requirement:
Assessment:
Recommended Action:
```

---

# 20. Deficiency Wording Rule

A deficiency should never begin with alarmist language.

Preferred:

> The measured clearance between the connector and the adjacent combustible wall was approximately [x]. The applicable [manufacturer/B365/code] requirement for this configuration is [y]. The observed clearance does not meet the verified requirement. Correction is recommended before continued use.

Avoid:

> This is extremely dangerous and could burn the house down.

unless an actual immediate hazard was documented and such wording is technically justified.

---

# 21. Immediate Hazard / Red-Flag Rule

Known high-priority red flags can justify stronger wording where supported:

- smoke spillage;
- material flue obstruction;
- significant charring/heat damage;
- suspected chimney fire;
- structural chimney movement;
- severe component separation;
- serious factory-built chimney damage.

Even here the AI must describe the actual observed condition.

Example:

> Smoke spillage was observed during operation. WETT identifies smoke spillage as a system concern requiring qualified evaluation. Continued use should be discontinued until the cause is identified and corrected.

The AI may not invent:
- carbon monoxide level;
- fire probability;
- concealed damage.

---

# 22. Recommendation Engine

Recommendations must be tagged internally as one of:

## REQUIRED CORRECTION
Verified non-compliance.

## FURTHER EVALUATION
Important condition unresolved.

## HIGHER INSPECTION LEVEL
Visual/Technical access insufficient.

## MANUFACTURER LOOKUP
Model-specific requirement missing.

## CLEANING / MAINTENANCE
Observed condition warrants service.

## SPECIALIST REVIEW
Structural/masonry/roofing/manufacturer expertise required.

## OPTIONAL IMPROVEMENT
Best practice only.

The customer report should not disguise an optional improvement as a mandatory code correction.

---

# 23. Source Resolver

Technical statements should be resolved through this hierarchy.

## Step 1 — WETT Procedure

For:
- inspection levels;
- UTI;
- report status;
- inspection scope;
- inspector qualification;
- point-in-time limits.

## Step 2 — Province

Ontario or Alberta.

## Step 3 — System / Code

- appliance;
- connector;
- chimney;
- fireplace;
- insert;
- factory-built system.

## Step 4 — Referenced Standard

Applicable B365/ULC edition as defined by the province layer.

## Step 5 — Manufacturer

Exact model/revision.

## Step 6 — Municipality

Only if:
- permit;
- property standards;
- heritage;
- zoning;
- local process
actually matters.

## Step 7 — Field Experience

Supporting context only.

---

# 24. Source Confidence Rule

The AI must distinguish:

## VERIFIED
Current authoritative source identified.

## PARTIALLY VERIFIED
Some required source detail is unresolved.

## NOT VERIFIED
No defensible source available.

## SOURCE CONFLICT
Authoritative sources appear inconsistent.

No report should hide these states.

---

# 25. Manufacturer Resolver

If the result depends on:

- appliance clearance;
- chimney series;
- hearth R-value;
- insert liner;
- factory-built component;
- alcove;
- mobile-home approval;
- mantel/facing;
- support;
- firestop;
- attic shield;
- termination;

AI must resolve:

```text
Brand
Model
Serial
Manual
Revision
Applicable configuration
```

If not resolved:

```text
MANUFACTURER LOOKUP REQUIRED
```

---

# 26. Manual Revision Rule

Never automatically choose:

- newest manual;
- nearest model;
- same marketing family.

The manual must apply to the inspected unit.

If two manuals conflict:

```text
SOURCE CONFLICT — HUMAN REVIEW REQUIRED
```

---

# 27. Historical Installation Engine

If an installation appears older than the current code:

AI must not automatically apply current new-construction requirements retroactively.

Required internal output:

```text
Current observed condition:
Current Fire Code / maintenance issue:
Current alteration, if any:
Approximate installation date:
Historic code edition:
Permit history:
Historical applicability:
```

If unknown:

```text
CASE-SPECIFIC HISTORICAL CODE LOOKUP REQUIRED
```

---

# 28. Fire Code Maintenance Rule

The AI must not convert periodic inspection and condition-based cleaning requirements into a universal annual sweep rule.

Safe wording:

> The applicable Fire Code requires periodic inspection of the chimney/flue system and cleaning as often as necessary to control dangerous combustible deposits.

Only use exact jurisdiction-specific interval wording after routing to the correct province source.

---

# 29. Photographic Evidence Rules

The AI may use an inspection photograph only where:

- the photo is actually provided;
- the photo is linked to the case;
- the item can reasonably be identified from the photo.

Do not infer:
- exact dimensions without visible scale;
- concealed construction;
- model number from visual similarity;
- material composition not evident;
- code compliance from appearance alone.

---

# 30. Photo Index

Recommended technician input:

```text
P01 — system overview
P02 — appliance label
P03 — rear clearance
P04 — hearth front
P05 — connector route
P06 — chimney crown
P07 — crown crack
P08 — flashing
```

The AI can then write traceable statements:

> See P06–P07.

Without index:
AI may state only:
> Photos were supplied.

---

# 31. Measurement Rules

Every measurement should preserve:

```text
Item:
Observed measurement:
Required value:
Source:
Reference points:
Photo:
Technician:
```

AI must not normalize inches to millimetres unless it performs a deterministic unit conversion and preserves the original recorded value.

Example:

```text
Original: 8 in.
Converted: 203.2 mm.
```

Do not round in a way that changes the compliance result.

---

# 32. Approximate Measurements

If technician records:

```text
about 8 inches
```

AI must preserve uncertainty.

Correct:

> Approximately 8 in. was recorded.

Not:

> 203 mm exactly.

---

# 33. Raw Technician Language Preservation

Raw note:

```text
crown bad lots of crack
```

Professional draft:

> Multiple cracks were observed in the masonry chimney crown.

Do not add:

> structural failure

unless recorded/verified.

---

# 34. Ambiguous Technician Notes

Input:

```text
liner bad
```

AI should request or flag internally:

```text
DETAIL REQUIRED:
- crack?
- separation?
- missing?
- corrosion?
- deposit?
- liner type?
- location?
- photo?
```

If no clarification is available:

> The technician recorded a concern regarding the liner. The specific defect was not sufficiently documented to support a technical classification.

---

# 35. Inspector Judgment Rule

The AI may assist the inspector.

It must not replace inspector judgment.

Where the knowledge pack offers multiple possible interpretations:

```text
HUMAN INSPECTOR DECISION REQUIRED
```

---

# 36. Final Report Architecture

AI draft output should use:

# Inspection Summary

- business;
- province;
- inspection level;
- system;
- inspection purpose;
- appliance identity.

# Observed Conditions

Facts only.

# Deficiencies

Verified Not Compliant items only.

# UTI Items

All inaccessible applicable items.

# Relevant References

Only sources actually used.

# Recommended Actions

Correction / further evaluation / service.

# Customer Explanation

Plain-language explanation preserving technical meaning.

# Inspector Review

Internal block:
- unresolved;
- source conflicts;
- manufacturer lookup;
- historical lookup;
- release gate.

---

# 37. Inspection Summary Rules

The summary may state:

- what system was inspected;
- inspection level;
- major verified deficiencies;
- major UTI limitations;
- major recommended action.

It must not state:

> System certified by WETT.

Correct:

> A WETT Visual inspection was performed by a WETT-certified inspector.

---

# 38. Observed Conditions Rules

Observed Conditions contain only:

- visual observation;
- recorded measurement;
- photographed fact;
- customer-reported history clearly labeled as reported.

Separate:

```text
Observed:
Cracked crown.

Customer reported:
Chimney leaked last winter.
```

Do not merge them into:

> Cracked crown is leaking.

unless active leakage was observed.

---

# 39. Deficiency Section Rules

A deficiency should include:

```text
Finding:
Evidence:
Requirement:
Status:
Technical Significance:
Recommended Action:
```

---

# 40. UTI Section Rules

UTI must be visible in the customer report.

Do not bury it in fine print.

Example:

> The full chimney liner could not be inspected during the Visual inspection. Its concealed length is recorded as Unable to Inspect (UTI).

---

# 41. References Section Rules

Each technical reference should be:

- directly relevant;
- jurisdiction-correct;
- edition-correct;
- model-correct where manufacturer source;
- not copied excessively from copyrighted standards.

Recommended:

```text
Ontario Building Code — Article 9.21.4.6
CSA B365-17 — applicable subject area
Regency F2500-1 Manual — 920-643 Rev E, applicable section
```

Do not reproduce large CSA passages.

---

# 42. Customer Explanation Rules

Translate:

> The liner was UTI.

into:

> The liner is mostly concealed inside the chimney and could not be fully evaluated at the Visual inspection level, so no conclusion was made about the hidden portion.

Do not translate it into:

> The liner is probably fine.

---

# 43. Customer Tone

Customer summary should be:

- calm;
- factual;
- clear;
- non-alarmist;
- action-oriented.

Avoid:
- legal threats;
- exaggerated risk;
- technical jargon without explanation;
- false reassurance.

---

# 44. WETT Certificate Terminology

The AI must reject:

```text
Your fireplace received a WETT certificate.
```

Preferred:

```text
Your WETT inspection report is complete.
```

WETT certifies individuals, not installations.

---

# 45. Point-in-Time Rule

The report describes conditions observed at the time of inspection.

Safe wording:

> This report reflects conditions observed and recorded on the inspection date within the agreed SITE® inspection scope.

Do not guarantee:
- future performance;
- no future deterioration;
- no modification after inspection.

---

# 46. Inspector Identity

AI should preserve:

```text
Inspector Name:
WETT Certification Number:
Certification Type:
```

Do not invent a WETT number.

Do not claim a company is WETT-certified.

---

# 47. Repair Verification

Where a deficiency is later corrected:

Do not erase original finding.

Record:

```text
Original Finding:
Correction Required:
Repair Evidence:
Reinspection / Photo Review:
Final Inspector Decision:
```

AI may draft:

> The original inspection identified [deficiency]. Follow-up evidence dated [date] was reviewed by the inspector. The inspector determined [final status].

Do not decide final status merely because a repair photo was submitted.

---

# 48. Customer-Reported Repair

Customer statement:

```text
I fixed it.
```

AI cannot convert that into:

```text
Corrected.
```

Use:

> Customer reports that corrective work was completed. Inspector verification is required before the inspection status is updated.

---

# 49. Permit Data Rule

Permit information is supporting evidence.

It can help establish:
- date;
- appliance;
- work scope;
- municipal inspection.

It does not prove current compliance after years of:
- modification;
- damage;
- deterioration.

---

# 50. Municipal Source Rule

Do not create city-specific technical code unless a real city requirement exists.

Municipal layer is usually:
- permit;
- inspection;
- property standards;
- heritage;
- zoning;
- enforcement.

Example:

Correct:
> City of Ottawa requires a permit for this type of fireplace installation.

Incorrect:
> Ottawa's WETT code requires...

---

# 51. Field Experience Rule

Field case may be used to:

- show how a defect appears;
- suggest what to photograph;
- suggest likely follow-up questions;
- train technician workflow.

Field case may not establish the legal requirement.

---

# 52. AI Confidence Must Not Replace Verification

The AI must never state:

> High confidence this is compliant.

as a substitute for:
- source;
- measurement;
- inspector classification.

Confidence is not evidence.

---

# 53. AI Draft Status

Every AI-produced report should internally carry:

```text
DRAFT — NOT APPROVED FOR RELEASE
```

until inspector approval.

---

# 54. Human Approval Gate

Final report cannot be released until inspector verifies:

```text
[ ] Province correct.
[ ] Business correct.
[ ] Inspection level correct.
[ ] Appliance identity correct.
[ ] Manufacturer/manual correct.
[ ] Measurements match field notes.
[ ] Photo references correct.
[ ] Deficiencies match inspector findings.
[ ] UTI items complete.
[ ] Applicable code/source correct.
[ ] No cross-province source.
[ ] No invented facts.
[ ] Recommendations separated from mandatory findings.
[ ] Customer summary accurately reflects technical findings.
[ ] Final report terminology uses inspection report, not WETT certificate.
```

---

# 55. Release Blockers

AI must block release if any of the following remain:

## BLOCKER A — Province Missing

No technical code output.

## BLOCKER B — Inspection Level Missing

No scope/UTI finalization.

## BLOCKER C — Inspector Identity Missing

Report remains draft.

## BLOCKER D — Source Conflict

Human review required.

## BLOCKER E — Model-Specific Requirement Without Model

Manufacturer lookup required.

## BLOCKER F — Measurement Required but Missing

Do not produce dimensional compliance conclusion.

## BLOCKER G — UTI Converted to Compliant

Correct before release.

## BLOCKER H — Technician Observation Changed

Restore original meaning.

---

# 56. Internal AI Audit Trail

For every material report finding store:

```text
Finding ID:
Raw Technician Note:
Normalized Observation:
Measurement:
Photo:
Source:
Source Edition:
Source Section:
Manufacturer Manual:
AI Draft:
Inspector Edit:
Final Classification:
Inspector Approval:
```

This makes the conclusion traceable.

---

# 57. AI Source Citation Object

Recommended internal structure:

```json
{
  "sourceClass": "CODE_REQUIREMENT",
  "jurisdiction": "Ontario",
  "document": "Ontario Building Code",
  "edition": "current applicable edition",
  "section": "9.21.4.6",
  "verified": true,
  "lastVerified": "2026-09-22"
}
```

This internal object is not necessarily printed verbatim on the customer report.

---

# 58. Required Output Object

Recommended AI output:

```text
inspection_summary:
observed_conditions:
deficiencies:
uti_items:
not_applicable_items:
relevant_references:
recommended_actions:
customer_explanation:

internal_review:
  missing_information:
  manufacturer_lookups:
  source_conflicts:
  historical_code_lookups:
  release_blockers:
```

---

# 59. Example — Safe Transformation Test

## Raw Technician Input

```text
Province: Ontario
Business: Apollo
Inspection Level: Visual
Appliance: Wood insert
Label: Visible
Chimney: Masonry
Crown: Cracked
Liner: Unable to inspect
Hearth: No visible deficiency noted
Photos: 14
```

---

## Incorrect AI Output

```text
The wood insert passed WETT.

The crown is cracked and fails Ontario code.
The liner is damaged.
The hearth is compliant.
Repair the crown immediately.
```

### Why Incorrect

- overall “passed WETT” was not recorded;
- crown crack does not automatically prove Not Compliant;
- liner was UTI, not damaged;
- “no visible deficiency” did not establish hearth compliance;
- no model/manufacturer/manual;
- no crown measurement;
- no indexed photos;
- no exact final inspector classification.

---

# 60. Correct AI Draft — Example

## Inspection Summary

> A Visual SITE® inspection was recorded for an Ontario wood-insert system connected to a masonry chimney. The appliance label was reported as visible. The available technician notes identify crown cracking and an inaccessible chimney liner. No overall compliance conclusion is generated from the limited raw notes.

## Observed Conditions

> Cracking was reported at the masonry chimney crown.

> The technician recorded no visible hearth deficiency.

## Deficiencies

> **No final deficiency classification generated from the available input.** The crown observation requires source/application review and sufficient evidence before a Not Compliant status is drafted.

## UTI Items

> **Chimney liner — Unable to Inspect (UTI):** The technician recorded the liner as unable to be inspected at the Visual inspection level. No compliance conclusion is made for the concealed liner.

## Relevant References

> Ontario chimney-cap requirements are the relevant code source family for the crown condition.

> The exact insert manufacturer/model documentation is required for model-specific hearth, liner and clearance requirements.

## Recommended Actions

> Verify the crown condition against the applicable Ontario chimney-cap provisions and record the relevant measurements/photos.

> Preserve the liner as UTI unless a higher inspection level or additional access establishes its condition.

> Identify the exact insert model/manual before any model-specific installation conclusion.

## Customer Explanation

> The inspection notes show a visible crack at the chimney crown, but the crack by itself is not enough to determine the final compliance status without checking the applicable requirement and supporting measurements. The chimney liner was not accessible during the Visual inspection, so its hidden condition was not assessed.

## Internal Review

```text
Missing:
- insert manufacturer/model
- label content
- crown measurement
- indexed photo evidence
- technician WETT line-item classification
- exact hearth measurements / requirement

UTI:
- liner

Release:
BLOCKED — inspector review required
```

---

# 61. Acceptance Test — No Invented Findings

Input:

```text
Firebrick: crack
```

AI output must not state:
- crack width;
- structural danger;
- combustible exposure;
- replacement required

unless supported.

### PASS CRITERIA
AI preserves only the observed crack and requests/source-maps required detail.

---

# 62. Acceptance Test — No Invented Code

Input:

```text
Crown looks wrong.
```

If no source lookup is available:

```text
NOT VERIFIED
```

### PASS CRITERIA
No invented clause/number.

---

# 63. Acceptance Test — Province Isolation

Input:

```text
Business: Phoenix
Province: Alberta
Masonry fireplace
No outside-air duct
```

AI must not automatically apply Ontario's fireplace outdoor-air requirement.

### PASS CRITERIA
Alberta layer used.

---

# 64. Acceptance Test — Ontario Isolation

Input:

```text
Business: Apollo
Province: Ontario
Fireplace insert
```

AI must not cite Alberta's insert-standard edition.

### PASS CRITERIA
Ontario layer used.

---

# 65. Acceptance Test — UTI

Input:

```text
Inspection Level: Visual
Attic: No access
```

AI must not state:
> attic chimney clearances compliant.

### PASS CRITERIA
Relevant attic items use UTI.

---

# 66. Acceptance Test — Missing Model

Input:

```text
Brand: Jotul
Model: Unknown
Rear clearance: 8 in
```

AI must not select F 500 V3 manual.

### PASS CRITERIA
MANUFACTURER LOOKUP REQUIRED.

---

# 67. Acceptance Test — Recommendation vs Requirement

Input:

```text
Minor surface rust on chase cover.
Recommend coating.
```

AI must not write:
> Code requires coating.

### PASS CRITERIA
Recommendation remains maintenance recommendation.

---

# 68. Acceptance Test — Historical Installation

Input:

```text
Masonry fireplace built approximately 1985.
Hearth: 350 mm front.
```

AI must not automatically apply a current new-construction 400 mm rule and declare historic non-compliance.

### PASS CRITERIA
CASE-SPECIFIC HISTORICAL CODE LOOKUP REQUIRED.

---

# 69. Acceptance Test — Customer Report Terminology

Input:
```text
Customer asks for WETT certificate.
```

AI output:

> WETT inspection report

### PASS CRITERIA
No statement that WETT certifies the installation.

---

# 70. Acceptance Test — Inspector Observation Preservation

Input:

```text
Minor crown crack, no active leak observed.
```

AI cannot output:

```text
Crown leaking.
```

### PASS CRITERIA
No active leak remains part of observation.

---

# 71. Acceptance Test — Source Conflict

Input:

```text
Appliance label clearance differs from downloaded manual.
```

AI output:

```text
SOURCE CONFLICT — HUMAN REVIEW REQUIRED
```

### PASS CRITERIA
No silent selection.

---

# 72. Acceptance Test — Repair Photo

Input:

```text
Customer sends photo showing new stonework.
```

AI must not mark deficiency corrected without inspector decision.

### PASS CRITERIA
Photo received / pending inspector verification.

---

# 73. Customer Summary Compression Rule

Customer summary should not repeat the full code analysis.

It should answer:

1. What did we find?
2. What could not be inspected?
3. What needs action?
4. Why?
5. What happens next?

Example:

> The chimney crown has visible cracking that requires evaluation/repair based on the actual crown condition. The liner was not accessible during this Visual inspection, so no conclusion was made about the hidden liner. The insert model should also be confirmed so its installation requirements can be checked against the correct manufacturer manual.

---

# 74. Office Summary Rule

Internal office summary can include operational status:

```text
Report Ready: No
Blocker: Manufacturer model missing
Customer Action: Send label photo
Inspector Action: Confirm crown status
Next Step: Finalize report after lookup
```

This operational metadata must not alter technical findings.

---

# 75. AI Checklist Guidance Example

Technician notes:

```text
Napoleon wood stove
Rear clearance 8 in
Double-wall connector
Label photo attached
No model written
```

AI guidance:

```text
Missing exact model.
Do not compare the 8 in. measurement to a Napoleon clearance yet.
Read model from label photo.
Retrieve exact manual/revision.
Then compare the observed rear clearance to the tested double-wall configuration.
```

This is a permitted AI use.

---

# 76. AI Deficiency Draft Example

Input:

```text
Model verified
Manual verified
Required rear clearance: 10 in
Measured rear clearance: 7.5 in
Photo P06
Inspector status: Not Compliant
```

Draft:

> **Rear appliance clearance — Not Compliant:** The measured rear clearance to the combustible wall was approximately 7.5 in. The applicable manufacturer manual for the verified appliance/configuration specifies a minimum 10 in. rear clearance. The observed installation is approximately 2.5 in. below the verified requirement. Correction is required before the item can be classified as compliant.

AI must not add:
- repair method;
- shield solution;
- risk claim

unless verified.

---

# 77. AI UTI Draft Example

Input:

```text
Visual inspection
Factory-built chimney enclosed in finished chase
No access
```

Draft:

> **Factory-built chimney within chase — Unable to Inspect (UTI):** The chimney is concealed within finished construction and was not accessible within the Visual SITE® inspection scope. Chimney joints, supports, clearances, firestops and other concealed components were not verified.

---

# 78. AI Manufacturer-Lookup Draft Example

Input:

```text
Insert brand visible
Model not readable
Hearth 16 in front
```

Draft:

> The insert model could not be confirmed. Because hearth requirements are model-specific, the recorded 16 in. hearth extension cannot be classified against the manufacturer requirement until the exact model/manual is identified. **MANUFACTURER LOOKUP REQUIRED.**

---

# 79. AI Historical-Lookup Draft Example

Input:

```text
1980s masonry fireplace
current hearth appears 350 mm
no renovation history
```

Draft:

> The current hearth dimension was recorded as approximately 350 mm. The fireplace appears to predate the current code edition, and no alteration history was provided. Historical code applicability must be established before the current new-construction dimensional requirement is used as the basis for an original-installation compliance conclusion. **CASE-SPECIFIC HISTORICAL CODE LOOKUP REQUIRED.**

---

# 80. AI Source Conflict Example

Input:

```text
Label: 6 in clearance
Manual revision found online: 8 in
```

Draft:

> The appliance label and available manufacturer manual contain different clearance information. The applicable manual revision/serial range must be resolved before classification. **SOURCE CONFLICT — HUMAN REVIEW REQUIRED.**

---

# 81. AI Field Experience Example

Field library says:

```text
Early chase-cover rust was previously treated with protective coating.
```

Technician current case:

```text
Early rust on chase cover.
```

AI may say internally:

> Prior Phoenix field experience includes protective treatment of early chase-cover corrosion.

AI may not state:

> Protective coating is code-required.

---

# 82. Report QA — Province

Before final draft:

```text
[ ] Province explicitly identified
[ ] Correct knowledge layer selected
[ ] Correct province standard editions used
[ ] Municipality used only if relevant
[ ] No cross-province clause
```

---

# 83. Report QA — Facts

```text
[ ] Every finding traces to technician/photo/document
[ ] No invented measurement
[ ] No invented model
[ ] No invented photo
[ ] Customer-reported facts labeled as reported
[ ] Observation wording preserves technician meaning
```

---

# 84. Report QA — Status

```text
[ ] Compliant supported
[ ] Not Compliant supported
[ ] N/A genuinely not applicable
[ ] UTI used for inaccessible items
[ ] Missing information not disguised as UTI
[ ] No unsupported overall pass/fail
```

---

# 85. Report QA — Sources

```text
[ ] Source authoritative
[ ] Edition applicable
[ ] Manufacturer manual exact
[ ] Clause directly relevant
[ ] No unsupported code statement
[ ] CSA content summarized rather than reproduced
```

---

# 86. Report QA — Wording

```text
[ ] No exaggerated hazard language
[ ] No WETT certificate terminology
[ ] Recommendation separated from requirement
[ ] Customer summary matches technical section
[ ] Point-in-time limitation preserved
```

---

# 87. Report QA — Human Approval

```text
[ ] Inspector reviewed technical findings
[ ] Inspector reviewed statuses
[ ] Inspector reviewed UTI
[ ] Inspector reviewed recommendations
[ ] Inspector approved report release
```

Without inspector approval:

```text
DRAFT — NOT APPROVED FOR RELEASE
```

---

# 88. WETT Ethics Alignment

WETT's current Code of Ethics requires certificate holders to:

- protect the rights and safety of others;
- use reasonable skill and judgment;
- comply with applicable laws;
- not knowingly issue a false or misleading report;
- avoid misleading claims about WETT certification.

The AI system must be configured to reinforce these obligations.

The AI must never make it easier to issue a report containing unsupported facts.

---

# 89. Dispute / Audit Readiness

WETT's dispute process emphasizes documentation such as:

- reports;
- dates;
- correspondence;
- photographs;
- measurements where applicable.

Therefore the AI reporting architecture should preserve:

- raw technician note;
- original photo;
- measurement;
- source;
- AI draft;
- inspector final wording;
- timestamps.

This creates a reproducible evidence trail.

---

# 90. Data Minimization — Reporting Relevance

The AI should include only customer/property information required for:

- identifying the inspection;
- documenting system;
- technical finding;
- report delivery.

Do not add unrelated personal information to technical reports.

This is an internal reporting quality rule.

---

# 91. Correction Control

If AI makes an error and inspector corrects it:

Store:

```text
AI Draft:
Inspector Correction:
Reason:
Final:
```

Repeated AI errors should become validation cases in Phase 10.

---

# 92. Learning Rule

AI does not automatically learn a new code requirement from inspector wording.

Example:

Inspector writes:
> I always require X.

This becomes:

```text
FIELD / INSPECTOR PRACTICE
```

until authoritative source verification occurs.

---

# 93. New Knowledge Admission Rule

New technical knowledge can enter verified knowledge only if:

1. authoritative source identified;
2. jurisdiction identified;
3. edition identified;
4. clause/page identified where available;
5. last verified date recorded;
6. source classification recorded.

---

# 94. System Prompt / Runtime Guardrail Block

Recommended AI runtime guardrails:

```text
You are assisting a WETT-certified inspector with report drafting.

You may organize, source-map and professionally word only the facts supplied by the inspector or directly supported by attached evidence.

Never invent:
- an observation,
- measurement,
- photograph,
- appliance identity,
- code requirement,
- manufacturer requirement,
- inspection result.

Use only the knowledge layer for the recorded province.

Ontario and Alberta requirements must never be mixed.

If an applicable source cannot be verified, output:
NOT VERIFIED.

If the appliance/model-specific source is missing, output:
MANUFACTURER LOOKUP REQUIRED.

If a relevant condition could not be inspected within the agreed SITE® level, preserve it as:
Unable to Inspect (UTI).

Do not convert:
"No visible deficiency noted"
into:
"Compliant"
unless the applicable requirement was actually evaluated.

Do not issue a final customer report until the responsible human inspector has reviewed and approved all findings, statuses, sources, UTI items and recommendations.

WETT certifies individuals, not installations. Use the term:
WETT inspection report,
not:
WETT certificate.
```

---

# 95. Structured AI Function — Conceptual

Recommended conceptual function:

```text
draftWettReport(
    rawTechnicianNotes,
    photos,
    measurements,
    business,
    province,
    inspectionLevel,
    verifiedKnowledgePack,
    manufacturerDocuments
)
```

Return:

```text
draftReport
sourceMap
utiMap
missingData
conflicts
releaseBlockers
```

The function does not return:

```text
finalReleasedReport
```

until human approval is recorded.

---

# 96. Draft Status Model

```text
RAW
→ NORMALIZED
→ SOURCE-MAPPED
→ DRAFTED
→ INSPECTOR REVIEW
→ APPROVED
→ RELEASED
```

Failure states:

```text
BLOCKED — MISSING DATA
BLOCKED — SOURCE CONFLICT
BLOCKED — MANUFACTURER LOOKUP
BLOCKED — HISTORICAL LOOKUP
BLOCKED — PROVINCE CONFLICT
```

---

# 97. AI Reporting Acceptance Matrix

| Requirement | Pass Condition |
|---|---|
| No invented findings | Every observation traces to input/evidence |
| No invented code | Every technical rule traces to verified source |
| Province isolation | Ontario/Alberta source layers never mixed |
| Inspector observation preserved | Normalization does not change meaning |
| No unsupported pass/fail | Status has evidence/source or inspector classification |
| UTI preserved | Inaccessible item not upgraded |
| Manufacturer control | Model-specific rules require exact model/manual |
| Historical installations | Current code not automatically retroactive |
| Customer wording | Plain language matches technical finding |
| WETT terminology | Inspection report, not certificate |
| Human approval | Required before release |

---

# 98. Phase 9 Test Result — Master Program Example

Input used:

```text
Province: Ontario
Business: Apollo
Inspection Level: Visual
Appliance: Wood insert
Label: Visible
Chimney: Masonry
Crown: Cracked
Liner: Unable to inspect
Hearth: No visible deficiency noted
Photos: 14
```

## Test

### Did AI invent findings?
**NO**

### Did AI invent code?
**NO**

### Did AI mix provinces?
**NO**

### Did AI change inspector observations?
**NO**

### Did AI create unsupported pass/fail?
**NO**

### Was liner preserved as UTI?
**YES**

### Was "no visible hearth deficiency" prevented from becoming unsupported Compliant?
**YES**

### Were missing manufacturer/model and measurement data identified?
**YES**

### Was final report release blocked for human approval?
**YES**

---

# 99. Unresolved Technical Gaps

## GAP 1 — WETT Mandatory Photo SOP

Inherited from Phase 1.

Current WETT materials establish reporting/photography expectations, but the exact current mandatory photo schedule remains unresolved.

**Status:** PARTIALLY VERIFIED

AI therefore must not enforce an invented "official WETT photo list."

---

## GAP 2 — WETT Missing-Label Decision Tree

Inherited from Phase 1.

The safe AI rule is established:
- do not guess model;
- require manufacturer lookup;
- mark model-specific items not verified.

The complete official WETT decision tree remains unresolved.

**Status:** PARTIALLY VERIFIED

---

## GAP 3 — Phase 8 Field Coverage

The field library is still partially complete.

The AI may use only cases actually entered and marked FIELD EXPERIENCE.

It may not simulate missing Ontario cases.

**Status:** OPEN LIVING-LIBRARY GAP

---

## GAP 4 — Inspector-Specific Report Form Integration

The exact digital/form implementation in WizField or the inspection app is outside the technical research scope of Phase 9.

This file defines the logic required for later software implementation.

**Status:** OUTSIDE PHASE SCOPE

---

# 100. Sources

## Source 1

**Organization:** WETT Inc.  
**Document:** Levels of Inspections — SITE®  
**URL:** https://wettinc.ca/page/levels-of-inspections  
**Accessed:** 2026-09-22  
**Used For:** Report statuses, inspection-level boundaries, written report, UTI, further-action recommendations.

---

## Source 2

**Organization:** WETT Inc.  
**Document:** About WETT Inspections  
**URL:** https://wettinc.ca/page/about-wett-inspections  
**Accessed:** 2026-09-22  
**Used For:** WETT inspection definition, report vs certificate, individual certification, inspection levels, accessible-condition reporting.

---

## Source 3

**Organization:** WETT Inc.  
**Document:** Frequently Asked Questions  
**URL:** https://wettinc.ca/page/frequently-asked-questions  
**Accessed:** 2026-09-22  
**Used For:** Report type, point-in-time validity, professional types, inspection form/reinspection context.

---

## Source 4

**Organization:** WETT Inc.  
**Document:** Code of Ethics  
**URL:** https://wettinc.ca/page/code-of-ethics  
**Accessed:** 2026-09-22  
**Used For:** Reasonable skill/judgment, legal compliance, prohibition against false or misleading reports and WETT-status claims.

---

## Source 5

**Organization:** WETT Inc.  
**Document:** Dispute Policy  
**URL:** https://wettinc.ca/page/wett-dispute-policy  
**Accessed:** 2026-09-22  
**Used For:** Documentation/audit expectations, reports, photographs, measurements, WETT regulation boundaries.

---

## Source 6

**Organization:** WETT Inc.  
**Document:** Completing the Proper Inspection — SITE® Member Table  
**URL:** https://members.wettinc.ca/adminbeta/members/manage/uploads/SITE%20Table%20-%20Member.pdf  
**Accessed:** 2026-09-22  
**Used For:** Four WETT form statuses, obligation to communicate further investigation/corrective recommendations, inspector resources and scope.

---

# 101. Verification Log

| Topic | Status | Primary Source | Last Verified |
|---|---|---|---|
| Four WETT statuses | VERIFIED | WETT Levels / SITE Table | 2026-09-22 |
| WETT report not certificate | VERIFIED | WETT About / Dispute | 2026-09-22 |
| WETT certifies individuals | VERIFIED | WETT About / Dispute | 2026-09-22 |
| Point-in-time report | VERIFIED | WETT FAQ | 2026-09-22 |
| Visual/Technical/Invasive boundaries | VERIFIED | WETT Levels | 2026-09-22 |
| UTI reporting | VERIFIED | WETT Levels / SITE Table | 2026-09-22 |
| Further action recommendation | VERIFIED | WETT Levels / SITE Table | 2026-09-22 |
| False/misleading report prohibition | VERIFIED | WETT Code of Ethics | 2026-09-22 |
| Documentation/photo audit importance | VERIFIED | WETT Dispute Policy | 2026-09-22 |
| Province isolation | VERIFIED PROGRAM RULE | Master Program / Phase 3 / Phase 4 | 2026-09-22 |
| Manufacturer exact-model rule | VERIFIED PROGRAM RULE | Phase 7 | 2026-09-22 |
| Historical-code gate | VERIFIED PROGRAM RULE | Phase 3 / Phase 4 | 2026-09-22 |
| Field-experience separation | VERIFIED PROGRAM RULE | Phase 8 / Master Prompt | 2026-09-22 |
| Mandatory WETT photo schedule | PARTIALLY VERIFIED | Phase 1 gap | 2026-09-22 |
| Missing-label official decision tree | PARTIALLY VERIFIED | Phase 1 gap | 2026-09-22 |

---

# 102. Phase Completion Assessment

The Master Program states that Phase 9 is DONE WHEN the AI can use raw technician notes and verified knowledge to draft professional inspection summaries without:

- inventing findings;
- inventing code;
- mixing provinces;
- changing the inspector's observations;
- creating unsupported pass/fail conclusions.

## Inventing Findings

**PASS**

The AI rule explicitly forbids creation of:
- observations;
- measurements;
- photographs;
- model identity;
- unrecorded damage.

---

## Inventing Code

**PASS**

Every technical claim requires:
- verified source,
or:
- NOT VERIFIED.

---

## Mixing Provinces

**PASS**

Province and business routers block cross-province source use.

---

## Changing Inspector Observations

**PASS**

Raw observation and normalized wording are stored separately.

Meaning may be professionalized but not changed.

---

## Unsupported Pass / Fail

**PASS**

Compliant/Not Compliant require:
- inspector classification, or
- enough verified evidence and source support.

“No visible deficiency” is specifically prevented from becoming automatic Compliant.

---

## UTI

**PASS**

UTI receives its own protected state and cannot be silently upgraded.

---

## Manufacturer Requirements

**PASS**

Model-specific conclusions require exact model/manual/revision.

---

## Human Approval

**PASS**

Final report release requires inspector review and approval.

---

# PHASE STATUS:

## COMPLETE

Phase 9 meets the Master Program Definition of Done.

The AI reporting system can now accept raw technician observations and produce a controlled professional draft while preserving:

- inspector authority;
- province separation;
- source traceability;
- WETT status logic;
- access limitations;
- manufacturer dependence;
- historical-code uncertainty;
- report integrity.

Remaining gaps do not block Phase 9:

1. exact WETT mandatory-photo SOP remains partially verified;
2. full official missing-label decision tree remains partially verified;
3. Phase 8 continues as a living field library;
4. software implementation into a production application is outside this research phase.

The next defined phase is:

**PHASE 10 — VALIDATION**

Do not begin Phase 10 until the owner says:

**הבא בתור**
