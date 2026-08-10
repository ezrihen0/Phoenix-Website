import Link from "next/link";
import { ArrowRight, MapPinned } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { getCityBySlug, getCityHref, type CitySlug } from "@/lib/cities";
import type { ServiceLandingPage } from "@/lib/site-data";

type ServiceLocalContextProps = {
  servicePage: ServiceLandingPage;
  city: CitySlug;
};

const GENERIC_PATTERNS = [
  /homeowners need reliable service/i,
  /has weather/i,
  /local homeowners/i,
];

function isWeakHighlight(text: string) {
  const trimmed = text.trim();

  if (trimmed.length < 40) {
    return true;
  }

  return GENERIC_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export function ServiceLocalContext({ servicePage, city }: ServiceLocalContextProps) {
  if (servicePage.cityCoverage) {
    return null;
  }

  const cityConfig = getCityBySlug(city);
  const highlight = cityConfig ? servicePage.cityHighlights[cityConfig.slug] : undefined;

  if (!highlight || isWeakHighlight(highlight)) {
    return null;
  }

  return (
    <section className="pb-20">
      <div className="page-frame">
        <Reveal>
          <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
              <MapPinned className="h-4 w-4" />
              {cityConfig?.name} context
            </div>
            <h2 className="mt-4 text-balance text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              How this service shows up in {cityConfig?.name}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base">{highlight}</p>
            <Link
              href={getCityHref(city, "/services")}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]"
            >
              Compare all {cityConfig?.name} services
              <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
