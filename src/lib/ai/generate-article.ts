import "server-only";

import { z } from "zod";

import { saveArticle, listArticles, getSiteSettings } from "@/lib/cms/storage";
import { slugify } from "@/lib/cms/helpers";
import type { Article, GeneratedArticleDraft } from "@/lib/cms/types";
import { services } from "@/lib/site-data";

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

function buildPromptContext(existingArticles: Article[]) {
  const recentArticles = existingArticles.slice(0, 5).map((article) => ({
    title: article.title,
    slug: article.slug,
  }));

  const serviceLinks = services.map((service) => ({
    title: service.title,
    href: `/services#${service.slug}`,
  }));

  return {
    recentArticles,
    serviceLinks,
  };
}

async function requestOpenAiArticle(
  topicHint: string,
  recentArticles: Article[],
): Promise<GeneratedArticleDraft> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4.1";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const context = buildPromptContext(recentArticles);
  const settings = await getSiteSettings();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: settings.aiSystemPrompt,
        },
        {
          role: "user",
          content: JSON.stringify({
            goal:
              "Write a fresh daily SEO article for a Calgary fireplace and chimney service website. Use clean markdown. Include helpful internal links to service pages and natural references to related existing articles. Avoid duplicate topics.",
            topicHint,
            targetAudience: "Calgary homeowners and property buyers",
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
        },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response.");
  }

  const parsed = aiArticleSchema.safeParse(JSON.parse(content));

  if (!parsed.success) {
    throw new Error(parsed.error.message);
  }

  return parsed.data;
}

export async function generateDailyArticle(options?: { force?: boolean }) {
  const existingArticles = await listArticles({ includeDrafts: true });
  const today = new Date().toISOString().slice(0, 10);

  const duplicateForToday = existingArticles.find((article) => {
    return article.aiGenerated && article.publishedAt.slice(0, 10) === today;
  });

  if (duplicateForToday && !options?.force) {
    return {
      status: "skipped" as const,
      reason: "An AI-generated article already exists for today.",
      article: duplicateForToday,
    };
  }

  const draft = await requestOpenAiArticle(
    buildDailyTopicHint(existingArticles.length),
    existingArticles,
  );
  const now = new Date().toISOString();
  let slug = slugify(draft.title);

  if (existingArticles.some((article) => article.slug === slug)) {
    slug = `${slug}-${today}`;
  }

  const relatedSlugs = existingArticles.slice(0, 3).map((article) => article.slug);

  const article: Article = {
    id: crypto.randomUUID(),
    slug,
    title: draft.title,
    excerpt: draft.excerpt,
    body: draft.body,
    seoTitle: draft.seoTitle,
    seoDescription: draft.seoDescription,
    keywords: draft.keywords,
    relatedSlugs,
    status: "published",
    authorName: (await getSiteSettings()).defaultAuthorName,
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