import { PORTAL_UI_PREVIEW_NOTICE, type PortalFinanceSelection, type PortalProfileTabId, type PortalUiPreviewProfile } from "@/lib/portal/ui-preview";
import type { PortalConnectionStatus } from "@/lib/portal/types";

import { PortalAppHeader } from "./portal-app-header";
import { PortalAppointmentsTab } from "./portal-appointments-tab";
import { PortalDocumentsTab } from "./portal-documents-tab";
import { PortalFinanceTab } from "./portal-finance-tab";
import { PortalJobDetail } from "./portal-job-detail";
import { PortalJobsTab } from "./portal-jobs-tab";
import { PortalOverview } from "./portal-overview";
import { PortalProfileCover } from "./portal-profile-cover";
import { PortalProfileTabs } from "./portal-profile-tabs";
import { PortalSettingsTab } from "./portal-settings-tab";

type PortalProfileShellProps = {
  profile: PortalUiPreviewProfile;
  connection: PortalConnectionStatus;
  activeTab: PortalProfileTabId;
  activeJobId?: string | null;
  invalidJobRequested?: boolean;
  financeSelection?: PortalFinanceSelection | null;
  invalidFinanceRequested?: boolean;
};

function PortalTabSurface({
  profile,
  activeTab,
  activeJobId,
  invalidJobRequested,
  financeSelection,
  invalidFinanceRequested,
}: {
  profile: PortalUiPreviewProfile;
  activeTab: PortalProfileTabId;
  activeJobId?: string | null;
  invalidJobRequested?: boolean;
  financeSelection?: PortalFinanceSelection | null;
  invalidFinanceRequested?: boolean;
}) {
  if (activeTab === "overview") {
    return <PortalOverview profile={profile} />;
  }

  if (activeTab === "jobs") {
    const job = activeJobId ? profile.jobs.find((item) => item.id === activeJobId) : undefined;

    if (job) {
      return <PortalJobDetail job={job} />;
    }

    return <PortalJobsTab jobs={profile.jobs} invalidJobRequested={invalidJobRequested} />;
  }

  if (activeTab === "documents") {
    return <PortalDocumentsTab documents={profile.documents} />;
  }

  if (activeTab === "appointments") {
    return <PortalAppointmentsTab appointments={profile.appointments} />;
  }

  if (activeTab === "finance") {
    return (
      <PortalFinanceTab
        profile={profile}
        selection={financeSelection}
        invalidSelection={invalidFinanceRequested}
      />
    );
  }

  return <PortalSettingsTab settings={profile.settings} />;
}

export function PortalProfileShell({
  profile,
  connection,
  activeTab,
  activeJobId,
  invalidJobRequested = false,
  financeSelection = null,
  invalidFinanceRequested = false,
}: PortalProfileShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f3eee6] text-[var(--color-ink)]">
      <PortalAppHeader profile={profile} />
      <p className="border-b border-[var(--color-border)] bg-[rgba(201,95,43,0.08)] px-4 py-2.5 text-center text-xs leading-5 text-[var(--color-muted)] sm:text-sm">
        {PORTAL_UI_PREVIEW_NOTICE} {connection.message}
      </p>
      <PortalProfileCover profile={profile} />
      <PortalProfileTabs activeTab={activeTab} />
      <div className="page-frame min-w-0 py-6 sm:py-8">
        <PortalTabSurface
          profile={profile}
          activeTab={activeTab}
          activeJobId={activeJobId}
          invalidJobRequested={invalidJobRequested}
          financeSelection={financeSelection}
          invalidFinanceRequested={invalidFinanceRequested}
        />
      </div>
    </div>
  );
}
