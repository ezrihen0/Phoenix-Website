import Image from "next/image";
import { MapPin } from "lucide-react";

import type { PortalUiPreviewProfile } from "@/lib/portal/ui-preview";

type PortalProfileCoverProps = {
  profile: PortalUiPreviewProfile;
};

export function PortalProfileCover({ profile }: PortalProfileCoverProps) {
  const { visits, activeJobs, documents } = profile.metrics;

  return (
    <section className="relative">
      <div className="relative h-44 overflow-hidden sm:h-56 lg:h-72">
        <Image
          src={profile.coverImageSrc}
          alt={profile.coverImageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,14,12,0.88)] via-[rgba(18,14,12,0.42)] to-[rgba(18,14,12,0.18)]" />
      </div>

      <div className="page-frame relative -mt-14 pb-6 sm:-mt-16 lg:-mt-[4.5rem]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div className="flex h-[4.75rem] w-[4.75rem] shrink-0 items-center justify-center rounded-full border-4 border-[var(--color-paper)] bg-[var(--color-card-strong)] text-lg font-semibold text-[var(--color-ink)] shadow-[0_8px_24px_rgba(31,26,22,0.18)] sm:h-24 sm:w-24 sm:text-xl">
              {profile.initials}
            </div>
            <div className="min-w-0 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                  {profile.displayName}
                </h1>
              </div>
              <p className="mt-1 text-sm font-medium text-[var(--color-muted)]">{profile.customerType}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{profile.cityLabel}</span>
              </p>
            </div>
          </div>

          <p className="text-sm font-medium text-[var(--color-muted)] sm:pb-2">
            <span className="text-[var(--color-ink)]">{visits}</span> Visits
            <span className="mx-2 text-[var(--color-border)]">|</span>
            <span className="text-[var(--color-ink)]">{activeJobs}</span> Active Jobs
            <span className="mx-2 text-[var(--color-border)]">|</span>
            <span className="text-[var(--color-ink)]">{documents}</span> Documents
          </p>
        </div>
      </div>
    </section>
  );
}
