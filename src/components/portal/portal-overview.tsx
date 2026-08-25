import type { PortalUiPreviewProfile } from "@/lib/portal/ui-preview";

import { PortalActivityFeed } from "./portal-activity-feed";
import { PortalHomeOverview } from "./portal-home-overview";
import { PortalJobsPreview } from "./portal-jobs-preview";
import { PortalNextAppointment } from "./portal-next-appointment";

type PortalOverviewProps = {
  profile: PortalUiPreviewProfile;
};

export function PortalOverview({ profile }: PortalOverviewProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,0.9fr)] lg:grid-rows-[auto_auto] lg:items-start">
      <div className="order-2 min-w-0 lg:order-none lg:col-start-1 lg:row-start-1">
        <PortalActivityFeed items={profile.activity} />
      </div>
      <div className="order-3 min-w-0 lg:order-none lg:col-start-1 lg:row-start-2">
        <PortalJobsPreview jobs={profile.jobs} />
      </div>
      <div className="order-4 min-w-0 lg:order-none lg:col-start-2 lg:row-start-1">
        <PortalHomeOverview home={profile.home} />
      </div>
      <div className="order-1 min-w-0 lg:order-none lg:col-start-2 lg:row-start-2">
        <PortalNextAppointment appointment={profile.nextAppointment} />
      </div>
    </div>
  );
}
