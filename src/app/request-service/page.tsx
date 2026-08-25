import type { Metadata } from "next";
import { Clock3, Phone, ShieldCheck } from "lucide-react";

import { RequestServiceForm } from "@/components/forms/request-service-form";
import { Reveal } from "@/components/motion/reveal";
import { StructuredData } from "@/components/structured-data";
import { getCityBySlug, getCitySettings } from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import { parseRequestServiceSearchParams } from "@/lib/request-service";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";

type RequestServicePageProps = {
  searchParams: Promise<{
    city?: string;
    service?: string;
    problem?: string;
    urgency?: string;
    cta?: string;
    from?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  }>;
};

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Request Fireplace & Chimney Service | Phoenix",
    description:
      "Request Phoenix fireplace, chimney, or WETT service in Calgary, Edmonton, or Red Deer. Tell us what is happening and the office will follow up with the next step.",
    path: "/request-service",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RequestServicePage({ searchParams }: RequestServicePageProps) {
  const query = await searchParams;
  const context = parseRequestServiceSearchParams(query);
  const city = context.city ? getCityBySlug(context.city) : undefined;
  const siteSettings = getCitySettings(await getPublicSiteSettings(), context.city);
  const sourceUrl = context.fromPath ? `${siteSettings.siteUrl}${context.fromPath}` : undefined;

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Request Service", path: "/request-service" },
        ])}
      />

      <section className="section-pad pt-8 sm:pt-12">
        <div className="page-frame space-y-8">
          <Reveal>
            <div className="overflow-hidden rounded-[2.5rem] border border-black/10 bg-[var(--color-ink)] px-6 py-8 text-[var(--color-paper)] sm:px-10 sm:py-10">
              <p className="eyebrow text-[var(--color-gold)]">
                {city ? `Request service in ${city.name}` : "Request service in Alberta"}
              </p>
              <h1 className="display-title mt-4 max-w-3xl text-balance text-4xl font-semibold leading-[0.94] sm:text-6xl">
                Tell Phoenix what you need. We will take it from there.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--color-paper)]/78 sm:text-base sm:leading-8">
                Choose a city and service, describe the issue, and leave your contact details. You can change a
                preselected city or service before you submit. The office reviews every request before following up.
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
              city={city?.slug}
              cityName={city?.name}
              settings={siteSettings}
              initialService={context.serviceTitle || context.serviceSlug}
              initialProblem={context.problem}
              initialUrgency={context.urgency}
              ctaLocation={context.ctaLocation}
              lockCity={false}
              attribution={{
                sourceUrl,
                utmSource: context.utmSource,
                utmMedium: context.utmMedium,
                utmCampaign: context.utmCampaign,
              }}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
