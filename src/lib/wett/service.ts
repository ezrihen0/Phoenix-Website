import "server-only";

import { randomUUID } from "node:crypto";

import {
  applyDeliveryResult,
  beginFinalizing,
  canStartFinalizing,
  completeAfterPdfSaved,
  editableStatusBeforeFinalizing,
  failFinalizing,
} from "@/lib/wett/completion-state";
import {
  allocateReportNumber,
  applyEditableDraft,
  createEmptyWettReport,
  isEditableWettStatus,
  toWettReportSummary,
  parseWettEditableDraft,
  wettPhotoSchema,
  type WettEditableDraft,
  type WettPhoto,
  type WettReport,
} from "@/lib/wett/schema";
import {
  readWettIndex,
  readWettReport,
  withWettLock,
  writeCompletedWettReport,
  writeWettIndex,
  writeWettReport,
} from "@/lib/wett/storage";

export class WettReportError extends Error {
  constructor(
    message: string,
    readonly code: "not-found" | "conflict" | "locked" | "invalid",
  ) {
    super(message);
    this.name = "WettReportError";
  }
}

function touch(report: WettReport, username: string, now = new Date().toISOString()) {
  report.audit.updatedAt = now;
  report.audit.updatedBy = username;
  report.audit.autosaveRevision += 1;
  return report;
}

async function persistReport(report: WettReport) {
  await writeWettReport(report);
  const index = await readWettIndex();
  const summary = toWettReportSummary(report);
  const existingIndex = index.reports.findIndex((entry) => entry.id === report.id);

  if (existingIndex >= 0) {
    index.reports[existingIndex] = summary;
  } else {
    index.reports.unshift(summary);
  }

  await writeWettIndex(index);
  return report;
}

export async function listWettReports() {
  const index = await readWettIndex();
  return [...index.reports].sort((first, second) => second.updatedAt.localeCompare(first.updatedAt));
}

export async function getWettReport(reportId: string) {
  return readWettReport(reportId);
}

export async function createWettDraft(username: string) {
  return withWettLock(async () => {
    const index = await readWettIndex();
    const now = new Date().toISOString();
    const report = createEmptyWettReport({
      id: randomUUID(),
      reportNumber: allocateReportNumber(index),
      username,
      now,
    });

    await writeWettReport(report);
    index.reports.unshift(toWettReportSummary(report));
    await writeWettIndex(index);
    return report;
  });
}

export async function saveWettEditableDraft(reportId: string, username: string, expectedRevision: number, editable: WettEditableDraft) {
  const parsed = parseWettEditableDraft(editable);

  return withWettLock(async () => {
    const current = await readWettReport(reportId);

    if (!current) {
      throw new WettReportError("Report not found.", "not-found");
    }

    if (!isEditableWettStatus(current.status)) {
      throw new WettReportError("This report is locked.", "locked");
    }

    if (current.audit.autosaveRevision !== expectedRevision) {
      throw new WettReportError("This report was updated somewhere else. Reload to continue.", "conflict");
    }

    const next = touch(applyEditableDraft(current, parsed), username);
    await persistReport(next);
    return next;
  });
}

export async function setWettReviewStatus(reportId: string, username: string, status: "draft" | "ready-for-review") {
  return withWettLock(async () => {
    const current = await readWettReport(reportId);

    if (!current) {
      throw new WettReportError("Report not found.", "not-found");
    }

    if (!isEditableWettStatus(current.status)) {
      throw new WettReportError("This report is locked.", "locked");
    }

    const next = touch({ ...current, status }, username);
    await persistReport(next);
    return next;
  });
}

export async function addWettPhoto(
  reportId: string,
  username: string,
  expectedRevision: number,
  photo: WettPhoto,
) {
  const parsedPhoto = wettPhotoSchema.parse(photo);

  return withWettLock(async () => {
    const current = await readWettReport(reportId);

    if (!current) {
      throw new WettReportError("Report not found.", "not-found");
    }

    if (!isEditableWettStatus(current.status)) {
      throw new WettReportError("This report is locked.", "locked");
    }

    if (current.audit.autosaveRevision !== expectedRevision) {
      throw new WettReportError("This report was updated somewhere else. Reload to continue.", "conflict");
    }

    const next = touch(
      {
        ...current,
        photos: [...current.photos, parsedPhoto],
      },
      username,
    );
    await persistReport(next);
    return next;
  });
}

export async function updateWettAiNotes(
  reportId: string,
  username: string,
  expectedRevision: number,
  notes: WettReport["notes"],
) {
  return withWettLock(async () => {
    const current = await readWettReport(reportId);

    if (!current) {
      throw new WettReportError("Report not found.", "not-found");
    }

    if (!isEditableWettStatus(current.status)) {
      throw new WettReportError("This report is locked.", "locked");
    }

    if (current.audit.autosaveRevision !== expectedRevision) {
      throw new WettReportError("This report was updated somewhere else. Reload to continue.", "conflict");
    }

    const next = touch(
      {
        ...current,
        notes,
      },
      username,
    );
    await persistReport(next);
    return next;
  });
}

export async function updateWettPhotoCaption(
  reportId: string,
  username: string,
  expectedRevision: number,
  photoId: string,
  caption: string | undefined,
) {
  return withWettLock(async () => {
    const current = await readWettReport(reportId);

    if (!current) {
      throw new WettReportError("Report not found.", "not-found");
    }

    if (!isEditableWettStatus(current.status)) {
      throw new WettReportError("This report is locked.", "locked");
    }

    if (current.audit.autosaveRevision !== expectedRevision) {
      throw new WettReportError("This report was updated somewhere else. Reload to continue.", "conflict");
    }

    if (!current.photos.some((photo) => photo.id === photoId)) {
      throw new WettReportError("Photo not found.", "not-found");
    }

    const next = touch(
      {
        ...current,
        photos: current.photos.map((photo) => (photo.id === photoId ? { ...photo, caption } : photo)),
      },
      username,
    );
    await persistReport(next);
    return next;
  });
}

export async function saveWettSystemReport(report: WettReport) {
  return withWettLock(async () => {
    await persistReport(report);
    return report;
  });
}

export async function prepareFinalizingReport(reportId: string, username: string) {
  return withWettLock(async () => {
    const current = await readWettReport(reportId);

    if (!current) {
      throw new WettReportError("Report not found.", "not-found");
    }

    if (current.status === "completed" || current.status === "archived") {
      throw new WettReportError("This report is already locked.", "locked");
    }

    if (!canStartFinalizing(current)) {
      throw new WettReportError("Finalization is already running.", "locked");
    }

    const next = beginFinalizing(current, username, new Date().toISOString());
    await persistReport(next);
    return next;
  });
}

export async function markFinalizingFailed(reportId: string, username: string, reason: string) {
  return withWettLock(async () => {
    const current = await readWettReport(reportId);

    if (!current || current.status === "completed") {
      return current;
    }

    const next = failFinalizing(current, reason, username, new Date().toISOString());
    next.audit.editableStatusBeforeFinalizing = editableStatusBeforeFinalizing(current);
    await persistReport(next);
    return next;
  });
}

export async function markCompletedAfterPdf(report: WettReport, pdfStorageKey: string, username: string) {
  const completed = completeAfterPdfSaved(report, {
    pdfStorageKey,
    username,
    now: new Date().toISOString(),
  });

  return withWettLock(async () => {
    await writeCompletedWettReport(completed);
    await persistReport(completed);
    return completed;
  });
}

export async function markDeliveryResult(
  reportId: string,
  username: string,
  result: { status: "sent" | "failed"; recipientEmail?: string; failureReason?: string },
) {
  return withWettLock(async () => {
    const current = await readWettReport(reportId);

    if (!current) {
      throw new WettReportError("Report not found.", "not-found");
    }

    const next = applyDeliveryResult(current, {
      ...result,
      username,
      now: new Date().toISOString(),
    });
    await writeCompletedWettReport(next);
    await persistReport(next);
    return next;
  });
}
