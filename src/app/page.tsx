import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPinned,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { ContactForm } from "@/components/forms/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCard } from "@/components/service-card";
import { StructuredData } from "@/components/structured-data";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "@/lib/seo";
import {
  galleryImages,
  heroHighlights,
  homeFaqs,
  processSteps,
  services,
  siteConfig,
  trustMetrics,
  valuePillars,
  wettBenefits,
} from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <StructuredData
        data={[
          buildBreadcrumbSchema([{ name: "Home", path: "/" }]),
          buildFaqSchema(homeFaqs),
          ...services.slice(0, 3).map((service) =>
            buildServiceSchema(service.title, service.description, "/services"),
          ),
        ]}
      />

      <section className="section-pad pt-8">
        <div className="page-bleed grid items-stretch gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-black/10 bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_30px_80px_rgba(31,26,22,0.2)]">
            <Image
              src="/images/photos/hero-fireplace.jpg"
              alt="Modern fireplace in a bright Calgary home"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(20,16,13,0.88),rgba(20,16,13,0.55),rgba(20,16,13,0.15))]" />
            <div className="relative flex h-full flex-col justify-between gap-12 p-7 sm:p-10 lg:p-12">
              <div className="space-y-5">
                <p className="eyebrow text-[var(--color-gold)]">Fireplace & chimney repair in Calgary</p>
                <h1 className="display-title text-balance max-w-4xl text-5xl font-semibold leading-[0.92] sm:text-6xl lg:text-7xl">
                  Safe heat, clear answers, and booking that does not stall the job.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--color-paper)]/80 sm:text-lg">
                  Phoenix handles gas fireplace repair, WETT inspections, chimney
                  sweeping, relining, and masonry service for Calgary homes that
                  need the issue diagnosed properly the first time.
                </p>
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

              <div className="flex flex-wrap gap-3">
                <a
                  href={siteConfig.workizUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ember)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-ember-dark)]"
                >
                  <CalendarDays className="h-4 w-4" />
                  Book online
                </a>
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/18 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/8"
                >
                  <Phone className="h-4 w-4" />
                  Call {siteConfig.phoneDisplay}
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
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

            <div className="overflow-hidden rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/photos/team-fireplace.jpg"
                  alt="Premium fireplace installation detail"
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-4 p-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-paper)]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                  WETT-ready reporting
                </div>
                <p className="display-title text-3xl font-semibold leading-none text-[var(--color-ink)]">
                  Inspection, documentation, and repair planning in one service flow.
                </p>
                <p className="text-sm leading-7 text-[var(--color-muted)]">
                  Insurance reviews, home sales, camera-based inspection, and field
                  notes are handled with the same practical standard as the repair work.
                </p>
                <Link
                  href="/wett"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]"
                >
                  Explore WETT inspections
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="page-frame">
          <SectionHeading
            eyebrow="What Phoenix handles"
            title="The core services Calgary homeowners actually book."
            description="The live site leaned heavily on repeated CTAs. Here the same services are clearer, better grouped, and easier to compare before booking."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Why people call again"
              title="Local service that is set up to diagnose first, not improvise."
              description="The current site promises fast scheduling and honest service. The rebuild keeps that positioning and makes the operating model more explicit."
            />
            <div className="grid gap-4">
              {valuePillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6"
                >
                  <h3 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>

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
                  href="/wett"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white"
                >
                  See the dedicated WETT page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="page-frame grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <SectionHeading
            eyebrow="How booking works"
            title="A simple process built around getting the right technician and the right report."
            description="Whether the issue is a dirty gas unit, a suspected chimney defect, or a time-sensitive WETT request, the goal is to match the appointment to the actual problem quickly."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6"
              >
                <div className="absolute right-5 top-4 display-title text-6xl text-[var(--color-ember)]/12">
                  0{index + 1}
                </div>
                <p className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{step.title}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame">
          <SectionHeading
            eyebrow="Recent field notes"
            title="Original site imagery, reused properly."
            description="The live site had good source material but scattered it across sliders and background blocks. Here the photos are grounded in service context and kept local to the app."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.slice(0, 2).map((image) => (
                <div key={image.src} className="relative min-h-[16rem] overflow-hidden rounded-[2rem] border border-[var(--color-border)]">
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {galleryImages.slice(2).map((image) => (
                <div key={image.src} className="relative min-h-[16rem] overflow-hidden rounded-[2rem] border border-[var(--color-border)]">
                  <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-6">
            <SectionHeading
              eyebrow="Coverage and quick answers"
              title="Common questions before you book."
              description="These answers are written for homeowners choosing between calling, booking, or requesting an inspection report."
            />
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
              <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                <MapPinned className="h-4 w-4" />
                Service area
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{siteConfig.serviceRadius}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                Core areas include {siteConfig.serviceAreas.join(", ")}.
              </p>
            </div>
          </div>
          <div className="grid gap-4">
            {homeFaqs.map((faq) => (
              <article
                key={faq.question}
                className="rounded-[2rem] border border-[var(--color-border)] bg-white/75 p-6"
              >
                <h3 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{faq.answer}</p>
              </article>
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
              This build keeps the Workiz booking path front and center while also
              leaving room for a direct API integration later. The contact endpoint is
              already isolated so it can move cleanly into a future NestJS backend if needed.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
