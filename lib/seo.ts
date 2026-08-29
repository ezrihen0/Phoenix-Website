import type { Metadata } from "next";

const siteName = "Phoenix Chimney & Fireplace";

function buildBase(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const buildServicePage = (s: { title: string; metaDescription: string; slug: string }): Metadata =>
  buildBase(s.title, s.metaDescription, `/services/${s.slug}`);

export const buildCityPage = (c: { title: string; metaDescription: string; slug: string }): Metadata =>
  buildBase(c.title, c.metaDescription, `/${c.slug}`);

/**
 * Explicit self-canonical metadata for simple pages (e.g. "/", "/contact", "/book").
 * Title/description are optional so pages that rely on the root layout defaults
 * (like the home page) keep their default title without template duplication.
 */
export const buildSimplePage = (path: string, title?: string, description?: string): Metadata => {
  const metadata: Metadata = {
    alternates: { canonical: path },
    openGraph: { url: path, siteName, type: "website" },
  };
  if (title) {
    metadata.title = title;
    metadata.openGraph = { ...metadata.openGraph, title };
    metadata.twitter = { card: "summary_large_image", title };
  }
  if (description) {
    metadata.description = description;
    metadata.openGraph = { ...metadata.openGraph, description };
    metadata.twitter = { ...(metadata.twitter ?? { card: "summary_large_image" }), description };
  }
  return metadata;
};
