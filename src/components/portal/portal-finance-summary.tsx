import { formatPortalMoney, type PortalPreviewFinanceSummary } from "@/lib/portal/ui-preview";

type PortalFinanceSummaryProps = {
  summary: PortalPreviewFinanceSummary;
};

function MetricCard({
  label,
  value,
  secondary,
  emphasized = false,
  upToDate = false,
}: {
  label: string;
  value: string;
  secondary?: string;
  emphasized?: boolean;
  upToDate?: boolean;
}) {
  return (
    <article
      className={`rounded-[1.5rem] border bg-white/90 p-4 shadow-[0_8px_24px_rgba(31,26,22,0.04)] sm:p-5 ${
        emphasized ? "border-[rgba(185,71,29,0.28)]" : "border-[var(--color-border)]"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">{label}</p>
      <p className={`mt-2 font-semibold tracking-tight text-[var(--color-ink)] ${emphasized ? "text-2xl" : "text-xl"}`}>
        {value}
      </p>
      {secondary ? <p className="mt-1 text-sm text-[var(--color-muted)]">{secondary}</p> : null}
      {upToDate ? <p className="mt-2 text-xs font-medium text-[#2a5a3a]">Account up to date</p> : null}
    </article>
  );
}

export function PortalFinanceSummary({ summary }: PortalFinanceSummaryProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        label="Open Invoices"
        value={String(summary.openInvoiceCount)}
        secondary={formatPortalMoney(summary.openInvoiceAmountCents)}
      />
      <MetricCard
        label="Estimates Pending"
        value={String(summary.pendingEstimateCount)}
        secondary={formatPortalMoney(summary.pendingEstimateAmountCents)}
      />
      <MetricCard label="Total Balance" value={formatPortalMoney(summary.totalBalanceCents)} />
      <MetricCard
        label="Remaining Balance"
        value={formatPortalMoney(summary.remainingBalanceCents)}
        emphasized
        upToDate={summary.remainingBalanceCents === 0}
      />
      <MetricCard
        label="Last Payment"
        value={summary.lastPayment ? summary.lastPayment.dateLabel : "No payments yet"}
        secondary={summary.lastPayment ? formatPortalMoney(summary.lastPayment.amountCents) : undefined}
      />
    </section>
  );
}
