import {
  WETT_INSPECTION_LEVELS,
  WETT_INSPECTION_REASONS,
  WETT_ITEM_STATUSES,
  WETT_WORKFLOW_CONTROLS,
} from "../schema";

export const INSPECTION_LEVEL_LABELS: Record<(typeof WETT_INSPECTION_LEVELS)[number], string> = {
  visual: "Visual — readily accessible",
  technical: "Technical — accessible",
  invasive: "Invasive — concealed accessibility",
};

export const INSPECTION_REASON_LABELS: Record<(typeof WETT_INSPECTION_REASONS)[number], string> = {
  insurance: "Insurance",
  "real-estate": "Real Estate",
  personal: "Personal / Peace of Mind",
  ahj: "AHJ / Authority Request",
  "post-fire": "Post-Fire",
  "follow-up": "Follow-Up",
  other: "Other",
};

export const ITEM_STATUS_LABELS: Record<(typeof WETT_ITEM_STATUSES)[number], string> = {
  compliant: "Compliant",
  "not-compliant": "Not Compliant",
  "not-applicable": "Not Applicable",
  "unable-to-inspect": "Unable to Inspect",
};

export const WORKFLOW_CONTROL_LABELS: Record<(typeof WETT_WORKFLOW_CONTROLS)[number], string> = {
  "not-verified": "Not verified",
  "manufacturer-lookup-required": "Manufacturer lookup required",
  "case-specific": "Case-specific determination required",
  "source-conflict": "Source conflict — human review required",
  "province-conflict": "Province source conflict — human review required",
  "incomplete-input": "Incomplete input",
};

export const SAFETY_GATE_FIELDS = [
  { key: "applianceBurning", label: "Appliance actively burning?" },
  { key: "systemCoolEnough", label: "System cool enough for inspection?" },
  { key: "safeAccess", label: "Safe access available?" },
  { key: "immediateHazard", label: "Immediate hazard observed?" },
] as const;

export const KNOWN_HISTORY_FIELDS = [
  { key: "knownChimneyFire", label: "Known chimney fire?" },
  { key: "knownSmokeSpillage", label: "Known smoke spillage?" },
  { key: "knownWaterLeak", label: "Known water leak?" },
  { key: "knownRepair", label: "Known repair?" },
  { key: "permitInformationAvailable", label: "Permit information available?" },
  { key: "priorWettReportAvailable", label: "Prior WETT report available?" },
] as const;
