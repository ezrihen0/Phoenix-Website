import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { listArticleSlugs } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/contact", "/book", "/calgary", "/edmonton", "/red-deer", "/services/gas-fireplace-repair", "/services/wett-inspection", "/services/chimney-sweep", "/services/chimney-repair"];
  const articleRoutes = listArticleSlugs().map((slug) => `/articles/${slug}`);
  return [...staticRoutes, ...articleRoutes].map((route) => ({ url: `${siteConfig.siteUrl}${route}`, lastModified: new Date() }));
}