import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CityPlaceholderPage } from "@/components/city-placeholder-page";
import { ArticleCard } from "@/components/articles/article-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { citySupportsArticles, getCityBySlug, getCityHref, getCitySettings } from "@/lib/cities";
import { listArticles, getPublicSiteSettings } from "@/lib/cms/storage";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    return createPageMetadata({
      title: "Articles Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested city articles page could not be found.",
      path: `/${cityParam}/articles`,
    });
  }

  if (!citySupportsArticles(city.slug)) {
    return {
      ...createPageMetadata({
        title: `${city.name} Fireplace Articles | Phoenix Dispatch`,
        description: `Local ${city.name.toLowerCase()} fireplace and chimney articles are in progress. Call Phoenix dispatch now for service routing.`,
        path: getCityHref(city.slug, "/articles"),
      }),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return createPageMetadata({
    title: `Fireplace Articles ${city.name} | Phoenix Chimney & Fireplace Services`,
    description:
      `Read ${city.name} fireplace, chimney, WETT, and masonry articles that help homeowners understand common issues, maintenance needs, and inspection timing.`,
    path: getCityHref(city.slug, "/articles"),
    keywords: [`fireplace articles ${city.name}`, `chimney blog ${city.name}`, `WETT advice ${city.name}`],
  });
}

export default async function CityArticlesPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    notFound();
  }

  if (!citySupportsArticles(city.slug)) {
    return <CityPlaceholderPage city={city} section="articles" />;
  }

  const [articles, settings] = await Promise.all([
    listArticles({ city: city.slug }),
    getPublicSiteSettings(),
  ]);
  const siteSettings = getCitySettings(settings, city.slug);

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: getCityHref(city.slug) },
          { name: "Articles", path: getCityHref(city.slug, "/articles") },
        ])}
      />

      <section className="section-pad">
        <div className="page-frame">
          <Reveal>
            <SectionHeading
              eyebrow="Articles"
              title={siteSettings.blogIndexTitle}
              description={siteSettings.blogIndexDescription}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Reveal key={article.id} delay={index * 90}>
                <ArticleCard article={article} city={city.slug} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
