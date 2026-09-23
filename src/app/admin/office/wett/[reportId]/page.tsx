import { notFound } from "next/navigation";

import { WettReportBuilder } from "@/components/admin/office/wett/wett-report-builder";
import { WettWorkspaceShell } from "@/components/admin/office/wett/wett-workspace-shell";
import { requireWettReportAccess } from "@/lib/auth/permissions";
import { getWettReport } from "@/lib/wett/service";

export const dynamic = "force-dynamic";

export default async function WettReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const session = await requireWettReportAccess();
  const { reportId } = await params;
  const report = await getWettReport(reportId);

  if (!report) {
    notFound();
  }

  return (
    <WettWorkspaceShell title={report.customer.name || "WETT Report"} backHref="/admin/office/wett" showHelp>
      <WettReportBuilder initialReport={report} username={session.username} />
    </WettWorkspaceShell>
  );
}
