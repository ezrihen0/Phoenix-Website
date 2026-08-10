import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { getCityBySlug, type CitySlug } from "@/lib/cities";
import {
  getCityServiceCardDescription,
  getServiceLandingHref,
  serviceLandingPages,
} from "@/lib/site-data";

type ServiceGuidesGridProps = {
  eyebrow: string;
  title: string;
  description: string;
  city?: CitySlug;
};

export function ServiceGuidesGrid({
  eyebrow,
  title,
  description,
  city,
}: ServiceGuidesGridProps) {
  const cityConfig = city ? getCityBySlug(city) : undefined;
  const guideEyebrow = cityConfig ? `${cityConfig.name} service guide` : "Alberta service guide";

  return (
    <section className="section-pad bg-[rgba(255,255,255,0.42)]">
      <div className="page-frame">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-4">
          {serviceLandingPages.map((servicePage, index) => (
            <Reveal key={servicePage.slug} delay={index * 70}>
              <Link
                href={getServiceLandingHref(servicePage.slug, city)}
                className="flex h-full flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[0_18px_40px_rgba(31,26,22,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(31,26,22,0.1)]"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
                  {guideEyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  {servicePage.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-muted)]">
                  {cityConfig
                    ? getCityServiceCardDescription(servicePage.slug, cityConfig.name)
                    : servicePage.cardDescription}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]">
                  Open guide
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}