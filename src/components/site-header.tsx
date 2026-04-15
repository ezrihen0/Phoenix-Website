"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Clock3, Flame, Menu, Phone, X } from "lucide-react";
import { useState } from "react";

import { navigationLinks, siteConfig } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(244,236,223,0.82)] backdrop-blur-xl">
      <div className="border-b border-[var(--color-border)] bg-[var(--color-ink)] text-[0.78rem] text-[var(--color-paper)]">
        <div className="page-bleed flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              Keeping Calgary homes safe and warm since 2015
            </span>
            <span className="inline-flex items-center gap-2 text-[var(--color-paper)]/75">
              <Clock3 className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              {siteConfig.hoursLabel} · {siteConfig.hoursDetail}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="inline-flex items-center gap-2 font-semibold"
            >
              <Phone className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              {siteConfig.phoneDisplay}
            </a>
            <a
              href={siteConfig.workizUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ember)] px-4 py-2 font-semibold text-white transition hover:bg-[var(--color-ember-dark)]"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              Book online
            </a>
          </div>
        </div>
      </div>

      <div className="page-bleed flex items-center justify-between gap-6 px-4 py-4">
        <Link href="/" className="flex items-center gap-4" onClick={() => setIsOpen(false)}>
          <Image
            src="/images/brand/logo.webp"
            alt="Phoenix Chimney & Fireplace Services logo"
            width={180}
            height={67}
            priority
            className="h-auto w-[9.5rem] sm:w-[11rem]"
          />
          <div className="hidden min-[980px]:block">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ember)]">
              Calgary chimney & fireplace specialists
            </p>
            <p className="text-sm text-[var(--color-muted)]">
              Repair, WETT inspections, chimney cleaning, and masonry work.
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navigationLinks.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--color-ink)] shadow-[0_12px_24px_rgba(31,26,22,0.18)]"
                    : "text-[var(--color-ink)] hover:bg-[var(--color-card)]"
                }`}
                style={
                  isActive
                    ? {
                        color: "var(--color-paper)",
                      }
                    : undefined
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${siteConfig.phoneHref}`}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--color-ink)]"
          >
            Call now
          </a>
          <a
            href={siteConfig.workizUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[rgba(34,58,51,0.18)] bg-[var(--color-forest)] px-5 py-2.5 text-sm font-semibold shadow-[0_14px_30px_rgba(34,58,51,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(34,58,51,0.3)]"
            style={{ color: "var(--color-paper)" }}
          >
            Schedule with Workiz
          </a>
        </div>

        <button
          type="button"
          className="inline-flex rounded-full border border-[var(--color-border)] p-3 lg:hidden"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-card)] lg:hidden">
          <div className="page-bleed flex flex-col gap-3 px-4 py-4">
            {navigationLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-base font-semibold transition ${
                    isActive
                      ? "bg-[var(--color-ink)] shadow-[0_10px_24px_rgba(31,26,22,0.18)]"
                      : "bg-white/60 hover:bg-white"
                  }`}
                  style={
                    isActive
                      ? {
                          color: "var(--color-paper)",
                        }
                      : undefined
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="rounded-2xl border border-[var(--color-border)] px-4 py-3 text-center font-semibold"
            >
              Call {siteConfig.phoneDisplay}
            </a>
            <a
              href={siteConfig.workizUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[var(--color-ember)] px-4 py-3 text-center font-semibold text-white"
            >
              Book online
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}