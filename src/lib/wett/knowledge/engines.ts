import type { WettChecklistItem, WettWorkflowControl } from "../schema";

export const UTI_VALID_REASONS = ["concealed", "inaccessible", "unsafe", "beyond-inspection-level", "other"] as const;

export const UTI_REASON_LABELS: Record<(typeof UTI_VALID_REASONS)[number], string> = {
  concealed: "Concealed",
  inaccessible: "Inaccessible",
  unsafe: "Unsafe Access",
  "beyond-inspection-level": "Beyond Inspection Level",
  other: "Other",
};

export const UTI_REASON_TO_WORKFLOW = {
  "forgotten-measurement": "incomplete-input",
  "missing-manual": "manufacturer-lookup-required",
  "unknown-model": "manufacturer-lookup-required",
  "unresolved-source": "not-verified",
} as const;

export type UtiAttemptReason = (typeof UTI_VALID_REASONS)[number] | keyof typeof UTI_REASON_TO_WORKFLOW;

export function routeAccessReason(reason: string): {
  status?: "unable-to-inspect";
  workflowControl?: WettWorkflowControl;
} {
  if (reason in UTI_REASON_TO_WORKFLOW) {
    return { workflowControl: UTI_REASON_TO_WORKFLOW[reason as keyof typeof UTI_REASON_TO_WORKFLOW] };
  }

  if ((UTI_VALID_REASONS as readonly string[]).includes(reason)) {
    return { status: "unable-to-inspect" };
  }

  return { workflowControl: "incomplete-input" };
}

export function naDecision(item: { naAllowed: boolean } | undefined) {
  return Boolean(item?.naAllowed);
}

export function classificationForSelectedDefect() {
  return undefined;
}

export function statusFromNoVisibleDeficiency() {
  return undefined;
}

export function automaticFindingFromConcern() {
  return undefined;
}

export function retroactiveCurrentCodeDeficiency() {
  return false;
}

export function albertaRequiresAnnualSweep() {
  return false;
}

export function ontarioOutdoorAirApplies() {
  return false;
}

export function clearanceDeficiencySupported(measurement: number | null | undefined, sourceVerifiedRequirement: string | undefined) {
  return typeof measurement === "number" && Number.isFinite(measurement) && Boolean(sourceVerifiedRequirement?.trim());
}

export function applyInspectorStatus(
  item: WettChecklistItem,
  status: WettChecklistItem["status"],
): WettChecklistItem {
  if (status === "not-applicable") {
    return { ...item, status, workflowControl: undefined };
  }

  if (status === "unable-to-inspect") {
    return { ...item, status, workflowControl: undefined };
  }

  return { ...item, status, workflowControl: undefined, uti: undefined };
}
