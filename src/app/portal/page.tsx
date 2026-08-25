import { getPortalConnectionStatus } from "@/lib/portal/adapter";
import { parsePortalJobId, parsePortalProfileTab, portalUiPreviewProfile } from "@/lib/portal/ui-preview";

import { PortalProfileShell } from "@/components/portal/portal-profile-shell";

type PortalHomePageProps = {
  searchParams: Promise<{ tab?: string | string[]; job?: string | string[] }>;
};

export default async function PortalHomePage({ searchParams }: PortalHomePageProps) {
  const query = await searchParams;
  const connection = getPortalConnectionStatus();
  const activeTab = parsePortalProfileTab(query.tab);
  const requestedJob = Array.isArray(query.job) ? query.job[0] : query.job;
  const activeJobId = activeTab === "jobs" ? parsePortalJobId(query.job, portalUiPreviewProfile.jobs) : null;
  const invalidJobRequested = activeTab === "jobs" && Boolean(requestedJob) && !activeJobId;

  return (
    <PortalProfileShell
      profile={portalUiPreviewProfile}
      connection={connection}
      activeTab={activeTab}
      activeJobId={activeJobId}
      invalidJobRequested={invalidJobRequested}
    />
  );
}
