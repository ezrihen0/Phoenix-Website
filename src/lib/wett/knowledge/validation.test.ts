import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

import { validateWettReportForFinalization } from "./completion-gate";
import { DEFECT_FAMILIES, defectPrompts } from "./defects";
import {
  albertaRequiresAnnualSweep,
  automaticFindingFromConcern,
  classificationForSelectedDefect,
  clearanceDeficiencySupported,
  ontarioOutdoorAirApplies,
  retroactiveCurrentCodeDeficiency,
  routeAccessReason,
  statusFromNoVisibleDeficiency,
} from "./engines";
import { activeChimneyRoute, applicableItems } from "./index";
import { runManufacturerLookup } from "../manufacturer-lookup";
import { MANUFACTURER_CLEARANCES_ENCODED } from "./manufacturer-routing";
import { PHOENIX_ALBERTA } from "./phoenix-alberta";
import { factoryBuiltFireplaceWorkflow } from "./systems/factory-built-fireplace";
import { woodStoveWorkflow } from "./systems/wood-stove";
import {
  CLEANING_ITEM_ID,
  CLEANING_REQUIRED_TEXT,
  CLEANING_TECHNICAL_BASIS,
  cleaningEvidenceOpen,
  cleaningLocationsFor,
  cleaningRecommendationCopy,
  cleaningReportVisible,
  cleaningRequiredFromLastCleaningDate,
  sanitizeCleaning,
} from "../cleaning";
import { buildWettReportViewModel } from "../report-view-model";
import { createEmptyWettReport, editableFromReport, applyEditableDraft, parseWettReport, type WettChecklistItem, type WettReport } from "../schema";
import { measurementClassificationIssue, measurementOutputLines, sanitizeMeasurements } from "../measurements";
import { measurementProfileFor } from "./measurement-profiles";
import { identificationLines, sanitizeSystem, switchedSystemDraft } from "../system-profile";

function reportFor(type: WettReport["system"]["type"], chimneyType?: "masonry" | "factory-built" | "unknown", route?: "factory-chase" | "factory-direct" | "unknown") {
  const report = createEmptyWettReport({
    id: randomUUID(),
    reportNumber: "PHX-WETT-2026-00002",
    username: "office",
    now: "2026-09-22T12:00:00.000Z",
  });

  report.property.addressLine = "10 Example Road";
  report.property.province = "AB";
  report.inspection.inspectionDate = "2026-09-22";
  report.inspection.inspectionLevel = "visual";
  report.inspection.inspectorName = "Michael";
  report.inspection.wettInspectorNumber = "WETT-1";
  if (route) report.venting = { route };
  report.system = sanitizeSystem({
    type,
    manufacturer: type === "masonry-fireplace" ? undefined : "Regency",
    model: type === "masonry-fireplace" ? undefined : "Recorded model",
    chimneyType: type === "wood-stove" ? chimneyType : undefined,
  });
  report.measurements = sanitizeMeasurements(report.system, {
    hearth: {
      frontExtensionInches: 18,
      leftExtensionInches: 8,
      rightExtensionInches: 8,
      rearExtensionInches: type === "wood-stove" || type === "fireplace-insert" ? 4 : undefined,
    },
  });
  report.checklist = applicableItems(report).map(
    (item): WettChecklistItem => ({
      id: item.id,
      status: "compliant",
    }),
  );
  report.cleaning = {
    deposits: "none",
    assessment: "no-cleaning-indicated",
    locations: [],
  };
  report.signOff.inspectorApproved = true;
  report.signOff.classificationReviewed = true;
  report.signOff.scopeReviewed = true;
  return report;
}

function setItem(report: WettReport, id: string, patch: Partial<WettChecklistItem>) {
  report.checklist = report.checklist.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

assert.equal(DEFECT_FAMILIES.length, 28);
assert.equal(classificationForSelectedDefect(), undefined);
assert.equal(defectPrompts("cracked-chimney-crown").includes("Crack width"), true);
assert.equal(statusFromNoVisibleDeficiency(), undefined);
assert.equal(retroactiveCurrentCodeDeficiency(), false);
assert.equal(albertaRequiresAnnualSweep(), false);
assert.equal(ontarioOutdoorAirApplies(), false);
assert.equal(PHOENIX_ALBERTA.importsOntario, false);
assert.equal(MANUFACTURER_CLEARANCES_ENCODED, false);
assert.equal(automaticFindingFromConcern(), undefined);
assert.equal(routeAccessReason("inaccessible").status, "unable-to-inspect");
assert.equal(routeAccessReason("forgotten-measurement").workflowControl, "incomplete-input");
assert.equal(routeAccessReason("forgotten-measurement").status, undefined);
assert.equal(routeAccessReason("missing-manual").workflowControl, "manufacturer-lookup-required");
assert.equal(routeAccessReason("unknown-model").workflowControl, "manufacturer-lookup-required");
assert.equal(routeAccessReason("unresolved-source").workflowControl, "not-verified");
assert.equal(clearanceDeficiencySupported(12, "manual revision 3, 8 in"), true);
assert.equal(clearanceDeficiencySupported(undefined, "manual revision 3"), false);

const legacy = createEmptyWettReport({
  id: randomUUID(),
  reportNumber: "PHX-WETT-2026-00001",
  username: "office",
  now: "2026-09-22T12:00:00.000Z",
});
const raw = JSON.parse(JSON.stringify(legacy)) as {
  system: { type?: string };
  measurements: { hearth?: { sideExtensionInches?: number; leftExtensionInches?: number; thicknessInches?: number } };
  checklist?: unknown;
  business?: unknown;
};
raw.system = { type: "wood-stove" };
raw.measurements.hearth = { sideExtensionInches: 9, thicknessInches: 2 };
delete raw.checklist;
delete raw.business;
const parsedLegacy = parseWettReport(raw);
assert.equal(parsedLegacy.measurements.items.find((item) => item.id === "ws-hearth-left")?.observed, 9);
assert.equal(parsedLegacy.measurements.items.some((item) => item.id === "mf-opening-width"), false);
assert.equal(parsedLegacy.property.province, "AB");
assert.deepEqual(parsedLegacy.checklist, []);

const attic = reportFor("masonry-fireplace");
setItem(attic, "mf-attic", {
  status: "unable-to-inspect",
  uti: { component: "Attic", reason: "inaccessible", notVerified: "Attic components were not accessed.", nextAction: "Technical inspection if verification is required." },
});
assert.equal(validateWettReportForFinalization(attic).ok, true);

const hiddenInsert = reportFor("fireplace-insert");
setItem(hiddenInsert, "ins-liner-connection", {
  status: "unable-to-inspect",
  uti: { component: "Liner connection", reason: "concealed", notVerified: "The connection is hidden.", nextAction: "Invasive access if verification is required." },
});
assert.equal(hiddenInsert.checklist.find((item) => item.id === "ins-liner-connection")?.status, "unable-to-inspect");
assert.notEqual(hiddenInsert.checklist.find((item) => item.id === "ins-liner-connection")?.status, "not-compliant");

const crown = reportFor("masonry-fireplace");
crown.findings.push({
  id: randomUUID(),
  defectFamily: "cracked-chimney-crown",
  observation: "Crown cracked.",
  classification: classificationForSelectedDefect(),
});
assert.equal(crown.findings[0]?.classification, undefined);
assert.equal(validateWettReportForFinalization(crown).blockers.some((blocker) => blocker.includes("Not Compliant")), false);

const missingLabel = reportFor("factory-built-fireplace");
if (missingLabel.system.type === "factory-built-fireplace") {
  missingLabel.system.manufacturer = undefined;
  missingLabel.system.model = undefined;
}
setItem(missingLabel, "fb-model", { status: undefined, workflowControl: "manufacturer-lookup-required" });
setItem(missingLabel, "fb-manual", { status: undefined, workflowControl: "not-verified" });
assert.equal(validateWettReportForFinalization(missingLabel).blockers.some((blocker) => blocker.includes("guess")), false);
assert.equal(missingLabel.checklist.find((item) => item.id === "fb-model")?.workflowControl, "manufacturer-lookup-required");

const clearance = reportFor("wood-stove");
setItem(clearance, "ws-clearances", {
  status: "not-compliant",
  observation: "Rear clearance is less than the recorded requirement.",
  sourceReference: "Manufacturer manual, revision recorded by inspector",
  sourceVerifiedRequirement: "Recorded rear clearance requirement 8 in",
});
assert.equal(validateWettReportForFinalization(clearance).ok, true);

const deposits = reportFor("wood-stove");
assert.equal(deposits.checklist.some((item) => item.id === "ws-fire-code"), true);
assert.match(woodStoveWorkflow.sections.find((section) => section.id === "fire-code")?.items[0]?.instructions || "", /one sweep every year/);
assert.equal(albertaRequiresAnnualSweep(), false);

const historic = reportFor("masonry-fireplace");
if (historic.system.type === "masonry-fireplace") {
  historic.system.homeBuiltYearStatus = "unknown";
}
assert.equal(retroactiveCurrentCodeDeficiency(), false);
assert.equal(historic.checklist.find((item) => item.id === "mf-hearth")?.status, "compliant");

const fireConcealed = reportFor("masonry-fireplace");
fireConcealed.inspection.knownChimneyFire = "yes";
setItem(fireConcealed, "mf-liner", {
  status: "unable-to-inspect",
  uti: { component: "Liner", reason: "concealed", notVerified: "Liner after the reported chimney fire was not accessed.", nextAction: "Further access if verification is required." },
});
assert.equal(fireConcealed.checklist.find((item) => item.id === "mf-liner")?.status, "unable-to-inspect");

assert.match(factoryBuiltFireplaceWorkflow.sections.find((section) => section.id === "air")?.items[0]?.instructions || "", /Do not apply Ontario/);

const exactRequirement = reportFor("wood-stove");
assert.equal(clearanceDeficiencySupported(exactRequirement.measurements.items.find((item) => item.id === "ws-hearth-front")?.observed, "Inspector-entered manufacturer requirement for this model"), true);
assert.equal(MANUFACTURER_CLEARANCES_ENCODED, false);

const concealedChimney = reportFor("factory-built-fireplace", undefined, "factory-chase");
setItem(concealedChimney, "fb-concealed", {
  status: "unable-to-inspect",
  uti: { component: "Concealed chimney", reason: "inaccessible", notVerified: "The concealed section was not accessed.", nextAction: "Access if verification is required." },
});
assert.equal(concealedChimney.checklist.find((item) => item.id === "fb-concealed")?.status, "unable-to-inspect");

const mixed = reportFor("factory-built-fireplace");
setItem(mixed, "fb-compatibility", { status: undefined, workflowControl: "manufacturer-lookup-required" });
assert.equal(mixed.checklist.find((item) => item.id === "fb-compatibility")?.status, undefined);
assert.equal(mixed.checklist.find((item) => item.id === "fb-compatibility")?.workflowControl, "manufacturer-lookup-required");

const concern = reportFor("wood-stove");
concern.notes.generalTechnicianNote = "Customer is concerned about the hearth.";
assert.equal(automaticFindingFromConcern(), undefined);
assert.equal(concern.findings.length, 0);

const missingMeasurement = reportFor("wood-stove");
missingMeasurement.measurements = sanitizeMeasurements(missingMeasurement.system, {
  items: [{ id: "ws-clearance-rear", status: "compliant", observed: 170, unit: "mm" }],
});
const missingGate = validateWettReportForFinalization(missingMeasurement);
assert.equal(missingGate.ok, false);
assert.equal(missingGate.blockers.some((blocker) => blocker.startsWith("Incomplete input")), true);
assert.equal(missingGate.blockers.some((blocker) => blocker.includes("Unable to Inspect")), false);
assert.equal(missingMeasurement.measurements.items.find((item) => item.id === "ws-clearance-rear")?.status, "compliant");
assert.equal(routeAccessReason("forgotten-measurement").status, undefined);

const noVisible = reportFor("wood-stove");
setItem(noVisible, "ws-condition", { observation: "No visible deficiency." });
assert.equal(statusFromNoVisibleDeficiency(), undefined);
assert.notEqual(statusFromNoVisibleDeficiency(), "compliant");

const unapproved = reportFor("wood-stove");
unapproved.signOff.inspectorApproved = false;
unapproved.notes.aiCandidateNote = "Rewritten note";
const approvalGate = validateWettReportForFinalization(unapproved);
assert.equal(approvalGate.ok, false);
assert.equal(approvalGate.blockers.some((blocker) => blocker.includes("Human inspector approval")), true);

const province = reportFor("wood-stove");
province.property.province = "ON";
assert.equal(validateWettReportForFinalization(province).blockers.some((blocker) => blocker.includes("Province source conflict")), true);

const legacyWood = parseWettReport({
  ...createEmptyWettReport({
    id: randomUUID(),
    reportNumber: "PHX-WETT-2026-00001",
    username: "office",
    now: "2026-09-22T12:00:00.000Z",
  }),
  system: {
    type: "wood-stove",
    manufacturer: "Regency",
    installationDateStatus: "known",
    installationDate: "2014-05-01",
    chimneyType: "Masonry",
    linerType: "Clay",
    chimneyManufacturer: "Selkirk",
    connectorType: "Single-Wall",
    applianceType: "stove",
    manufacturingDate: "2010",
  },
});
assert.equal(legacyWood.system.type, "wood-stove");
if (legacyWood.system.type === "wood-stove") {
  assert.equal(legacyWood.system.manufacturer, "Regency");
  assert.equal(legacyWood.system.installationYear, "2014");
  assert.equal(legacyWood.system.linerType, "clay");
  assert.equal(legacyWood.system.chimneyManufacturer, undefined);
  assert.equal(legacyWood.system.connectorType, "single-wall");
  assert.equal("applianceType" in legacyWood.system, false);
}

const legacyMasonry = parseWettReport({
  ...legacyWood,
  system: {
    type: "masonry-fireplace",
    manufacturer: "Should not stay active",
    model: "Should not stay active",
    installationDate: "1998-01-01",
    linerType: "clay",
    connectorType: "single-wall",
  },
});
assert.equal(legacyMasonry.system.type, "masonry-fireplace");
if (legacyMasonry.system.type === "masonry-fireplace") {
  assert.equal("manufacturer" in legacyMasonry.system, false);
  assert.equal(legacyMasonry.system.homeBuiltYear, undefined);
  assert.equal(legacyMasonry.system.linerType, "clay");
}
assert.equal(identificationLines(legacyMasonry.system).some((line) => line.label === "Manufacturer"), false);
assert.equal(validateWettReportForFinalization(reportFor("masonry-fireplace")).blockers.some((blocker) => blocker.includes("Manufacturer")), false);

const woodMasonry = sanitizeSystem({
  type: "wood-stove",
  chimneyType: "masonry",
  linerType: "stainless",
  chimneyManufacturer: "Selkirk",
  chimneySeries: "HT",
});
assert.equal(woodMasonry.type, "wood-stove");
if (woodMasonry.type === "wood-stove") {
  assert.equal(woodMasonry.linerType, "stainless");
  assert.equal(woodMasonry.chimneyManufacturer, undefined);
}
const woodFactory = sanitizeSystem({
  type: "wood-stove",
  chimneyType: "factory-built",
  linerType: "clay",
  chimneyManufacturer: "Selkirk",
});
if (woodFactory.type === "wood-stove") {
  assert.equal(woodFactory.linerType, undefined);
  assert.equal(woodFactory.chimneyManufacturer, "Selkirk");
}

const altered = sanitizeSystem({ type: "masonry-fireplace", majorAlteration: "yes", alterationYear: "2018" });
const cleared = sanitizeSystem({ ...altered, majorAlteration: "no" });
if (cleared.type === "masonry-fireplace") {
  assert.equal(cleared.alterationYear, undefined);
}
assert.equal(identificationLines(cleared).some((line) => line.label === "Approx. alteration year"), false);

const switched = switchedSystemDraft("masonry-fireplace");
assert.equal(switched.system.type, "masonry-fireplace");
assert.deepEqual(switched.checklist, []);
assert.equal(identificationLines(switched.system).some((line) => line.label === "Manufacturer"), false);

const insertProfile = sanitizeSystem({
  type: "fireplace-insert",
  manufacturer: "Jotul",
  originalFireplaceType: "factory-built",
  originalFireplaceManufacturer: "Heatilator",
  connectorType: "single-wall",
  linerType: "stainless",
});
assert.equal(insertProfile.type, "fireplace-insert");
if (insertProfile.type === "fireplace-insert") {
  assert.equal(insertProfile.originalFireplaceManufacturer, "Heatilator");
  assert.equal("connectorType" in insertProfile, false);
}

const factoryProfile = sanitizeSystem({
  type: "factory-built-fireplace",
  manufacturer: "Heatilator",
  certificationListing: "UL 127",
  chimneyDiameter: 8,
  linerType: "clay",
  connectorType: "single-wall",
});
if (factoryProfile.type === "factory-built-fireplace") {
  assert.equal(factoryProfile.certificationListing, "UL 127");
  assert.equal(factoryProfile.chimneyDiameter, 8);
  assert.equal("linerType" in factoryProfile, false);
  assert.equal("connectorType" in factoryProfile, false);
}

const woodProfile = measurementProfileFor("wood-stove");
assert.equal(woodProfile?.groups.some((group) => group.label === "Appliance Clearances"), true);
assert.equal(woodProfile?.groups.some((group) => group.items.some((item) => item.id === "mf-opening-width")), false);
const woodMasonryMeasures = sanitizeMeasurements(sanitizeSystem({ type: "wood-stove", chimneyType: "masonry" }), {
  items: [
    { id: "ws-masonry-flue", observed: 200, unit: "mm" },
    { id: "ws-chimney-diameter", observed: 8, unit: "in" },
    { id: "mf-hearth-front", observed: 400, unit: "mm" },
  ],
});
assert.equal(woodMasonryMeasures.items.some((item) => item.id === "ws-masonry-flue"), true);
assert.equal(woodMasonryMeasures.items.some((item) => item.id === "ws-chimney-diameter"), false);
assert.equal(woodMasonryMeasures.items.some((item) => item.id === "mf-hearth-front"), false);

const woodFactoryMeasures = sanitizeMeasurements(sanitizeSystem({ type: "wood-stove", chimneyType: "factory-built" }), {
  items: [
    { id: "ws-masonry-flue", observed: 200, unit: "mm" },
    { id: "ws-chimney-diameter", observed: 8, unit: "in" },
  ],
});
assert.equal(woodFactoryMeasures.items.some((item) => item.id === "ws-chimney-diameter"), true);
assert.equal(woodFactoryMeasures.items.some((item) => item.id === "ws-masonry-flue"), false);

const insertMasonryMeasures = sanitizeMeasurements(sanitizeSystem({ type: "fireplace-insert", originalFireplaceType: "masonry" }), {
  items: [
    { id: "ins-opening", observed: 36, unit: "in" },
    { id: "ins-original-compatibility", note: "Should stay off this branch" },
  ],
});
assert.equal(insertMasonryMeasures.items.some((item) => item.id === "ins-opening"), true);
assert.equal(insertMasonryMeasures.items.some((item) => item.id === "ins-original-compatibility"), false);

const masonryScreen = sanitizeMeasurements(sanitizeSystem({ type: "masonry-fireplace" }), {
  items: [{ id: "mf-screen", present: "no" }],
});
assert.equal(masonryScreen.items[0]?.present, "no");
assert.equal(masonryScreen.items[0]?.status, undefined);
assert.equal(measurementClassificationIssue(sanitizeSystem({ type: "masonry-fireplace" }), masonryScreen.items[0]), undefined);
assert.equal(measurementOutputLines(sanitizeSystem({ type: "masonry-fireplace" }), masonryScreen.items).some((line) => line.value.includes("Not Compliant")), false);
assert.equal(measurementProfileFor("masonry-fireplace")?.groups.some((group) => group.items.some((item) => item.id === "ws-clearance-rear")), false);

const factoryChecks = measurementProfileFor("factory-built-fireplace");
assert.equal(factoryChecks?.groups.some((group) => group.items.some((item) => item.id === "fb-doors")), true);
assert.equal(factoryChecks?.groups.some((group) => group.items.some((item) => item.sourceBehavior === "manufacturer")), true);
assert.equal(factoryChecks?.groups.some((group) => group.items.some((item) => item.id === "mf-screen")), false);

const classified = sanitizeMeasurements(sanitizeSystem({ type: "wood-stove" }), {
  items: [{ id: "ws-clearance-rear", observed: 170, unit: "mm", required: 250, requiredUnit: "mm", source: "manufacturer-manual", sourceReference: "Regency F2500-1 — Rev E", sourceVerified: true, status: "not-compliant" }],
});
assert.equal(measurementClassificationIssue(sanitizeSystem({ type: "wood-stove" }), classified.items[0]), undefined);
assert.match(measurementOutputLines(sanitizeSystem({ type: "wood-stove" }), classified.items)[0]?.value || "", /Observed: 170 mm/);
assert.equal(switchedSystemDraft("masonry-fireplace").measurements.items.length, 0);

const masonryRoute = { system: sanitizeSystem({ type: "masonry-fireplace" as const }), venting: {} };
assert.equal(activeChimneyRoute(masonryRoute), "masonry");
assert.equal(applicableItems(masonryRoute).some((item) => item.id === "mf-crown"), true);
assert.equal(applicableItems(masonryRoute).some((item) => item.id.includes("chase")), false);
const chaseRoute = { system: sanitizeSystem({ type: "factory-built-fireplace" as const }), venting: { route: "factory-chase" as const } };
assert.equal(applicableItems(chaseRoute).some((item) => item.id === "fb-chase-cover"), true);
assert.equal(applicableItems(chaseRoute).some((item) => item.id === "fb-crown"), false);
const directRoute = { system: sanitizeSystem({ type: "factory-built-fireplace" as const }), venting: { route: "factory-direct" as const } };
assert.equal(applicableItems(directRoute).some((item) => item.id.includes("chase")), false);
assert.equal(applicableItems(directRoute).some((item) => item.id === "fb-direct-roof"), true);
assert.equal(woodStoveWorkflow.sections.some((section) => section.items.some((item) => /smoke chamber/i.test(item.label))), false);

const missingListing = sanitizeSystem({ type: "wood-stove", labelStatus: "missing", labelRecheckConfirmed: true, alternateIdentity: "no", listingStatus: "not-verified" });
assert.equal(missingListing.type === "wood-stove" && missingListing.listingStatus, "not-verified");
assert.notEqual(missingListing.type === "wood-stove" && missingListing.listingStatus, "confirmed-unlisted");
const noId = runManufacturerLookup({ requestedRequirement: "Mantel clearance", system: sanitizeSystem({ type: "wood-stove" }) });
assert.equal(noId.status, "insufficient-appliance-id");
assert.match(noId.auditNote, /not recorded as checked/);
const noMatch = runManufacturerLookup({ requestedRequirement: "Mantel clearance", system: sanitizeSystem({ type: "wood-stove", manufacturer: "Regency", model: "F500" }) });
assert.equal(noMatch.status, "no-verified-exact-match");
assert.match(noMatch.auditNote, /Exact manufacturer searched: Regency/);
assert.equal(noMatch.requirementValue, undefined);
const differentSuffix = runManufacturerLookup({ requestedRequirement: "Mantel clearance", system: sanitizeSystem({ type: "wood-stove", manufacturer: "Regency", model: "F500", modelSuffix: "V3" }) });
assert.equal(differentSuffix.status, "no-verified-exact-match");
assert.equal(routeAccessReason("missing-manual").status, undefined);
assert.equal(routeAccessReason("unknown-model").status, undefined);

assert.equal(cleaningLocationsFor("wood-stove").some((item) => item.id === "connector"), true);
assert.equal(cleaningLocationsFor("wood-stove").some((item) => item.id === "smoke-chamber"), false);
assert.equal(cleaningLocationsFor("fireplace-insert").some((item) => item.id === "liner"), true);
assert.equal(cleaningLocationsFor("masonry-fireplace").some((item) => item.id === "smoke-chamber"), true);
assert.equal(cleaningLocationsFor("factory-built-fireplace").some((item) => item.id === "pipe"), true);
assert.equal(cleaningEvidenceOpen({ deposits: "none", assessment: "no-cleaning-indicated" }), false);
assert.equal(cleaningEvidenceOpen({ deposits: "light", assessment: "no-cleaning-indicated" }), false);
assert.equal(cleaningEvidenceOpen({ deposits: "light", assessment: "cleaning-recommended" }), true);
assert.equal(cleaningEvidenceOpen({ deposits: "heavy" }), true);
assert.equal(cleaningEvidenceOpen({ deposits: "glazed" }), true);
assert.equal(cleaningRecommendationCopy("no-cleaning-indicated"), undefined);
assert.equal(cleaningRecommendationCopy("cleaning-required")?.priority, "before-continued-use");
assert.match(cleaningRecommendationCopy("cleaning-required")?.text || "", /before continued use/);
const oldCleaning = sanitizeCleaning("wood-stove", { lastCleaningKnown: "yes", lastCleaningDate: "2020-01-01", locations: [] });
assert.equal(oldCleaning.assessment, undefined);
assert.equal(cleaningRequiredFromLastCleaningDate(oldCleaning.lastCleaningDate), false);
assert.equal(cleaningReportVisible(oldCleaning), false);
const quietCleaning = sanitizeCleaning("masonry-fireplace", { deposits: "none", assessment: "no-cleaning-indicated", locations: [] });
assert.equal(cleaningReportVisible(quietCleaning), false);
const partialAccess = sanitizeCleaning("fireplace-insert", {
  deposits: "heavy",
  locations: [
    { id: "liner", deposits: "heavy" },
    { id: "liner-connection", utiReason: "inaccessible" },
  ],
});
assert.equal(partialAccess.deposits, "heavy");
assert.equal(partialAccess.locations.find((item) => item.id === "liner-connection")?.utiReason, "inaccessible");
assert.equal(sanitizeCleaning("wood-stove", { locations: [{ id: "smoke-chamber", deposits: "heavy" }] }).locations.length, 0);
const legacyCleaning = parseWettReport({
  ...createEmptyWettReport({ id: randomUUID(), reportNumber: "PHX-WETT-2026-00003", username: "office", now: "2026-09-22T12:00:00.000Z" }),
  cleaning: undefined,
});
assert.equal(legacyCleaning.cleaning.assessment, undefined);
assert.notEqual(legacyCleaning.cleaning.assessment, "no-cleaning-indicated");
const cleaningReport = reportFor("masonry-fireplace");
const photoId = randomUUID();
cleaningReport.cleaning = sanitizeCleaning("masonry-fireplace", {
  deposits: "heavy",
  assessment: "cleaning-required",
  observation: "Heavy combustible deposits were observed within the accessible portion of the venting system.",
  observationRaw: "heavy deposits in the flue",
  locations: [],
});
cleaningReport.recommendations = [{ id: randomUUID(), inspectionItemId: CLEANING_ITEM_ID, text: CLEANING_REQUIRED_TEXT, priority: "before-continued-use", photoIds: [photoId] }];
cleaningReport.photos = [{
  id: photoId,
  storageKey: `wett/reports/${cleaningReport.id}/photos/${photoId}.jpg`,
  contentType: "image/jpeg",
  byteSize: 10,
  checklistItemId: CLEANING_ITEM_ID,
  inspectionSection: "Maintenance / Combustible Deposits",
  systemType: "masonry-fireplace",
  createdAt: "2026-09-22T12:00:00.000Z",
  createdBy: "office",
}];
const reloaded = applyEditableDraft(cleaningReport, editableFromReport(cleaningReport));
assert.equal(reloaded.photos[0]?.checklistItemId, CLEANING_ITEM_ID);
assert.equal(reloaded.cleaning.assessment, "cleaning-required");
assert.equal(reloaded.cleaning.deposits, "heavy");
const cleaningModel = buildWettReportViewModel(reloaded);
assert.equal(cleaningModel.cleaning?.assessment, "Cleaning Required Before Continued Use");
assert.equal(cleaningModel.cleaning?.photoIds[0], photoId);
assert.match(cleaningModel.cleaning?.recommendation || "", /before continued use/);
assert.match(cleaningModel.cleaning?.technicalBasis || "", /as often as necessary/);
assert.equal((cleaningModel.cleaning?.technicalBasis || "").includes("annual chimney sweeping"), false);
assert.equal(CLEANING_TECHNICAL_BASIS.includes("one sweep every year"), false);
assert.equal(buildWettReportViewModel(reportFor("wood-stove")).cleaning, null);
const builderSource = readFileSync("src/components/admin/office/wett/wett-report-builder.tsx", "utf8");
assert.equal(builderSource.includes('id: "cleaning"'), false);
const accepted = { ...partialAccess, observation: "Light soot was observed.", acceptedFinalText: "Light soot was observed." };
assert.equal(accepted.deposits, "heavy");
assert.equal(accepted.assessment, undefined);

const unnamedApproval = reportFor("wood-stove");
unnamedApproval.inspection.inspectorName = "";
unnamedApproval.signOff.signedBy = "";
unnamedApproval.signOff.inspectorApproved = true;
const unnamedModel = buildWettReportViewModel(unnamedApproval);
assert.equal(unnamedModel.signOff.includes("Approved by"), false);
assert.equal(unnamedModel.signOff.includes("Not recorded"), false);
assert.match(unnamedModel.signOff, /observed on the inspection date/);
const namedApproval = reportFor("wood-stove");
namedApproval.signOff.inspectorApproved = true;
assert.equal(buildWettReportViewModel(namedApproval).signOff, "Approved by Michael");

console.log("wett knowledge validation passed");
