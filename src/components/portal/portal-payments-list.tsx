import {
  formatPortalMoney,
  type PortalPreviewFinancePayment,
} from "@/lib/portal/ui-preview";

type PortalPaymentsListProps = {
  payments: PortalPreviewFinancePayment[];
};

export function PortalPaymentsList({ payments }: PortalPaymentsListProps) {
  if (payments.length === 0) {
    return (
      <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 px-5 py-8 text-center shadow-[0_10px_30px_rgba(31,26,22,0.05)]">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">No payment history yet</h2>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">Recent Payments</h2>
      <ul className="mt-4 grid gap-3">
        {payments.map((payment) => (
          <li
            key={payment.id}
            className="rounded-[1.4rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-semibold text-[var(--color-ink)]">{payment.typeLabel}</p>
              <p className="font-medium text-[var(--color-ink)]">{formatPortalMoney(payment.amountCents)}</p>
            </div>
            <p className="mt-1 text-[var(--color-muted)]">{payment.dateLabel}</p>
            <p className="mt-1 text-[var(--color-muted)]">{payment.description}</p>
            <p className="mt-1 text-[var(--color-muted)]">
              {payment.invoiceNumber ? `Invoice ${payment.invoiceNumber}` : payment.jobNumber}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
