import Link from "next/link";

import {
  estimateStatusClass,
  formatPortalMoney,
  portalEstimateHref,
  type PortalFinanceSelection,
  type PortalPreviewFinanceEstimate,
} from "@/lib/portal/ui-preview";

type PortalEstimatesListProps = {
  estimates: PortalPreviewFinanceEstimate[];
  selection: PortalFinanceSelection | null;
};

export function PortalEstimatesList({ estimates, selection }: PortalEstimatesListProps) {
  if (estimates.length === 0) {
    return (
      <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 px-5 py-8 text-center shadow-[0_10px_30px_rgba(31,26,22,0.05)]">
        <h2 className="text-lg font-semibold text-[var(--color-ink)]">No estimates available</h2>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">Estimates</h2>
      <ul className="mt-4 grid gap-3 lg:hidden">
        {estimates.map((estimate) => {
          const isActive = selection?.kind === "estimate" && selection.id === estimate.id;

          return (
            <li key={estimate.id}>
              <Link
                href={portalEstimateHref(estimate.id)}
                scroll={false}
                className={`block w-full rounded-[1.4rem] border p-4 ${
                  isActive
                    ? "border-[rgba(185,71,29,0.35)] bg-[rgba(185,71,29,0.06)]"
                    : "border-[var(--color-border)] bg-white"
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-[var(--color-ink)]">{estimate.number}</p>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estimateStatusClass(estimate.status)}`}>
                    {estimate.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{estimate.serviceTitle}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">{formatPortalMoney(estimate.totalCents)}</p>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-[0.14em] text-[var(--color-muted)]">
              <th className="pb-3 font-semibold">Estimate #</th>
              <th className="pb-3 font-semibold">Service</th>
              <th className="pb-3 font-semibold">Related Job</th>
              <th className="pb-3 font-semibold">Created Date</th>
              <th className="pb-3 font-semibold">Total</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((estimate) => {
              const isActive = selection?.kind === "estimate" && selection.id === estimate.id;

              return (
                <tr key={estimate.id} className={isActive ? "bg-[rgba(185,71,29,0.06)]" : undefined}>
                  <td className="py-3">
                    <Link
                      href={portalEstimateHref(estimate.id)}
                      scroll={false}
                      className={`font-semibold underline-offset-4 hover:underline ${
                        isActive ? "text-[var(--color-ember)]" : "text-[var(--color-ink)]"
                      }`}
                    >
                      {estimate.number}
                    </Link>
                  </td>
                  <td className="py-3 text-[var(--color-ink)]">{estimate.serviceTitle}</td>
                  <td className="py-3 text-[var(--color-muted)]">{estimate.jobNumber}</td>
                  <td className="py-3 text-[var(--color-muted)]">{estimate.createdDateLabel}</td>
                  <td className="py-3 text-[var(--color-ink)]">{formatPortalMoney(estimate.totalCents)}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${estimateStatusClass(estimate.status)}`}>
                      {estimate.status}
                    </span>
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
