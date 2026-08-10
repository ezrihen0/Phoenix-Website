import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import {
  buildBreadcrumbSchema,
  buildServiceSchema,
  createPageMetadata,
} from "@/lib/seo";
import { getServiceLandingHref, serviceLandingPages, services } from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({
  title: "Fireplace & Chimney Services Alberta | Calgary, Edmonton & Red Deer",
  description:
    "Explore Alberta gas fireplace maintenance, chimney sweeping, masonry repair, installation, and fireplace service coverage for Calgary, Edmonton, and Red Deer.",
  path: "/services",
  keywords: [
    "chimney services Alberta",
    "gas fireplace maintenance Calgary Edmonton Red Deer",
    "expert chimney sweep Alberta",
    "gas fireplace installation Alberta",
  ],
});

export default async function ServicesPage() {
  const siteSettings = await getPublicSiteSettings();

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          ...services.map((service) =>
            buildServiceSchema(service.title, service.description, "/services"),
          ),
        ]}
      />

      <section className="section-pad pb-10">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Alberta service scope"
              title="Repair, inspection, sweeping, and installation coverage for Calgary, Edmonton, and Red Deer without hopping between contractors."
              description="Use this page as the Alberta service index, then drill into the dedicated maintenance, chimney, masonry, and installation pages that match what the homeowner actually needs booked."
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

      <section className="pb-16">
        <div className="page-frame">
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-4">
              {serviceLandingPages.map((servicePage, index) => (
                <Reveal key={servicePage.slug} delay={index * 70}>
                  <Link
                    href={getServiceLandingHref(servicePage.slug)}
                    className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[0_18px_40px_rgba(31,26,22,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(31,26,22,0.1)]"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                      Dedicated page
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                      {servicePage.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                      {servicePage.cardDescription}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]">
                      Open service page
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
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
    </>
  );
}