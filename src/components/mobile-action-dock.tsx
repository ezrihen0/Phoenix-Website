import Link from "next/link";
import { CalendarDays, FileText, Phone } from "lucide-react";

import type { PublicSiteSettings } from "@/lib/cms/types";

type MobileActionDockProps = {
  settings: PublicSiteSettings;
};

export function MobileActionDock({ settings }: MobileActionDockProps) {
  return (
    <div className="fixed inset-x-3 bottom-3 z-40 rounded-[1.75rem] border border-[var(--color-border)] bg-[rgba(31,26,22,0.92)] p-2 text-[var(--color-paper)] shadow-[0_20px_40px_rgba(31,26,22,0.3)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
        <a
          href={`tel:${settings.phoneHref}`}
          className="flex flex-col items-center justify-center gap-1 rounded-[1.1rem] px-2 py-3"
        >
          <Phone className="h-4 w-4 text-[var(--color-gold)]" />
          Call
        </a>
        <a
          href={settings.workizUrl}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-1 rounded-[1.1rem] bg-[var(--color-ember)] px-2 py-3 text-white"
        >
          <CalendarDays className="h-4 w-4" />
          {settings.bookingLabel}
        </a>
        <Link
          href="/articles"
          className="flex flex-col items-center justify-center gap-1 rounded-[1.1rem] px-2 py-3"
        >
          <FileText className="h-4 w-4 text-[var(--color-gold)]" />
          Articles
        </Link>
      </div>
    </div>
  );
}