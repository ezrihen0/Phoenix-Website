import { notFound } from "next/navigation";
import { getArticleBySlug, listArticleSlugs } from "@/lib/articles";
import { ArticleLayout } from "@/components/articles/ArticleLayout";

export async function generateStaticParams() { return listArticleSlugs().map((slug) => ({ slug })); }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();
  return <ArticleLayout article={article} />;
}