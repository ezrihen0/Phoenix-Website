import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import {
  applyDeliveryResult,
  beginFinalizing,
  completeAfterPdfSaved,
  failFinalizing,
} from "./completion-state";
import { createEmptyWettReport } from "./schema";

const now = new Date().toISOString();
const report = createEmptyWettReport({
  id: randomUUID(),
  reportNumber: "PHX-WETT-2026-00001",
  username: "office",
  now,
});

const finalizing = beginFinalizing(report, "office", now);
assert.equal(finalizing.status, "finalizing");

const failed = failFinalizing(finalizing, "PDF storage failed", "office", now);
assert.equal(failed.status, "finalizing-failed");
assert.equal(failed.audit.completedAt, undefined);
assert.equal(failed.audit.lockedAt, undefined);

const completed = completeAfterPdfSaved(finalizing, {
  pdfStorageKey: `wett/reports/${report.id}/pdf/report.pdf`,
  username: "office",
  now,
});
assert.equal(completed.status, "completed");
assert.ok(completed.audit.lockedAt);
assert.ok(completed.reportOutput.pdfSavedAt);

const emailed = applyDeliveryResult(completed, {
  status: "failed",
  now,
  username: "office",
  failureReason: "Email delivery is not configured.",
});
assert.equal(emailed.status, "completed");
assert.equal(emailed.delivery.status, "failed");

assert.throws(() =>
  completeAfterPdfSaved(finalizing, {
    pdfStorageKey: "",
    username: "office",
    now,
  }),
);

console.log("wett completion-state tests passed");
