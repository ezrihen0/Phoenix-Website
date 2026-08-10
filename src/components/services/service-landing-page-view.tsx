import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPinned, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  cities,
  getCityBySlug,
  getCityHref,
  type CitySlug,
} from "@/lib/cities";
import type { PublicSiteSettings } from "@/lib/cms/types";
import {
  getServiceLandingHref,
  type ServiceLandingPage,
} from "@/lib/site-data";

type ServiceLandingPageViewProps = {
  servicePage: ServiceLandingPage;
  settings: PublicSiteSettings;
  city?: CitySlug;
};

export function ServiceLandingPageView({
  servicePage,
  settings,
  city,
}: ServiceLandingPageViewProps) {
  const cityConfig = city ? getCityBySlug(city) : undefined;
  const nearbyAreas = cityConfig?.serviceAreas.slice(0, 6) || [];
  const nearbyAreasPreview = cityConfig?.serviceAreas.slice(0, 4).join(", ");
  const heroEyebrow = cityConfig
    ? `${cityConfig.name} ${servicePage.eyebrow.toLowerCase()}`
    : servicePage.eyebrow;
  const heroTitle = cityConfig
    ? `${servicePage.title} in ${cityConfig.name} with local dispatch that keeps the service path clear from the first click.`
    : servicePage.heroTitle;
  const heroDescription = cityConfig
    ? `${servicePage.heroDescription} Our ${servicePage.title.toLowerCase()} experts are ready to help you in ${cityConfig.name}${nearbyAreasPreview ? ` and nearby communities such as ${nearbyAreasPreview}` : ""}.`
    : servicePage.heroDescription;
  const includedTitle = cityConfig
    ? `${servicePage.title} visits in ${cityConfig.name} are scoped around safety, findings, and the next step a homeowner actually needs.`
    : `${servicePage.title} appointments are scoped around safety, findings, and the next step a homeowner actually needs.`;
  const includedDescription = cityConfig
    ? `Every ${cityConfig.name} appointment is built to help the homeowner understand what was checked, what was found, and whether the next move is maintenance, repair, inspection, or scheduling the next phase of work.`
    : "Every appointment is built to help the homeowner understand what was checked, what was found, and whether the next move is maintenance, repair, inspection, or scheduling the next phase of work.";
  const ctaTitle = cityConfig
    ? `Need ${servicePage.title.toLowerCase()} in ${cityConfig.name}?`
    : `Need ${servicePage.title.toLowerCase()} in Calgary, Edmonton, or Red Deer?`;
  const ctaDescription = cityConfig
    ? `Use the Workiz booking form to send the request now. If the job is urgent or you need help deciding whether this page matches the problem, call first and we will route the ${cityConfig.name} visit correctly.`
    : "Use the Workiz booking form to send the request now. If the job is urgent or you need help deciding whether this page matches the problem, call first and we will route the visit correctly.";

  return (
    <>
      <section className="section-pad">
        <Reveal>
          <div className="page-frame overflow-hidden rounded-[2.8rem] border border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_25px_80px_rgba(31,26,22,0.22)]">
            <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="space-y-6 p-8 sm:p-10 lg:p-12">
                <p className="eyebrow text-[var(--color-gold)]">{heroEyebrow}</p>
                <h1 className="display-title max-w-4xl text-balance text-5xl font-semibold leading-[0.92] sm:text-6xl">
                  {heroTitle}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-[var(--color-paper)]/78 sm:text-lg">
                  {heroDescription}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {servicePage.supportingPoints.map((point) => (
                    <div key={point.title} className="rounded-[1.7rem] bg-white/8 p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                        {point.title}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-paper)]/75">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={settings.workizUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white"
                  >
                    {servicePage.ctaLabel}
                  </a>
                  <a
                    href={`tel:${settings.phoneHref}`}
                    className="inline-flex items-center gap-2 rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white"
                  >
                    <Phone className="h-4 w-4" />
                    Call now
                  </a>
                </div>
              </div>
              <div className="relative min-h-[24rem] lg:min-h-full">
                <Image
                  src={servicePage.image}
                  alt={servicePage.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="pb-20">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="What's Included"
              title={includedTitle}
              description={includedDescription}
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {servicePage.included.map((item, index) => (
              <Reveal key={item} delay={index * 70}>
                <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-ember)]" />
                  <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {cityConfig ? (
        <section className="section-pad bg-[rgba(255,255,255,0.45)]">
          <div className="page-frame grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <Reveal>
              <SectionHeading
                eyebrow={`${cityConfig.name} service area`}
                title={`${servicePage.title} support for ${cityConfig.name} homes and nearby communities.`}
                description={`${servicePage.cityHighlights[cityConfig.slug]} Our ${servicePage.title.toLowerCase()} experts are ready to help you in ${cityConfig.name}.`}
              />
            </Reveal>
            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <Reveal delay={70}>
                <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                    <MapPinned className="h-4 w-4" />
                    {cityConfig.name} dispatch
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    {servicePage.cityHighlights[cityConfig.slug]}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    Nearby service areas include {nearbyAreas.join(", ")}. Phoenix routes this service through the {cityConfig.name} path so the homeowner stays on the right local dispatch number and booking flow.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {nearbyAreas.map((area) => (
                      <span
                        key={`${cityConfig.slug}-${area}`}
                        className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
              <Reveal delay={140}>
                <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <p className="eyebrow">Local service context</p>
                  <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                    Why {cityConfig.name} service calls need the right path from the start.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    {cityConfig.weatherContext}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    Our {servicePage.title.toLowerCase()} experts are ready to help you in {cityConfig.name}. If you need broader context first, use the full city service overview before you book.
                  </p>
                  <Link
                    href={getCityHref(cityConfig.slug, "/services")}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]"
                  >
                    See all {cityConfig.name} services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              </Reveal>
            </div>
          </div>
        </section>
      ) : (
        <section className="section-pad bg-[rgba(255,255,255,0.45)]">
          <div className="page-frame grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <Reveal>
              <SectionHeading
                eyebrow="Calgary, Edmonton, and Red Deer"
                title="One Alberta service path, with city-specific dispatch context built in."
                description="These service pages are written for Alberta homeowners, but booking still routes through the right city path so Calgary, Edmonton, and Red Deer callers land with the correct local dispatch number and service context."
              />
            </Reveal>
            <div className="grid gap-4 lg:grid-cols-3">
              {cities.map((cityOption, index) => (
                <Reveal key={cityOption.slug} delay={index * 70}>
                  <article className="flex h-full flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                      <MapPinned className="h-4 w-4" />
                      {cityOption.name}
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-7 text-[var(--color-muted)]">
                      {servicePage.cityHighlights[cityOption.slug]}
                    </p>
                    <Link
                      href={getServiceLandingHref(servicePage.slug, cityOption.slug)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]"
                    >
                      See {cityOption.name} service page
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pb-20 pt-16">
        <div className="page-frame overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5 p-8 sm:p-10">
              <p className="eyebrow">Book now</p>
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                {ctaTitle}
              </h2>
              <p className="text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                {ctaDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={settings.workizUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
                >
                  {servicePage.ctaLabel}
                </a>
                <a
                  href={`tel:${settings.phoneHref}`}
                  className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
                >
                  Call {settings.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="relative min-h-[20rem] lg:min-h-full">
              <Image
                src={servicePage.secondaryImage}
                alt={servicePage.secondaryImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}