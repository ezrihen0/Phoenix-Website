import { MapPin } from "lucide-react";

import type { PortalPreviewHome } from "@/lib/portal/ui-preview";

type PortalHomeOverviewProps = {
  home: PortalPreviewHome;
};

function mapsEmbedUrl(home: PortalPreviewHome) {
  const query = encodeURIComponent(`${home.serviceAddress}, ${home.cityLabel}`);
  return `https://maps.google.com/maps?q=${query}&t=m&z=16&output=embed&iwloc=near`;
}

export function PortalHomeOverview({ home }: PortalHomeOverviewProps) {
  const fullAddress = `${home.serviceAddress}, ${home.cityLabel}`;

  return (
    <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">Home Overview</h2>
      <div className="mt-4 overflow-hidden rounded-[1.25rem] border border-[var(--color-border)] bg-[var(--color-paper-strong)]">
        <iframe
          src={mapsEmbedUrl(home)}
          title={`Map for ${fullAddress}`}
          className="h-40 w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-[var(--color-ink)]">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted)]" aria-hidden="true" />
        <span>
          <span className="block font-semibold">{home.serviceAddress}</span>
          <span className="text-[var(--color-muted)]">{home.cityLabel}</span>
        </span>
      </p>
    </article>
  );
}
