import { Section } from "@/components/ui/Section";
export function RealWorkProof() {
  return (
    <Section className="bg-[var(--surface-section)]">
      <p className="section-kicker">Work Categories</p>
      <h2 className="section-title">Recent Field Work Snapshot</h2>
      <p className="section-subtitle max-w-2xl">
        Real project media is curated for launch updates. The blocks below represent our work
        categories used in Alberta homes.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="card-premium p-5">
          <h3 className="font-semibold text-[var(--inner-page-title)]">Gas Fireplace Diagnostics</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Ignition and flame-performance troubleshooting.</p>
        </article>
        <article className="card-premium p-5">
          <h3 className="font-semibold text-[var(--inner-page-title)]">WETT Reporting Support</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Inspection-first findings prepared for documentation needs.</p>
        </article>
        <article className="card-premium p-5">
          <h3 className="font-semibold text-[var(--inner-page-title)]">Chimney Repair & Sweep</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Safety-focused chimney upkeep and targeted repair work.</p>
        </article>
      </div>
    </Section>
  );
}
