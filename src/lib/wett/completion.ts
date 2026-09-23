import "server-only";

import { validateWettReportForFinalization } from "@/lib/wett/knowledge/completion-gate";
import { sendCompletedWettReportEmail } from "@/lib/wett/email";
import { wettPdfStorageKey } from "@/lib/wett/photo-storage";
import { renderWettReportPdf } from "@/lib/wett/report-pdf";
import {
  getWettReport,
  markCompletedAfterPdf,
  markDeliveryResult,
  markFinalizingFailed,
  prepareFinalizingReport,
} from "@/lib/wett/service";
import { readPrivateWettBytes, writePrivateWettBytes } from "@/lib/wett/storage";

export async function finalizeWettReport(reportId: string, username: string) {
  const prepared = await prepareFinalizingReport(reportId, username);
  const gate = validateWettReportForFinalization(prepared);

  if (!gate.ok) {
    const failed = await markFinalizingFailed(reportId, username, gate.blockers.join(" "));
    return {
      ok: false as const,
      message: gate.blockers.join(" "),
      report: failed,
    };
  }

  let completed;

  try {
    const frozen = {
      ...prepared,
      reportOutput: {
        ...prepared.reportOutput,
        finalInspectionDataFrozenAt: new Date().toISOString(),
      },
    };

    if (!frozen.id || !frozen.reportNumber) {
      throw new Error("Report identity is missing.");
    }

    const pdf = await renderWettReportPdf(frozen);
    const pdfStorageKey = wettPdfStorageKey(reportId);
    await writePrivateWettBytes(pdfStorageKey, pdf, "application/pdf");
    completed = await markCompletedAfterPdf(frozen, pdfStorageKey, username);

    const delivery = await sendCompletedWettReportEmail(completed, pdf);
    const saved = await markDeliveryResult(reportId, username, {
      status: delivery.status,
      recipientEmail: delivery.recipientEmail,
      failureReason: delivery.failureReason,
    });

    return {
      ok: true as const,
      report: saved,
    };
  } catch (error) {
    if (completed?.status === "completed") {
      return {
        ok: true as const,
        report: completed,
      };
    }

    const reason = error instanceof Error ? error.message : "The report could not be finalized.";
    const failed = await markFinalizingFailed(reportId, username, reason.slice(0, 500));

    return {
      ok: false as const,
      message: "The report was not completed because the PDF could not be stored.",
      report: failed,
    };
  }
}

export async function resendCompletedWettReport(reportId: string, username: string) {
  const report = await getWettReport(reportId);

  if (!report || report.status !== "completed" || !report.reportOutput.pdfStorageKey) {
    return {
      ok: false as const,
      message: "A stored PDF is required before this report can be resent.",
      report,
    };
  }

  const pdf = await readPrivateWettBytes(report.reportOutput.pdfStorageKey);

  if (!pdf) {
    return {
      ok: false as const,
      message: "The stored PDF could not be read. The report remains completed.",
      report,
    };
  }

  const delivery = await sendCompletedWettReportEmail(report, pdf);
  const saved = await markDeliveryResult(reportId, username, {
    status: delivery.status,
    recipientEmail: delivery.recipientEmail,
    failureReason: delivery.failureReason,
  });

  return {
    ok: delivery.status === "sent",
    message: delivery.failureReason,
    report: saved,
  };
}
