import type { Article } from "@/lib/cms/types";

export const ARTICLE_TIMEZONE = "America/Edmonton";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
    timeZone: ARTICLE_TIMEZONE,
  }).format(new Date(value));
}

export function formatArticleDateTime(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: ARTICLE_TIMEZONE,
  }).format(new Date(value));
}

export function getArticleSortTimestamp(article: Article) {
  if (article.status === "published") {
    return article.publishedAt || article.updatedAt || article.createdAt;
  }

  if (article.status === "scheduled" && article.scheduledAt) {
    return article.scheduledAt;
  }

  return article.updatedAt || article.createdAt;
}

export function getArticleAdminDateLabel(article: Article) {
  if (article.status === "published") {
    return formatArticleDate(article.publishedAt || article.updatedAt || article.createdAt);
  }

  if (article.status === "scheduled" && article.scheduledAt) {
    return formatArticleDateTime(article.scheduledAt);
  }

  return formatArticleDate(article.updatedAt || article.createdAt);
}

function getDateTimePartsInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

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

export function parseScheduleDateTime(date: string, time: string) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim());
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time.trim());

  if (!dateMatch || !timeMatch) {
    throw new Error("Enter a valid publish date (YYYY-MM-DD) and time (HH:MM).");
  }

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) {
    throw new Error("Enter a valid publish date (YYYY-MM-DD) and time (HH:MM).");
  }

  let utcMs = Date.UTC(year, month - 1, day, hour + 7, minute);

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const parts = getDateTimePartsInTimeZone(new Date(utcMs), ARTICLE_TIMEZONE);

    if (
      parts.year === year &&
      parts.month === month &&
      parts.day === day &&
      parts.hour === hour &&
      parts.minute === minute
    ) {
      return new Date(utcMs).toISOString();
    }

    const minuteDelta =
      (year - parts.year) * 525600 +
      (month - parts.month) * 43200 +
      (day - parts.day) * 1440 +
      (hour - parts.hour) * 60 +
      (minute - parts.minute);

    utcMs += minuteDelta * 60 * 1000;
  }

  throw new Error("Could not resolve the scheduled publish time in Alberta time.");
}

export function formatScheduleInputValues(isoUtc: string) {
  const parts = getDateTimePartsInTimeZone(new Date(isoUtc), ARTICLE_TIMEZONE);

  return {
    date: `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`,
    time: `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`,
  };
}

export function estimateReadingTime(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function countWords(markdown: string) {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}

export function buildRelatedArticles(
  current: Article,
  articles: Article[],
  limit = 3,
) {
  const localArticles = articles.filter((article) => article.city === current.city);
  const related = current.relatedSlugs
    .map((slug) => localArticles.find((article) => article.slug === slug))
    .filter((article): article is Article => article != null)
    .filter((article) => article.slug !== current.slug);

  if (related.length >= limit) {
    return related.slice(0, limit);
  }

  const fallback = localArticles.filter((article) => article.slug !== current.slug);

  for (const article of fallback) {
    if (related.find((entry) => entry.slug === article.slug)) {
      continue;
    }

    related.push(article);

    if (related.length >= limit) {
      break;
    }
  }

  return related;
}