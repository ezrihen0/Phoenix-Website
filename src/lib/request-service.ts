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

export const SERVICE_REQUEST_CATALOG = services;

export const SERVICE_REQUEST_TITLES = services.map((service) => service.title);

export type ServiceRequestUrgency = (typeof SERVICE_REQUEST_URGENCY_OPTIONS)[number];
export type ServiceRequestContactMethod = (typeof SERVICE_REQUEST_CONTACT_METHODS)[number];

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
