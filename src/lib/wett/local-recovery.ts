import { editableFromReport, type WettEditableDraft, type WettReport } from "@/lib/wett/schema";

export const WETT_LOCAL_RECOVERY_PREFIX = "phoenix-wett-recovery:";
export const WETT_LOCAL_RECOVERY_TTL_MS = 72 * 60 * 60 * 1000;

export type WettLocalRecoveryRecord = {
  username: string;
  reportId: string;
  savedRevision: number;
  updatedAt: string;
  editable: WettEditableDraft;
};

function storageKey(username: string, reportId: string) {
  return `${WETT_LOCAL_RECOVERY_PREFIX}${encodeURIComponent(username)}:${reportId}`;
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readWettLocalRecovery(username: string, reportId: string): WettLocalRecoveryRecord | null {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(storageKey(username, reportId));

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as WettLocalRecoveryRecord;

    if (
      parsed.username !== username ||
      parsed.reportId !== reportId ||
      typeof parsed.savedRevision !== "number" ||
      typeof parsed.updatedAt !== "string" ||
      !parsed.editable
    ) {
      return null;
    }

    if (Date.now() - Date.parse(parsed.updatedAt) > WETT_LOCAL_RECOVERY_TTL_MS) {
      window.localStorage.removeItem(storageKey(username, reportId));
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeWettLocalRecovery(record: WettLocalRecoveryRecord) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(storageKey(record.username, record.reportId), JSON.stringify(record));
  } catch {
    // Local recovery is temporary. A full browser store must not block the server draft.
  }
}

export function writeWettLocalRecoveryFromReport(username: string, report: WettReport) {
  writeWettLocalRecovery({
    username,
    reportId: report.id,
    savedRevision: report.audit.autosaveRevision,
    updatedAt: new Date().toISOString(),
    editable: editableFromReport(report),
  });
}

export function purgeWettLocalRecovery(username: string, reportId: string) {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(storageKey(username, reportId));
  } catch {
    // Ignore storage failures during cleanup.
  }
}

export function purgeAllWettLocalRecovery() {
  if (!canUseStorage()) {
    return;
  }

  try {
    const keys = Object.keys(window.localStorage).filter((key) => key.startsWith(WETT_LOCAL_RECOVERY_PREFIX));

    for (const key of keys) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Logout should continue even if the browser blocks storage access.
  }
}

export function purgeExpiredWettLocalRecovery() {
  if (!canUseStorage()) {
    return;
  }

  try {
    const keys = Object.keys(window.localStorage).filter((key) => key.startsWith(WETT_LOCAL_RECOVERY_PREFIX));

    for (const key of keys) {
      const raw = window.localStorage.getItem(key);

      if (!raw) {
        continue;
      }

      try {
        const parsed = JSON.parse(raw) as { updatedAt?: string };

        if (!parsed.updatedAt || Date.now() - Date.parse(parsed.updatedAt) > WETT_LOCAL_RECOVERY_TTL_MS) {
          window.localStorage.removeItem(key);
        }
      } catch {
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage failures during maintenance.
  }
}
