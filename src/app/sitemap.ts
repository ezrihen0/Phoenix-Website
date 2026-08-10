import type { MetadataRoute } from "next";

import { cities, citySupportsArticles, getCityHref } from "@/lib/cities";
import { listArticles } from "@/lib/cms/storage";
import { absoluteUrl } from "@/lib/seo";
import { getServiceLandingHref, serviceLandingPages } from "@/lib/site-data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await listArticles();

  const rootLegacyRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about",
    "/wett",
    "/contact",
    "/articles",
    "/gas-fireplace-repair",
  ].map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 0.78 : route === "/gas-fireplace-repair" ? 0.9 : 0.75,
  }));

  const rootServiceRoutes = [
    "/services",
    ...serviceLandingPages.map((servicePage) => getServiceLandingHref(servicePage.slug)),
  ];

  const rootRoutes: MetadataRoute.Sitemap = rootServiceRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/services" ? "weekly" : "monthly",
    priority: route === "/services" ? 0.88 : 0.82,
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

  const articleRoutes: MetadataRoute.Sitemap = [
    ...articles
      .filter((article) => article.city === "calgary")
      .map((article) => ({
        url: absoluteUrl(`/articles/${article.slug}`),
        lastModified: new Date(article.updatedAt || article.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.72,
      })),
    ...articles
      .filter((article) => citySupportsArticles(article.city) && article.city !== "calgary")
      .map((article) => ({
        url: absoluteUrl(getCityHref(article.city, `/articles/${article.slug}`)),
        lastModified: new Date(article.updatedAt || article.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
    ...articles
      .filter((article) => article.city === "calgary")
      .map((article) => ({
        url: absoluteUrl(getCityHref("calgary", `/articles/${article.slug}`)),
        lastModified: new Date(article.updatedAt || article.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.75,
      })),
  ];

  return [...rootLegacyRoutes, ...rootRoutes, ...staticRoutes, ...articleRoutes];
}