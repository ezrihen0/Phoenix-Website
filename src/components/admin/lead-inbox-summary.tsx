import type { LeadInboxSummary } from "@/lib/leads/handling";
import { formatDurationMinutes } from "@/lib/leads/handling";

type LeadInboxSummaryProps = {
  summary: LeadInboxSummary;
};

export function LeadInboxSummary({ summary }: LeadInboxSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      <SummaryCard label="Total" value={String(summary.total)} />
      <SummaryCard label="Pending" value={String(summary.pending)} />
      <SummaryCard label="Added to Calendar" value={String(summary.addedToCalendar)} />
      <SummaryCard label="Not Added" value={String(summary.notAdded)} />
      <SummaryCard
        label="Median handling time"
        value={
          summary.medianHandlingMinutes == null
            ? "—"
            : formatDurationMinutes(summary.medianHandlingMinutes)
        }
      />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/75 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{value}</p>
    </div>
  );
}
