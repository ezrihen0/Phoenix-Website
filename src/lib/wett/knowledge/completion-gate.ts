import { cleaningRequiredFromLastCleaningDate } from "../cleaning";
import { measurementClassificationIssue } from "../measurements";
import type { WettChecklistItem, WettReport } from "../schema";
import { applianceIdentityRecorded } from "../system-profile";
import { UTI_VALID_REASONS, clearanceDeficiencySupported } from "./engines";
import { applicableItems } from "./index";
import { isAlbertaProvince } from "./phoenix-alberta";

export type WettFinalizationGate = {
  ok: boolean;
  blockers: string[];
};

function itemById(report: WettReport, id: string) {
  return report.checklist.find((item) => item.id === id);
}

function notCompliantSupported(item: WettChecklistItem, report: WettReport) {
  if (!item.observation?.trim()) {
    return false;
  }

  const source = item.sourceReference?.trim() || item.sourceVerifiedRequirement?.trim();
  if (!source) {
    return false;
  }

  const clearanceItem = /clearance|hearth|face|surround/i.test(item.id);
  if (!clearanceItem) {
    return true;
  }

  const observed = report.measurements.items.find((entry) => typeof entry.observed === "number")?.observed;
  return clearanceDeficiencySupported(observed, item.sourceVerifiedRequirement || item.sourceReference);
}

export function validateWettReportForFinalization(report: WettReport): WettFinalizationGate {
  const blockers: string[] = [];

  if (!isAlbertaProvince(report.property.province)) {
    blockers.push("Province source conflict — human review required.");
  }

  if (!report.property.addressLine?.trim()) {
    blockers.push("Inspection address is required.");
  }

  if (!report.inspection.inspectionDate) {
    blockers.push("Inspection date is required.");
  }

  if (!report.inspection.inspectionLevel) {
    blockers.push("Inspection level must be selected.");
  }

  if (!report.inspection.inspectorName?.trim()) {
    blockers.push("Responsible inspector is required.");
  }

  if (!report.inspection.wettInspectorNumber?.trim()) {
    blockers.push("WETT number is required.");
  }

  if (!report.system.type) {
    blockers.push("System type is required.");
  }

  const identityRecorded = applianceIdentityRecorded(report.system);
  if (report.system.type && report.system.type !== "masonry-fireplace" && !identityRecorded) {
    const identityItems = applicableItems(report).filter((item) => item.manufacturerDependent);
    const routed = identityItems.some((item) => {
      const stored = itemById(report, item.id);
      return stored?.workflowControl === "manufacturer-lookup-required" || stored?.workflowControl === "not-verified";
    });
    if (!routed) {
      blockers.push("Appliance identification was not recorded. Use manufacturer lookup or not verified.");
    }
  }

  for (const item of applicableItems(report)) {
    const stored = itemById(report, item.id);
    if (!stored?.status && !stored?.workflowControl) {
      blockers.push(`${item.label} needs a status or a workflow control.`);
      continue;
    }

    if (stored.workflowControl === "province-conflict" || stored.workflowControl === "source-conflict") {
      blockers.push(`${item.label} has an unresolved ${stored.workflowControl.split("-").join(" ")}.`);
    }

    if (stored.status === "not-applicable" && !item.naAllowed) {
      blockers.push(`${item.label} cannot be Not Applicable.`);
    }

    if (stored.status === "unable-to-inspect") {
      const reason = stored.uti?.reason || "";
      if (!(UTI_VALID_REASONS as readonly string[]).includes(reason) || !stored.uti?.component?.trim() || !stored.uti.notVerified?.trim()) {
        blockers.push(`${item.label} needs a valid access reason, component, and what was not verified.`);
      }
    }

    if (stored.status === "not-compliant" && !notCompliantSupported(stored, report)) {
      blockers.push(`${item.label} needs an observation and a source or evidence reference before Not Compliant.`);
    }

    if (stored.status === "compliant" && item.manufacturerDependent && !identityRecorded && stored.workflowControl !== "not-verified") {
      blockers.push(`${item.label} cannot be Compliant until the appliance is identified or marked not verified.`);
    }
  }

  if (report.system.type && !report.cleaning.assessment) {
    blockers.push("Maintenance / combustible deposits needs a recorded cleaning assessment. It is not inferred from the last cleaning date.");
  }
  if (cleaningRequiredFromLastCleaningDate(report.cleaning.lastCleaningDate)) {
    blockers.push("Last cleaning date was treated as a cleaning requirement.");
  }

  for (const item of report.measurements.items) {
    const issue = measurementClassificationIssue(report.system, item);
    if (issue) blockers.push(`Incomplete input: ${issue}`);
  }

  for (const finding of report.findings) {
    if (!finding.observation?.trim()) {
      blockers.push("Each finding needs an observation.");
    }
    if (finding.classification === "not-compliant" && !finding.sourceRoute?.trim()) {
      blockers.push("A Not Compliant finding needs a source route. Selecting a defect does not set that classification.");
    }
  }

  if (report.signOff.inspectorApproved !== true) {
    blockers.push("Human inspector approval is required before release.");
  }

  if (report.signOff.classificationReviewed !== true || report.signOff.scopeReviewed !== true) {
    blockers.push("Classification review and scope review are required.");
  }

  return { ok: blockers.length === 0, blockers };
}
