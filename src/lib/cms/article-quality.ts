import type { Article } from "@/lib/cms/types";

export type ArticleQualityIssue = {
  code: string;
  message: string;
  severity: "error" | "warning";
};

const GENERIC_HEADING_PATTERN =
  /^#{2,3}\s*(introduction|conclusion|final thoughts|things to know|why it matters)\s*$/gim;

function stripMarkdown(text: string) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getOpeningText(body: string, maxWords = 120) {
  const withoutHeadings = body.replace(/^#{1,6}\s+.*$/gm, "").trim();
  const firstParagraph = withoutHeadings.split(/\n\s*\n/)[0] || withoutHeadings;
  return stripMarkdown(firstParagraph).split(/\s+/).slice(0, maxWords).join(" ");
}

export function assessArticleQuality(article: Pick<
  Article,
  "title" | "excerpt" | "body" | "coverImage" | "coverImageAlt" | "status"
>): ArticleQualityIssue[] {
  const issues: ArticleQualityIssue[] = [];

  if (!article.excerpt.trim()) {
    issues.push({
      code: "missing_excerpt",
      message: "Excerpt is required.",
      severity: "error",
    });
  }

  if (!article.body.trim() || article.body.trim().length < 120) {
    issues.push({
      code: "thin_body",
      message: "Article body is too short to publish.",
      severity: "error",
    });
  }

  if (article.coverImage?.trim()) {
    const alt = article.coverImageAlt?.trim() || "";

    if (!alt) {
      issues.push({
        code: "missing_cover_alt",
        message: "Cover image alt text is required when a cover image is set.",
        severity: "error",
      });
    } else if (alt.toLowerCase() === article.title.trim().toLowerCase()) {
      issues.push({
        code: "title_as_alt",
        message: "Cover image alt should describe the image, not repeat the title.",
        severity: "error",
      });
    }
  }

  const opening = getOpeningText(article.body, 80);

  if (opening.split(/\s+/).filter(Boolean).length < 20) {
    issues.push({
      code: "thin_direct_answer",
      message: "Add a short direct answer near the top before the first section heading.",
      severity: "warning",
    });
  }

  if (GENERIC_HEADING_PATTERN.test(article.body)) {
    issues.push({
      code: "generic_heading",
      message: "Replace generic headings such as Introduction or Final Thoughts with descriptive headings.",
      severity: "warning",
    });
  }

  return issues;
}

export function assertPublishableArticle(
  article: Pick<Article, "title" | "excerpt" | "body" | "coverImage" | "coverImageAlt" | "status">,
) {
  if (article.status !== "published") {
    return;
  }

  const errors = assessArticleQuality(article).filter((issue) => issue.severity === "error");

  if (errors.length > 0) {
    throw new Error(errors.map((issue) => issue.message).join(" "));
  }
}

export function normalizeBodyFingerprint(body: string, cityNames: string[] = []) {
  let normalized = stripMarkdown(body).toLowerCase();

  for (const cityName of cityNames) {
    normalized = normalized.replaceAll(cityName.toLowerCase(), "{city}");
  }

  return normalized.replace(/\s+/g, " ").trim();
}

export function calculateTextSimilarity(first: string, second: string) {
  if (!first || !second) {
    return 0;
  }

  if (first === second) {
    return 1;
  }

  const firstTokens = new Set(first.split(" ").filter(Boolean));
  const secondTokens = new Set(second.split(" ").filter(Boolean));

  if (firstTokens.size === 0 || secondTokens.size === 0) {
    return 0;
  }

  let intersection = 0;

  for (const token of firstTokens) {
    if (secondTokens.has(token)) {
      intersection += 1;
    }
  }

  return intersection / Math.max(firstTokens.size, secondTokens.size);
}
