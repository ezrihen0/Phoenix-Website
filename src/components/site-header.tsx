"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Clock3, Flame, Menu, Phone, X } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import {
  PhoenixLogoEasterEgg,
  type PhoenixFlightState,
} from "@/components/phoenix-logo-easter-egg";
import type { PublicSiteSettings } from "@/lib/cms/types";
import { navigationLinks } from "@/lib/site-data";

type SiteHeaderProps = {
  settings: PublicSiteSettings;
};

const REQUIRED_LOGO_CLICKS = 5;
const CLICK_STREAK_WINDOW_MS = 650;
const CLICK_STREAK_RESET_MS = 950;
const PHOENIX_MESSAGE_COUNT = 4;

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [phoenixFlight, setPhoenixFlight] = useState<PhoenixFlightState | null>(null);
  const [logoFlareKey, setLogoFlareKey] = useState(0);
  const logoLinkRef = useRef<HTMLAnchorElement | null>(null);
  const logoClickCountRef = useRef(0);
  const lastLogoClickAtRef = useRef(0);
  const clickResetTimerRef = useRef<number | null>(null);
  const lastPhoenixMessageIndexRef = useRef(-1);
  const mobileBookingLabel = settings.bookingLabel.length > 14 ? "Book online" : settings.bookingLabel;

  useEffect(() => {
    return () => {
      if (clickResetTimerRef.current) {
        clearTimeout(clickResetTimerRef.current);
      }
    };
  }, []);

  function clearLogoClickStreak() {
    logoClickCountRef.current = 0;
    lastLogoClickAtRef.current = 0;

    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current);
      clickResetTimerRef.current = null;
    }
  }

  function triggerPhoenixFlight() {
    if (phoenixFlight || !logoLinkRef.current) {
      return;
    }

    const logoBounds = logoLinkRef.current.getBoundingClientRect();
    const size = Math.max(118, Math.min(186, window.innerWidth * 0.16));
    const nextMessageIndex = (lastPhoenixMessageIndexRef.current + 1) % PHOENIX_MESSAGE_COUNT;

    lastPhoenixMessageIndexRef.current = nextMessageIndex;

    setLogoFlareKey((value) => value + 1);
    setPhoenixFlight({
      id: Date.now(),
      startX: logoBounds.left + Math.min(logoBounds.width * 0.23, 44),
      startY: logoBounds.top + logoBounds.height * 0.52,
      size,
      messageIndex: nextMessageIndex,
    });
  }

  function handleLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    setIsOpen(false);

    if (pathname !== "/") {
      return;
    }

    const now = performance.now();
    const nextClickCount =
      now - lastLogoClickAtRef.current <= CLICK_STREAK_WINDOW_MS
        ? logoClickCountRef.current + 1
        : 1;

    logoClickCountRef.current = nextClickCount;
    lastLogoClickAtRef.current = now;

    if (clickResetTimerRef.current) {
      clearTimeout(clickResetTimerRef.current);
    }

    clickResetTimerRef.current = window.setTimeout(() => {
      clearLogoClickStreak();
    }, CLICK_STREAK_RESET_MS);

    if (nextClickCount < REQUIRED_LOGO_CLICKS) {
      return;
    }

    event.preventDefault();
    clearLogoClickStreak();
    triggerPhoenixFlight();
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(244,236,223,0.82)] backdrop-blur-xl">
      <div className="hidden border-b border-[var(--color-border)] bg-[var(--color-ink)] text-[0.78rem] text-[var(--color-paper)] md:block">
        <div className="page-bleed flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2">
              <Flame className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              Keeping Calgary homes safe and warm since 2015
            </span>
            <span className="inline-flex items-center gap-2 text-[var(--color-paper)]/75">
              <Clock3 className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              {settings.hoursLabel} · {settings.hoursDetail}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={`tel:${settings.phoneHref}`}
              className="inline-flex items-center gap-2 font-semibold"
            >
              <Phone className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              {settings.phoneDisplay}
            </a>
            <a
              href={settings.workizUrl}
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

      <div className="page-bleed flex items-center justify-between gap-3 px-4 py-3 lg:gap-6 lg:py-4">
        <Link
          ref={logoLinkRef}
          href="/"
          className="phoenix-logo-trigger relative flex items-center"
          onClick={handleLogoClick}
        >
          {logoFlareKey ? (
            <span
              key={logoFlareKey}
              className="phoenix-logo-radiance"
              aria-hidden="true"
            />
          ) : null}
          <Image
            src="/images/brand/logo.webp"
            alt="Phoenix Chimney & Fireplace Services logo"
            width={180}
            height={67}
            priority
            className="h-auto w-[8.25rem] sm:w-[10.5rem]"
          />
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navigationLinks.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
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
            href={`tel:${settings.phoneHref}`}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--color-ink)]"
          >
            Call now
          </a>
          <a
            href={settings.workizUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[rgba(34,58,51,0.18)] bg-[var(--color-forest)] px-5 py-2.5 text-sm font-semibold shadow-[0_14px_30px_rgba(34,58,51,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(34,58,51,0.3)]"
            style={{ color: "var(--color-paper)" }}
          >
            {settings.bookingLabel}
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={`tel:${settings.phoneHref}`}
            className="inline-flex rounded-full border border-[var(--color-border)] p-3"
            aria-label={`Call ${settings.phoneDisplay}`}
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href={settings.workizUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[var(--color-forest)] px-3 py-3 text-[0.82rem] font-semibold text-[var(--color-paper)] sm:px-4 sm:text-sm"
          >
            <CalendarDays className="h-4 w-4" />
            {mobileBookingLabel}
          </a>
          <button
            type="button"
            className="inline-flex rounded-full border border-[var(--color-border)] p-3"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-card)] lg:hidden">
          <div className="page-bleed flex flex-col gap-4 px-4 py-5">
            <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--color-muted)]">
              <p className="font-semibold text-[var(--color-ink)]">{settings.hoursLabel}</p>
              <p>{settings.hoursDetail}</p>
            </div>
            {navigationLinks.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-2xl px-4 py-3 text-base font-semibold transition ${isActive
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
              href={`tel:${settings.phoneHref}`}
              className="rounded-2xl border border-[var(--color-border)] px-4 py-3 text-center font-semibold"
            >
              Call {settings.phoneDisplay}
            </a>
            <a
              href={settings.workizUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl bg-[var(--color-ember)] px-4 py-3 text-center font-semibold text-white"
            >
              {mobileBookingLabel}
            </a>
          </div>
        </div>
      ) : null}
      </header>
      <PhoenixLogoEasterEgg
        flight={phoenixFlight}
        onComplete={() => {
          setPhoenixFlight(null);
          setLogoFlareKey((value) => value + 1);
        }}
      />
    </>
  );
}