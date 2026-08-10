import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { getScopedPath, type CitySlug } from "@/lib/cities";
import { getServiceDetailPath } from "@/lib/site-data";

type ServiceCardProps = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  icon: string;
  city?: CitySlug;
};

export function ServiceCard({
  slug,
  title,
  tagline,
  description,
  image,
  icon,
  city,
}: ServiceCardProps) {
  return (
    <Reveal>
      <article className="group overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_20px_50px_rgba(31,26,22,0.06)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={`${title} service photo`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(31,26,22,0.65)] via-transparent to-transparent" />
        <div className="absolute left-5 top-5 rounded-2xl bg-white/86 p-3 shadow-lg backdrop-blur">
          <Image src={icon} alt="Service icon" width={36} height={36} className="h-9 w-9 object-contain" />
        </div>
      </div>
      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-ember)]">
            {tagline}
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">{title}</h3>
        </div>
        <p className="text-sm leading-7 text-[var(--color-muted)]">{description}</p>
        <Link
          href={getScopedPath(getServiceDetailPath(slug), city)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)]"
        >
          Explore service details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      </article>
    </Reveal>
  );
}