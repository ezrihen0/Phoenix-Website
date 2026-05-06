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
