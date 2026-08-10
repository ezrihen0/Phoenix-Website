import type { Metadata } from "next";

import { countWords } from "@/lib/cms/helpers";
import type { Article } from "@/lib/cms/types";
import { getCityBySlug, getCityHref, type CitySlug } from "@/lib/cities";
import { siteConfig } from "@/lib/site-data";

type MetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  imagePath?: string;
  imageAlt?: string;
  openGraphType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

function buildShareImages(imagePath?: string, imageAlt?: string) {
  if (imagePath) {
    return [
      {
        url: absoluteUrl(imagePath),
        alt: imageAlt || `${siteConfig.name} image`,
      },
    ];
  }

  return [
    {
      url: absoluteUrl("/opengraph-image"),
      width: 1200,
      height: 630,
      alt:
        imageAlt ||
        "Phoenix Chimney & Fireplace Services brand and service overview",
    },
  ];
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  imagePath,
  imageAlt,
  openGraphType = "website",
  publishedTime,
  modifiedTime,
  authors = [],
}: MetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const shareImages = buildShareImages(imagePath, imageAlt || title);
  const twitterImage = absoluteUrl(imagePath || "/twitter-image");

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: openGraphType,
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "en_CA",
      images: shareImages,
      ...(openGraphType === "article"
        ? {
          publishedTime,
          modifiedTime,
          authors,
        }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [twitterImage],
    },
  };
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqSchema(
  items: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildLocalBusinessSchema(city?: CitySlug) {
  const logoUrl = absoluteUrl("/images/brand/favicon-512.png");
  const cityConfig = city ? getCityBySlug(city) : undefined;
  const areaServed = (cityConfig ? [cityConfig.name, ...cityConfig.serviceAreas] : ["Calgary", ...siteConfig.serviceAreas]).map((area) => ({
    "@type": "Place",
    name: area,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": cityConfig ? absoluteUrl(getCityHref(cityConfig.slug)) : siteConfig.url,
    name: siteConfig.legalName,
    url: cityConfig ? absoluteUrl(getCityHref(cityConfig.slug)) : siteConfig.url,
    image: absoluteUrl(siteConfig.socialPreview),
    logo: logoUrl,
    telephone: cityConfig?.phoneHref || siteConfig.phoneHref,
    email: siteConfig.email,
    areaServed,
    description: cityConfig
      ? `${cityConfig.name} fireplace, chimney, and WETT dispatch from ${siteConfig.legalName}.`
      : siteConfig.description,
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    sameAs: [],
  };
}

export function buildServiceSchema(
  name: string,
  description: string,
  path: string,
  city?: CitySlug,
) {
  const cityConfig = city ? getCityBySlug(city) : undefined;
  const serviceUrl = absoluteUrl(path);
  const areaServed = (cityConfig ? [cityConfig.name, ...cityConfig.serviceAreas] : ["Calgary", ...siteConfig.serviceAreas]).map((area) => ({
    "@type": "Place",
    name: area,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${serviceUrl}#${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    serviceType: name,
    name,
    description,
    areaServed,
    provider: {
      "@type": "LocalBusiness",
      "@id": cityConfig ? absoluteUrl(getCityHref(cityConfig.slug)) : siteConfig.url,
      name: siteConfig.legalName,
      telephone: cityConfig?.phoneHref || siteConfig.phoneHref,
      url: cityConfig ? absoluteUrl(getCityHref(cityConfig.slug)) : siteConfig.url,
    },
    url: serviceUrl,
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": siteConfig.url,
    name: siteConfig.legalName,
    url: siteConfig.url,
    logo: absoluteUrl("/images/brand/favicon-512.png"),
    email: siteConfig.email,
    telephone: siteConfig.phoneHref,
  };
}

export function buildArticleSchema(article: Article, city: CitySlug) {
  const articleUrl = absoluteUrl(getCityHref(city, `/articles/${article.slug}`));
  const imageUrl = article.coverImage ? absoluteUrl(article.coverImage) : absoluteUrl(siteConfig.socialPreview);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": articleUrl,
    mainEntityOfPage: articleUrl,
    headline: article.title,
    description: article.excerpt,
    articleBody: article.body,
    keywords: article.keywords.join(", "),
    wordCount: countWords(article.body),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.legalName,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/brand/favicon-512.png"),
      },
    },
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
  };
}

export function buildWebsiteSchema() {
  const logoUrl = absoluteUrl("/images/brand/favicon-512.png");

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: logoUrl,
      },
    },
  };
}