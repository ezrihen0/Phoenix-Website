import type { Metadata } from "next";

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
        "Phoenix Chimney & Fireplace Services logo and Calgary service overview",
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

export function buildLocalBusinessSchema() {
  const logoUrl = absoluteUrl("/images/brand/favicon-512.png");

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.legalName,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.socialPreview),
    logo: logoUrl,
    telephone: siteConfig.phoneHref,
    email: siteConfig.email,
    areaServed: ["Calgary", ...siteConfig.serviceAreas],
    description: siteConfig.description,
    priceRange: "$$",
    openingHours: "Su-Fr 09:00-18:00",
    sameAs: [],
  };
}

export function buildServiceSchema(
  name: string,
  description: string,
  path: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    areaServed: ["Calgary", ...siteConfig.serviceAreas],
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.legalName,
      telephone: siteConfig.phoneHref,
      url: siteConfig.url,
    },
    url: absoluteUrl(path),
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
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/services`,
      "query-input": "required name=service",
    },
  };
}