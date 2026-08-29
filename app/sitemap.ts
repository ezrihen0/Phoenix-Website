import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { getArticleBySlug, listArticleSlugs } from "@/lib/articles";

function toIsoDate(display: string): string {
  const d = new Date(display);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/contact", "/book", "/calgary", "/edmonton", "/red-deer", "/services/gas-fireplace-repair", "/services/wett-inspection", "/services/chimney-sweep", "/services/chimney-repair"];
  const staticSitemap = staticRoutes.map((route) => ({ url: `${siteConfig.siteUrl}${route}`, lastModified: new Date() }));
  const articleSitemap = listArticleSlugs().map((slug) => {
    const article = getArticleBySlug(slug);
    return {
      url: `${siteConfig.siteUrl}/articles/${slug}`,
      lastModified: article ? toIsoDate(article.lastUpdated) : new Date(),
    };
  });
  return [...staticSitemap, ...articleSitemap];
}