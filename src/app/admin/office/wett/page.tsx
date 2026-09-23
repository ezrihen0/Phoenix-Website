import { WettReportList } from "@/components/admin/office/wett/wett-report-list";
import { WettWorkspaceShell } from "@/components/admin/office/wett/wett-workspace-shell";
import { requireWettReportAccess } from "@/lib/auth/permissions";
import { listWettReports } from "@/lib/wett/service";

export const dynamic = "force-dynamic";

export default async function WettReportsPage() {
  await requireWettReportAccess();
  const reports = await listWettReports();

  return (
    <WettWorkspaceShell title="WETT Reports" progressLabel={`${reports.length} reports`}>
      <WettReportList reports={reports} />
    </WettWorkspaceShell>
  );
}
