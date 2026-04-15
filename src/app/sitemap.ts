import type { MetadataRoute } from "next";

import { listArticles } from "@/lib/cms/storage";
import { absoluteUrl } from "@/lib/seo";

const routes = ["/", "/services", "/wett", "/about", "/contact", "/articles"] as const;

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listArticles();

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" || route === "/articles" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route === "/articles" ? 0.9 : 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: absoluteUrl(`/articles/${article.slug}`),
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...articleRoutes];
}