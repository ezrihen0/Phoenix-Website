import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/articles/article-body";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleRelatedServices } from "@/components/articles/article-related-services";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { citySupportsArticles, getCityBySlug, getCityHref } from "@/lib/cities";
import { buildArticleSchema, buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { getArticleByline } from "@/lib/cms/article-authorship";
import { buildRelatedArticles, estimateReadingTime, formatArticleDate } from "@/lib/cms/helpers";
import { getArticleBySlug, getPublicSiteSettings, listArticles } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { city: cityParam, slug } = await params;
  const city = getCityBySlug(cityParam);

  if (!city || !citySupportsArticles(city.slug)) {
    return createPageMetadata({
      title: "Article Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested article could not be found.",
      path: `/${cityParam}/articles/${slug}`,
    });
  }

  const article = await getArticleBySlug(slug, { city: city.slug });

  if (!article) {
    return createPageMetadata({
      title: "Article Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested article could not be found.",
      path: getCityHref(city.slug, `/articles/${slug}`),
    });
  }

  return createPageMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: getCityHref(city.slug, `/articles/${article.slug}`),
    keywords: article.keywords,
    imagePath: article.coverImage || undefined,
    imageAlt: article.coverImageAlt || article.title,
    openGraphType: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.authorName],
  });
}

export default async function CityArticlePage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city: cityParam, slug } = await params;
  const city = getCityBySlug(cityParam);

  if (!city || !citySupportsArticles(city.slug)) {
    notFound();
  }

  const [article, articles, settings] = await Promise.all([
    getArticleBySlug(slug, { city: city.slug }),
    listArticles({ city: city.slug }),
    getPublicSiteSettings(),
  ]);

  if (!article) {
    notFound();
  }

  const relatedArticles = buildRelatedArticles(article, articles);
  const byline = getArticleByline(article, settings.legalName);

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: getCityHref(city.slug) },
            { name: "Articles", path: getCityHref(city.slug, "/articles") },
            { name: article.title, path: getCityHref(city.slug, `/articles/${article.slug}`) },
          ]),
          buildArticleSchema(article, city.slug),
        ]}
      />

      <section className="section-pad">
        <div className="page-frame max-w-4xl">
          <Reveal>
            <p className="eyebrow">Article</p>
            <h1 className="mt-5 text-balance text-5xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-6xl">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
              <span>{formatArticleDate(article.publishedAt)}</span>
              <span>{estimateReadingTime(article.body)} min read</span>
              <span>{byline}</span>
            </div>
            <p className="mt-6 text-base leading-8 text-[var(--color-muted)] sm:text-lg">
              {article.excerpt}
            </p>
          </Reveal>
        </div>
      </section>

      {article.coverImage ? (
        <section className="pb-16">
          <div className="page-frame max-w-5xl">
            <Reveal>
              <div className="relative min-h-[22rem] overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] shadow-[0_20px_50px_rgba(31,26,22,0.1)]">
                <Image
                  src={article.coverImage}
                  alt={article.coverImageAlt || article.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="pb-20">
        <div className="page-frame grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-start">
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/78 p-6 sm:p-8">
            <ArticleBody markdown={article.body} city={city.slug} />
          </div>

          <aside className="space-y-6">
            <ArticleRelatedServices article={article} city={city.slug} />
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <SectionHeading
              eyebrow="Related reading"
              title="More guidance for similar issues."
              description="Browse a few related articles if you want more context before you book service."
            />
            <div className="mt-4 grid gap-4">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} city={city.slug} />
              ))}
            </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
