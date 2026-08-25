import Link from "next/link";
import { Briefcase, CalendarDays, FileText, LayoutGrid, Receipt, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { PORTAL_PROFILE_TABS, type PortalProfileTabId } from "@/lib/portal/ui-preview";

const TAB_ICONS: Record<PortalProfileTabId, LucideIcon> = {
  overview: LayoutGrid,
  jobs: Briefcase,
  documents: FileText,
  appointments: CalendarDays,
  finance: Receipt,
  settings: Settings,
};

type PortalProfileTabsProps = {
  activeTab: PortalProfileTabId;
};

export function PortalProfileTabs({ activeTab }: PortalProfileTabsProps) {
  return (
    <nav aria-label="Portal sections" className="border-b border-[var(--color-border)] bg-[var(--color-paper)]">
      <div className="page-frame">
        <ul className="flex gap-1 overflow-x-auto pb-px [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PORTAL_PROFILE_TABS.map((tab) => {
            const Icon = TAB_ICONS[tab.id];
            const isActive = tab.id === activeTab;
            const href = tab.id === "overview" ? "/portal" : `/portal?tab=${tab.id}`;

            return (
              <li key={tab.id} className="shrink-0">
                <Link
                  href={href}
                  scroll={false}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2 whitespace-nowrap px-3 py-3.5 text-sm font-semibold transition sm:px-4 ${
                    isActive
                      ? "border-b-2 border-[var(--color-ember)] text-[var(--color-ink)]"
                      : "border-b-2 border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
