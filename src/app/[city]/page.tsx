import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, MapPinned, Phone, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { CityPlaceholderPage } from "@/components/city-placeholder-page";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ServiceGuidesGrid } from "@/components/service-guides-grid";
import { ServiceCard } from "@/components/service-card";
import { StructuredData } from "@/components/structured-data";
import { cityHasFullContent, getCityBySlug, getCityHref, getCitySettings } from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  createPageMetadata,
} from "@/lib/seo";
import {
  galleryImages,
  getHomeFaqs,
  getTrustMetrics,
  getValuePillars,
  heroHighlights,
  processSteps,
  services,
  wettBenefits,
} from "@/lib/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    return createPageMetadata({
      title: "City Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested city page could not be found.",
      path: `/${cityParam}`,
    });
  }

  if (!cityHasFullContent(city.slug)) {
    return {
      ...createPageMetadata({
        title: `${city.name} Fireplace Service | Phoenix Dispatch`,
        description: `Call Phoenix dispatch for ${city.name.toLowerCase()} fireplace, chimney, and WETT service routing while the full city site is being prepared.`,
        path: getCityHref(city.slug),
        keywords: [`${city.name} fireplace service`, `${city.name} chimney service`],
      }),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return createPageMetadata({
    title: `Fireplace Repair ${city.name} | Chimney, WETT & Gas Fireplace Service`,
    description:
      `Book ${city.name} fireplace and chimney specialists for gas fireplace repair, WETT inspections, chimney sweeping, relining, and masonry work.`,
    path: getCityHref(city.slug),
    keywords: [
      `fireplace repair ${city.name}`,
      `chimney repair ${city.name}`,
      `WETT inspection ${city.name}`,
      `gas fireplace repair ${city.name}`,
      `chimney sweep ${city.name}`,
    ],
  });
}

export default async function CityHomePage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    notFound();
  }

  if (!cityHasFullContent(city.slug)) {
    return <CityPlaceholderPage city={city} section="home" />;
  }

  const siteSettings = getCitySettings(await getPublicSiteSettings(), city.slug);
  const trustMetrics = getTrustMetrics(city.name);
  const valuePillars = getValuePillars(city.name);
  const homeFaqs = getHomeFaqs(city.name, city.serviceAreas);

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([{ name: "Home", path: getCityHref(city.slug) }]),
          buildLocalBusinessSchema(city.slug),
          buildFaqSchema(homeFaqs),
          ...services.slice(0, 3).map((service) =>
            buildServiceSchema(
              service.title,
              service.description,
              getCityHref(city.slug, "/services"),
              city.slug,
            ),
          ),
        ]}
      />

      <section className="pb-12 pt-2 sm:pb-14 sm:pt-4 lg:pb-16">
        <div className="page-bleed space-y-6">
          <Reveal>
            <div className="relative min-h-[38rem] overflow-hidden rounded-[2.8rem] border border-black/10 bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_30px_80px_rgba(31,26,22,0.2)] sm:min-h-[42rem]">
              <div className="hero-orb hero-orb-primary" />
              <div className="hero-orb hero-orb-secondary" />
              <Image
                src="/images/photos/hero-fireplace.jpg"
                alt="Modern fireplace in a bright Alberta home"
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,13,0.34),rgba(20,16,13,0.66),rgba(20,16,13,0.9))]" />
              <div className="relative flex min-h-[38rem] flex-col justify-between px-6 py-10 sm:min-h-[42rem] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
                <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center text-center">
                  <div className="space-y-6">
                    <p className="eyebrow text-[var(--color-paper)] [text-shadow:0_2px_10px_rgba(0,0,0,0.4)]">
                      Fireplace & chimney repair in {city.name}
                    </p>
                    <h1 className="display-title text-balance text-5xl font-semibold leading-[0.92] sm:text-6xl lg:text-7xl">
                      Gas fireplace repair, WETT inspections, chimney care, and masonry work handled by one local team.
                    </h1>
                    <p className="mx-auto max-w-3xl text-base leading-8 text-[var(--color-paper)]/80 sm:text-lg">
                      Phoenix handles gas fireplace repair, WETT inspections, chimney
                      sweeping, relining, and masonry service for {city.name} homes that
                      need the issue diagnosed properly the first time.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 pb-6 pt-2 sm:pb-8">
                      <a
                        href={siteSettings.workizUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ember)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-ember-dark)]"
                      >
                        <CalendarDays className="h-4 w-4" />
                        Book online
                      </a>
                      <a
                        href={`tel:${siteSettings.phoneHref}`}
                        className="inline-flex items-center gap-2 rounded-full border border-white/18 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/8"
                      >
                        <Phone className="h-4 w-4" />
                        Call {siteSettings.phoneDisplay}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {heroHighlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur-sm"
                    >
                      <CheckCircle2 className="mb-4 h-5 w-5 text-[var(--color-gold)]" />
                      <p className="text-sm leading-7 text-[var(--color-paper)]/82">{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-[0.68fr_1.32fr]">
            <Reveal>
              <div className="glass-panel rounded-[2.5rem] p-8">
                <p className="eyebrow">Fast facts</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {trustMetrics.map((metric) => (
                    <div key={metric.label} className="rounded-[1.6rem] bg-white/75 p-5">
                      <p className="display-title text-4xl font-semibold text-[var(--color-ink)]">
                        {metric.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-paper)] lg:grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[18rem] lg:min-h-full">
                  <Image
                    src="/images/photos/wett-report.jpg"
                    alt="WETT inspection reporting and planning detail"
                    fill
                    sizes="(max-width: 1024px) 100vw, 28vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-4 p-7 sm:p-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-paper)]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                    WETT-ready reporting
                  </div>
                  <p className="display-title text-3xl font-semibold leading-none text-[var(--color-paper)] sm:text-[2.15rem]">
                    Inspection, documentation, and repair planning in one service flow.
                  </p>
                  <p className="text-sm leading-7 text-[var(--color-paper)]/76">
                    Insurance reviews, home sales, camera-based inspection, and field
                    notes are handled with the same practical standard as the repair work.
                  </p>
                  <Link
                    href={getCityHref(city.slug, "/wett")}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-gold)]"
                  >
                    Explore WETT inspections
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="page-frame">
          <Reveal>
            <SectionHeading
              eyebrow="What Phoenix handles"
              title={`The core services ${city.name} homeowners actually book.`}
              description="Compare the most common repair, inspection, sweeping, and masonry visits before you choose the appointment that fits your home."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} {...service} city={city.slug} />
            ))}
          </div>
        </div>
      </section>

      <ServiceGuidesGrid
        eyebrow="Alberta service guides"
        title={`Deeper service pages that support ${city.name} homeowners, buyers, and booking decisions.`}
        description={`These Alberta-wide service guides strengthen the local ${city.name} pages with dedicated maintenance, sweeping, masonry, and installation content while still routing callers back into Calgary, Edmonton, and Red Deer dispatch.`}
        city={city.slug}
      />

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <Reveal>
              <SectionHeading
                eyebrow="Why people call again"
                title="Local service that is set up to diagnose first, not improvise."
                description="Homeowners call when they want a practical diagnosis, straightforward documentation, and repair advice that matches the actual condition of the system."
              />
            </Reveal>
            <div className="grid gap-4">
              {valuePillars.map((pillar, index) => (
                <Reveal key={pillar.title} delay={index * 90}>
                  <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                    <h3 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{pillar.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_20px_60px_rgba(31,26,22,0.18)]">
              <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-[22rem]">
                  <Image
                    src="/images/photos/wett-inspection.jpg"
                    alt="Technician performing WETT-related fireplace inspection"
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-6 p-8">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/brand/wett-badge.png"
                      alt="WETT certification mark"
                      width={72}
                      height={72}
                      className="h-14 w-14 object-contain"
                    />
                    <div>
                      <p className="eyebrow text-[var(--color-gold)]">WETT spotlight</p>
                      <p className="text-sm leading-6 text-[var(--color-paper)]/70">
                        Reporting built for insurers, closings, and homeowner clarity.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {wettBenefits.slice(0, 3).map((benefit) => (
                      <div key={benefit.title} className="rounded-[1.5rem] bg-white/8 p-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                          {benefit.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[var(--color-paper)]/78">
                          {benefit.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link
                    href={getCityHref(city.slug, "/wett")}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    See the dedicated WETT page
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="page-frame grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="How booking works"
              title="A simple process built around getting the right technician and the right report."
              description="Whether the issue is a dirty gas unit, a suspected chimney defect, or a time-sensitive WETT request, the goal is to match the appointment to the actual problem quickly."
            />
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <Reveal key={step.title} delay={index * 90}>
                <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <div className="absolute right-5 top-4 display-title text-6xl text-[var(--color-ember)]/12">
                    0{index + 1}
                  </div>
                  <p className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{step.title}</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame">
          <Reveal>
            <SectionHeading
              eyebrow="Recent field notes"
              title="Recent service snapshots from the field."
              description={`A closer look at the kinds of fireplace, chimney, and inspection work handled across ${city.name} homes.`}
            />
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.slice(0, 2).map((image, index) => (
                <Reveal key={image.src} delay={index * 90}>
                  <div className="relative min-h-[16rem] overflow-hidden rounded-[2rem] border border-[var(--color-border)]">
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.slice(2).map((image, index) => (
                <Reveal key={image.src} delay={index * 90}>
                  <div className="relative min-h-[16rem] overflow-hidden rounded-[2rem] border border-[var(--color-border)]">
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <Reveal>
              <SectionHeading
                eyebrow="Coverage and quick answers"
                title="Common questions before you book."
                description="These answers are written for homeowners choosing between calling, booking, or requesting an inspection report."
              />
            </Reveal>
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                <MapPinned className="h-4 w-4" />
                Service area
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{siteSettings.serviceRadius}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Core areas include {city.serviceAreas.join(", ")}.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {homeFaqs.map((faq, index) => (
              <Reveal key={faq.question} delay={index * 70}>
                <article className="rounded-[2rem] border border-[var(--color-border)] bg-white/75 p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{faq.answer}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="space-y-5">
            <p className="eyebrow text-[var(--color-gold)]">Request service</p>
            <h2 className="display-title text-balance text-5xl font-semibold leading-[0.95] sm:text-6xl">
              Book online, or send the issue through the form and let us route the right service.
            </h2>
            <p className="max-w-xl text-base leading-8 text-[var(--color-paper)]/76">
              Whether you are dealing with a cold unit, a chimney concern, or an insurance-driven inspection,
              the request form gives us enough detail to send back the right next step quickly.
            </p>
          </div>
          <Reveal delay={120}>
            <ContactForm settings={siteSettings} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
