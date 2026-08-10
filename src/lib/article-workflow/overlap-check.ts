import type { CitySlug } from "@/lib/cities";
import { slugify } from "@/lib/cms/helpers";
import type { Article } from "@/lib/cms/types";

import type { OverlapMatch, OverlapResult } from "./types";

function tokenize(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 3),
  );
}

function jaccardSimilarity(left: Set<string>, right: Set<string>) {
  if (left.size === 0 || right.size === 0) {
    return 0;
  }

  let intersection = 0;

  for (const token of left) {
    if (right.has(token)) {
      intersection += 1;
    }
  }

  const union = left.size + right.size - intersection;

  return union === 0 ? 0 : intersection / union;
}

export function checkArticleOverlap({
  city,
  proposedTitle,
  primaryQuestion,
  articles,
}: {
  city: CitySlug;
  proposedTitle: string;
  primaryQuestion: string;
  articles: Article[];
}): OverlapResult {
  const cityArticles = articles.filter((article) => article.city === city);
  const proposedSlug = slugify(proposedTitle);
  const proposedTokens = tokenize(`${proposedTitle} ${primaryQuestion}`);
  const matches: OverlapMatch[] = [];

  for (const article of cityArticles) {
    const articleTokens = tokenize(`${article.title} ${article.excerpt}`);
    const score = jaccardSimilarity(proposedTokens, articleTokens);
    const slugCollision = article.slug === proposedSlug;

    if (slugCollision) {
      matches.push({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        score: 1,
        reason: "Proposed title would produce the same slug as an existing article.",
      });
      continue;
    }

    if (score >= 0.35) {
      matches.push({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        score,
        reason: "Title and topic wording overlap strongly with this existing article.",
      });
    }
  }

  matches.sort((first, second) => second.score - first.score);

  if (matches.length === 0) {
    return {
      status: "none",
      matches: [],
      recommendation: "No meaningful overlap found with existing articles in this city.",
    };
  }

  const topMatch = matches[0];

  return {
    status: "potential",
    matches: matches.slice(0, 3),
    recommendation:
      topMatch.score >= 0.55
        ? "Potential overlap. Review the closest existing article before publishing, or adjust the primary question to make the article clearly different."
        : "Some topical overlap exists, but the proposed question may still be distinct enough if the article answers a different homeowner need.",
  };
}
