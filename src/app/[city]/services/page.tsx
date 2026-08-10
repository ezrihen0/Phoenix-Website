import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { notFound } from "next/navigation";

import { CityPlaceholderPage } from "@/components/city-placeholder-page";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ServiceGuidesGrid } from "@/components/service-guides-grid";
import { StructuredData } from "@/components/structured-data";
import { cityHasFullContent, getCityBySlug, getCityHref, getCitySettings } from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import { buildBreadcrumbSchema, buildFaqSchema, buildLocalBusinessSchema, buildServiceSchema, createPageMetadata } from "@/lib/seo";
import { getServicesFaqs, services } from "@/lib/site-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    return createPageMetadata({
      title: "Services Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested city services page could not be found.",
      path: `/${cityParam}/services`,
    });
  }

  if (!cityHasFullContent(city.slug)) {
    return {
      ...createPageMetadata({
        title: `${city.name} Fireplace Services | Phoenix Dispatch`,
        description: `Call Phoenix dispatch for ${city.name.toLowerCase()} fireplace, chimney, and WETT service routing while the full city services page is being prepared.`,
        path: getCityHref(city.slug, "/services"),
      }),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return createPageMetadata({
    title: `Gas Fireplace Repair ${city.name} | Chimney Service, WETT & Masonry`,
    description:
      `Book gas fireplace repair in ${city.name} plus chimney service, WETT inspections, relining, and masonry repair from one local team.`,
    path: getCityHref(city.slug, "/services"),
    keywords: [
      `gas fireplace repair ${city.name}`,
      `fireplace repair ${city.name}`,
      `chimney services ${city.name}`,
      `wood stove repair ${city.name}`,
      `chimney masonry ${city.name}`,
      `WETT inspection ${city.name}`,
    ],
  });
}

export default async function CityServicesPage({
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
    return <CityPlaceholderPage city={city} section="services" />;
  }

  const siteSettings = getCitySettings(await getPublicSiteSettings(), city.slug);
  const servicesFaqs = getServicesFaqs(city.name);

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: getCityHref(city.slug) },
            { name: "Services", path: getCityHref(city.slug, "/services") },
          ]),
          buildLocalBusinessSchema(city.slug),
          buildFaqSchema(servicesFaqs),
          ...services.map((service) =>
            buildServiceSchema(
              service.title,
              service.description,
              getCityHref(city.slug, "/services"),
              city.slug,
            ),
          ),
        ]}
      />

      <section className="section-pad pb-10">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow={`${city.name} gas fireplace repair & chimney service`}
              title={`Gas fireplace repair in ${city.name}, plus WETT inspections, chimney sweeping, and masonry work.`}
              description="Homeowners book Phoenix when they need an exact diagnosis, clear repair direction, and one local team that can handle fireplace, chimney, and inspection work together."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)] p-8">
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Every visit starts with the problem you are actually seeing: ignition failure, poor draft,
                smoke, visible masonry damage, insurance documentation, or a system that has simply gone too
                long without cleaning.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={siteSettings.workizUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Book online
                </a>
                <a
                  href={`tel:${siteSettings.phoneHref}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
                >
                  <Phone className="h-4 w-4" />
                  Call for help
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-frame space-y-8">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 80}>
              <article
                id={service.slug}
                className="overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_20px_60px_rgba(31,26,22,0.07)]"
              >
                <div className={`grid gap-0 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <div className="relative min-h-[20rem]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-7 sm:p-9">
                    <p className="eyebrow">{service.tagline}</p>
                    <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                      {service.title}
                    </h2>
                    <p className="mt-5 max-w-xl text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                      {service.description}
                    </p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {service.bullets.map((bullet) => (
                        <div key={bullet} className="inline-flex items-start gap-3 rounded-[1.4rem] bg-white/70 p-4 text-sm leading-6 text-[var(--color-muted)]">
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--color-ember)]" />
                          {bullet}
                        </div>
                      ))}
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <a
                        href={siteSettings.workizUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
                      >
                        Schedule this service
                      </a>
                      <a
                        href={`tel:${siteSettings.phoneHref}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
                      >
                        Call for a quick diagnosis
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <ServiceGuidesGrid
        eyebrow="Alberta service guides"
        title={`Dedicated service pages that reinforce ${city.name} repair, sweep, masonry, and installation intent.`}
        description={`Use these deeper Alberta service guides when a homeowner needs more detail than the ${city.name} services overview alone. They strengthen internal linking while keeping Calgary, Edmonton, and Red Deer all represented.`}
        city={city.slug}
      />

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Gas fireplace repair FAQs"
              title={`Questions homeowners ask before booking gas fireplace repair in ${city.name}.`}
              description="These are the practical questions people usually want answered before they call for fireplace troubleshooting, repair, or a combined inspection visit."
            />
          </Reveal>
          <div className="grid gap-4">
            {servicesFaqs.map((faq, index) => (
              <Reveal key={faq.question} delay={index * 70}>
                <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{faq.question}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{faq.answer}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
