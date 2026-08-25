import type { Metadata } from "next";

import { ArticleCard } from "@/components/articles/article-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { createPageMetadata, buildBreadcrumbSchema } from "@/lib/seo";
import { getPublicSiteSettings, listArticles } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Fireplace & Chimney Articles Alberta | Phoenix",
  description:
    "Alberta fireplace, chimney, WETT, and gas fireplace articles written for the situation a homeowner is actually in — not keyword variants for every city.",
  path: "/articles",
  keywords: ["fireplace articles Alberta", "WETT inspection guide", "gas fireplace troubleshooting"],
});

export default async function ArticlesPage() {
  const [articles, settings] = await Promise.all([
    listArticles({ scope: "general" }),
    getPublicSiteSettings(),
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
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
