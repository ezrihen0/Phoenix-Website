import { CLEANING_ITEM_ID, cleaningRecommendationCopy } from "./cleaning";
import { applicableItems } from "./knowledge/index";
import type { WettReport } from "./schema";
export { LISTING_NOT_VERIFIED_NOTICE } from "./system-profile";

export const TECHNICIAN_RECOMMENDATION_DISCLAIMER =
  "Corrective options are provided as technician recommendations. Final acceptance of repairs or existing conditions may depend on the homeowner, insurer, authority having jurisdiction, or other requesting party.";

export const TECHNICIAN_CORRECTIVE_OPTIONS = [
  { id: "seal", label: "Seal / coating" },
  { id: "repair", label: "Repair affected area" },
  { id: "replace", label: "Replace damaged component" },
  { id: "rebuild", label: "Rebuild affected area" },
  { id: "evaluate", label: "Further evaluation" },
  { id: "custom", label: "Custom recommendation" },
] as const;

export function recommendationTargets(report: Pick<WettReport, "system" | "venting" | "checklist" | "measurements" | "findings" | "notes" | "cleaning">) {
  const applicable = applicableItems(report);
  const checklist = applicable
    .filter((item) => report.checklist.find((stored) => stored.id === item.id)?.status === "not-compliant")
    .map((item) => ({ id: item.id, label: item.label }));
  const measurements = report.measurements.items.filter((item) => item.status === "not-compliant");
  const findings = report.findings.filter((finding) => Boolean(finding.observation?.trim() || finding.acceptedFinalText?.trim()));
  const cleaning = cleaningRecommendationCopy(report.cleaning?.assessment);
  return {
    checklist,
    measurements,
    findings,
    cleaning: cleaning ? [{ id: CLEANING_ITEM_ID, label: "Maintenance / combustible deposits", priority: cleaning.priority, text: cleaning.text }] : [],
  };
}

export function recommendationsNeeded(report: Pick<WettReport, "system" | "venting" | "checklist" | "measurements" | "findings" | "notes" | "cleaning">) {
  const targets = recommendationTargets(report);
  return targets.checklist.length + targets.measurements.length + targets.findings.length + targets.cleaning.length > 0;
}
