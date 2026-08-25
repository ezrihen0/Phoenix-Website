import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPinned, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { FromTheField } from "@/components/services/from-the-field";
import { ServiceLocalContext } from "@/components/services/service-local-context";
import {
  cities,
  getCityBySlug,
  getCityHref,
  getRequestServiceHref,
  type CitySlug,
} from "@/lib/cities";
import type { PublicSiteSettings } from "@/lib/cms/types";
import { resolveContextualLinkHref } from "@/lib/internal-links";
import {
  getServiceLandingHref,
  getServiceLandingPage,
  type ServiceLandingPage,
} from "@/lib/site-data";

type ServiceLandingPageViewProps = {
  servicePage: ServiceLandingPage;
  settings: PublicSiteSettings;
  city?: CitySlug;
};

function resolveDirectAnswer(servicePage: ServiceLandingPage, cityName?: string) {
  if (cityName) {
    return servicePage.directAnswer.city(cityName);
  }

  return servicePage.directAnswer.province;
}

function resolveRelatedServices(servicePage: ServiceLandingPage) {
  return servicePage.relatedServices
    .map((slug) => getServiceLandingPage(slug))
    .filter((page): page is ServiceLandingPage => page != null);
}

export async function ServiceLandingPageView({
  servicePage,
  settings,
  city,
}: ServiceLandingPageViewProps) {
  const cityConfig = city ? getCityBySlug(city) : undefined;
  const nearbyAreas = cityConfig?.serviceAreas.slice(0, 6) ?? [];
  const heroEyebrow = cityConfig
    ? `${cityConfig.name} ${servicePage.eyebrow.toLowerCase()}`
    : servicePage.eyebrow;
  const heroTitle = cityConfig
    ? servicePage.cityHeroTitle(cityConfig.name)
    : servicePage.heroTitle;
  const directAnswer = resolveDirectAnswer(servicePage, cityConfig?.name);
  const relatedServices = resolveRelatedServices(servicePage);
  const contextualLinks = servicePage.contextualLinks ?? [];
  const finalCtaTitle = cityConfig
    ? servicePage.finalCta.cityTitle(cityConfig.name)
    : servicePage.finalCta.provinceTitle;

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
                <div className="max-w-3xl space-y-4 text-base leading-8 text-[var(--color-paper)]/78 sm:text-lg">
                  {directAnswer.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={getRequestServiceHref({
                      city,
                      service: servicePage.slug,
                      cta: "service-landing",
                      from: city
                        ? getCityHref(city, `/services/${servicePage.slug}`)
                        : getServiceLandingHref(servicePage.slug),
                    })}
                    className="rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white"
                  >
                    {servicePage.ctaLabel}
                  </Link>
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
              eyebrow={servicePage.supportingSection.eyebrow}
              title={servicePage.supportingSection.title}
              description={servicePage.supportingSection.description}
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {servicePage.supportingPoints.map((point, index) => (
              <Reveal key={point.title} delay={index * 70}>
                <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                    {point.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    {point.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow={servicePage.scopeSection.eyebrow}
              title={servicePage.scopeSection.title}
              description={servicePage.scopeSection.description}
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

      {servicePage.semanticSections.map((section, index) => (
        <section key={section.heading} className={index % 2 === 0 ? "pb-20" : "section-pad bg-[rgba(255,255,255,0.45)]"}>
          <div className="page-frame grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <Reveal>
              <SectionHeading
                eyebrow={section.eyebrow ?? "Service details"}
                title={section.heading}
              />
            </Reveal>
            <div className="space-y-5">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="grid gap-3">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="inline-flex items-start gap-3 rounded-[1.4rem] bg-[var(--color-card)] p-4 text-sm leading-7 text-[var(--color-muted)]"
                    >
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-ember)]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </section>
      ))}

      <section className="pb-20">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Common questions"
              title={`Questions about ${servicePage.title.toLowerCase()}`}
              description="Direct answers to the decisions homeowners usually need to make before booking."
            />
          </Reveal>
          <div className="grid gap-4">
            {servicePage.faqs.map((faq, index) => (
              <Reveal key={faq.question} delay={index * 70}>
                <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                    {faq.question}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{faq.answer}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {city ? <ServiceLocalContext servicePage={servicePage} city={city} /> : null}

      {relatedServices.length > 0 || contextualLinks.length > 0 ? (
        <section className="section-pad bg-[rgba(255,255,255,0.45)]">
          <div className="page-frame">
            <Reveal>
              <SectionHeading
                eyebrow="Related services"
                title="Other services that often come up next"
                description="These pages cover different problems and should not be mixed into one appointment type."
              />
            </Reveal>
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {relatedServices.map((relatedPage, index) => (
                <Reveal key={relatedPage.slug} delay={index * 70}>
                  <Link
                    href={getServiceLandingHref(relatedPage.slug, city)}
                    className="flex h-full flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[0_18px_40px_rgba(31,26,22,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(31,26,22,0.1)]"
                  >
                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                      {relatedPage.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-muted)]">
                      {cityConfig
                        ? relatedPage.directAnswer.city(cityConfig.name)[0]
                        : relatedPage.directAnswer.province[0]}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]">
                      Open service page
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
              {contextualLinks.map((link, index) => (
                <Reveal key={link.path} delay={(relatedServices.length + index) * 70}>
                  <Link
                    href={resolveContextualLinkHref(link.path, city)}
                    className="flex h-full flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[0_18px_40px_rgba(31,26,22,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(31,26,22,0.1)]"
                  >
                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">{link.title}</h2>
                    <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-muted)]">{link.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]">
                      Open service page
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {cityConfig && servicePage.cityCoverage ? (
        <section className="pb-20">
          <div className="page-frame">
            <Reveal>
              <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                  <MapPinned className="h-4 w-4" />
                  {cityConfig.name} service area
                </div>
                <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                  {servicePage.cityCoverage.title(cityConfig.name)}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                  {servicePage.cityHighlights[cityConfig.slug]}
                </p>
                {nearbyAreas.length > 0 ? (
                  <>
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
                  </>
                ) : null}
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
        </section>
      ) : null}

      {!cityConfig ? (
        <section className="pb-20">
          <div className="page-frame grid gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <Reveal>
              <SectionHeading
                eyebrow={servicePage.provinceCoverage.eyebrow}
                title={servicePage.provinceCoverage.title}
                description={servicePage.provinceCoverage.description}
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
      ) : null}

      <FromTheField serviceSlug={servicePage.slug} city={city} />

      <section className="pb-20 pt-16">
        <div className="page-frame overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5 p-8 sm:p-10">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                {finalCtaTitle}
              </h2>
              <p className="text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                {servicePage.finalCta.description}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={getRequestServiceHref({
                    city,
                    service: servicePage.slug,
                    cta: "service-landing",
                    from: city
                      ? getCityHref(city, `/services/${servicePage.slug}`)
                      : getServiceLandingHref(servicePage.slug),
                  })}
                  className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
                >
                  {servicePage.ctaLabel}
                </Link>
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
