import Link from "next/link";

import {
  formatPortalMoney,
  invoiceStatusClass,
  portalInvoiceHref,
  type PortalFinanceSelection,
  type PortalPreviewFinanceInvoice,
} from "@/lib/portal/ui-preview";

type PortalInvoicesListProps = {
  invoices: PortalPreviewFinanceInvoice[];
  selection: PortalFinanceSelection | null;
};

export function PortalInvoicesList({ invoices, selection }: PortalInvoicesListProps) {
  if (invoices.length === 0) {
    return (
      <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 px-5 py-10 text-center shadow-[0_10px_30px_rgba(31,26,22,0.05)]">
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">No invoices yet</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          Your Phoenix invoices will appear here when available.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">Invoices</h2>
      <ul className="mt-4 grid gap-3 lg:hidden">
        {invoices.map((invoice) => {
          const isActive = selection?.kind === "invoice" && selection.id === invoice.id;

          return (
            <li key={invoice.id}>
              <Link
                href={portalInvoiceHref(invoice.id)}
                scroll={false}
                className={`block w-full rounded-[1.4rem] border p-4 ${
                  isActive
                    ? "border-[rgba(185,71,29,0.35)] bg-[rgba(185,71,29,0.06)]"
                    : "border-[var(--color-border)] bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[var(--color-ink)]">{invoice.number}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${invoiceStatusClass(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{invoice.serviceTitle}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Total {formatPortalMoney(invoice.totalCents)}
                  <span className="mx-1.5">·</span>
                  Remaining {formatPortalMoney(invoice.remainingBalanceCents)}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
              <th className="pb-3 font-semibold">Invoice #</th>
              <th className="pb-3 font-semibold">Job / Service</th>
              <th className="pb-3 font-semibold">Issue Date</th>
              <th className="pb-3 font-semibold">Due Date</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 font-semibold">Total</th>
              <th className="pb-3 font-semibold">Paid</th>
              <th className="pb-3 font-semibold">Balance</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const isActive = selection?.kind === "invoice" && selection.id === invoice.id;

              return (
                <tr key={invoice.id} className={isActive ? "bg-[rgba(185,71,29,0.06)]" : undefined}>
                  <td className="py-3">
                    <Link
                      href={portalInvoiceHref(invoice.id)}
                      scroll={false}
                      className={`font-semibold underline-offset-4 hover:underline ${
                        isActive ? "text-[var(--color-ember)]" : "text-[var(--color-ink)]"
                      }`}
                    >
                      {invoice.number}
                    </Link>
                  </td>
                  <td className="py-3">
                    <p className="font-medium text-[var(--color-ink)]">{invoice.serviceTitle}</p>
                    <p className="text-[var(--color-muted)]">{invoice.jobNumber}</p>
                  </td>
                  <td className="py-3 text-[var(--color-muted)]">{invoice.issueDateLabel}</td>
                  <td className="py-3 text-[var(--color-muted)]">{invoice.dueDateLabel}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${invoiceStatusClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 text-[var(--color-ink)]">{formatPortalMoney(invoice.totalCents)}</td>
                  <td className="py-3 text-[var(--color-muted)]">{formatPortalMoney(invoice.amountPaidCents)}</td>
                  <td className="py-3 font-medium text-[var(--color-ink)]">
                    {formatPortalMoney(invoice.remainingBalanceCents)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
