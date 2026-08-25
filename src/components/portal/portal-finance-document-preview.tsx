import Link from "next/link";
import { ArrowLeft, Download, FileText } from "lucide-react";

import { toEstimateDocumentView, toInvoiceDocumentView } from "@/lib/portal/finance-document";
import {
  portalFinancePdfHref,
  type PortalPreviewFinance,
  type PortalPreviewFinanceDocument,
  type PortalUiPreviewProfile,
} from "@/lib/portal/ui-preview";

import { PortalFinanceA4Page } from "./portal-finance-a4-page";

type PortalFinanceDocumentPreviewProps = {
  profile: PortalUiPreviewProfile;
  finance: PortalPreviewFinance;
  invoiceId?: string | null;
  estimateId?: string | null;
};

function RelatedDocuments({ documents }: { documents: PortalPreviewFinanceDocument[] }) {
  if (documents.length === 0) {
    return null;
  }

  return (
    <section className="mt-4">
      <h3 className="text-sm font-semibold text-[var(--color-ink)]">Documents</h3>
      <ul className="mt-3 grid gap-2">
        {documents.map((document) => (
          <li key={document.title} className="flex items-start gap-3 text-sm">
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted)]" aria-hidden="true" />
            <div>
              <p className="font-medium text-[var(--color-ink)]">{document.title}</p>
              <p className="text-[var(--color-muted)]">
                {document.dateLabel} · {document.fileType}
              </p>
              {document.href ? (
                <a
                  href={document.href}
                  className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-ember)] underline-offset-4 hover:underline"
                >
                  View
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PortalFinanceDocumentPreview({
  profile,
  finance,
  invoiceId,
  estimateId,
}: PortalFinanceDocumentPreviewProps) {
  const invoice = invoiceId ? finance.invoices.find((item) => item.id === invoiceId) : undefined;
  const estimate = !invoice && estimateId ? finance.estimates.find((item) => item.id === estimateId) : undefined;
  const document = invoice
    ? toInvoiceDocumentView(invoice, profile)
    : estimate
      ? toEstimateDocumentView(estimate, profile)
      : null;
  const pdfHref = invoice
    ? portalFinancePdfHref("invoice", invoice.id)
    : estimate
      ? portalFinancePdfHref("estimate", estimate.id)
      : null;

  if (!document || !pdfHref) {
    return (
      <aside className="hidden rounded-[1.75rem] border border-dashed border-[var(--color-border)] bg-white/70 px-5 py-10 text-center text-sm leading-7 text-[var(--color-muted)] lg:block">
        Select an invoice or estimate.
      </aside>
    );
  }

  return (
    <div className="min-w-0">
      <Link
        href="/portal?tab=finance"
        scroll={false}
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--color-ember)] lg:hidden"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to Finance
      </Link>
      <div className="overflow-x-auto">
        <PortalFinanceA4Page document={document} />
      </div>
      <RelatedDocuments documents={(invoice ?? estimate)?.documents ?? []} />
      <a
        href={pdfHref}
        className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ember)] px-5 text-sm font-semibold text-white"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Generate PDF
      </a>
    </div>
  );
}
