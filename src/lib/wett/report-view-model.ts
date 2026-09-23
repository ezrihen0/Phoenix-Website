import { ITEM_STATUS_LABELS, WORKFLOW_CONTROL_LABELS } from "@/lib/wett/knowledge/common-site";
import { defectFamily } from "@/lib/wett/knowledge/defects";
import { applicableItems, workflowFor } from "@/lib/wett/knowledge/index";
import { PHOENIX_ALBERTA } from "@/lib/wett/knowledge/phoenix-alberta";
import { propertySummary, type WettReport } from "@/lib/wett/schema";
import { CLEANING_ITEM_ID, CLEANING_ASSESSMENT_LABELS, CLEANING_TECHNICAL_BASIS, DEPOSIT_LEVEL_LABELS, cleaningReportVisible } from "@/lib/wett/cleaning";
import { measurementOutputLines } from "@/lib/wett/measurements";
import { TECHNICIAN_RECOMMENDATION_DISCLAIMER } from "@/lib/wett/recommendations";
import { identificationLines } from "@/lib/wett/system-profile";

export type WettReportViewModel = {
  title: "WETT Inspection Report";
  reportNumber: string;
  status: string;
  generatedAt: string;
  customerName: string;
  propertyLines: string[];
  inspectionDate: string;
  inspectionLevel: string;
  reason: string;
  inspectorName: string;
  wettInspectorNumber: string;
  systemLabel: string;
  identification: Array<{ label: string; value: string }>;
  executiveSummary: string[];
  measurements: Array<{ label: string; value: string }>;
  sectionResults: Array<{ label: string; value: string; photoIds: string[] }>;
  findings: Array<{ title: string; body: string; photoIds: string[] }>;
  uti: string[];
  diagrams: string[];
  recommendations: string[];
  recommendationDisclaimer: string;
  cleaning: {
    observation: string;
    assessment: string;
    recommendation: string;
    technicalBasis: string;
    photoIds: string[];
  } | null;
  photos: Array<{ id: string; caption: string }>;
  signOff: string;
  scopeNote: string;
  technicianNote: string;
  maintenanceNotes: string;
  protectiveBarrierNotes: string;
};

function display(value: string | undefined, fallback = "Not recorded") {
  return value?.trim() || fallback;
}

export function buildWettReportViewModel(report: WettReport, generatedAt = new Date().toISOString()): WettReportViewModel {
  const propertyLines = [
    report.property.addressLine,
    [report.property.municipality, report.property.city, PHOENIX_ALBERTA.provinceLabel, report.property.postalCode].filter(Boolean).join(", "),
  ].filter((line): line is string => Boolean(line));
  const workflow = workflowFor(report.system.type);
  const applicable = applicableItems(report);
  const cleaningVisible = cleaningReportVisible(report.cleaning);
  const cleaningRecommendation = report.recommendations.find((item) => item.inspectionItemId === CLEANING_ITEM_ID);
  const cleaningObservation = report.cleaning.acceptedFinalText || report.cleaning.observation || (report.cleaning.deposits ? `Deposits observed: ${DEPOSIT_LEVEL_LABELS[report.cleaning.deposits]}` : "");
  const notCompliant = report.checklist.filter((item) => item.status === "not-compliant").length;
  const utiCount = report.checklist.filter((item) => item.status === "unable-to-inspect").length;
  const lookupCount = report.checklist.filter((item) => item.workflowControl === "manufacturer-lookup-required").length;
  const notVerifiedCount = report.checklist.filter((item) => item.workflowControl === "not-verified").length;

  return {
    title: "WETT Inspection Report",
    reportNumber: report.reportNumber,
    status: report.status,
    generatedAt,
    customerName: display(report.customer.name),
    propertyLines: propertyLines.length > 0 ? propertyLines : [display(propertySummary(report))],
    inspectionDate: display(report.inspection.inspectionDate),
    inspectionLevel: display(report.inspection.inspectionLevel),
    reason: display(report.inspection.reason),
    inspectorName: display(report.inspection.inspectorName),
    wettInspectorNumber: display(report.inspection.wettInspectorNumber),
    systemLabel: workflow?.label || "Not recorded",
    identification: identificationLines(report.system),
    executiveSummary: [
      `System type: ${workflow?.label || "Not recorded"}`,
      `Inspection level: ${display(report.inspection.inspectionLevel)}`,
      `Findings: ${report.findings.length}`,
      `Not compliant items: ${notCompliant}`,
      `Unable to inspect items: ${utiCount}`,
      `Manufacturer lookup required: ${lookupCount}`,
      `Not verified: ${notVerifiedCount}`,
      `Applicable sections recorded: ${report.checklist.filter((item) => applicable.some((entry) => entry.id === item.id)).length} of ${applicable.length}`,
    ],
    measurements: measurementOutputLines(report.system, report.measurements.items),
    sectionResults: applicable.flatMap((item) => {
      const stored = report.checklist.find((entry) => entry.id === item.id);
      if (!stored?.status && !stored?.workflowControl && !stored?.observation) return [];
      const status = stored.status ? ITEM_STATUS_LABELS[stored.status] : stored.workflowControl ? WORKFLOW_CONTROL_LABELS[stored.workflowControl] : "";
      const recommendation = report.recommendations.find((entry) => entry.inspectionItemId === item.id);
      const value = [status, stored.observation, stored.uti?.reason ? `Unable to inspect: ${stored.uti.reason}` : "", recommendation?.text ? `Technician recommendation: ${recommendation.text}` : ""]
        .filter(Boolean)
        .join("\n");
      return [{ label: item.label, value, photoIds: report.photos.filter((photo) => photo.checklistItemId === item.id).map((photo) => photo.id) }];
    }),
    findings: (report.notes.additionalIssues === "no" && report.findings.every((finding) => !finding.observation?.trim()) ? [] : report.findings)
      .filter((finding) => Boolean(finding.observation?.trim() || finding.acceptedFinalText?.trim()))
      .map((finding) => ({
        title: defectFamily(finding.defectFamily || "")?.label || "Additional finding",
        body: finding.acceptedFinalText || finding.observation || "",
        photoIds: report.photos.filter((photo) => photo.findingId === finding.id).map((photo) => photo.id),
      })),
    uti: [],
    diagrams: [],
    recommendations: report.recommendations.map((item) => item.text).filter((value): value is string => Boolean(value?.trim())),
    recommendationDisclaimer: report.recommendations.some((item) => item.text?.trim() || item.options?.length) ? TECHNICIAN_RECOMMENDATION_DISCLAIMER : "",
    cleaning: cleaningVisible
      ? {
          observation: cleaningObservation,
          assessment: report.cleaning.assessment ? CLEANING_ASSESSMENT_LABELS[report.cleaning.assessment] : "Not yet recorded",
          recommendation: cleaningRecommendation?.text || "",
          technicalBasis: report.cleaning.assessment === "cleaning-recommended" || report.cleaning.assessment === "cleaning-required" ? CLEANING_TECHNICAL_BASIS : "",
          photoIds: report.photos.filter((photo) => photo.checklistItemId === CLEANING_ITEM_ID).map((photo) => photo.id),
        }
      : null,
    photos: report.photos.map((photo) => ({
      id: photo.id,
      caption: [photo.evidenceType, photo.caption].filter(Boolean).join(" — ") || "Phoenix Evidence Photo",
    })),
    signOff: report.signOff.inspectorApproved
      ? `Approved by ${display(report.signOff.signedBy || report.inspection.inspectorName)}`
      : "Field capture. Inspector approval has not been recorded.",
    scopeNote:
      "This is a WETT Inspection Report for a Phoenix Alberta inspection. It records the selected inspection level, observations, measurements, access limits, and the responsible inspector's classification. It is not a WETT certificate. Phoenix evidence photos are not an official WETT mandatory-photo schedule.",
    technicianNote: report.notes.generalTechnicianNote?.trim() || "",
    maintenanceNotes: report.maintenance.notes?.trim() || "",
    protectiveBarrierNotes: report.protectiveBarrier.notes?.trim() || "",
  };
}
