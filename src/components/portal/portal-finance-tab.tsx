import type { PortalFinanceSelection, PortalUiPreviewProfile } from "@/lib/portal/ui-preview";

import { PortalEstimatesList } from "./portal-estimates-list";
import { PortalFinanceDocumentPreview } from "./portal-finance-document-preview";
import { PortalFinanceSummary } from "./portal-finance-summary";
import { PortalInvoicesList } from "./portal-invoices-list";
import { PortalPaymentsList } from "./portal-payments-list";

type PortalFinanceTabProps = {
  profile: PortalUiPreviewProfile;
  selection?: PortalFinanceSelection | null;
  invalidSelection?: boolean;
};

export function PortalFinanceTab({
  profile,
  selection = null,
  invalidSelection = false,
}: PortalFinanceTabProps) {
  const invoiceId = selection?.kind === "invoice" ? selection.id : null;
  const estimateId = selection?.kind === "estimate" ? selection.id : null;
  const hasSelection = Boolean(invoiceId || estimateId);

  return (
    <div className="grid gap-5">
      {invalidSelection ? (
        <p className="rounded-2xl bg-[rgba(201,95,43,0.08)] px-4 py-3 text-sm text-[var(--color-muted)]">
          That financial record isn’t available. Showing your Finance overview instead.
        </p>
      ) : null}
      <PortalFinanceSummary summary={profile.finance.summary} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,0.9fr)] lg:items-start">
        <div className={`grid min-w-0 gap-5 ${hasSelection ? "hidden lg:grid" : ""}`}>
          <PortalInvoicesList invoices={profile.finance.invoices} selection={selection} />
          <PortalEstimatesList estimates={profile.finance.estimates} selection={selection} />
          <PortalPaymentsList payments={profile.finance.payments} />
        </div>
        <div className={`min-w-0 ${hasSelection ? "" : "hidden lg:block"}`}>
          <PortalFinanceDocumentPreview
            profile={profile}
            finance={profile.finance}
            invoiceId={invoiceId}
            estimateId={estimateId}
          />
        </div>
      </div>
    </div>
  );
}
