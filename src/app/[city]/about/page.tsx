import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPinned } from "lucide-react";
import { notFound } from "next/navigation";

import { CityPlaceholderPage } from "@/components/city-placeholder-page";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { cityHasFullContent, getCityBySlug, getCityHref, getCitySettings, getRequestServiceHref } from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import { buildBreadcrumbSchema, createPageMetadata } from "@/lib/seo";
import { getAboutPoints, services, siteConfig } from "@/lib/site-data";
import { resolvePublicServiceHref } from "@/lib/internal-links";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    return createPageMetadata({
      title: "About Page Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested city about page could not be found.",
      path: `/${cityParam}/about`,
    });
  }

  if (!cityHasFullContent(city.slug)) {
    return {
      ...createPageMetadata({
        title: `${city.name} Fireplace Team | Phoenix Dispatch`,
        description: `Call Phoenix dispatch for ${city.name.toLowerCase()} fireplace, chimney, and WETT service routing while the full city about page is being prepared.`,
        path: getCityHref(city.slug, "/about"),
      }),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return createPageMetadata({
    title: `About Phoenix Chimney & Fireplace Services | ${city.name} Team`,
    description:
      `Meet the ${city.name} team behind Phoenix chimney and fireplace service, including WETT inspections, gas fireplace repair, and masonry work.`,
    path: getCityHref(city.slug, "/about"),
    keywords: [`about fireplace repair ${city.name}`, `chimney company ${city.name}`],
  });
}

export default async function CityAboutPage({
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
    return <CityPlaceholderPage city={city} section="about" />;
  }

  const siteSettings = getCitySettings(await getPublicSiteSettings(), city.slug);
  const aboutPoints = getAboutPoints(city.name);

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Home", path: getCityHref(city.slug) },
          { name: "About", path: getCityHref(city.slug, "/about") },
        ])}
      />

      <section className="section-pad">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="space-y-5">
            <Reveal>
              <SectionHeading
                eyebrow="About Phoenix"
                title={`A ${city.name} service company built around safety, workmanship, and useful documentation.`}
                description="Phoenix combines fireplace repair, chimney service, WETT reporting, and masonry work so homeowners can deal with one accountable local team."
              />
            </Reveal>
            <p className="text-base leading-8 text-[var(--color-muted)]">
              Phoenix works across gas fireplaces, wood-burning systems, chimneys,
              and exterior masonry. That range matters because homeowners rarely show up with a perfectly defined issue.
              They show up with a symptom, a real-estate deadline, an insurer request, or a system that just does not feel safe anymore.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={getRequestServiceHref(city.slug)}
                className="rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white"
              >
                Request Service
              </Link>
              <Link
                href={getCityHref(city.slug, "/services")}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
              >
                See services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] shadow-[0_25px_70px_rgba(31,26,22,0.12)]">
              <div className="relative min-h-[26rem]">
                <Image
                  src="/images/photos/about-crew.jpg"
                  alt="Technician performing a fireplace service visit"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-frame grid gap-5 md:grid-cols-2">
          {aboutPoints.map((point, index) => (
            <Reveal key={point.title} delay={index * 80}>
              <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-7">
                <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                  <CheckCircle2 className="h-4 w-4" />
                  {point.title}
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{point.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)]">
            <div className="relative min-h-[24rem]">
              <Image
                src="/images/photos/team-fireplace.jpg"
                alt="Fireplace appliance detail during a home service visit"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-6">
            <Reveal>
              <SectionHeading
                eyebrow="What Phoenix covers"
                title="One local team across inspection, repair, sweeping, and masonry work."
                description="That wider scope matters because many service calls overlap: draft issues can be cleaning, masonry, or liner-related; a real-estate inspection can reveal repair needs that must be documented clearly."
              />
            </Reveal>
            <div className="grid gap-3">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={resolvePublicServiceHref(service.slug, city.slug)}
                  className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/72 px-5 py-4 text-sm leading-7 text-[var(--color-muted)] transition hover:border-[var(--color-forest)]/30"
                >
                  <span className="font-semibold text-[var(--color-ink)]">{service.title}</span>
                  {" · "}
                  {service.tagline}
                </Link>
              ))}
            </div>
            <Link
              href={getCityHref(city.slug, "/articles")}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]"
            >
              Read {city.name} homeowner articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
          <div className="rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-ink)] p-8 text-[var(--color-paper)]">
            <p className="eyebrow text-[var(--color-gold)]">Serving {city.name} & area</p>
            <p className="mt-5 text-base leading-8 text-[var(--color-paper)]/78">
              {siteSettings.serviceRadius}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {city.serviceAreas.map((area) => (
                <div key={area} className="rounded-[1.35rem] bg-white/8 px-4 py-3 text-sm">
                  {area}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)] p-8">
            <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
              <MapPinned className="h-4 w-4" />
              Our promise
            </p>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
              The homeowner should leave the appointment with clarity, not just an invoice.
            </h2>
            <p className="mt-5 text-sm leading-8 text-[var(--color-muted)] sm:text-base">
              Whether the solution is a quick service call, a larger masonry repair,
              or a WETT report with follow-up work, the goal is the same: make the
              condition of the system understandable and actionable. Informational articles on this site are published by{" "}
              {siteConfig.legalName} for review—not generated and posted automatically.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
