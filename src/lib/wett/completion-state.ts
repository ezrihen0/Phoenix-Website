import type { WettReport, WettReportStatus } from "./schema";

const FINALIZING_STALE_MS = 2 * 60 * 1000;

export function canStartFinalizing(report: WettReport, now = Date.now()) {
  if (report.status === "completed" || report.status === "archived") {
    return false;
  }

  if (report.status !== "finalizing") {
    return report.status === "draft" || report.status === "ready-for-review" || report.status === "finalizing-failed";
  }

  const started = Date.parse(report.audit.finalizingAt || "");
  return Number.isFinite(started) && now - started >= FINALIZING_STALE_MS;
}

export function editableStatusBeforeFinalizing(report: WettReport): "draft" | "ready-for-review" {
  if (report.status === "ready-for-review") {
    return "ready-for-review";
  }

  if (report.audit.editableStatusBeforeFinalizing) {
    return report.audit.editableStatusBeforeFinalizing;
  }

  return "draft";
}

export function beginFinalizing(report: WettReport, username: string, now: string): WettReport {
  return {
    ...report,
    status: "finalizing",
    audit: {
      ...report.audit,
      updatedAt: now,
      updatedBy: username,
      finalizingAt: now,
      finalizingBy: username,
      editableStatusBeforeFinalizing: editableStatusBeforeFinalizing(report),
      autosaveRevision: report.audit.autosaveRevision + 1,
    },
    reportOutput: {
      ...report.reportOutput,
      finalizingStartedAt: now,
      finalizingFailedAt: undefined,
      finalizingFailureReason: undefined,
    },
  };
}

export function failFinalizing(report: WettReport, reason: string, username: string, now: string): WettReport {
  const status: WettReportStatus = "finalizing-failed";

  return {
    ...report,
    status,
    audit: {
      ...report.audit,
      updatedAt: now,
      updatedBy: username,
      completedAt: undefined,
      lockedAt: undefined,
      autosaveRevision: report.audit.autosaveRevision + 1,
    },
    reportOutput: {
      ...report.reportOutput,
      pdfStorageKey: undefined,
      pdfSavedAt: undefined,
      finalInspectionDataFrozenAt: undefined,
      finalizingFailedAt: now,
      finalizingFailureReason: reason.slice(0, 500),
    },
  };
}

export function completeAfterPdfSaved(
  report: WettReport,
  input: { pdfStorageKey: string; username: string; now: string },
): WettReport {
  if (!input.pdfStorageKey) {
    throw new Error("A completed WETT report requires a stored PDF.");
  }

  return {
    ...report,
    status: "completed",
    audit: {
      ...report.audit,
      updatedAt: input.now,
      updatedBy: input.username,
      completedAt: input.now,
      lockedAt: input.now,
      autosaveRevision: report.audit.autosaveRevision + 1,
    },
    reportOutput: {
      ...report.reportOutput,
      finalInspectionDataFrozenAt: report.reportOutput.finalInspectionDataFrozenAt || input.now,
      pdfStorageKey: input.pdfStorageKey,
      pdfSavedAt: input.now,
      finalizingFailedAt: undefined,
      finalizingFailureReason: undefined,
    },
    delivery: {
      ...report.delivery,
      status: "not-sent",
      failureReason: undefined,
      sentAt: undefined,
    },
  };
}

export function applyDeliveryResult(
  report: WettReport,
  input: {
    status: "sent" | "failed";
    now: string;
    username: string;
    recipientEmail?: string;
    failureReason?: string;
  },
): WettReport {
  if (report.status !== "completed") {
    throw new Error("Email delivery can be recorded only after the report is completed.");
  }

  return {
    ...report,
    audit: {
      ...report.audit,
      updatedAt: input.now,
      updatedBy: input.username,
      autosaveRevision: report.audit.autosaveRevision + 1,
    },
    delivery: {
      status: input.status,
      lastAttemptAt: input.now,
      sentAt: input.status === "sent" ? input.now : undefined,
      failureReason: input.status === "failed" ? input.failureReason?.slice(0, 500) : undefined,
      recipientEmail: input.recipientEmail,
    },
  };
}
