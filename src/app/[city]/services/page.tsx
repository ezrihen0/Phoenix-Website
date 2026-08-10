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
import { getHomeFaqs, services } from "@/lib/site-data";

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
    title: `Fireplace & Chimney Services in ${city.name} | Phoenix Chimney`,
    description:
      `Browse fireplace and chimney services in ${city.name}, including gas repair, WETT inspections, sweeping, maintenance, masonry, and installation.`,
    path: getCityHref(city.slug, "/services"),
    keywords: [
      `fireplace services ${city.name}`,
      `chimney services ${city.name}`,
      `WETT inspection ${city.name}`,
      `chimney sweep ${city.name}`,
      `gas fireplace service ${city.name}`,
      `chimney masonry ${city.name}`,
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
  const servicesFaqs = getHomeFaqs(city.name, city.serviceAreas);

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
            <div className="flex max-w-3xl flex-col gap-4">
              <p className="eyebrow">{city.name} fireplace & chimney services</p>
              <h1 className="display-title text-balance text-4xl font-semibold leading-none sm:text-5xl">
                Choose the right fireplace or chimney service in {city.name}.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--color-muted)] sm:text-lg">
                Compare repair, inspection, sweeping, maintenance, masonry, and installation options,
                then open the page that matches the problem you are trying to solve.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)] p-8">
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Not sure where to start? Match the symptom to the service: ignition problems go to gas
                fireplace repair, insurance or sale files go to WETT, routine cleaning goes to sweeping,
                and structural wear goes to masonry.
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
        eyebrow={`${city.name} service guides`}
        title={`Detailed pages for maintenance, sweeping, masonry, and installation in ${city.name}.`}
        description={`Open these guides when you need more detail on a specific service before booking in ${city.name}.`}
        city={city.slug}
      />

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Fireplace & chimney FAQs"
              title={`Common questions before booking fireplace or chimney service in ${city.name}.`}
              description="These answers help homeowners choose between calling, booking online, or opening a more specific service page."
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
