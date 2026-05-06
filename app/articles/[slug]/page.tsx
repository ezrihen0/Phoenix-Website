import { notFound } from "next/navigation";
import { getArticleBySlug, listArticleSlugs } from "@/lib/articles";
import { ArticleLayout } from "@/components/articles/ArticleLayout";
import type { Metadata } from "next";

export async function generateStaticParams() { return listArticleSlugs().map((slug) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.metaDescription,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      url: `/articles/${article.slug}`,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleLayout article={article} />;
}
