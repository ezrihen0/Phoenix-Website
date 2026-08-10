import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/articles/article-body";
import { ArticleCard } from "@/components/articles/article-card";
import { ArticleRelatedServices } from "@/components/articles/article-related-services";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { defaultCitySlug } from "@/lib/cities";
import { getArticleByline } from "@/lib/cms/article-authorship";
import { buildArticleSchema, buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { buildRelatedArticles, estimateReadingTime, formatArticleDate } from "@/lib/cms/helpers";
import { getArticleBySlug, getPublicSiteSettings, listArticles } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, { city: defaultCitySlug });

  if (!article) {
    return createPageMetadata({
      title: "Article Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested article could not be found.",
      path: `/articles/${slug}`,
    });
  }

  return createPageMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/articles/${article.slug}`,
    keywords: article.keywords,
    imagePath: article.coverImage || undefined,
    imageAlt: article.coverImageAlt || article.title,
    openGraphType: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.authorName],
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, articles, settings] = await Promise.all([
    getArticleBySlug(slug, { city: defaultCitySlug }),
    listArticles({ city: defaultCitySlug }),
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
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: article.title, path: `/articles/${article.slug}` },
          ]),
          buildArticleSchema(article, defaultCitySlug),
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
            <ArticleBody markdown={article.body} city={defaultCitySlug} />
          </div>

          <aside className="space-y-6">
            <ArticleRelatedServices article={article} city={defaultCitySlug} />
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
            <SectionHeading
              eyebrow="Related reading"
              title="More guidance for similar issues."
              description="Browse a few related articles if you want more context before you book service."
            />
            <div className="mt-4 grid gap-4">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} city={defaultCitySlug} />
              ))}
            </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}