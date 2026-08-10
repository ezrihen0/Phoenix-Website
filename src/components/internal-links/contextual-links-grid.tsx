import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { CitySlug } from "@/lib/cities";
import { resolveContextualLinkHref, type ContextualLink } from "@/lib/internal-links";

type ContextualLinksGridProps = {
  eyebrow: string;
  title: string;
  description: string;
  links: readonly ContextualLink[];
  city?: CitySlug;
};

export function ContextualLinksGrid({
  eyebrow,
  title,
  description,
  links,
  city,
}: ContextualLinksGridProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <section className="section-pad bg-[rgba(255,255,255,0.45)]">
      <div className="page-frame">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </Reveal>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {links.map((link, index) => (
            <Reveal key={link.path} delay={index * 70}>
              <Link
                href={resolveContextualLinkHref(link.path, city)}
                className="flex h-full flex-col rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-[0_18px_40px_rgba(31,26,22,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_52px_rgba(31,26,22,0.1)]"
              >
                <h2 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">{link.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-7 text-[var(--color-muted)]">{link.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]">
                  Open page
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
