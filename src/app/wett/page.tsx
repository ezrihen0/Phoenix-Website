import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { ContextualLinksGrid } from "@/components/internal-links/contextual-links-grid";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { StructuredData } from "@/components/structured-data";
import { getCityHref, getRequestServiceHref } from "@/lib/cities";
import { getSiteSettings } from "@/lib/cms/storage";
import { getWettContextualLinks } from "@/lib/internal-links";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
  createPageMetadata,
} from "@/lib/seo";
import { getWettFaqs, wettBenefits } from "@/lib/site-data";

export const metadata: Metadata = createPageMetadata({
  title: "WETT Inspection Calgary | Insurance & Real-Estate Reports",
  description:
    "Book WETT inspection appointments in Calgary for insurance, real-estate transactions, wood-burning system review, and clear reporting. Edmonton and Red Deer city pages are also available.",
  path: "/wett",
  keywords: ["WETT inspection Calgary", "insurance fireplace inspection Calgary"],
});

export default async function WettPage() {
  const siteSettings = await getSiteSettings();
  const wettFaqs = getWettFaqs("Calgary");

  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "WETT", path: "/wett" },
          ]),
          buildLocalBusinessSchema("calgary"),
          buildFaqSchema(wettFaqs),
          buildServiceSchema(
            "WETT Inspections",
            "WETT inspection appointments and documentation support for Calgary wood-burning systems.",
            "/wett",
            "calgary",
          ),
        ]}
      />

      <section className="section-pad">
        <Reveal>
        <div className="page-frame overflow-hidden rounded-[2.8rem] border border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_25px_80px_rgba(31,26,22,0.22)]">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6 p-8 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                <ShieldCheck className="h-4 w-4" />
                Calgary WETT inspection service
              </div>
              <h1 className="display-title text-balance text-5xl font-semibold leading-[0.92] sm:text-6xl">
                WETT inspections in Calgary for insurers, closings, and homeowners who need clear documentation.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--color-paper)]/78 sm:text-lg">
                This is the Calgary legacy WETT page. When a sale, policy review, or safety concern depends on credible documentation,
                Phoenix inspects the full wood-burning system and produces reporting organized around visible findings.
              </p>
              <p className="text-sm leading-7 text-[var(--color-paper)]/70">
                Serving Edmonton or Red Deer? Use the{" "}
                <Link href={getCityHref("edmonton", "/wett")} className="font-semibold text-[var(--color-gold)]">
                  Edmonton WETT page
                </Link>{" "}
                or{" "}
                <Link href={getCityHref("red-deer", "/wett")} className="font-semibold text-[var(--color-gold)]">
                  Red Deer WETT page
                </Link>
                .
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {wettBenefits.map((benefit) => (
                  <div key={benefit.title} className="rounded-[1.7rem] bg-white/8 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                      {benefit.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-paper)]/75">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={getRequestServiceHref()}
                  className="rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Request WETT inspection
                </Link>
                <a
                  href={`tel:${siteSettings.phoneHref}`}
                  className="rounded-full border border-white/16 px-5 py-3 text-sm font-semibold text-white"
                >
                  Call for urgency questions
                </a>
              </div>
            </div>
            <div className="relative min-h-[24rem] lg:min-h-full">
              <Image
                src="/images/photos/wett-report.jpg"
                alt="WETT inspection documentation and report paperwork"
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
        <div className="page-frame grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <div className="space-y-6">
            <Reveal>
              <SectionHeading
                eyebrow="Why a WETT inspection gets requested"
                title="Most requests are driven by insurance, a purchase or sale, or uncertainty about a system's real condition."
                description="These are the situations where homeowners, buyers, sellers, and insurers usually need a report they can rely on."
              />
            </Reveal>
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                Our WETT workflow reviews appliance setup, clearances, flue condition,
                chimney path, visible defects, and safety-related concerns, with documented findings where photos are available.
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Pre-purchase and pre-sale documentation",
              "Insurance provider requests and renewals",
              "New stove or insert installations",
              "Peace of mind after repairs or long periods without use",
            ].map((item, index) => (
              <Reveal key={item} delay={index * 80}>
                <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-ember)]" />
                  <p className="mt-4 text-base leading-7 text-[var(--color-muted)]">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContextualLinksGrid
        eyebrow="When findings point elsewhere"
        title="Related Calgary chimney and guidance paths"
        description="These pages cover separate visits when sweeping, masonry, or informational guidance is the next step—not automatic add-ons to every WETT appointment."
        links={getWettContextualLinks("calgary")}
        city="calgary"
      />

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[22rem]">
              <Image
                src="/images/photos/wett-inspection.jpg"
                alt="WETT inspection work being carried out"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-5 p-8 sm:p-10">
              <Image
                src="/images/brand/insurance-badge.png"
                alt=""
                aria-hidden
                width={68}
                height={68}
                className="h-14 w-14 object-contain"
              />
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
                Clear findings, fast reporting, and next steps you can actually act on.
              </h2>
              <p className="text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                If defects are found, the report should still help move the situation forward. Phoenix frames issues in plain language,
                documents them properly, and points to the repair or correction path rather than leaving homeowners to interpret technical notes alone.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={getRequestServiceHref()}
                  className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
                >
                  Request inspection
                </Link>
                <a
                  href={`tel:${siteSettings.phoneHref}`}
                  className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
                >
                  Call for report timing
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="WETT inspection FAQs"
              title="Questions homeowners ask before booking a WETT inspection in Calgary."
              description="These are the questions that usually come up around insurance files, home sales, wood-burning appliances, and how the reporting process works."
            />
          </Reveal>
          <div className="grid gap-4">
            {wettFaqs.map((faq, index) => (
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
