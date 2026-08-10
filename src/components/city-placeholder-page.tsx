import Link from "next/link";
import { ArrowRight, MapPinned, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { CityDefinition } from "@/lib/cities";

type CityPlaceholderPageProps = {
  city: CityDefinition;
  section: "home" | "services" | "wett" | "about" | "contact" | "articles";
};

const sectionCopy = {
  home: {
    eyebrow: "City rollout",
    title: (cityName: string) => `${cityName} dispatch is live while the full city site is being built.`,
    description: (cityName: string) =>
      `Phoenix is opening ${cityName.toLowerCase()} in stages. Call the local dispatch number now and we will route the next step while detailed service, WETT, and article pages are finished.`,
  },
  services: {
    eyebrow: "Services in progress",
    title: (cityName: string) => `${cityName} service pages are coming next.`,
    description: (cityName: string) =>
      `The detailed ${cityName.toLowerCase()} services breakdown is still being written. Call dispatch now if you need fireplace repair, chimney work, or inspection guidance.`,
  },
  wett: {
    eyebrow: "WETT coverage",
    title: (cityName: string) => `${cityName} WETT content is being localized.`,
    description: (cityName: string) =>
      `Phoenix is preparing a ${cityName.toLowerCase()}-specific WETT page with local timing, insurer expectations, and reporting context. The dispatch line is live now for urgent questions.`,
  },
  about: {
    eyebrow: "About this rollout",
    title: (cityName: string) => `${cityName} is being opened as a dedicated city section.`,
    description: (cityName: string) =>
      `This city section will get its own service pages, articles, and local guidance. For now, the fastest path is to call the ${cityName.toLowerCase()} dispatch number directly.`,
  },
  contact: {
    eyebrow: "Contact dispatch",
    title: (cityName: string) => `Call Phoenix for ${cityName.toLowerCase()} service routing.`,
    description: (cityName: string) =>
      `The ${cityName.toLowerCase()} contact page is in a call-first rollout state. Use the city number below and we will route the right next step while the local form flow is being prepared.`,
  },
  articles: {
    eyebrow: "Local articles coming",
    title: (cityName: string) => `${cityName} articles are being prepared with local weather and code context.`,
    description: (cityName: string) =>
      `Phoenix is building a ${cityName.toLowerCase()} article library focused on local winter wear, maintenance timing, and Alberta reporting requirements. The dispatch line is already live.`,
  },
} as const;

export function CityPlaceholderPage({ city, section }: CityPlaceholderPageProps) {
  const copy = sectionCopy[section];

  return (
    <>
      <section className="section-pad pb-12">
        <div className="page-frame space-y-6">
          <Reveal>
            <div className="overflow-hidden rounded-[2.8rem] border border-[var(--color-border)] bg-[var(--color-ink)] text-[var(--color-paper)] shadow-[0_28px_70px_rgba(31,26,22,0.18)]">
              <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="space-y-6 p-8 sm:p-10 lg:p-12">
                  <p className="eyebrow text-[var(--color-gold)]">{copy.eyebrow}</p>
                  <h1 className="display-title text-balance text-5xl font-semibold leading-[0.94] sm:text-6xl">
                    {copy.title(city.name)}
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-[var(--color-paper)]/78 sm:text-lg">
                    {copy.description(city.name)}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={`tel:${city.phoneHref}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ember)] px-6 py-3.5 text-sm font-semibold text-white"
                    >
                      <Phone className="h-4 w-4" />
                      Call {city.phoneDisplay}
                    </a>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 rounded-full border border-white/16 px-6 py-3.5 text-sm font-semibold text-white"
                    >
                      Choose a different city
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <div className="grid gap-4 bg-[rgba(255,255,255,0.04)] p-8 sm:grid-cols-3 lg:grid-cols-1 lg:p-10">
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                      City status
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-paper)]/78">
                      {city.dispatchLabel}. Call routing is available before the full city content library is complete.
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                      What is live
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-paper)]/78">
                      City phone routing is active now. Local service pages, article coverage, and detailed city guidance are next.
                    </p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                      Service area note
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-paper)]/78">
                      {city.serviceRadius}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <div className="page-frame grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
          <Reveal>
            <SectionHeading
              eyebrow={`${city.name} rollout`}
              title="What to do right now"
              description="Use the live city dispatch number for scheduling questions, symptom triage, and service routing while the full city section is still being completed."
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal>
              <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                  <Phone className="h-4 w-4" />
                  Call dispatch
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  Call {city.phoneDisplay} to explain the problem, timeline, and appliance type so Phoenix can point you to the right next step.
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
                <p className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                  <MapPinned className="h-4 w-4" />
                  City setup
                </p>
                <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                  This city section will get dedicated service pages, local article coverage, and area-specific guidance as the rollout continues.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}