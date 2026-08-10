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

function getCityServiceHeroCopy(servicePage: ServiceLandingPage, cityName: string, citySlug: CitySlug) {
  const cityHighlight = servicePage.cityHighlights[citySlug];

  switch (servicePage.slug) {
    case "gas-fireplace-maintenance":
      return {
        heroTitle: `Gas fireplace maintenance in ${cityName}`,
        heroDescription: `Annual safety checks, cleaning, and pilot service for gas fireplaces in ${cityName}. ${cityHighlight}`,
      };
    case "chimney-sweeping-inspection":
      return {
        heroTitle: `Chimney sweeping and inspection in ${cityName}`,
        heroDescription: `Creosote removal and chimney inspection visits for ${cityName} homes that need cleaner systems and clearer safety notes. ${cityHighlight}`,
      };
    case "chimney-repair-masonry":
      return {
        heroTitle: `Chimney repair and masonry in ${cityName}`,
        heroDescription: `Mortar, crown, flashing, and masonry repair for ${cityName} chimneys showing wear, leaks, or freeze-thaw damage. ${cityHighlight}`,
      };
    case "gas-fireplace-installation":
      return {
        heroTitle: `Gas fireplace installation in ${cityName}`,
        heroDescription: `New gas fireplace installs, retrofits, and replacements planned for ${cityName} homes and renovation projects. ${cityHighlight}`,
      };
    default:
      return {
        heroTitle: `${servicePage.title} in ${cityName}`,
        heroDescription: cityHighlight,
      };
  }
}

export function ServiceLandingPageView({
  servicePage,
  settings,
  city,
}: ServiceLandingPageViewProps) {
  const cityConfig = city ? getCityBySlug(city) : undefined;
  const nearbyAreas = cityConfig?.serviceAreas.slice(0, 6) || [];
  const heroEyebrow = cityConfig
    ? `${cityConfig.name} ${servicePage.eyebrow.toLowerCase()}`
    : servicePage.eyebrow;
  const cityHeroCopy = cityConfig
    ? getCityServiceHeroCopy(servicePage, cityConfig.name, cityConfig.slug)
    : undefined;
  const heroTitle = cityHeroCopy?.heroTitle ?? servicePage.heroTitle;
  const heroDescription = cityHeroCopy?.heroDescription ?? servicePage.heroDescription;
  const includedTitle = cityConfig
    ? `What a ${servicePage.title.toLowerCase()} visit in ${cityConfig.name} includes.`
    : `${servicePage.title} appointments are scoped around safety, findings, and the next step a homeowner actually needs.`;
  const includedDescription = cityConfig
    ? `Each ${cityConfig.name} visit is built to explain what was checked, what was found, and whether the next step is maintenance, repair, inspection, or follow-up work.`
    : "Every appointment is built to help the homeowner understand what was checked, what was found, and whether the next move is maintenance, repair, inspection, or scheduling the next phase of work.";
  const ctaTitle = cityConfig
    ? `Need ${servicePage.title.toLowerCase()} in ${cityConfig.name}?`
    : `Need ${servicePage.title.toLowerCase()} in Calgary, Edmonton, or Red Deer?`;
  const ctaDescription = cityConfig
    ? `Book online if you are ready to schedule. If you are unsure whether this service matches the problem, call first and we will point you to the right ${cityConfig.name} visit.`
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
                title={`${servicePage.title} for ${cityConfig.name} homes and nearby communities.`}
                description={servicePage.cityHighlights[cityConfig.slug]}
              />
            </Reveal>
            <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <Reveal delay={70}>
                <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                    <MapPinned className="h-4 w-4" />
                    {cityConfig.name} coverage
                  </div>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    {servicePage.cityHighlights[cityConfig.slug]}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    Nearby service areas include {nearbyAreas.join(", ")}.
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
                    Local conditions that affect {servicePage.title.toLowerCase()} in {cityConfig.name}.
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    {cityConfig.weatherContext}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                    If you need broader context first, use the full {cityConfig.name} services overview before you book.
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