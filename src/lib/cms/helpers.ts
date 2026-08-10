import type { Article } from "@/lib/cms/types";

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
  }).format(new Date(value));
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