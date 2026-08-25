import { isCitySlug, type CitySlug } from "@/lib/cities";
import { SITE_TIMEZONE } from "@/lib/datetime";
import { resolveCanonicalServiceSlug } from "@/lib/service-taxonomy";
import { services } from "@/lib/site-data";

export const SERVICE_REQUEST_URGENCY_OPTIONS = [
  "As soon as possible",
  "This week",
  "Flexible",
] as const;

export const SERVICE_REQUEST_ASAP_DETAILS = [
  "Today, if available",
  "Tomorrow",
  "First available appointment",
] as const;

export const SERVICE_REQUEST_FLEXIBLE_DETAILS = [
  "Next week",
  "Within the next 2 weeks",
  "No specific preference",
] as const;

const WEEKDAYS_MONDAY_FIRST = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const SERVICE_REQUEST_CONTACT_METHODS = ["Phone", "Email", "Either"] as const;

export const SERVICE_REQUEST_TIME_WINDOWS = [
  "8-12 Morning",
  "12-3 Noon",
  "3-7 Afternoon/evening",
] as const;

export const CANADIAN_PROVINCES = [
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "ON", name: "Ontario" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "QC", name: "Quebec" },
  { code: "SK", name: "Saskatchewan" },
  { code: "YT", name: "Yukon" },
] as const;

export const CANADIAN_PROVINCE_CODES = CANADIAN_PROVINCES.map((province) => province.code);

export function getCanadianProvinceLabel(code?: string) {
  if (!code) {
    return undefined;
  }

  return CANADIAN_PROVINCES.find((province) => province.code === code)?.name || code;
}

export const SERVICE_REQUEST_CATALOG = services;

export const SERVICE_REQUEST_TITLES = services.map((service) => service.title);

export type ServiceRequestUrgency = (typeof SERVICE_REQUEST_URGENCY_OPTIONS)[number];
export type ServiceRequestContactMethod = (typeof SERVICE_REQUEST_CONTACT_METHODS)[number];

export type ServiceAddressParts = {
  addressStreet?: string;
  addressCity?: string;
  addressProvince?: string;
  addressPostalCode?: string;
  address?: string;
};

export function normalizeServiceAddressParts(parts: ServiceAddressParts) {
  return {
    addressStreet: parts.addressStreet?.trim() || undefined,
    addressCity: parts.addressCity?.trim() || undefined,
    addressProvince: parts.addressProvince?.trim() || undefined,
    addressPostalCode: parts.addressPostalCode?.trim().toUpperCase() || undefined,
  };
}

export function formatServiceAddress(parts: ServiceAddressParts) {
  const normalized = normalizeServiceAddressParts(parts);

  if (
    normalized.addressStreet ||
    normalized.addressCity ||
    normalized.addressProvince ||
    normalized.addressPostalCode
  ) {
    const cityLine = [normalized.addressCity, normalized.addressProvince].filter(Boolean).join(", ");
    const cityPostal = [cityLine, normalized.addressPostalCode].filter(Boolean).join(" ");

    return [normalized.addressStreet, cityPostal].filter(Boolean).join(", ") || undefined;
  }

  return parts.address?.trim() || undefined;
}

export function formatServiceAddressLines(parts: ServiceAddressParts) {
  const normalized = normalizeServiceAddressParts(parts);
  const lines: string[] = [];

  if (normalized.addressStreet) {
    lines.push(`Street: ${normalized.addressStreet}`);
  }

  if (normalized.addressCity) {
    lines.push(`City: ${normalized.addressCity}`);
  }

  if (normalized.addressProvince) {
    lines.push(`Province: ${getCanadianProvinceLabel(normalized.addressProvince) || normalized.addressProvince}`);
  }

  if (normalized.addressPostalCode) {
    lines.push(`Postal code: ${normalized.addressPostalCode}`);
  }

  if (!lines.length && parts.address?.trim()) {
    lines.push(`Address: ${parts.address.trim()}`);
  }

  return lines;
}

export function getUpcomingWeekdayOptions(now = new Date()) {
  const todayName = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TIMEZONE,
    weekday: "long",
  }).format(now);

  const todayIndex = WEEKDAYS_MONDAY_FIRST.indexOf(
    todayName as (typeof WEEKDAYS_MONDAY_FIRST)[number],
  );

  if (todayIndex < 0) {
    return [...WEEKDAYS_MONDAY_FIRST];
  }

  return WEEKDAYS_MONDAY_FIRST.slice(todayIndex);
}

export function getUrgencyDetailOptions(urgency: string) {
  if (urgency === "As soon as possible") {
    return [...SERVICE_REQUEST_ASAP_DETAILS];
  }

  if (urgency === "This week") {
    return getUpcomingWeekdayOptions();
  }

  if (urgency === "Flexible") {
    return [...SERVICE_REQUEST_FLEXIBLE_DETAILS];
  }

  return [];
}

export const REQUEST_SERVICE_PATH = "/request-service";

export const REQUEST_SERVICE_CTA_LOCATIONS = [
  "header",
  "footer",
  "mobile-dock",
  "city-home",
  "city-contact",
  "city-services",
  "city-about",
  "service-landing",
  "wett",
  "gas-fireplace-repair",
  "article",
  "request-service-form",
] as const;

export type RequestServiceCtaLocation = (typeof REQUEST_SERVICE_CTA_LOCATIONS)[number];

export const REQUEST_SERVICE_CTA_LABELS: Record<RequestServiceCtaLocation, string> = {
  header: "Header",
  footer: "Footer",
  "mobile-dock": "Mobile dock",
  "city-home": "City home",
  "city-contact": "City contact",
  "city-services": "City services",
  "city-about": "City about",
  "service-landing": "Service page",
  wett: "WETT page",
  "gas-fireplace-repair": "Gas repair page",
  article: "Article",
  "request-service-form": "Request Service form",
};

export function getRequestServiceCtaLabel(value?: string) {
  if (value && isRequestServiceCta(value)) {
    return REQUEST_SERVICE_CTA_LABELS[value];
  }

  const trimmed = value?.trim();
  return trimmed || undefined;
}

const PROBLEM_MAX_LENGTH = 500;
const UTM_MAX_LENGTH = 120;

function isRequestServiceCta(value: string): value is RequestServiceCtaLocation {
  return (REQUEST_SERVICE_CTA_LOCATIONS as readonly string[]).includes(value);
}

function sanitizePlainText(value?: string, maxLength = PROBLEM_MAX_LENGTH) {
  if (!value) {
    return undefined;
  }

  const cleaned = value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  return cleaned ? cleaned.slice(0, maxLength) : undefined;
}

function sanitizeFromPath(value?: string) {
  if (!value) {
    return undefined;
  }

  const path = value.trim().split("?")[0];
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return undefined;
  }

  if (/^\/(admin|api|portal)(\/|$)/.test(path)) {
    return undefined;
  }

  if (path.length > 200) {
    return undefined;
  }

  return path;
}

export type RequestServiceQueryContext = {
  city?: CitySlug;
  serviceSlug?: string;
  serviceTitle?: string;
  problem?: string;
  urgency?: string;
  ctaLocation: RequestServiceCtaLocation;
  fromPath?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export function parseRequestServiceSearchParams(searchParams: {
  city?: string;
  service?: string;
  problem?: string;
  urgency?: string;
  cta?: string;
  from?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}): RequestServiceQueryContext {
  const city = searchParams.city && isCitySlug(searchParams.city) ? searchParams.city : undefined;
  const serviceSlug =
    (searchParams.service && resolveCanonicalServiceSlug(searchParams.service)) ||
    SERVICE_REQUEST_CATALOG.find((item) => item.title === searchParams.service)?.slug;
  const serviceTitle = serviceSlug
    ? SERVICE_REQUEST_CATALOG.find((item) => item.slug === serviceSlug)?.title
    : undefined;
  const urgency = SERVICE_REQUEST_URGENCY_OPTIONS.find((option) => option === searchParams.urgency);
  const ctaLocation =
    searchParams.cta && isRequestServiceCta(searchParams.cta) ? searchParams.cta : "request-service-form";

  return {
    city,
    serviceSlug,
    serviceTitle,
    problem: sanitizePlainText(searchParams.problem),
    urgency,
    ctaLocation,
    fromPath: sanitizeFromPath(searchParams.from),
    utmSource: sanitizePlainText(searchParams.utm_source, UTM_MAX_LENGTH),
    utmMedium: sanitizePlainText(searchParams.utm_medium, UTM_MAX_LENGTH),
    utmCampaign: sanitizePlainText(searchParams.utm_campaign, UTM_MAX_LENGTH),
  };
}
