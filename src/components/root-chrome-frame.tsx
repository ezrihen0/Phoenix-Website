"use client";

import { usePathname } from "next/navigation";

import { MobileActionDock } from "@/components/mobile-action-dock";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { PublicSiteSettings } from "@/lib/cms/types";
import { isWettWorkspacePath } from "@/lib/wett/paths";

export function RootChromeFrame({
  settings,
  children,
}: {
  settings: PublicSiteSettings;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (isWettWorkspacePath(pathname)) {
    return <div className="min-h-screen bg-[#f4efe8] text-[#1f1a16]">{children}</div>;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip pb-24 lg:pb-0">
      <SiteHeader settings={settings} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <MobileActionDock settings={settings} />
    </div>
  );
}
