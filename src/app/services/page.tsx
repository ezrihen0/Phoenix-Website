import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { cities, getCityHref, getRequestServiceHref } from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import {
  buildBreadcrumbSchema,
  buildServiceSchema,
  createPageMetadata,
} from "@/lib/seo";
import {
  canonicalServices,
  getServiceHref,
  isServiceLandingSlug,
  SERVICE_FAMILY_LABELS,
  type ServiceFamily,
} from "@/lib/service-taxonomy";

export const metadata: Metadata = createPageMetadata({
  title: "Fireplace & Chimney Services in Alberta | Phoenix",
  description:
    "Alberta-wide overview of Phoenix gas fireplace, chimney, and WETT services. Choose Calgary, Edmonton, or Red Deer for local booking and service-area context.",
  path: "/services",
  keywords: [
    "fireplace services Alberta",
    "chimney services Alberta",
    "WETT inspection Alberta",
    "gas fireplace repair Alberta",
  ],
});

const FAMILY_ORDER: ServiceFamily[] = ["gas-fireplace", "chimney", "wett"];

const FAMILY_INTRO: Record<ServiceFamily, string> = {
  "gas-fireplace":
    "Maintenance, diagnosis and repair, then installation or replacement when the system is no longer the right fit. Not every capability has its own URL.",
  chimney:
    "Sweeping improves visibility. Inspection explains what was found. Repair, liners, crowns, flashing, and wood-stove work are capabilities of this family.",
  wett: "Customer-facing inspection reporting for insurance and real-estate files where they apply. A WETT visit is documentation, not an automatic sweep or repair.",
};

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
          ...canonicalServices.map((service) =>
            buildServiceSchema(service.title, service.description, getServiceHref(service.slug)),
          ),
        ]}
      />

      <section className="section-pad pb-10">
        <div className="page-frame grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Alberta service hub"
              title="Understand the system first. Diagnose properly. Then choose the local page that matches the work."
              description="This page is the province-wide overview. City pages carry local service information, climate context, and booking. Phoenix does not create a landing page for every town inside the 100 km radius."
            />
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)] p-8">
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Search intent for a city should land on that city. Use these Alberta resources when you
                need the service family explained, then pick Calgary, Edmonton, or Red Deer to request
                service.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={getRequestServiceHref({
                    cta: "service-landing",
                    from: "/services",
                  })}
                  className="rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Request Service
                </Link>
                <a
                  href={`tel:${siteSettings.phoneHref}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
                >
                  <Phone className="h-4 w-4" />
                  Call Phoenix
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-10">
        <div className="page-frame">
          <div className="grid gap-4 sm:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={getCityHref(city.slug, "/services")}
                className="rounded-[1.8rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 transition hover:-translate-y-0.5"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                  Local revenue page
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  {city.name} services
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{city.serviceRadius}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]">
                  Open {city.name}
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-frame space-y-12">
          {FAMILY_ORDER.map((family) => {
            const familyServices = canonicalServices.filter((service) => service.family === family);

            return (
              <Reveal key={family}>
                <div className="space-y-5">
                  <div className="max-w-3xl">
                    <p className="eyebrow">{SERVICE_FAMILY_LABELS[family]}</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
                      {SERVICE_FAMILY_LABELS[family]} services
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                      {FAMILY_INTRO[family]}
                    </p>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3">
                    {familyServices.map((service) => (
                      <article
                        key={service.slug}
                        className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6"
                      >
                        <h3 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                          {service.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                          {service.description}
                        </p>
                        {isServiceLandingSlug(service.slug) ? (
                          <Link
                            href={getServiceHref(service.slug)}
                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]"
                          >
                            Read the general resource
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        ) : (
                          <div className="mt-5 flex flex-wrap gap-3">
                            {cities.map((city) => (
                              <Link
                                key={city.slug}
                                href={getServiceHref(service.slug, city.slug)}
                                className="text-sm font-semibold text-[var(--color-forest)]"
                              >
                                {city.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
