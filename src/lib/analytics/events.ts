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

export function trackContactFormSubmit() {
  sendGAEvent("contact_form_submit");
}

export function trackRequestServiceSubmit() {
  sendGAEvent("request_service_submit");
}

export function trackThankYouView() {
  sendGAEvent("thank_you_view");
}

export function trackPhoneClick(linkUrl: string) {
  sendGAEvent("phone_click", { link_url: linkUrl });
}
