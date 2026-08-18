import { SITE_TIMEZONE } from "@/lib/datetime";
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
