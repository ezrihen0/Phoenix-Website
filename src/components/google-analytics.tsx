"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import {
  isGaConfigured,
  trackPhoneClick,
  trackThankYouView,
} from "@/lib/analytics/events";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();

export function GoogleAnalytics() {
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
    if (!GA_MEASUREMENT_ID || pathname !== "/thank-you" || thankYouTracked.current) {
      return;
    }

    thankYouTracked.current = true;
    trackThankYouView();
  }, [pathname]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (pathname?.startsWith("/admin")) {
        return;
      }

      const target = event.target as HTMLElement | null;
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

  if (!isGaConfigured() || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
