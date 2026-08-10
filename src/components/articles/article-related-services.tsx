import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getCityBySlug, type CitySlug } from "@/lib/cities";
import type { Article } from "@/lib/cms/types";
import { resolveRelatedServiceLink } from "@/lib/internal-links";

type ArticleRelatedServicesProps = {
  article: Pick<Article, "relatedServiceSlugs">;
  city: CitySlug;
};

export function ArticleRelatedServices({ article, city }: ArticleRelatedServicesProps) {
  const slugs = (article.relatedServiceSlugs || []).slice(0, 3);
  const cityConfig = getCityBySlug(city);

  if (slugs.length === 0 || !cityConfig) {
    return null;
  }

  const links = slugs
    .map((slug) => resolveRelatedServiceLink(slug, city))
    .filter((link): link is NonNullable<typeof link> => link != null);

  if (links.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-ember)]">
        Related services
      </p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--color-ink)]">
        When this article points toward service
      </h2>
      <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
        These pages cover booking and scope when the issue moves beyond informational guidance.
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex flex-col rounded-[1.35rem] border border-[var(--color-border)] bg-white/70 p-4 transition hover:border-[var(--color-forest)]/30"
            >
              <span className="font-semibold text-[var(--color-ink)]">{link.title}</span>
              <span className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{link.description}</span>
              <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]">
                View service page
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
