import "server-only";

import { cities } from "@/lib/cities";
import {
  assessArticleQuality,
  calculateTextSimilarity,
  normalizeBodyFingerprint,
} from "@/lib/cms/article-quality";
import { SEED_ARTICLES, getSeedArticleById, isKnownSeedId } from "@/lib/cms/seed-articles";
import type { Article } from "@/lib/cms/types";

export type ArticleSourceType = "KNOWN_SEED" | "LEGACY_AI" | "GUIDED_OR_MANUAL" | "UNKNOWN";

export type MigrationRecommendation =
  | "REWRITE_SEED"
  | "KEEP"
  | "LIGHT_EDIT"
  | "FULL_REWRITE"
  | "DRAFT_REVIEW"
  | "SKIP_PROTECTED";

export type ArticleInventoryEntry = {
  id: string;
  slug: string;
  city: Article["city"];
  title: string;
  status: Article["status"];
  aiGenerated: boolean;
  authorType: Article["authorType"];
  publishedAt: string;
  updatedAt: string;
  sourceType: ArticleSourceType;
  knownSeedMatch: boolean;
  seedTopic?: "spring" | "wett" | "gas";
  recommendation: MigrationRecommendation;
  bodyFingerprint: string;
  qualityFlags: string[];
  siblingSimilarityScore?: number;
};

export type ArticleMigrationProposal = {
  articleId: string;
  migrationType: MigrationRecommendation;
  reason: string;
  before: {
    title: string;
    excerpt: string;
    bodyPreview: string;
    status: Article["status"];
    publishedAt: string;
    updatedAt: string;
  };
  after: {
    title: string;
    excerpt: string;
    bodyPreview: string;
    status: Article["status"];
    publishedAt: string;
    updatedAt: string;
  };
  warnings: string[];
};

export type ArticleMigrationReport = {
  generatedAt: string;
  storedArticleCount: number;
  mergedArticleCount: number;
  inventory: ArticleInventoryEntry[];
  proposals: ArticleMigrationProposal[];
};

const SEED_TEMPLATE_ERA = new Date("2026-04-20T00:00:00.000Z").getTime();

function getSeedTopic(id: string): "spring" | "wett" | "gas" | undefined {
  if (id.includes("spring-fireplace-checklist")) {
    return "spring";
  }

  if (id.includes("wett-booking-guide")) {
    return "wett";
  }

  if (id.includes("gas-fireplace-troubleshooting")) {
    return "gas";
  }

  return undefined;
}

function classifySourceType(article: Article): ArticleSourceType {
  if (isKnownSeedId(article.id)) {
    return "KNOWN_SEED";
  }

  if (!article.aiGenerated) {
    return "GUIDED_OR_MANUAL";
  }

  return "LEGACY_AI";
}

function isLikelyManualImprovement(article: Article, seedFingerprint?: string) {
  const updatedAt = new Date(article.updatedAt).getTime();

  if (updatedAt <= SEED_TEMPLATE_ERA) {
    return false;
  }

  if (!seedFingerprint) {
    return true;
  }

  const currentFingerprint = normalizeBodyFingerprint(
    article.body,
    cities.map((city) => city.name),
  );

  return currentFingerprint !== seedFingerprint && calculateTextSimilarity(currentFingerprint, seedFingerprint) < 0.85;
}

function getSiblingArticles(article: Article, articles: Article[]) {
  const topic = getSeedTopic(article.id) || inferTopicFromSlug(article.slug);

  if (!topic) {
    return [];
  }

  return articles.filter((entry) => {
    if (entry.id === article.id || entry.city === article.city) {
      return false;
    }

    const entryTopic = getSeedTopic(entry.id) || inferTopicFromSlug(entry.slug);
    return entryTopic === topic;
  });
}

function inferTopicFromSlug(slug: string) {
  if (slug.includes("spring-fireplace") || slug.includes("maintenance-checklist")) {
    return "spring";
  }

  if (slug.includes("wett")) {
    return "wett";
  }

  if (slug.includes("gas-fireplace")) {
    return "gas";
  }

  return undefined;
}

function recommendMigration(
  article: Article,
  articles: Article[],
  sourceType: ArticleSourceType,
): MigrationRecommendation {
  if (sourceType === "KNOWN_SEED") {
    const seed = getSeedArticleById(article.id);
    const seedFingerprint = seed
      ? normalizeBodyFingerprint(seed.body, cities.map((city) => city.name))
      : undefined;

    if (isLikelyManualImprovement(article, seedFingerprint)) {
      return "SKIP_PROTECTED";
    }

    return "REWRITE_SEED";
  }

  if (sourceType === "GUIDED_OR_MANUAL") {
    const qualityIssues = assessArticleQuality(article).filter((issue) => issue.severity === "error");

    if (qualityIssues.length === 0) {
      return "KEEP";
    }

    return "LIGHT_EDIT";
  }

  const siblings = getSiblingArticles(article, articles);
  const fingerprint = normalizeBodyFingerprint(
    article.body,
    cities.map((city) => city.name),
  );
  const siblingScore = siblings.reduce((maxScore, sibling) => {
    const siblingFingerprint = normalizeBodyFingerprint(
      sibling.body,
      cities.map((city) => city.name),
    );
    return Math.max(maxScore, calculateTextSimilarity(fingerprint, siblingFingerprint));
  }, 0);

  if (siblingScore >= 0.85) {
    return "FULL_REWRITE";
  }

  const qualityIssues = assessArticleQuality(article);

  if (qualityIssues.some((issue) => issue.code === "thin_body" || issue.code === "missing_excerpt")) {
    return "DRAFT_REVIEW";
  }

  if (qualityIssues.length > 0) {
    return "LIGHT_EDIT";
  }

  if (sourceType === "LEGACY_AI") {
    return "DRAFT_REVIEW";
  }

  return "KEEP";
}

function buildInventoryEntry(article: Article, articles: Article[]): ArticleInventoryEntry {
  const sourceType = classifySourceType(article);
  const cityNames = cities.map((city) => city.name);
  const bodyFingerprint = normalizeBodyFingerprint(article.body, cityNames);
  const siblings = getSiblingArticles(article, articles);
  const siblingSimilarityScore = siblings.reduce((maxScore, sibling) => {
    const siblingFingerprint = normalizeBodyFingerprint(sibling.body, cityNames);
    return Math.max(maxScore, calculateTextSimilarity(bodyFingerprint, siblingFingerprint));
  }, 0);
  const qualityFlags = assessArticleQuality(article).map((issue) => issue.code);

  return {
    id: article.id,
    slug: article.slug,
    city: article.city,
    title: article.title,
    status: article.status,
    aiGenerated: article.aiGenerated,
    authorType: article.authorType,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    sourceType,
    knownSeedMatch: isKnownSeedId(article.id),
    seedTopic: getSeedTopic(article.id),
    recommendation: recommendMigration(article, articles, sourceType),
    bodyFingerprint,
    qualityFlags,
    siblingSimilarityScore: siblings.length > 0 ? siblingSimilarityScore : undefined,
  };
}

function previewBody(body: string, length = 500) {
  return body.replace(/\s+/g, " ").trim().slice(0, length);
}

function mergeSeedProposal(existing: Article | undefined, seed: Article, migrationTimestamp: string): Article {
  return {
    ...seed,
    id: seed.id,
    slug: existing?.slug || seed.slug,
    city: existing?.city || seed.city,
    status: existing?.status || seed.status,
    publishedAt: existing?.publishedAt || seed.publishedAt,
    createdAt: existing?.createdAt || seed.createdAt,
    updatedAt: migrationTimestamp,
    aiGenerated: existing?.aiGenerated ?? seed.aiGenerated,
    relatedSlugs: existing?.relatedSlugs?.length ? existing.relatedSlugs : seed.relatedSlugs,
  };
}

function buildProposal(
  article: Article,
  recommendation: MigrationRecommendation,
  migrationTimestamp: string,
): ArticleMigrationProposal | null {
  if (recommendation === "KEEP" || recommendation === "SKIP_PROTECTED") {
    return null;
  }

  const seed = recommendation === "REWRITE_SEED" ? getSeedArticleById(article.id) : null;
  const nextArticle = seed ? mergeSeedProposal(article, seed, migrationTimestamp) : article;
  const reasonMap: Record<MigrationRecommendation, string> = {
    REWRITE_SEED: "Known seed article requires Phase C content upgrade.",
    LIGHT_EDIT: "Article needs metadata or opening-structure cleanup.",
    FULL_REWRITE: "Article appears too similar to sibling-city content or legacy template output.",
    DRAFT_REVIEW: "Article should be reviewed before remaining published.",
    KEEP: "",
    SKIP_PROTECTED: "",
  };

  const warnings = assessArticleQuality(nextArticle)
    .filter((issue) => issue.severity === "warning")
    .map((issue) => issue.message);

  return {
    articleId: article.id,
    migrationType: recommendation,
    reason: reasonMap[recommendation],
    before: {
      title: article.title,
      excerpt: article.excerpt,
      bodyPreview: previewBody(article.body),
      status: article.status,
      publishedAt: article.publishedAt,
      updatedAt: article.updatedAt,
    },
    after: {
      title: nextArticle.title,
      excerpt: nextArticle.excerpt,
      bodyPreview: previewBody(nextArticle.body),
      status: recommendation === "DRAFT_REVIEW" ? "draft" : nextArticle.status,
      publishedAt: article.publishedAt,
      updatedAt: migrationTimestamp,
    },
    warnings,
  };
}

export function buildArticleMigrationReport(storedArticles: Article[], mergedArticles: Article[]): ArticleMigrationReport {
  const migrationTimestamp = new Date().toISOString();
  const inventory = mergedArticles.map((article) => buildInventoryEntry(article, mergedArticles));
  const proposals = inventory
    .map((entry) => {
      const article = mergedArticles.find((candidate) => candidate.id === entry.id);

      if (!article) {
        return null;
      }

      return buildProposal(article, entry.recommendation, migrationTimestamp);
    })
    .filter((proposal): proposal is ArticleMigrationProposal => proposal != null);

  return {
    generatedAt: migrationTimestamp,
    storedArticleCount: storedArticles.length,
    mergedArticleCount: mergedArticles.length,
    inventory,
    proposals,
  };
}

export function applyArticleMigrationProposals(
  storedArticles: Article[],
  mergedArticles: Article[],
  approvedIds: string[],
) {
  const migrationTimestamp = new Date().toISOString();
  const approved = new Set(approvedIds);
  const nextById = new Map(storedArticles.map((article) => [article.id, article]));

  for (const articleId of approved) {
    const storedArticle = nextById.get(articleId);
    const mergedArticle = mergedArticles.find((candidate) => candidate.id === articleId);
    const sourceArticle = storedArticle || mergedArticle;

    if (!sourceArticle && isKnownSeedId(articleId)) {
      const seed = getSeedArticleById(articleId);

      if (seed) {
        nextById.set(articleId, {
          ...seed,
          updatedAt: migrationTimestamp,
        });
      }

      continue;
    }

    if (!sourceArticle) {
      continue;
    }

    const inventoryEntry = buildInventoryEntry(sourceArticle, mergedArticles);

    if (inventoryEntry.recommendation === "REWRITE_SEED") {
      const seed = getSeedArticleById(articleId);

      if (seed) {
        nextById.set(
          articleId,
          mergeSeedProposal(storedArticle || sourceArticle, seed, migrationTimestamp),
        );
      }

      continue;
    }

    if (inventoryEntry.recommendation === "DRAFT_REVIEW") {
      nextById.set(articleId, {
        ...sourceArticle,
        status: "draft",
        updatedAt: migrationTimestamp,
      });
    }
  }

  return sortArticles(Array.from(nextById.values()));
}

function sortArticles(articles: Article[]) {
  return [...articles].sort((first, second) => {
    return new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime();
  });
}

export function getDefaultApprovedSeedIds() {
  return SEED_ARTICLES.map((article) => article.id);
}
