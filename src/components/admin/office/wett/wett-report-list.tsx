import Link from "next/link";

import { createWettDraftAction } from "@/app/admin/office/wett/actions";
import { WettRecoveryMaintenance } from "@/components/admin/office/wett/wett-recovery-maintenance";
import type { WettReportSummary } from "@/lib/wett/schema";

const STATUS_LABELS: Record<WettReportSummary["status"], string> = {
  draft: "Draft",
  "ready-for-review": "Ready for review",
  finalizing: "Finalizing",
  "finalizing-failed": "Finalizing failed",
  completed: "Completed",
  archived: "Archived",
};

const DELIVERY_LABELS: Record<WettReportSummary["deliveryStatus"], string> = {
  "not-sent": "Not sent",
  sent: "Sent",
  failed: "Delivery failed",
};

function ReportCard({ report }: { report: WettReportSummary }) {
  return (
    <Link
      href={`/admin/office/wett/${report.id}`}
      className="block rounded-3xl border border-[#d8d0c6] bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-semibold">{report.reportNumber}</p>
          <p className="mt-1 text-sm text-[#6b625a]">{report.customerName || "Customer not entered"}</p>
        </div>
        <span className="rounded-full bg-[#f4efe8] px-3 py-1 text-xs font-semibold">{STATUS_LABELS[report.status]}</span>
      </div>
      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-[#6b625a]">Property</dt>
          <dd className="text-right">{report.propertySummary || "Not entered"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#6b625a]">Inspection date</dt>
          <dd>{report.inspectionDate || "Not entered"}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#6b625a]">Delivery</dt>
          <dd>{DELIVERY_LABELS[report.deliveryStatus]}</dd>
        </div>
      </dl>
    </Link>
  );
}

function ReportSection({ title, reports }: { title: string; reports: WettReportSummary[] }) {
  return (
    <section className="mt-8">
      <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b625a]">{title}</h2>
      {reports.length === 0 ? (
        <p className="mt-3 rounded-3xl border border-dashed border-[#d8d0c6] bg-white/70 px-4 py-6 text-sm text-[#6b625a]">
          None yet.
        </p>
      ) : (
        <div className="mt-3 grid gap-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      )}
    </section>
  );
}

export function WettReportList({ reports }: { reports: WettReportSummary[] }) {
  const drafts = reports.filter((report) => report.status !== "completed" && report.status !== "archived");
  const completed = reports.filter((report) => report.status === "completed" || report.status === "archived");

  return (
    <>
      <WettRecoveryMaintenance />
      <form action={createWettDraftAction}>
        <button
          type="submit"
          className="min-h-12 w-full rounded-full bg-[#1c1816] px-5 text-base font-semibold text-white"
        >
          New WETT Report
        </button>
      </form>
      <ReportSection title="Draft reports" reports={drafts} />
      <ReportSection title="Completed reports" reports={completed} />
    </>
  );
}
