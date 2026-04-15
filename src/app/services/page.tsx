import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { getSiteSettings } from "@/lib/cms/storage";
import {
  buildBreadcrumbSchema,
  buildServiceSchema,
  createPageMetadata,
} from "@/lib/seo";
import { services } from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({
  title: "Fireplace & Chimney Services Calgary | Gas, Wood, WETT & Masonry",
  description:
    "Explore Calgary gas fireplace repair, wood stove service, chimney sweeping, WETT inspections, relining, and masonry repair from one local team.",
  path: "/services",
  keywords: [
    "chimney services Calgary",
    "gas fireplace maintenance Calgary",
    "wood stove repair Calgary",
    "chimney masonry Calgary",
  ],
});

export default async function ServicesPage() {
  const siteSettings = await getSiteSettings();

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
              eyebrow="Calgary service scope"
              title="Repair, inspection, sweeping, and masonry without hopping between contractors."
              description="Fireplace repair, WETT inspections, chimney sweeping, and masonry service handled by one local team with clear next steps for each visit."
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
    </>
  );
}