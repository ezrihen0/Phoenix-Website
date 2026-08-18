import type { MetadataRoute } from "next";

import { cities, citySupportsArticles, getCityHref } from "@/lib/cities";
import { listArticles } from "@/lib/cms/storage";
import { absoluteUrl } from "@/lib/seo";
import { getServiceLandingHref, serviceLandingPages } from "@/lib/site-data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listArticles();

  const rootRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.78,
    },
  ];

  const provinceServiceRoutes: MetadataRoute.Sitemap = serviceLandingPages.map((servicePage) => ({
    url: absoluteUrl(getServiceLandingHref(servicePage.slug)),
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.82,
  }));

  const staticRoutes: MetadataRoute.Sitemap = cities.flatMap((city) => {
    const baseRoutes = [
      getCityHref(city.slug),
      getCityHref(city.slug, "/gas-fireplace-repair"),
      getCityHref(city.slug, "/services"),
      ...serviceLandingPages.map((servicePage) => getServiceLandingHref(servicePage.slug, city.slug)),
      getCityHref(city.slug, "/wett"),
      getCityHref(city.slug, "/about"),
      getCityHref(city.slug, "/contact"),
      getCityHref(city.slug, "/articles"),
    ];

    return baseRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: new Date(),
      changeFrequency:
        route === getCityHref(city.slug) || route.endsWith("/articles") || route.endsWith("/gas-fireplace-repair") || route.includes("/services/")
          ? "weekly"
          : "monthly",
      priority:
        route === getCityHref(city.slug)
          ? city.launchStage === "full"
            ? 1
            : 0.65
          : route.endsWith("/gas-fireplace-repair")
            ? city.launchStage === "full"
              ? 0.92
              : 0.58
          : route.includes("/services/")
            ? city.launchStage === "full"
              ? 0.86
              : 0.56
          : route.endsWith("/articles")
            ? city.launchStage === "full"
              ? 0.9
              : 0.55
            : city.launchStage === "full"
              ? 0.8
              : 0.5,
    }));
  });

  const articleRoutes: MetadataRoute.Sitemap = articles
    .filter((article) => citySupportsArticles(article.city))
    .map((article) => ({
      url: absoluteUrl(getCityHref(article.city, `/articles/${article.slug}`)),
      lastModified: new Date(article.updatedAt || article.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

  return [...rootRoutes, ...provinceServiceRoutes, ...staticRoutes, ...articleRoutes];
}
