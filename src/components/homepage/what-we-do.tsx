import Link from "next/link";
import { Flame, MapPinned, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";

const serviceCategories = [
  {
    title: "Gas Fireplaces",
    href: "/gas-fireplace-repair",
    icon: Flame,
  },
  {
    title: "Chimney & Masonry",
    href: "/services/chimney-sweeping-inspection",
    icon: MapPinned,
  },
  {
    title: "WETT & Wood-Burning",
    href: "/wett",
    icon: ShieldCheck,
  },
] as const;

export function WhatWeDo() {
  return (
    <section className="pb-14 pt-2 sm:pb-16">
      <div className="page-frame space-y-5">
        <Reveal>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-2xl">
            What We Do
          </h2>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-3">
          {serviceCategories.map((category, index) => (
            <Reveal key={category.title} delay={index * 50}>
              <Link
                href={category.href}
                className="group flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3.5 transition hover:border-[var(--color-forest)]/30"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[rgba(182,84,45,0.12)] text-[var(--color-ember)]">
                  <category.icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-forest)]">
                  {category.title}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
