import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceLandingPageView } from "@/components/services/service-landing-page-view";
import { StructuredData } from "@/components/structured-data";
import { getCityHref } from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  createPageMetadata,
} from "@/lib/seo";
import {
  getServiceLandingHref,
  getServiceLandingPage,
  serviceLandingPages,
} from "@/lib/site-data";

export function generateStaticParams() {
  return serviceLandingPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const servicePage = getServiceLandingPage(slug);

  if (!servicePage) {
    return createPageMetadata({
      title: "Service Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested service page could not be found.",
      path: getServiceLandingHref(slug),
    });
  }

  return createPageMetadata({
    title: servicePage.metaTitle,
    description: servicePage.metaDescription,
    path: getServiceLandingHref(servicePage.slug),
    keywords: [...servicePage.keywords],
    imagePath: servicePage.image,
    imageAlt: servicePage.imageAlt,
  });
}

export default async function ServiceLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const servicePage = getServiceLandingPage(slug);

  if (!servicePage) {
    notFound();
  }

  const siteSettings = await getPublicSiteSettings();

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: servicePage.title, path: getServiceLandingHref(servicePage.slug) },
          ]),
          buildLocalBusinessSchema(),
          buildServiceSchema(
            servicePage.title,
            servicePage.metaDescription,
            getServiceLandingHref(servicePage.slug),
          ),
        ]}
      />
      <ServiceLandingPageView servicePage={servicePage} settings={siteSettings} />
    </>
  );
}