import "server-only";

import { z } from "zod";

import { CITY_SLUGS, defaultCitySlug, getCityBySlug, getCityHref, type CitySlug } from "@/lib/cities";
import { requestDeepSeekJsonCompletion } from "@/lib/ai/deepseek-client";
import {
  EDITORIAL_STANDARD_PROMPT,
  GUIDED_JSON_ONLY_RULE,
} from "@/lib/ai/prompt-shared";
import { saveArticle, listArticles, getSiteSettings } from "@/lib/cms/storage";
import { slugify } from "@/lib/cms/helpers";
import type { Article, GeneratedArticleDraft } from "@/lib/cms/types";
import { getServiceLandingHref, serviceLandingPages, services } from "@/lib/site-data";

const aiArticleSchema = z.object({
  title: z.string().min(12),
  excerpt: z.string().min(40),
  body: z.string().min(400),
  seoTitle: z.string().min(12),
  seoDescription: z.string().min(40),
  keywords: z.array(z.string()).min(3).max(8),
});

function buildDailyTopicHint(articleCount: number) {
  const topics = [
    "seasonal fireplace maintenance",
    "gas fireplace troubleshooting",
    "WETT inspection guidance",
    "chimney repair warning signs",
    "masonry maintenance and leak prevention",
    "wood stove safety and upkeep",
  ];

  return topics[articleCount % topics.length];
}

function buildPromptContext(city: CitySlug, existingArticles: Article[]) {
  const recentArticles = existingArticles.slice(0, 5).map((article) => ({
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt.slice(0, 180),
  }));

  const serviceLinks = services.map((service) => ({
    title: service.title,
    href: getCityHref(city, `/services#${service.slug}`),
  }));

  const serviceGuideLinks = serviceLandingPages.map((servicePage) => ({
    title: servicePage.title,
    href: getServiceLandingHref(servicePage.slug, city),
  }));

  return {
    recentArticles,
    serviceLinks: [...serviceLinks, ...serviceGuideLinks],
  };
}

async function requestDeepSeekArticle(
  topicHint: string,
  city: CitySlug,
  recentArticles: Article[],
): Promise<GeneratedArticleDraft> {
  const cityConfig = getCityBySlug(city);

  if (!cityConfig) {
    throw new Error(`Unsupported city: ${city}`);
  }

  const context = buildPromptContext(city, recentArticles);
  const settings = await getSiteSettings();

  const content = await requestDeepSeekJsonCompletion({
    systemPrompt: `${settings.aiSystemPrompt}\n\n${EDITORIAL_STANDARD_PROMPT}\n\n${GUIDED_JSON_ONLY_RULE}`,
    userPrompt: JSON.stringify({
      goal:
        "Write an informational homeowner article draft for review. Use clean markdown in the body field. Include helpful internal links where natural. Avoid duplicate topics. This output is draft-only and must stay informational, not transactional.",
      city: cityConfig.name,
      topicHint,
      targetAudience: cityConfig.articleAudience,
      outputShape: {
        title: "string",
        excerpt: "string",
        seoTitle: "string",
        seoDescription: "string",
        keywords: ["string"],
        body: "markdown with descriptive H2/H3 headings, a direct answer near the top, bullet lists where helpful, and no FAQ unless genuinely useful",
      },
      recentArticles: context.recentArticles,
      serviceLinks: context.serviceLinks,
    }),
  });

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(content);
  } catch {
    throw new Error("DeepSeek returned invalid JSON.");
  }

  const parsed = aiArticleSchema.safeParse(parsedJson);

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}

function pickNextCityForGeneration(existingArticles: Article[]) {
  const latestAiArticle = [...existingArticles]
    .filter((article) => article.aiGenerated)
    .sort((first, second) => {
      return new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime();
    })[0];

  if (!latestAiArticle) {
    return defaultCitySlug;
  }

  const currentIndex = CITY_SLUGS.indexOf(latestAiArticle.city);

  if (currentIndex === -1) {
    return defaultCitySlug;
  }

  return CITY_SLUGS[(currentIndex + 1) % CITY_SLUGS.length];
}

export async function generateDailyArticle(options?: { force?: boolean; city?: CitySlug }) {
  const allArticles = await listArticles({ includeDrafts: true });
  const today = new Date().toISOString().slice(0, 10);
  const city = options?.city || pickNextCityForGeneration(allArticles);
  const cityArticles = allArticles.filter((article) => article.city === city);
  const settings = await getSiteSettings();

  const duplicateForToday = cityArticles.find((article) => {
    return article.aiGenerated && article.updatedAt.slice(0, 10) === today;
  });

  if (duplicateForToday && !options?.force) {
    return {
      status: "skipped" as const,
      reason: "An AI-generated draft already exists for today in this city.",
      article: duplicateForToday,
    };
  }

  const draft = await requestDeepSeekArticle(
    buildDailyTopicHint(cityArticles.length),
    city,
    cityArticles,
  );
  const now = new Date().toISOString();
  let slug = slugify(draft.title);

  if (cityArticles.some((article) => article.slug === slug)) {
    slug = `${slug}-${today}`;
  }

  const relatedSlugs = cityArticles.slice(0, 3).map((article) => article.slug);

  const article: Article = {
    id: crypto.randomUUID(),
    city,
    slug,
    title: draft.title,
    excerpt: draft.excerpt,
    body: draft.body,
    seoTitle: draft.seoTitle,
    seoDescription: draft.seoDescription,
    keywords: draft.keywords,
    relatedSlugs,
    status: "draft",
    authorName: settings.defaultAuthorName,
    authorType: "organization",
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    aiGenerated: true,
  };

  await saveArticle(article);

  return {
    status: "created" as const,
    article,
  };
}
