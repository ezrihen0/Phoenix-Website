import { z } from "zod";

import { cleaningSchema, sanitizeCleaning } from "@/lib/wett/cleaning";
import { measurementsSchema, sanitizeMeasurements } from "@/lib/wett/measurements";
import { sanitizeSystem, wettSystemSchema } from "@/lib/wett/system-profile";

export const WETT_REPORT_STATUSES = [
  "draft",
  "ready-for-review",
  "finalizing",
  "finalizing-failed",
  "completed",
  "archived",
] as const;

export const WETT_DELIVERY_STATUSES = ["not-sent", "sent", "failed"] as const;

export const WETT_AI_REWRITE_MODES = [
  "standard-professional",
  "insurance-oriented",
  "realtor-friendly",
] as const;

export { WETT_SYSTEM_TYPES, type WettSystemType, type WettSystem } from "@/lib/wett/system-profile";

export const WETT_INSPECTION_LEVELS = ["visual", "technical", "invasive"] as const;

export const WETT_INSPECTION_REASONS = [
  "insurance",
  "real-estate",
  "personal",
  "ahj",
  "post-fire",
  "follow-up",
  "other",
] as const;

export const WETT_ITEM_STATUSES = [
  "compliant",
  "not-compliant",
  "not-applicable",
  "unable-to-inspect",
] as const;

export const WETT_WORKFLOW_CONTROLS = [
  "not-verified",
  "manufacturer-lookup-required",
  "case-specific",
  "source-conflict",
  "province-conflict",
  "incomplete-input",
] as const;

export const WETT_EVIDENCE_TYPES = [
  "overview",
  "identification-label",
  "measurement",
  "component",
  "deficiency",
  "access-limitation",
  "manufacturer-label",
  "chimney-exterior",
  "termination",
  "hearth",
  "other",
] as const;

export const WETT_YES_NO = ["yes", "no"] as const;

export const WETT_YES_NO_NA = ["yes", "no", "na"] as const;

export const WETT_CHIMNEY_ROUTES = ["masonry", "factory-chase", "factory-direct", "unknown"] as const;

export const WETT_LISTING_STATUSES = ["verified", "not-verified", "confirmed-unlisted"] as const;

export const WETT_LOOKUP_STATUSES = [
  "verified-exact-match",
  "possible-matches",
  "source-conflict",
  "no-verified-exact-match",
  "insufficient-appliance-id",
] as const;

/** Remaining authoritative gaps. These are not encoded as rules. */
export const WETT_KNOWLEDGE_PACK_DEPENDENCIES = [
  "Official current WETT mandatory-photo SOP",
  "Exact WETT procedure for a missing or illegible label",
  "Exact same-level post-repair reinspection procedure",
  "Copyrighted standard clearance tables",
  "Model-specific manufacturer clearances",
] as const;

const optionalText = (max: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }, z.string().max(max).optional());

const optionalDate = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional());

const optionalEmail = z.preprocess((value) => {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}, z.string().email().max(200).optional());

const optionalUuid = z.string().uuid().optional();

const utiRecordSchema = z
  .object({
    component: optionalText(160),
    reason: optionalText(80),
    inspectionLevel: z.enum(WETT_INSPECTION_LEVELS).optional(),
    notVerified: optionalText(2000),
    nextAction: optionalText(2000),
  })
  .strict();

export const wettChecklistItemSchema = z
  .object({
    id: z.string().min(1).max(120),
    status: z.enum(WETT_ITEM_STATUSES).optional(),
    workflowControl: z.enum(WETT_WORKFLOW_CONTROLS).optional(),
    observation: optionalText(4000),
    observationRaw: optionalText(4000),
    observationCandidate: optionalText(4000),
    sourceReference: optionalText(500),
    sourceVerifiedRequirement: optionalText(500),
    sourceClass: optionalText(80),
    governingSource: optionalText(160),
    documentRef: optionalText(160),
    edition: optionalText(80),
    manualRef: optionalText(160),
    verificationState: optionalText(80),
    uti: utiRecordSchema.optional(),
  })
  .strict();

export const wettFindingSchema = z
  .object({
    id: z.string().uuid(),
    defectFamily: optionalText(80),
    component: optionalText(160),
    observation: optionalText(4000),
    rawTechnicianText: optionalText(4000),
    aiCandidate: optionalText(4000),
    acceptedFinalText: optionalText(4000),
    followUp: z.array(z.object({ prompt: z.string().max(80), answer: z.string().max(2000) }).strict()).max(20).optional(),
    measurementIds: z.array(z.string().max(80)).max(20).optional(),
    photoIds: z.array(z.string().uuid()).max(20).optional(),
    diagramRegionId: optionalText(80),
    sourceRoute: optionalText(500),
    classification: z.enum(WETT_ITEM_STATUSES).optional(),
    recommendation: optionalText(2000),
  })
  .strict();

export const wettDiagramSchema = z
  .object({
    id: z.string().uuid(),
    diagramId: z.enum(["masonry-exterior", "fireplace-appliance", "factory-built"]),
    regionId: z.string().min(1).max(80),
    findingId: optionalUuid,
    measurementId: optionalText(80),
    photoId: optionalUuid,
  })
  .strict();

export const wettPhotoSchema = z
  .object({
    id: z.string().uuid(),
    storageKey: z.string().min(1).max(240),
    contentType: z.string().min(1).max(80),
    byteSize: z.number().int().nonnegative(),
    caption: optionalText(500),
    evidenceType: z.enum(WETT_EVIDENCE_TYPES).optional(),
    findingId: optionalUuid,
    checklistItemId: optionalText(120),
    measurementId: optionalText(80),
    diagramRegionId: optionalText(80),
    systemType: optionalText(40),
    inspectionSection: optionalText(80),
    createdAt: z.string().datetime(),
    createdBy: z.string().min(1).max(80),
  })
  .strict();

export const wettVentingSchema = z
  .object({
    route: z.enum(WETT_CHIMNEY_ROUTES).optional(),
  })
  .strict();

export const wettRecommendationSchema = z
  .object({
    id: z.string().uuid(),
    inspectionItemId: optionalText(120),
    findingId: optionalUuid,
    photoIds: z.array(z.string().uuid()).max(12).optional(),
    options: z.array(z.string().max(80)).max(12).optional(),
    text: optionalText(4000),
    priority: z.enum(["routine", "before-continued-use"]).optional(),
  })
  .strict();

export const wettManufacturerLookupSchema = z
  .object({
    id: z.string().uuid(),
    requestedRequirement: z.string().min(1).max(160),
    status: z.enum(WETT_LOOKUP_STATUSES),
    manufacturer: optionalText(120),
    model: optionalText(120),
    modelSuffix: optionalText(80),
    serial: optionalText(80),
    sourcesSearched: z.array(z.string().max(240)).max(20),
    auditNote: z.string().min(1).max(2000),
    requirementValue: optionalText(80),
    requirementUnit: optionalText(8),
    sourceDocument: optionalText(240),
    pageSection: optionalText(120),
    technicianAccepted: z.boolean().optional(),
    createdAt: z.string().datetime(),
  })
  .strict();

export const wettReportSchema = z
  .object({
    id: z.string().uuid(),
    reportNumber: z.string().min(1).max(40),
    status: z.enum(WETT_REPORT_STATUSES),
    business: z.literal("phoenix").default("phoenix"),
    customer: z
      .object({
        name: optionalText(120),
        phone: optionalText(40),
        email: optionalEmail,
      })
      .strict(),
    property: z
      .object({
        addressLine: optionalText(160),
        city: optionalText(80),
        municipality: optionalText(80),
        province: optionalText(40),
        postalCode: optionalText(20),
      })
      .strict(),
    inspection: z
      .object({
        inspectionDate: optionalDate,
        inspectionLevel: z.enum(WETT_INSPECTION_LEVELS).optional(),
        reason: z.enum(WETT_INSPECTION_REASONS).optional(),
        inspectorName: optionalText(120),
        wettInspectorNumber: optionalText(40),
        knownChimneyFire: z.enum(WETT_YES_NO).optional(),
        knownSmokeSpillage: z.enum(WETT_YES_NO).optional(),
        knownWaterLeak: z.enum(WETT_YES_NO).optional(),
        knownRepair: z.enum(WETT_YES_NO).optional(),
        permitInformationAvailable: z.enum(WETT_YES_NO).optional(),
        priorWettReportAvailable: z.enum(WETT_YES_NO).optional(),
        applianceBurning: z.enum(WETT_YES_NO).optional(),
        systemCoolEnough: z.enum(WETT_YES_NO).optional(),
        safeAccess: z.enum(WETT_YES_NO).optional(),
        roofAccessAcceptable: z.enum(WETT_YES_NO_NA).optional(),
        immediateHazard: z.enum(WETT_YES_NO).optional(),
        lastKnownInspectionDate: optionalDate,
        applianceAddedSincePriorInspection: z.enum(WETT_YES_NO).optional(),
        combustibleDepositsObserved: z.enum(WETT_YES_NO).optional(),
        cleaningRequiredByCondition: z.enum(WETT_YES_NO).optional(),
      })
      .strict(),
    system: wettSystemSchema,
    venting: wettVentingSchema,
    cleaning: cleaningSchema,
    measurements: measurementsSchema,
    checklist: z.array(wettChecklistItemSchema).max(200),
    findings: z.array(wettFindingSchema).max(80),
    maintenance: z
      .object({
        notes: optionalText(4000),
      })
      .strict(),
    protectiveBarrier: z
      .object({
        notes: optionalText(4000),
      })
      .strict(),
    photos: z.array(wettPhotoSchema).max(40),
    diagrams: z.array(wettDiagramSchema).max(80),
    recommendations: z.array(wettRecommendationSchema).max(40),
    manufacturerLookups: z.array(wettManufacturerLookupSchema).max(40),
    notes: z
      .object({
        generalTechnicianNote: optionalText(8000),
        additionalIssues: z.enum(["yes", "no"]).optional(),
        aiOriginalNote: optionalText(8000),
        aiCandidateNote: optionalText(8000),
        aiCandidateMode: z.enum(WETT_AI_REWRITE_MODES).optional(),
        aiCandidateAt: z.string().datetime().optional(),
        aiAcceptedAt: z.string().datetime().optional(),
      })
      .strict(),
    signOff: z
      .object({
        inspectorApproved: z.boolean().optional(),
        classificationReviewed: z.boolean().optional(),
        scopeReviewed: z.boolean().optional(),
        signedAt: z.string().datetime().optional(),
        signedBy: optionalText(120),
      })
      .strict(),
    reportOutput: z
      .object({
        finalInspectionDataFrozenAt: z.string().datetime().optional(),
        pdfStorageKey: optionalText(240),
        pdfSavedAt: z.string().datetime().optional(),
        finalizingStartedAt: z.string().datetime().optional(),
        finalizingFailedAt: z.string().datetime().optional(),
        finalizingFailureReason: optionalText(500),
      })
      .strict(),
    delivery: z
      .object({
        status: z.enum(WETT_DELIVERY_STATUSES),
        lastAttemptAt: z.string().datetime().optional(),
        sentAt: z.string().datetime().optional(),
        failureReason: optionalText(500),
        recipientEmail: optionalEmail,
      })
      .strict(),
    audit: z
      .object({
        createdAt: z.string().datetime(),
        createdBy: z.string().min(1).max(80),
        updatedAt: z.string().datetime(),
        updatedBy: z.string().min(1).max(80),
        autosaveRevision: z.number().int().nonnegative(),
        completedAt: z.string().datetime().optional(),
        lockedAt: z.string().datetime().optional(),
        finalizingAt: z.string().datetime().optional(),
        finalizingBy: optionalText(80),
        editableStatusBeforeFinalizing: z.enum(["draft", "ready-for-review"]).optional(),
      })
      .strict(),
  })
  .strict();

const wettPhotoMetadataSchema = z
  .object({
    id: z.string().uuid(),
    caption: optionalText(500),
    evidenceType: z.enum(WETT_EVIDENCE_TYPES).optional(),
    findingId: optionalUuid,
    checklistItemId: optionalText(120),
    measurementId: optionalText(80),
    diagramRegionId: optionalText(80),
    systemType: optionalText(40),
    inspectionSection: optionalText(80),
  })
  .strict();

export const wettEditableDraftSchema = z
  .object({
    customer: wettReportSchema.shape.customer,
    property: wettReportSchema.shape.property,
    inspection: wettReportSchema.shape.inspection,
    system: wettReportSchema.shape.system,
    venting: wettReportSchema.shape.venting,
    cleaning: wettReportSchema.shape.cleaning,
    measurements: wettReportSchema.shape.measurements,
    maintenance: wettReportSchema.shape.maintenance,
    protectiveBarrier: wettReportSchema.shape.protectiveBarrier,
    checklist: z.array(wettChecklistItemSchema).max(200),
    findings: z.array(wettFindingSchema).max(80),
    diagrams: z.array(wettDiagramSchema).max(80),
    recommendations: z.array(wettRecommendationSchema).max(40),
    manufacturerLookups: z.array(wettManufacturerLookupSchema).max(40),
    photoMetadata: z.array(wettPhotoMetadataSchema).max(40),
    signOff: wettReportSchema.shape.signOff,
    notes: z
      .object({
        generalTechnicianNote: optionalText(8000),
        additionalIssues: z.enum(["yes", "no"]).optional(),
      })
      .strict(),
  })
  .strict();

export const wettReportSummarySchema = z
  .object({
    id: z.string().uuid(),
    reportNumber: z.string().min(1).max(40),
    status: z.enum(WETT_REPORT_STATUSES),
    customerName: optionalText(120),
    propertySummary: optionalText(240),
    inspectionDate: optionalDate,
    deliveryStatus: z.enum(WETT_DELIVERY_STATUSES),
    updatedAt: z.string().datetime(),
    createdAt: z.string().datetime(),
  })
  .strict();

export type WettReportStatus = (typeof WETT_REPORT_STATUSES)[number];
export type WettDeliveryStatus = (typeof WETT_DELIVERY_STATUSES)[number];
export type WettAiRewriteMode = (typeof WETT_AI_REWRITE_MODES)[number];
export type WettInspectionLevel = (typeof WETT_INSPECTION_LEVELS)[number];
export type WettItemStatus = (typeof WETT_ITEM_STATUSES)[number];
export type WettWorkflowControl = (typeof WETT_WORKFLOW_CONTROLS)[number];
export type WettEvidenceType = (typeof WETT_EVIDENCE_TYPES)[number];
export type WettChecklistItem = z.infer<typeof wettChecklistItemSchema>;
export type WettFinding = z.infer<typeof wettFindingSchema>;
export type WettDiagramPin = z.infer<typeof wettDiagramSchema>;
export type WettPhoto = z.infer<typeof wettPhotoSchema>;
export type WettReport = z.infer<typeof wettReportSchema>;
export type WettEditableDraft = z.infer<typeof wettEditableDraftSchema>;
export type WettReportSummary = z.infer<typeof wettReportSummarySchema>;

export type WettIndexFile = {
  nextSequenceByYear: Record<string, number>;
  reports: WettReportSummary[];
};

export function emptyWettIndex(): WettIndexFile {
  return {
    nextSequenceByYear: {},
    reports: [],
  };
}

export function createEmptyWettReport(input: {
  id: string;
  reportNumber: string;
  username: string;
  now: string;
}): WettReport {
  return wettReportSchema.parse({
    id: input.id,
    reportNumber: input.reportNumber,
    status: "draft",
    business: "phoenix",
    customer: {},
    property: {
      province: "AB",
    },
    inspection: {},
    system: {},
    venting: {},
    cleaning: { locations: [] },
    measurements: {
      items: [],
    },
    checklist: [],
    findings: [],
    maintenance: {},
    protectiveBarrier: {},
    photos: [],
    diagrams: [],
    recommendations: [],
    manufacturerLookups: [],
    notes: {},
    signOff: {},
    reportOutput: {},
    delivery: {
      status: "not-sent",
    },
    audit: {
      createdAt: input.now,
      createdBy: input.username,
      updatedAt: input.now,
      updatedBy: input.username,
      autosaveRevision: 0,
    },
  });
}

export function propertySummary(report: Pick<WettReport, "property">) {
  return [report.property.addressLine, report.property.city].filter(Boolean).join(", ") || undefined;
}

export function toWettReportSummary(report: WettReport): WettReportSummary {
  return wettReportSummarySchema.parse({
    id: report.id,
    reportNumber: report.reportNumber,
    status: report.status,
    customerName: report.customer.name,
    propertySummary: propertySummary(report),
    inspectionDate: report.inspection.inspectionDate,
    deliveryStatus: report.delivery.status,
    updatedAt: report.audit.updatedAt,
    createdAt: report.audit.createdAt,
  });
}

export function editableFromReport(report: WettReport): WettEditableDraft {
  return wettEditableDraftSchema.parse({
    customer: report.customer,
    property: report.property,
    inspection: report.inspection,
    system: report.system,
    venting: report.venting,
    cleaning: report.cleaning,
    measurements: report.measurements,
    maintenance: report.maintenance,
    protectiveBarrier: report.protectiveBarrier,
    checklist: report.checklist,
    findings: report.findings,
    diagrams: report.diagrams,
    recommendations: report.recommendations,
    manufacturerLookups: report.manufacturerLookups,
    photoMetadata: report.photos.map((photo) => ({
      id: photo.id,
      caption: photo.caption,
      evidenceType: photo.evidenceType,
      findingId: photo.findingId,
      checklistItemId: photo.checklistItemId,
      measurementId: photo.measurementId,
      diagramRegionId: photo.diagramRegionId,
      systemType: photo.systemType,
      inspectionSection: photo.inspectionSection,
    })),
    signOff: report.signOff,
    notes: {
      generalTechnicianNote: report.notes.generalTechnicianNote,
      additionalIssues: report.notes.additionalIssues,
    },
  });
}

export function applyEditableDraft(report: WettReport, editable: WettEditableDraft): WettReport {
  const metadata = new Map(editable.photoMetadata.map((photo) => [photo.id, photo]));

  return {
    ...report,
    business: "phoenix",
    customer: editable.customer,
    property: { ...editable.property, province: "AB" },
    inspection: editable.inspection,
    system: editable.system,
    venting: editable.venting,
    cleaning: editable.cleaning,
    measurements: editable.measurements,
    maintenance: editable.maintenance,
    protectiveBarrier: editable.protectiveBarrier,
    checklist: editable.checklist,
    findings: editable.findings,
    diagrams: editable.diagrams,
    recommendations: editable.recommendations,
    manufacturerLookups: editable.manufacturerLookups,
    signOff: editable.signOff,
    photos: report.photos.map((photo) => {
      const update = metadata.get(photo.id);
      return update ? { ...photo, ...update } : photo;
    }),
    notes: {
      ...report.notes,
      generalTechnicianNote: editable.notes.generalTechnicianNote,
      additionalIssues: editable.notes.additionalIssues,
    },
  };
}

export function isEditableWettStatus(status: WettReportStatus) {
  return status === "draft" || status === "ready-for-review" || status === "finalizing-failed";
}

function asRecord(value: unknown) {
  return value && typeof value === "object" ? { ...(value as Record<string, unknown>) } : {};
}

export function normalizeWettReportInput(value: unknown) {
  const report = asRecord(value);
  const property = asRecord(report.property);
  if (!property.province) {
    property.province = "AB";
  }

  const system = sanitizeSystem(asRecord(report.system));

  return {
    ...report,
    business: "phoenix",
    property,
    inspection: asRecord(report.inspection),
    system,
    venting: asRecord(report.venting),
    cleaning: sanitizeCleaning(system.type, asRecord(report.cleaning)),
    measurements: sanitizeMeasurements(system, asRecord(report.measurements)),
    recommendations: Array.isArray(report.recommendations) ? report.recommendations : [],
    manufacturerLookups: Array.isArray(report.manufacturerLookups) ? report.manufacturerLookups : [],
    checklist: Array.isArray(report.checklist) ? report.checklist : [],
    findings: Array.isArray(report.findings) ? report.findings : [],
    maintenance: asRecord(report.maintenance),
    protectiveBarrier: asRecord(report.protectiveBarrier),
    photos: Array.isArray(report.photos) ? report.photos : [],
    diagrams: Array.isArray(report.diagrams) ? report.diagrams : [],
    notes: asRecord(report.notes),
    signOff: asRecord(report.signOff),
    reportOutput: asRecord(report.reportOutput),
    delivery: asRecord(report.delivery).status ? asRecord(report.delivery) : { ...asRecord(report.delivery), status: "not-sent" },
    audit: asRecord(report.audit),
  };
}

export function parseWettReport(value: unknown) {
  return wettReportSchema.parse(normalizeWettReportInput(value));
}

export function parseWettEditableDraft(value: unknown) {
  const record = asRecord(value);
  const property = asRecord(record.property);
  const system = sanitizeSystem(asRecord(record.system));

  return wettEditableDraftSchema.parse({
    ...record,
    property: { ...property, province: "AB" },
    system,
    venting: asRecord(record.venting),
    cleaning: sanitizeCleaning(system.type, asRecord(record.cleaning)),
    measurements: sanitizeMeasurements(system, asRecord(record.measurements)),
    recommendations: Array.isArray(record.recommendations) ? record.recommendations : [],
    manufacturerLookups: Array.isArray(record.manufacturerLookups) ? record.manufacturerLookups : [],
    checklist: Array.isArray(record.checklist) ? record.checklist : [],
    findings: Array.isArray(record.findings) ? record.findings : [],
    diagrams: Array.isArray(record.diagrams) ? record.diagrams : [],
    photoMetadata: Array.isArray(record.photoMetadata) ? record.photoMetadata : [],
    signOff: asRecord(record.signOff),
  });
}

export function parseWettIndex(value: unknown): WettIndexFile {
  if (!value || typeof value !== "object") {
    return emptyWettIndex();
  }

  const record = value as {
    nextSequenceByYear?: unknown;
    reports?: unknown;
  };
  const nextSequenceByYear: Record<string, number> = {};

  if (record.nextSequenceByYear && typeof record.nextSequenceByYear === "object") {
    for (const [year, count] of Object.entries(record.nextSequenceByYear)) {
      if (/^\d{4}$/.test(year) && typeof count === "number" && Number.isInteger(count) && count >= 0) {
        nextSequenceByYear[year] = count;
      }
    }
  }

  const reports = Array.isArray(record.reports)
    ? record.reports.flatMap((entry) => {
        const parsed = wettReportSummarySchema.safeParse(entry);
        return parsed.success ? [parsed.data] : [];
      })
    : [];

  return {
    nextSequenceByYear,
    reports,
  };
}

export function allocateReportNumber(index: WettIndexFile, now = new Date()) {
  const year = String(now.getFullYear());
  const next = (index.nextSequenceByYear[year] ?? 0) + 1;
  index.nextSequenceByYear[year] = next;
  return `PHX-WETT-${year}-${String(next).padStart(5, "0")}`;
}
