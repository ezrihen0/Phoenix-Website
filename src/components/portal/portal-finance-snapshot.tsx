import { formatPortalMoney, type PortalPreviewFinanceSummary } from "@/lib/portal/ui-preview";
import Link from "next/link";

type PortalFinanceSnapshotProps = {
  summary: PortalPreviewFinanceSummary;
};

export function PortalFinanceSnapshot({ summary }: PortalFinanceSnapshotProps) {
  return (
    <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">Finance Snapshot</h2>
      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[var(--color-muted)]">Open Invoices</dt>
          <dd className="font-semibold text-[var(--color-ink)]">{summary.openInvoiceCount}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-[var(--color-muted)]">Remaining Balance</dt>
          <dd className="font-semibold text-[var(--color-ink)]">{formatPortalMoney(summary.remainingBalanceCents)}</dd>
        </div>
        {summary.recentEstimateNumber ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[var(--color-muted)]">Recent Estimate</dt>
            <dd className="font-semibold text-[var(--color-ink)]">{summary.recentEstimateNumber}</dd>
          </div>
        ) : null}
        {summary.nextDueDateLabel ? (
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-[var(--color-muted)]">Next due</dt>
            <dd className="font-medium text-[var(--color-ink)]">{summary.nextDueDateLabel}</dd>
          </div>
        ) : null}
      </dl>
      <Link
        href="/portal?tab=finance"
        scroll={false}
        className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-ember)] underline-offset-4 hover:underline"
      >
        View Finance →
      </Link>
    </article>
  );
}
