import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame, Phone, Wrench } from "lucide-react";
import { notFound } from "next/navigation";

import { ContextualLinksGrid } from "@/components/internal-links/contextual-links-grid";
import { CityPlaceholderPage } from "@/components/city-placeholder-page";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { FromTheField } from "@/components/services/from-the-field";
import { cityHasFullContent, getCityBySlug, getCityHref, getCitySettings, getRequestServiceHref } from "@/lib/cities";
import { getPublicSiteSettings } from "@/lib/cms/storage";
import { getGasRepairContextualLinks } from "@/lib/internal-links";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  createPageMetadata,
} from "@/lib/seo";
import { getServicesFaqs, services } from "@/lib/site-data";

const gasRepairHighlights = [
  "Pilot lights that will not stay lit",
  "Ignition systems that click without firing",
  "Weak flame, soot, or dirty burner performance",
  "Fireplaces that shut off unexpectedly or smell abnormal",
] as const;

const gasRepairVisitPoints = [
  {
    title: "Troubleshooting first",
    description:
      "Phoenix starts with the actual symptom you are seeing, so the visit stays focused on diagnosis instead of generic part swapping.",
  },
  {
    title: "Safety-focused testing",
    description:
      "Each visit checks core operating and combustion concerns so the repair path is grounded in safe performance, not just whether the fireplace turns on once.",
  },
  {
    title: "Clear repair direction",
    description:
      "If a component has failed or maintenance has been skipped too long, Phoenix explains the next step in plain language so the homeowner can make the decision quickly.",
  },
  {
    title: "$99 diagnostic visit",
    description:
      "Complex repairs are not priced by guessing over the phone. When the issue is unknown, Phoenix inspects first, then presents options instead of assuming replacement.",
  },
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: cityParam } = await params;
  const city = getCityBySlug(cityParam);

  if (!city) {
    return createPageMetadata({
      title: "Gas Fireplace Repair Page Not Found | Phoenix Chimney & Fireplace Services",
      description: "The requested city gas fireplace repair page could not be found.",
      path: `/${cityParam}/gas-fireplace-repair`,
    });
  }

  if (!cityHasFullContent(city.slug)) {
    return {
      ...createPageMetadata({
        title: `${city.name} Gas Fireplace Repair | Phoenix Dispatch`,
        description: `Call Phoenix dispatch for ${city.name.toLowerCase()} gas fireplace repair scheduling while the full local landing page is being prepared.`,
        path: getCityHref(city.slug, "/gas-fireplace-repair"),
      }),
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return createPageMetadata({
    title: `Gas Fireplace Repair in ${city.name} | Phoenix Chimney`,
    description:
      `Book gas fireplace repair in ${city.name} for ignition failure, weak flames, clicking pilots, shutdown issues, and fireplace diagnostics.`,
    path: getCityHref(city.slug, "/gas-fireplace-repair"),
    keywords: [
      `gas fireplace repair ${city.name}`,
      `gas fireplace not working ${city.name}`,
      `fireplace diagnostics ${city.name}`,
      `gas fireplace service ${city.name}`,
    ],
  });
}

export default async function CityGasFireplaceRepairPage({
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
  const service = services.find((item) => item.slug === "gas-fireplace-repair");
  const servicesFaqs = getServicesFaqs(city.name);

  if (!service) {
    notFound();
  }

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: getCityHref(city.slug) },
            { name: "Gas Fireplace Repair", path: getCityHref(city.slug, "/gas-fireplace-repair") },
          ]),
          buildLocalBusinessSchema(city.slug),
          buildFaqSchema(servicesFaqs),
          buildServiceSchema(
            "Gas Fireplace Repair",
            `Gas fireplace repair and diagnostics for ${city.name} homeowners dealing with ignition, flame, or shutdown problems.`,
            getCityHref(city.slug, "/gas-fireplace-repair"),
            city.slug,
          ),
        ]}
      />

      <section className="section-pad pt-2 sm:pt-4">
        <div className="page-frame overflow-hidden rounded-[2.8rem] border border-black/10 bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_25px_80px_rgba(31,26,22,0.22)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6 p-8 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                <Flame className="h-4 w-4" />
                {city.name} gas fireplace repair
              </div>
              <h1 className="display-title text-balance text-5xl font-semibold leading-[0.92] sm:text-6xl">
                Gas fireplace repair in {city.name}.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--color-paper)]/78 sm:text-lg">
                Book gas fireplace repair in {city.name} when the unit will not ignite, the flame is weak,
                the pilot keeps dropping out, or the fireplace shuts off unexpectedly. When the problem is
                unknown, a $99 diagnostic/inspection visit comes first: assessment, findings, options, then
                an accurate quote. {city.weatherContext}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {gasRepairHighlights.map((highlight) => (
                  <div key={highlight} className="rounded-[1.7rem] bg-white/8 p-5">
                    <CheckCircle2 className="h-5 w-5 text-[var(--color-gold)]" />
                    <p className="mt-4 text-sm leading-7 text-[var(--color-paper)]/78">{highlight}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={getRequestServiceHref({
                    city: city.slug,
                    service: "gas-fireplace-repair",
                    cta: "gas-fireplace-repair",
                    from: getCityHref(city.slug, "/gas-fireplace-repair"),
                  })}
                  className="rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Request gas fireplace repair
                </Link>
                <a
                  href={`tel:${siteSettings.phoneHref}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white"
                >
                  <Phone className="h-4 w-4" />
                  Call {siteSettings.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="relative min-h-[24rem] lg:min-h-full">
              <Image
                src={service.image}
                alt="Technician servicing a gas fireplace firebox during a repair visit"
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="space-y-6">
            <Reveal>
              <SectionHeading
                eyebrow="What a repair visit covers"
                title={`How Phoenix approaches gas fireplace repair in ${city.name}.`}
                description="The goal is not to guess. The goal is to pinpoint the issue, test safely, and move the homeowner toward a reliable fix."
              />
            </Reveal>
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                The most common service calls involve pilot problems, ignition failure, low flame output,
                dirty burners, worn components, and fireplaces that have not been maintained before heavy seasonal use.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={getCityHref(city.slug, "/services")}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]"
              >
                See all fireplace and chimney services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {gasRepairVisitPoints.map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(182,84,45,0.12)] text-[var(--color-ember)]">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight text-[var(--color-ink)]">{item.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{item.description}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContextualLinksGrid
        eyebrow="Related service paths"
        title="Maintenance, installation, or troubleshooting guidance"
        description="Repair stays the primary intent on this page. These links help when the problem may be preventive, upgrade-related, or still being diagnosed."
        links={getGasRepairContextualLinks(city.slug)}
        city={city.slug}
      />

      <FromTheField serviceSlug="gas-fireplace-repair" city={city.slug} />

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Gas fireplace repair FAQs"
              title={`Questions homeowners ask before booking gas fireplace repair in ${city.name}.`}
              description="These are the practical questions that usually come up before a repair, troubleshooting, or combined inspection visit is booked."
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