import { notFound } from "next/navigation";

import { WettReportPreview } from "@/components/admin/office/wett/wett-report-preview";
import { WettWorkspaceShell } from "@/components/admin/office/wett/wett-workspace-shell";
import { requireWettReportAccess } from "@/lib/auth/permissions";
import { buildWettReportViewModel } from "@/lib/wett/report-view-model";
import { getWettReport } from "@/lib/wett/service";

export const dynamic = "force-dynamic";

export default async function WettReportPreviewPage({ params }: { params: Promise<{ reportId: string }> }) {
  await requireWettReportAccess();
  const { reportId } = await params;
  const report = await getWettReport(reportId);

  if (!report) {
    notFound();
  }

  const model = buildWettReportViewModel(report);

  return (
    <WettWorkspaceShell title="Report preview" backHref={`/admin/office/wett/${report.id}`} backLabel="Back to report">
      <WettReportPreview model={model} />
      <a
        href={`/api/admin/wett/reports/${report.id}/pdf`}
        className="mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-[#1c1816] px-5 text-sm font-semibold text-white"
      >
        Download PDF
      </a>
    </WettWorkspaceShell>
  );
}
