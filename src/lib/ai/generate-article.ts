import "server-only";

import { z } from "zod";

import { CITY_SLUGS, defaultCitySlug, getCityBySlug, getCityHref, type CitySlug } from "@/lib/cities";
import { requestDeepSeekJsonCompletion } from "@/lib/ai/deepseek-client";
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
    systemPrompt: `${settings.aiSystemPrompt}\n\nReturn only valid JSON that matches the requested output shape. Do not wrap the JSON in markdown fences.`,
    userPrompt: JSON.stringify({
      goal:
        `Write a fresh daily SEO article for a ${cityConfig.name} fireplace and chimney service website. Use clean markdown inside the body field. Include helpful internal links to service pages and natural references to related existing articles. Avoid duplicate topics. Return a JSON object only.`,
      city: cityConfig.name,
      topicHint,
      targetAudience: cityConfig.articleAudience,
      localWeatherContext: cityConfig.weatherContext,
      localRegulatoryContext: cityConfig.regulationContext,
      outputShape: {
        title: "string",
        excerpt: "string",
        seoTitle: "string",
        seoDescription: "string",
        keywords: ["string"],
        body: "markdown with H2/H3 headings, bullet lists, FAQ section, internal links, and a practical CTA",
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
      return new Date(second.publishedAt).getTime() - new Date(first.publishedAt).getTime();
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
    return article.aiGenerated && article.publishedAt.slice(0, 10) === today;
  });

  if (duplicateForToday && !options?.force) {
    return {
      status: "skipped" as const,
      reason: "An AI-generated article already exists for today.",
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
    status: "published",
    authorName: settings.defaultAuthorName,
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