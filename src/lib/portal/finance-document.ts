import { formatPortalMoney, type PortalPreviewFinanceEstimate, type PortalPreviewFinanceInvoice, type PortalUiPreviewProfile } from "@/lib/portal/ui-preview";
import { siteConfig } from "@/lib/site-data";

export const FINANCE_A4 = {
  width: 1000,
  height: 1414,
  headerHeight: 340,
  padX: 42,
  cardWidth: 440,
  cardHeight: 185,
  cardGap: 36,
  summaryY: 585,
  summaryHeight: 88,
  tableY: 695,
  tableHeaderHeight: 44,
  footerHeight: 110,
  columns: {
    description: "51%",
    qty: "13%",
    unitPrice: "19%",
    amount: "17%",
  },
} as const;

export const FINANCE_A4_COLORS = {
  charcoal: "#1c1816",
  copper: "#c56a3a",
  copperDeep: "#b9471d",
  paper: "#ffffff",
  line: "#d8d0c6",
  muted: "#6b625a",
  ink: "#1f1a16",
  summaryBand: "#f4efe8",
} as const;

export const FINANCE_A4_COPY = {
  credentials: "LICENSED  •  BONDED  •  INSURED  •  CSIA CERTIFIED",
  tagline: "Safety. Craftsmanship. Integrity.",
} as const;

export type FinanceDocumentKind = "invoice" | "estimate";

export type FinanceDocumentView = {
  kind: FinanceDocumentKind;
  documentType: "INVOICE" | "ESTIMATE";
  documentNumber: string;
  numberCaption: string;
  issueDateCaption: string;
  issueDateLabel: string;
  dueDateCaption: string;
  dueDateLabel: string;
  status: string;
  jobNumber: string;
  brand: {
    phone: string;
    email: string;
    website: string;
    address: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    billingAddress: string;
  };
  serviceAddress: string;
  serviceSummary: string;
  lineItems: {
    description: string;
    quantity: string;
    unitPrice: string;
    amount: string;
  }[];
  subtotal: string;
  taxLabel: string;
  tax: string;
  total: string;
  payments: string;
  emphasizedLabel: string;
  emphasizedAmount: string;
  notes: string;
  paymentTerms: string;
};

function websiteHost() {
  try {
    return new URL(siteConfig.url).hostname.replace(/^www\./, "");
  } catch {
    return "phoenixfireplace.ca";
  }
}

function serviceAddressLine(profile: PortalUiPreviewProfile) {
  return `${profile.settings.serviceAddress}, ${profile.settings.cityLabel}`;
}

function taxLine(taxes: { label: string; amountCents: number }[]) {
  const first = taxes[0];
  return {
    label: first?.label ?? "Tax",
    amount: formatPortalMoney(first?.amountCents ?? 0),
  };
}

export function toInvoiceDocumentView(
  invoice: PortalPreviewFinanceInvoice,
  profile: PortalUiPreviewProfile,
): FinanceDocumentView {
  const tax = taxLine(invoice.taxes);

  return {
    kind: "invoice",
    documentType: "INVOICE",
    documentNumber: invoice.number,
    numberCaption: "Invoice #",
    issueDateCaption: "Issue Date",
    issueDateLabel: invoice.issueDateLabel,
    dueDateCaption: "Due Date",
    dueDateLabel: invoice.dueDateLabel,
    status: invoice.status,
    jobNumber: invoice.jobNumber,
    brand: {
      phone: siteConfig.phoneDisplay,
      email: siteConfig.email,
      website: websiteHost(),
      address: profile.finance.issuerAddress,
    },
    customer: {
      name: profile.displayName,
      email: profile.settings.email,
      phone: profile.settings.phone,
      billingAddress: serviceAddressLine(profile),
    },
    serviceAddress: serviceAddressLine(profile),
    serviceSummary: invoice.serviceSummary,
    lineItems: invoice.itemLines.map((line) => ({
      description: line.description,
      quantity: String(line.quantity),
      unitPrice: formatPortalMoney(line.rateCents),
      amount: formatPortalMoney(line.amountCents),
    })),
    subtotal: formatPortalMoney(invoice.subtotalCents),
    taxLabel: tax.label,
    tax: tax.amount,
    total: formatPortalMoney(invoice.totalCents),
    payments: `-${formatPortalMoney(invoice.amountPaidCents)}`,
    emphasizedLabel: "Remaining Balance",
    emphasizedAmount: formatPortalMoney(invoice.remainingBalanceCents),
    notes: invoice.notes,
    paymentTerms: invoice.paymentTerms,
  };
}

export function toEstimateDocumentView(
  estimate: PortalPreviewFinanceEstimate,
  profile: PortalUiPreviewProfile,
): FinanceDocumentView {
  const tax = taxLine(estimate.taxes);

  return {
    kind: "estimate",
    documentType: "ESTIMATE",
    documentNumber: estimate.number,
    numberCaption: "Estimate #",
    issueDateCaption: "Created",
    issueDateLabel: estimate.createdDateLabel,
    dueDateCaption: "Valid Until",
    dueDateLabel: estimate.dueDateLabel ?? estimate.createdDateLabel,
    status: estimate.status,
    jobNumber: estimate.jobNumber,
    brand: {
      phone: siteConfig.phoneDisplay,
      email: siteConfig.email,
      website: websiteHost(),
      address: profile.finance.issuerAddress,
    },
    customer: {
      name: profile.displayName,
      email: profile.settings.email,
      phone: profile.settings.phone,
      billingAddress: serviceAddressLine(profile),
    },
    serviceAddress: serviceAddressLine(profile),
    serviceSummary: estimate.serviceSummary,
    lineItems: estimate.itemLines.map((line) => ({
      description: line.description,
      quantity: String(line.quantity),
      unitPrice: formatPortalMoney(line.rateCents),
      amount: formatPortalMoney(line.amountCents),
    })),
    subtotal: formatPortalMoney(estimate.subtotalCents),
    taxLabel: tax.label,
    tax: tax.amount,
    total: formatPortalMoney(estimate.totalCents),
    payments: formatPortalMoney(0),
    emphasizedLabel: "Estimate Total",
    emphasizedAmount: formatPortalMoney(estimate.totalCents),
    notes: estimate.notes,
    paymentTerms: estimate.paymentTerms,
  };
}

export function pdfPointX(logicalX: number) {
  return (logicalX / FINANCE_A4.width) * 595.28;
}

export function pdfPointY(logicalY: number) {
  return (logicalY / FINANCE_A4.height) * 841.89;
}
