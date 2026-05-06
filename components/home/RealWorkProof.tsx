import { Section } from "@/components/ui/Section";
export function RealWorkProof() {
  return (
    <Section className="bg-[var(--surface-section)]">
      <h2 className="text-3xl font-semibold">Recent Field Work Snapshot</h2>
      <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
        Real project media is curated for launch updates. The blocks below represent our work
        categories used in Alberta homes.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[var(--card-border)] bg-white p-5">
          <h3 className="font-semibold">Gas Fireplace Diagnostics</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Ignition and flame-performance troubleshooting.</p>
        </article>
        <article className="rounded-2xl border border-[var(--card-border)] bg-white p-5">
          <h3 className="font-semibold">WETT Reporting Support</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Inspection-first findings prepared for documentation needs.</p>
        </article>
        <article className="rounded-2xl border border-[var(--card-border)] bg-white p-5">
          <h3 className="font-semibold">Chimney Repair & Sweep</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Safety-focused chimney upkeep and targeted repair work.</p>
        </article>
      </div>
    </Section>
  );
}
