import { getPortalConnectionStatus } from "@/lib/portal/adapter";
import {
  parsePortalFinanceSelection,
  parsePortalJobId,
  parsePortalProfileTab,
  portalUiPreviewProfile,
} from "@/lib/portal/ui-preview";

import { PortalProfileShell } from "@/components/portal/portal-profile-shell";

type PortalHomePageProps = {
  searchParams: Promise<{
    tab?: string | string[];
    job?: string | string[];
    invoice?: string | string[];
    estimate?: string | string[];
  }>;
};

export default async function PortalHomePage({ searchParams }: PortalHomePageProps) {
  const query = await searchParams;
  const connection = getPortalConnectionStatus();
  const activeTab = parsePortalProfileTab(query.tab);
  const requestedJob = Array.isArray(query.job) ? query.job[0] : query.job;
  const activeJobId = activeTab === "jobs" ? parsePortalJobId(query.job, portalUiPreviewProfile.jobs) : null;
  const invalidJobRequested = activeTab === "jobs" && Boolean(requestedJob) && !activeJobId;
  const financeSelection =
    activeTab === "finance"
      ? parsePortalFinanceSelection(query.invoice, query.estimate, portalUiPreviewProfile.finance)
      : null;
  const requestedInvoice = Array.isArray(query.invoice) ? query.invoice[0] : query.invoice;
  const requestedEstimate = Array.isArray(query.estimate) ? query.estimate[0] : query.estimate;
  const invalidFinanceRequested =
    activeTab === "finance" && Boolean(requestedInvoice || requestedEstimate) && !financeSelection;

  return (
    <PortalProfileShell
      profile={portalUiPreviewProfile}
      connection={connection}
      activeTab={activeTab}
      activeJobId={activeJobId}
      invalidJobRequested={invalidJobRequested}
      financeSelection={financeSelection}
      invalidFinanceRequested={invalidFinanceRequested}
    />
  );
}
