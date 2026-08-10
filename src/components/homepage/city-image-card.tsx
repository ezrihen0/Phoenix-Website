import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CityChooserCard } from "@/lib/city-chooser-cards";

type CityImageCardProps = {
  card: CityChooserCard;
};

export function CityImageCard({ card }: CityImageCardProps) {
  return (
    <Link
      href={card.href}
      aria-label={`${card.ctaLabel} — ${card.serviceLabel}`}
      className="group/card block rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ember)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)]"
    >
      <article
        className={[
          "relative isolate min-h-[18rem] overflow-hidden rounded-[2rem] border border-[var(--color-border)] shadow-[0_20px_50px_rgba(31,26,22,0.12)] transition duration-500 ease-out",
          "hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(31,26,22,0.18)]",
          "group-hover/grid:opacity-[0.88] hover:!opacity-100",
          "sm:min-h-[20rem] lg:min-h-[26rem] lg:aspect-[4/5] lg:max-h-[34rem]",
        ].join(" ")}
      >
        {card.image ? (
          <Image
            src={card.image}
            alt={card.imageAlt || `${card.name} service area`}
            fill
            priority={card.slug === "calgary"}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 ease-out group-hover/card:scale-[1.04]"
          />
        ) : (
          <div aria-hidden className={`absolute inset-0 ${card.fallbackClassName}`} />
        )}

        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,16,13,0.08)_0%,rgba(20,16,13,0.34)_42%,rgba(20,16,13,0.82)_100%)] transition duration-500 group-hover/card:bg-[linear-gradient(180deg,rgba(20,16,13,0.12)_0%,rgba(20,16,13,0.4)_40%,rgba(20,16,13,0.88)_100%)]"
        />

        <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 sm:p-7">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold)]">
            {card.name}
          </p>
          <h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-white sm:text-[2rem]">
            {card.serviceLabel}
          </h2>
          {card.contextLine ? (
            <p className="mt-2 max-w-[18rem] text-sm leading-6 text-white/78">{card.contextLine}</p>
          ) : null}
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
            {card.ctaLabel}
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover/card:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
}
