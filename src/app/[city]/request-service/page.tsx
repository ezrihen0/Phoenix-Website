import type { Metadata } from "next";
import { Clock3, Phone, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { RequestServiceForm } from "@/components/forms/request-service-form";
import { CityPlaceholderPage } from "@/components/city-placeholder-page";
import { Reveal } from "@/components/motion/reveal";
import { StructuredData } from "@/components/structured-data";
import { cityHasFullContent, getCityBySlug, getCityHref, getCitySettings } from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

type RequestServicePageProps = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    return createPageMetadata({
      title: "Request Service Page Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested city service request page could not be found.",
      path: `/${cityParam}/request-service`,
    });
  }

  return createPageMetadata({
    title: `Request Fireplace & Chimney Service in ${city.name} | Phoenix`,
    description: `Request Phoenix fireplace, chimney, or WETT service in ${city.name}. Tell us what is happening and the office will follow up with the next step.`,
    path: getCityHref(city.slug, "/request-service"),
  });
}

export default async function CityRequestServicePage({
  params,
  searchParams,
}: RequestServicePageProps) {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    notFound();
  }

  if (!cityHasFullContent(city.slug)) {
    return <CityPlaceholderPage city={city} section="contact" />;
  }

  const query = await searchParams;
  const siteSettings = getCitySettings(await getPublicSiteSettings(), city.slug);

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: getCityHref(city.slug) },
          { name: "Request Service", path: getCityHref(city.slug, "/request-service") },
        ])}
      />

      <section className="section-pad pt-8 sm:pt-12">
        <div className="page-frame space-y-8">
          <Reveal>
            <div className="overflow-hidden rounded-[2.5rem] border border-black/10 bg-[var(--color-ink)] px-6 py-8 text-[var(--color-paper)] sm:px-10 sm:py-10">
              <p className="eyebrow text-[var(--color-gold)]">Request service in {city.name}</p>
              <h1 className="display-title mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[0.94] sm:text-6xl">
                Tell Phoenix what you need. We will take it from there.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--color-paper)]/78 sm:text-base sm:leading-8">
                Choose a service, describe the issue, and leave your contact details. The office reviews every
                request before following up.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm">
                  <ShieldCheck className="h-4 w-4 text-[var(--color-gold)]" />
                  Reviewed by Phoenix
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm">
                  <Clock3 className="h-4 w-4 text-[var(--color-gold)]" />
                  {siteSettings.hoursLabel} · {siteSettings.hoursDetail}
                </div>
                <a
                  href={`tel:${siteSettings.phoneHref}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm"
                >
                  <Phone className="h-4 w-4 text-[var(--color-gold)]" />
                  {siteSettings.phoneDisplay}
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <RequestServiceForm
              city={city.slug}
              cityName={city.name}
              settings={siteSettings}
              attribution={{
                sourceUrl: `${siteSettings.siteUrl}${getCityHref(city.slug, "/request-service")}`,
                utmSource: query.utm_source,
                utmMedium: query.utm_medium,
                utmCampaign: query.utm_campaign,
              }}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
