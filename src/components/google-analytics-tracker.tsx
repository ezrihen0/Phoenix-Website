"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { trackCtaClick, isGaConfigured, trackPhoneClick, trackThankYouView } from "@/lib/analytics/events";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const thankYouTracked = useRef(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !pathname || pathname.startsWith("/admin")) {
      return;
    }

    window.gtag?.("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  useEffect(() => {
    if (!isGaConfigured() || pathname !== "/thank-you" || thankYouTracked.current) {
      return;
    }

    thankYouTracked.current = true;
    trackThankYouView();
  }, [pathname]);

  useEffect(() => {
    if (!isGaConfigured()) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (pathname?.startsWith("/admin")) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const cta = target?.closest("[data-cta]") as HTMLElement | null;
      if (cta) {
        trackCtaClick(cta.getAttribute("data-cta") || "unknown", cta.textContent?.trim() || undefined);
      }

      const anchor = target?.closest('a[href^="tel:"]') as HTMLAnchorElement | null;

      if (!anchor) {
        return;
      }

      trackPhoneClick(anchor.href);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname]);

  return null;
}
