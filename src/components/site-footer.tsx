import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPinned, Phone } from "lucide-react";

import { footerLinks, siteConfig } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-paper)]">
      <div className="page-bleed grid gap-10 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr_0.9fr]">
        <div className="space-y-6">
          <Image
            src="/images/brand/logo.webp"
            alt="Phoenix Chimney & Fireplace Services logo"
            width={210}
            height={78}
            className="h-auto w-[11rem] brightness-0 invert"
          />
          <p className="max-w-xl text-sm leading-7 text-[var(--color-paper)]/78">
            Calgary fireplace and chimney service built around clean workmanship,
            honest diagnosis, and documentation that homeowners can actually use.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="rounded-full border border-[rgba(255,255,255,0.22)] bg-[var(--color-gold)] px-4 py-2.5 text-sm font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:brightness-105"
              style={{ color: "var(--color-ink)" }}
            >
              Call now
            </a>
            <a
              href={siteConfig.workizUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-semibold transition hover:border-white/40"
            >
              Book with Workiz
            </a>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-[var(--color-paper)]/82">
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.label}`}>
                    <Link href={item.href} className="inline-flex items-center gap-2 hover:text-white">
                      {item.label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="space-y-4 text-sm text-[var(--color-paper)]/82">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Contact
          </p>
          <p className="inline-flex items-center gap-3">
            <Phone className="h-4 w-4 text-[var(--color-gold)]" />
            <a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phoneDisplay}</a>
          </p>
          <p className="inline-flex items-center gap-3">
            <Mail className="h-4 w-4 text-[var(--color-gold)]" />
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </p>
          <p className="inline-flex items-center gap-3">
            <Clock3 className="h-4 w-4 text-[var(--color-gold)]" />
            {siteConfig.hoursLabel} · {siteConfig.hoursDetail}
          </p>
          <p className="inline-flex items-start gap-3 leading-7">
            <MapPinned className="mt-1 h-4 w-4 shrink-0 text-[var(--color-gold)]" />
            {siteConfig.serviceRadius}
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-bleed flex flex-col gap-3 px-4 py-5 text-xs text-[var(--color-paper)]/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.legalName}. All rights reserved.</p>
          <p>Built in Next.js with a backend seam ready for future Workiz and admin expansion.</p>
        </div>
      </div>
    </footer>
  );
}