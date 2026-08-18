export const SITE_TIMEZONE = "America/Edmonton";

export const SITE_TIMEZONE_LABEL = "Calgary";

const SITE_LOCALE = "en-CA";

type DateInput = string | Date;

function toDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

export function getSiteTimeZoneName(date: DateInput = new Date()): string {
  return (
    new Intl.DateTimeFormat(SITE_LOCALE, {
      timeZone: SITE_TIMEZONE,
      timeZoneName: "short",
    })
      .formatToParts(toDate(date))
      .find((part) => part.type === "timeZoneName")?.value || "MT"
  );
}

export function formatSiteDate(value: DateInput): string {
  return new Intl.DateTimeFormat(SITE_LOCALE, {
    dateStyle: "long",
    timeZone: SITE_TIMEZONE,
  }).format(toDate(value));
}

export function formatSiteDateTime(value: DateInput, options?: { showTimeZone?: boolean }): string {
  const date = toDate(value);
  const formatted = new Intl.DateTimeFormat(SITE_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: SITE_TIMEZONE,
  }).format(date);

  if (!options?.showTimeZone) {
    return formatted;
  }

  return `${formatted} ${getSiteTimeZoneName(date)}`;
}

export function formatSiteTime(value: DateInput, options?: { showTimeZone?: boolean }): string {
  const date = toDate(value);
  const formatted = new Intl.DateTimeFormat(SITE_LOCALE, {
    timeStyle: "short",
    timeZone: SITE_TIMEZONE,
  }).format(date);

  if (!options?.showTimeZone) {
    return formatted;
  }

  return `${formatted} ${getSiteTimeZoneName(date)}`;
}

export function getDateTimePartsInSiteTimeZone(date: DateInput) {
  const parts = new Intl.DateTimeFormat(SITE_LOCALE, {
    timeZone: SITE_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(toDate(date));

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value || 0);

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour") % 24,
    minute: read("minute"),
  };
}
