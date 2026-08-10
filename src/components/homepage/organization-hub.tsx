import Link from "next/link";
import { ArrowRight, BookOpen, Flame, MapPinned, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cities, getCityHref } from "@/lib/cities";
import { serviceLandingPages, siteConfig } from "@/lib/site-data";

const serviceCategories = [
  {
    title: "Gas fireplace service",
    description: "Repair when the unit fails, maintenance when it still runs but needs annual care.",
    links: [
      { href: "/gas-fireplace-repair", label: "Gas fireplace repair" },
      { href: "/services/gas-fireplace-maintenance", label: "Gas fireplace maintenance" },
      { href: "/services/gas-fireplace-installation", label: "Gas fireplace installation" },
    ],
  },
  {
    title: "Chimney & masonry",
    description: "Sweeping and inspection for draft and creosote concerns; masonry when exterior wear is visible.",
    links: [
      { href: "/services/chimney-sweeping-inspection", label: "Chimney sweeping and inspection" },
      { href: "/services/chimney-repair-masonry", label: "Chimney repair and masonry" },
    ],
  },
  {
    title: "WETT & wood-burning documentation",
    description: "Inspection reporting when insurers, buyers, or homeowners need clear wood-burning system documentation.",
    links: [{ href: "/wett", label: "WETT inspections" }],
  },
] as const;

export function OrganizationHub() {
  return (
    <>
      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow="Who Phoenix is"
              title={`${siteConfig.legalName} serves Alberta fireplace and chimney markets.`}
              description="Phoenix is the organization behind this website. We publish service pages and homeowner guidance for Calgary, Edmonton, and Red Deer, then route booking to the correct local dispatch path."
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                This homepage is a market entry point—not a city landing page. Choose your city first so phone numbers,
                service areas, and articles match your market. Service categories below show what the site covers across Alberta.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
                >
                  <BookOpen className="h-4 w-4" />
                  Calgary articles hub
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
                >
                  About Phoenix
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-pad pt-0">
        <div className="page-frame">
          <Reveal>
            <SectionHeading
              eyebrow="Service categories"
              title="What this site covers"
              description="Each category links to Calgary legacy pages or province-wide guides. After choosing a city, use that city's service directory for local booking context."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {serviceCategories.map((category, index) => (
              <Reveal key={category.title} delay={index * 70}>
                <article className="flex h-full flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(182,84,45,0.12)] text-[var(--color-ember)]">
                    {category.title.includes("WETT") ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : category.title.includes("Gas") ? (
                      <Flame className="h-5 w-5" />
                    ) : (
                      <MapPinned className="h-5 w-5" />
                    )}
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight text-[var(--color-ink)]">{category.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-muted)]">{category.description}</p>
                  <ul className="mt-5 space-y-2">
                    {category.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className="text-sm font-semibold text-[var(--color-forest)] hover:underline">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[rgba(255,255,255,0.45)]">
        <div className="page-frame">
          <Reveal>
            <SectionHeading
              eyebrow="Province service guides"
              title="Alberta-wide landing pages"
              description="These guides explain scope before you choose a city. City pages add local service-area context and dispatch details."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {serviceLandingPages.map((page, index) => (
              <Reveal key={page.slug} delay={index * 60}>
                <Link
                  href={`/services/${page.slug}`}
                  className="block rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition hover:border-[var(--color-forest)]/30"
                >
                  <p className="font-semibold text-[var(--color-ink)]">{page.navLabel}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{page.menuDescription}</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={getCityHref(city.slug)}
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 px-5 py-4 text-sm font-semibold text-[var(--color-forest)]"
              >
                Open {city.name} home →
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-frame rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
            Content responsibility
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            Informational articles are published for review—not autonomous output.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
            Articles on this site explain symptoms, maintenance timing, and when to book service. They are written and
            reviewed under editorial standards before publication. Field photos and case examples appear only when verified
            evidence is approved—never as invented proof.
          </p>
        </div>
      </section>
    </>
  );
}
