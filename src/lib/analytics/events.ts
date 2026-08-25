type GAEventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function isGaConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim());
}

export function sendGAEvent(eventName: string, params?: GAEventParams) {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackCtaClick(ctaLocation: string, ctaLabel?: string) {
  sendGAEvent("cta_click", {
    cta_location: ctaLocation,
    ...(ctaLabel ? { cta_label: ctaLabel } : {}),
  });
}

export function trackPhoneClick(linkUrl: string) {
  sendGAEvent("phone_click", { link_url: linkUrl });
}

export function trackFormStart(formName = "request_service") {
  sendGAEvent("form_start", { form_name: formName });
}

export function trackLeadSubmitted(formName = "request_service") {
  sendGAEvent("lead_submitted", { form_name: formName });
}

export function trackThankYouView() {
  sendGAEvent("thank_you_view");
}

export function trackWeatherBannerView(city?: string) {
  sendGAEvent("weather_banner_view", city ? { city } : undefined);
}

export function trackWeatherBannerCta(city?: string) {
  sendGAEvent("weather_banner_cta", city ? { city } : undefined);
}
