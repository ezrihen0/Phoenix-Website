import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { ServiceLandingPageView } from "@/components/services/service-landing-page-view";
import { StructuredData } from "@/components/structured-data";
import {
  cities,
  cityHasFullContent,
  getCityBySlug,
  getCityHref,
  getCitySettings,
} from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import {
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  createPageMetadata,
} from "@/lib/seo";
import {
  getCityServiceKeywords,
  getCityServiceMetadata,
  getServiceLandingHref,
  getServiceLandingPage,
  serviceLandingPages,
} from "@/lib/site-data";

export function generateStaticParams() {
  return cities
    .filter((city) => cityHasFullContent(city.slug))
    .flatMap((city) =>
      serviceLandingPages.map((page) => ({
        city: city.slug,
        slug: page.slug,
      })),
    );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}): Promise<Metadata> {
  const { city: cityParam, slug } = await params;
  const city = getCityBySlug(cityParam);
  const servicePage = getServiceLandingPage(slug);

  if (!city || !servicePage) {
    return createPageMetadata({
      title: "Service Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested city service page could not be found.",
      path: getServiceLandingHref(slug),
    });
  }

  const { title, description } = getCityServiceMetadata(servicePage, city.name);

  return createPageMetadata({
    title,
    description,
    path: getServiceLandingHref(servicePage.slug, city.slug),
    keywords: [...getCityServiceKeywords(servicePage.slug, city.name)],
    imagePath: servicePage.image,
    imageAlt: servicePage.imageAlt,
  });
}

export default async function CityServiceLandingPage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city: cityParam, slug } = await params;
  const city = getCityBySlug(cityParam);
  const servicePage = getServiceLandingPage(slug);

  if (!city || !servicePage) {
    notFound();
  }

  if (!cityHasFullContent(city.slug)) {
    redirect(getServiceLandingHref(slug));
  }

  const siteSettings = getCitySettings(await getPublicSiteSettings(), city.slug);
  const { description: serviceDescription } = getCityServiceMetadata(servicePage, city.name);

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: getCityHref(city.slug) },
            { name: "Services", path: getCityHref(city.slug, "/services") },
            {
              name: servicePage.title,
              path: getServiceLandingHref(servicePage.slug, city.slug),
            },
          ]),
          buildLocalBusinessSchema(city.slug),
          buildServiceSchema(
            `${servicePage.title} in ${city.name}`,
            serviceDescription,
            getServiceLandingHref(servicePage.slug, city.slug),
            city.slug,
          ),
        ]}
      />
      <ServiceLandingPageView
        servicePage={servicePage}
        settings={siteSettings}
        city={city.slug}
      />
    </>
  );
}