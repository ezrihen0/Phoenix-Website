import type { Metadata } from "next";

import { ArticleCard } from "@/components/articles/article-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { defaultCitySlug } from "@/lib/cities";
import { createPageMetadata, buildBreadcrumbSchema } from "@/lib/seo";
import { listArticles, getSiteSettings } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Fireplace Articles Calgary | Phoenix Chimney & Fireplace Services",
  description:
    "Read Calgary fireplace, chimney, WETT, and masonry articles that help homeowners understand common issues, maintenance needs, and inspection timing.",
  path: "/articles",
  keywords: ["fireplace articles Calgary", "chimney blog Calgary", "WETT advice Calgary"],
});

export default async function ArticlesPage() {
  const [articles, settings] = await Promise.all([
    listArticles({ city: defaultCitySlug }),
    getSiteSettings(),
  ]);

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
        ])}
      />

      <section className="section-pad">
        <div className="page-frame">
          <Reveal>
            <SectionHeading
              eyebrow="Articles"
              title={settings.blogIndexTitle}
              description={settings.blogIndexDescription}
            />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {articles.map((article, index) => (
              <Reveal key={article.id} delay={index * 90}>
                <ArticleCard article={article} city={defaultCitySlug} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}