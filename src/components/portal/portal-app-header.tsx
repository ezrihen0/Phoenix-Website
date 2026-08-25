import Image from "next/image";
import Link from "next/link";

import type { PortalUiPreviewProfile } from "@/lib/portal/ui-preview";
import { siteConfig } from "@/lib/site-data";

type PortalAppHeaderProps = {
  profile: PortalUiPreviewProfile;
};

export function PortalAppHeader({ profile }: PortalAppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[rgba(248,242,234,0.92)] backdrop-blur-xl">
      <div className="page-frame flex h-16 items-center justify-between gap-4 sm:h-[4.25rem]">
        <Link href="/portal" className="flex shrink-0 items-center" aria-label="Phoenix customer portal">
          <Image
            src="/images/brand/logo.webp"
            alt={siteConfig.shortName}
            width={168}
            height={62}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>

        <div className="flex min-w-0 items-center gap-3">
          <a
            href={`tel:${siteConfig.phoneHref}`}
            className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
          >
            Call
          </a>
          <a
            href="/request-service?city=calgary&cta=portal"
            className="hidden text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)] sm:inline"
          >
            Request Service
          </a>
          {siteConfig.email ? (
            <a
              href={`mailto:${siteConfig.email}`}
              className="hidden text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)] lg:inline"
            >
              Email
            </a>
          ) : null}
          <Link
            href="/portal/login"
            className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
          >
            Sign in
          </Link>
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="hidden truncate text-sm font-medium text-[var(--color-ink)] sm:inline">
              {profile.displayName}
            </span>
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-paper-strong)] text-xs font-semibold text-[var(--color-ink)]"
              aria-hidden="true"
            >
              {profile.initials}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
