"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Clock3, Flame, Menu, Phone, X } from "lucide-react";
import type { FocusEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import {
  PhoenixLogoEasterEgg,
  type PhoenixFlightState,
} from "@/components/phoenix-logo-easter-egg";
import { WeatherBanner } from "@/components/weather/weather-banner";
import {
  cities,
  getCityBySlug,
  getCityFromPathname,
  getCityHref,
  getCitySettings,
  getRequestServiceHref,
  getScopedPath,
  isPortalPath,
} from "@/lib/cities";
import type { PublicSiteSettings } from "@/lib/cms/types";
import { canonicalServices, getServiceHref } from "@/lib/service-taxonomy";
import { navigationLinks } from "@/lib/site-data";

type SiteHeaderProps = {
  settings: PublicSiteSettings;
};

const REQUIRED_LOGO_CLICKS = 5;
const CLICK_STREAK_WINDOW_MS = 650;
const CLICK_STREAK_RESET_MS = 950;
const PHOENIX_MESSAGE_COUNT = 4;
const SERVICES_MENU_CLOSE_DELAY_MS = 160;

export function SiteHeader({ settings }: SiteHeaderProps) {
  const pathname = usePathname();
  const currentCity = getCityFromPathname(pathname);
  const city = currentCity ? getCityBySlug(currentCity) : undefined;
  const effectiveSettings = getCitySettings(settings, currentCity);
  const showCityNavigation = Boolean(currentCity);
  const requestServiceHref = getRequestServiceHref({
    city: currentCity,
    cta: "header",
    from: pathname,
  });
  const isChooserPage = pathname === "/";
  const isProvinceWideServicesRoute =
    pathname === "/services" ||
    pathname?.startsWith("/services/") ||
    pathname === "/request-service";
  const showServicesNavigation =
    showCityNavigation ||
    isProvinceWideServicesRoute ||
    pathname === "/articles" ||
    Boolean(pathname?.startsWith("/articles/"));
  const navigationMenuItems = showCityNavigation
    ? navigationLinks
    : navigationLinks.filter((item) => item.href === "/services" || item.href === "/articles");
  const easterEggPath = currentCity === "calgary" ? getCityHref("calgary") : null;
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const [phoenixFlight, setPhoenixFlight] = useState<PhoenixFlightState | null>(null);
  const [logoFlareKey, setLogoFlareKey] = useState(0);
  const logoLinkRef = useRef<HTMLAnchorElement | null>(null);
  const logoClickCountRef = useRef(0);
  const lastLogoClickAtRef = useRef(0);
  const clickResetTimerRef = useRef<number | null>(null);
  const servicesMenuCloseTimerRef = useRef<number | null>(null);
  const lastPhoenixMessageIndexRef = useRef(-1);

  useEffect(() => {
    return () => {
      if (clickResetTimerRef.current) {
        clearTimeout(clickResetTimerRef.current);
      }

      if (servicesMenuCloseTimerRef.current) {
        clearTimeout(servicesMenuCloseTimerRef.current);
      }
    };
  }, []);

  function clearServicesMenuCloseTimer() {
    if (servicesMenuCloseTimerRef.current) {
      clearTimeout(servicesMenuCloseTimerRef.current);
      servicesMenuCloseTimerRef.current = null;
    }
  }

  function openServicesMenu() {
    clearServicesMenuCloseTimer();
    setIsServicesMenuOpen(true);
  }

  function closeServicesMenu() {
    clearServicesMenuCloseTimer();
    setIsServicesMenuOpen(false);
  }

  function scheduleServicesMenuClose() {
    clearServicesMenuCloseTimer();
    servicesMenuCloseTimerRef.current = window.setTimeout(() => {
      setIsServicesMenuOpen(false);
      servicesMenuCloseTimerRef.current = null;
    }, SERVICES_MENU_CLOSE_DELAY_MS);
  }

  useEffect(() => {
    clearServicesMenuCloseTimer();

    const resetTimer = window.setTimeout(() => {
      setIsOpen(false);
      setIsServicesMenuOpen(false);
      setIsServicesMobileOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(resetTimer);
    };
  }, [pathname]);

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

    if (pathname !== easterEggPath) {
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

  function handleServicesMenuBlur(event: FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget;

    if (nextFocusedElement instanceof Node && event.currentTarget.contains(nextFocusedElement)) {
      return;
    }

    scheduleServicesMenuClose();
  }

  const servicesIndexHref = currentCity ? getCityHref(currentCity, "/services") : "/services";
  const cityServicesPrefix = currentCity ? `${getCityHref(currentCity, "/services")}/` : null;
  const isServicesActive =
    pathname === servicesIndexHref ||
    pathname === "/services" ||
    pathname?.startsWith("/services/") ||
    (cityServicesPrefix ? pathname?.startsWith(cityServicesPrefix) : false);

  if (isPortalPath(pathname)) {
    return null;
  }

  return (
    <>
      {currentCity ? <WeatherBanner city={currentCity} /> : null}
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[rgba(244,236,223,0.82)] backdrop-blur-xl">
        <div className="hidden border-b border-[var(--color-border)] bg-[var(--color-ink)] text-[0.78rem] text-[var(--color-paper)] md:block">
          <div className="page-bleed flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-2">
                <Flame className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                {city
                  ? `Fireplace and chimney service for ${city.name} homes`
                  : "Choose your city for the right dispatch number and service path"}
              </span>
              {showCityNavigation ? (
                <span className="inline-flex items-center gap-2 text-[var(--color-paper)]/75">
                  <Clock3 className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                  {effectiveSettings.hoursLabel} · {effectiveSettings.hoursDetail}
                </span>
              ) : null}
            </div>
            {showCityNavigation ? (
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/" className="font-semibold text-[var(--color-paper)]/78 hover:text-white">
                  Choose city
                </Link>
                <a
                  href={`tel:${effectiveSettings.phoneHref}`}
                  className="inline-flex items-center gap-2 font-semibold"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                  {effectiveSettings.phoneDisplay}
                </a>
                <Link
                  href={requestServiceHref}
                  data-cta="header-info-bar"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ember)] px-4 py-2 font-semibold text-white transition hover:bg-[var(--color-ember-dark)]"
                >
                  Request Service
                </Link>
              </div>
            ) : isChooserPage ? (
              <div className="flex flex-wrap items-center gap-4 text-[var(--color-paper)]/78">
                {cities.map((cityOption) => (
                  <Link key={cityOption.slug} href={getCityHref(cityOption.slug)} className="font-semibold hover:text-white">
                    {cityOption.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="page-bleed flex items-center justify-between gap-3 px-4 py-3 lg:gap-6 lg:py-4">
          <Link
            ref={logoLinkRef}
            href={currentCity ? getCityHref(currentCity) : "/"}
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

          {showServicesNavigation ? (
            <nav className="hidden items-center gap-2 lg:flex">
              {navigationMenuItems.map((item) => {
                if (item.href === "/services") {
                  return (
                    <div
                      key="services-menu"
                      className="relative"
                      onMouseEnter={openServicesMenu}
                      onMouseLeave={scheduleServicesMenuClose}
                      onFocusCapture={openServicesMenu}
                      onBlurCapture={handleServicesMenuBlur}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          closeServicesMenu();
                        }
                      }}
                    >
                      <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={isServicesMenuOpen}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isServicesActive
                          ? "bg-[var(--color-ink)] shadow-[0_12px_24px_rgba(31,26,22,0.18)]"
                          : "text-[var(--color-ink)] hover:bg-[var(--color-card)]"
                          }`}
                        style={
                          isServicesActive
                            ? {
                              color: "var(--color-paper)",
                            }
                            : undefined
                        }
                        onClick={() => {
                          if (isServicesMenuOpen) {
                            closeServicesMenu();
                            return;
                          }

                          openServicesMenu();
                        }}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition ${isServicesMenuOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isServicesMenuOpen ? (
                        <>
                          <div
                            aria-hidden="true"
                            className="nav-dropdown-bridge absolute left-0 top-full z-10 h-4 w-[20rem] max-w-[calc(100vw-2rem)]"
                          />
                          <div className="nav-dropdown-panel absolute left-0 top-full z-20 mt-2 w-[20rem] max-w-[calc(100vw-2rem)] rounded-[1.4rem] p-2.5">
                            <Link
                              href={servicesIndexHref}
                              className="block rounded-[1.05rem] border border-[rgba(31,26,22,0.08)] bg-white/68 px-3.5 py-2.5 transition hover:bg-white/88 focus-visible:bg-white/88"
                            >
                              <p className="text-[0.82rem] font-semibold leading-5 text-[var(--color-ink)]">All fireplace and chimney services</p>
                              <p className="mt-0.5 text-[0.74rem] leading-5 text-[var(--color-muted)]">
                                Start with the city services overview and dispatch details.
                              </p>
                            </Link>
                            <div className="mt-1.5 grid gap-1">
                              {canonicalServices.map((service) => (
                                <Link
                                  key={service.slug}
                                  href={getServiceHref(service.slug, currentCity)}
                                  className="rounded-[1.05rem] px-3.5 py-2.5 transition hover:bg-white/72 focus-visible:bg-white/72"
                                >
                                  <p className="text-[0.82rem] font-semibold leading-5 text-[var(--color-ink)]">{service.navLabel}</p>
                                  <p className="mt-0.5 text-[0.74rem] leading-5 text-[var(--color-muted)]">
                                    {service.tagline}
                                  </p>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                }

                const href = getScopedPath(item.href, currentCity);
                const isActive = item.href === "/"
                  ? pathname === href
                  : pathname === href || pathname?.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
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
          ) : null}

          {showCityNavigation ? (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/"
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--color-ink)]"
              >
                Cities
              </Link>
              <a
                href={`tel:${effectiveSettings.phoneHref}`}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--color-ink)]"
              >
                Call now
              </a>
              <Link
                href={requestServiceHref}
                data-cta="header-nav"
                className="rounded-full border border-[rgba(34,58,51,0.18)] bg-[var(--color-forest)] px-5 py-2.5 text-sm font-semibold shadow-[0_14px_30px_rgba(34,58,51,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(34,58,51,0.3)]"
                style={{ color: "var(--color-paper)" }}
              >
                Request Service
              </Link>
            </div>
          ) : null}

          {isProvinceWideServicesRoute && !showCityNavigation ? (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/"
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--color-ink)]"
              >
                Cities
              </Link>
              <Link
                href={requestServiceHref}
                data-cta="header-nav"
                className="rounded-full bg-[var(--color-ember)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-ember-dark)]"
              >
                Request Service
              </Link>
            </div>
          ) : null}

          {showServicesNavigation ? (
            <div className="flex items-center gap-2 lg:hidden">
              {showCityNavigation ? (
                <a
                  href={`tel:${effectiveSettings.phoneHref}`}
                  className="inline-flex rounded-full border border-[var(--color-border)] p-3"
                  aria-label={`Call ${effectiveSettings.phoneDisplay}`}
                >
                  <Phone className="h-4 w-4" />
                </a>
              ) : (
                <Link
                  href="/"
                  className="inline-flex rounded-full border border-[var(--color-border)] px-4 py-3 text-[0.82rem] font-semibold sm:text-sm"
                >
                  Cities
                </Link>
              )}
              <Link
                href={requestServiceHref}
                data-cta="header-mobile"
                className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[var(--color-forest)] px-3 py-3 text-[0.82rem] font-semibold text-[var(--color-paper)] sm:px-4 sm:text-sm"
              >
                Request Service
              </Link>
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
          ) : null}
        </div>

        {isOpen && showServicesNavigation ? (
          <div className="border-t border-[var(--color-border)] bg-[rgba(248,242,234,0.82)] backdrop-blur-xl lg:hidden">
            <div className="page-bleed flex min-w-0 flex-col gap-3.5 px-4 py-4">
              {showCityNavigation ? (
                <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 p-4 text-sm leading-7 text-[var(--color-muted)]">
                  <p className="font-semibold text-[var(--color-ink)]">{effectiveSettings.hoursLabel}</p>
                  <p>{effectiveSettings.hoursDetail}</p>
                </div>
              ) : null}
              <Link
                href="/"
                className="rounded-2xl bg-white/60 px-4 py-3 text-base font-semibold transition hover:bg-white"
                onClick={() => setIsOpen(false)}
              >
                Choose city
              </Link>
              {navigationMenuItems.map((item) => {
                if (item.href === "/services") {
                  return (
                    <div key="services-mobile-menu" className="nav-mobile-panel overflow-hidden rounded-[1.4rem] px-2 py-2">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-[1.1rem] px-3 py-3.5 text-left text-[0.96rem] font-semibold transition hover:bg-white/60"
                        aria-expanded={isServicesMobileOpen}
                        onClick={() => setIsServicesMobileOpen((value) => !value)}
                      >
                        <span>Services</span>
                        <ChevronDown
                          className={`h-5 w-5 transition ${isServicesMobileOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isServicesMobileOpen ? (
                        <div className="grid gap-2 px-1 pb-2 pt-1">
                          <Link
                            href={servicesIndexHref}
                            className="rounded-[1.1rem] border border-[rgba(31,26,22,0.08)] bg-white/92 px-4 py-3.5 text-[0.92rem] font-semibold leading-5 text-[var(--color-ink)]"
                            onClick={() => {
                              setIsOpen(false);
                              setIsServicesMobileOpen(false);
                            }}
                          >
                            All fireplace and chimney services
                          </Link>
                          {canonicalServices.map((service) => (
                            <Link
                              key={service.slug}
                              href={getServiceHref(service.slug, currentCity)}
                              className="rounded-[1.1rem] border border-transparent bg-white/78 px-4 py-3.5 text-[0.87rem] leading-5 transition hover:bg-white"
                              onClick={() => {
                                setIsOpen(false);
                                setIsServicesMobileOpen(false);
                              }}
                            >
                              <p className="font-semibold text-[var(--color-ink)]">{service.navLabel}</p>
                              <p className="mt-1 text-[0.78rem] leading-5 text-[var(--color-muted)]">{service.tagline}</p>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                }

                const href = getScopedPath(item.href, currentCity);
                const isActive = item.href === "/"
                  ? pathname === href
                  : pathname === href || pathname?.startsWith(`${href}/`);

                return (
                  <Link
                    key={href}
                    href={href}
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
              {showCityNavigation ? (
                <a
                  href={`tel:${effectiveSettings.phoneHref}`}
                  className="rounded-2xl border border-[var(--color-border)] px-4 py-3 text-center font-semibold"
                >
                  Call {effectiveSettings.phoneDisplay}
                </a>
              ) : null}
              <Link
                href={requestServiceHref}
                data-cta="header-mobile-menu"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl bg-[var(--color-ember)] px-4 py-3 text-center font-semibold text-white"
              >
                Request Service
              </Link>
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