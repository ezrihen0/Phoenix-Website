/**
 * Isolated portal UI preview for layout work only.
 * Never import this from the WizField adapter. Never treat this as a live customer.
 */
export const PORTAL_UI_PREVIEW_NOTICE =
  "Layout preview — WizField is not connected. This is not a live customer record.";

export const PORTAL_PROFILE_TABS = [
  { id: "overview", label: "Overview", emptyLabel: "Overview" },
  { id: "jobs", label: "My Jobs", emptyLabel: "Jobs" },
  { id: "documents", label: "Documents", emptyLabel: "Documents" },
  { id: "appointments", label: "Appointments", emptyLabel: "Appointments" },
  { id: "finance", label: "Finance", emptyLabel: "Finance" },
  { id: "settings", label: "Settings", emptyLabel: "Settings" },
] as const;

export const PORTAL_DOCUMENT_FILTERS = [
  { id: "all", label: "All" },
  { id: "wett", label: "WETT" },
  { id: "inspection", label: "Inspection" },
  { id: "warranty", label: "Warranty" },
] as const;

export type PortalProfileTabId = (typeof PORTAL_PROFILE_TABS)[number]["id"];
export type PortalDocumentKind = Exclude<(typeof PORTAL_DOCUMENT_FILTERS)[number]["id"], "all">;

export type PortalPreviewActivityKind = "completed" | "scheduled" | "document";
export type PortalPreviewStatus = "Completed" | "Scheduled";
export type PortalJobCustomerStatus =
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Awaiting Action"
  | "Cancelled";

export type PortalPreviewActivity = {
  id: string;
  title: string;
  dateLabel: string;
  reference?: string;
  status?: PortalPreviewStatus;
  kind: PortalPreviewActivityKind;
};

export type PortalPreviewQuote = {
  summary: string;
  status: string;
};

export type PortalPreviewInvoice = {
  summary: string;
  status: string;
};

export type PortalPreviewPayment = {
  summary: string;
  dateLabel: string;
};

export type PortalPreviewInspection = {
  summary: string;
  status: string;
};

export type PortalPreviewPhoto = {
  src: string;
  alt: string;
};

export type PortalPreviewWarranty = {
  summary: string;
};

export type PortalPreviewJobDocument = {
  title: string;
  dateLabel: string;
  fileType: string;
};

export type PortalPreviewJob = {
  id: string;
  serviceTitle: string;
  jobNumber: string;
  dateLabel: string;
  status: PortalJobCustomerStatus;
  serviceAddress: string;
  thumbnailSrc?: string;
  quote?: PortalPreviewQuote;
  invoice?: PortalPreviewInvoice;
  payments?: PortalPreviewPayment[];
  inspection?: PortalPreviewInspection;
  photos?: PortalPreviewPhoto[];
  warranty?: PortalPreviewWarranty;
  documents?: PortalPreviewJobDocument[];
};

export type PortalPreviewHome = {
  serviceAddress: string;
  cityLabel: string;
};

export type PortalPreviewAppointment = {
  serviceTitle: string;
  dateLabel: string;
  windowLabel: string;
  jobNumber: string;
};

export type PortalPreviewVisit = {
  id: string;
  jobId: string;
  serviceTitle: string;
  dateLabel: string;
  windowLabel: string;
  address: string;
  jobNumber: string;
  status: PortalJobCustomerStatus;
  timing: "upcoming" | "past";
};

export type PortalPreviewLibraryDocument = {
  id: string;
  title: string;
  kind: PortalDocumentKind;
  jobId: string;
  jobNumber: string;
  dateLabel: string;
  fileType: string;
};

export type PortalPreviewSettings = {
  displayName: string;
  email: string;
  phone: string;
  serviceAddress: string;
  cityLabel: string;
  preferredContact: string;
  notifications: string;
  accessNote: string;
};

export type PortalInvoiceCustomerStatus = "Due" | "Partially Paid" | "Paid";
export type PortalEstimateCustomerStatus = "Pending Review" | "Sent" | "Accepted" | "Declined" | "Expired";

export type PortalPreviewFinanceLine = {
  description: string;
  quantity: number;
  rateCents: number;
  amountCents: number;
};

export type PortalPreviewFinanceTax = {
  label: string;
  amountCents: number;
};

export type PortalPreviewFinanceDocument = {
  title: string;
  dateLabel: string;
  fileType: string;
  href?: string;
};

export type PortalPreviewFinanceInvoice = {
  id: string;
  number: string;
  jobId: string;
  jobNumber: string;
  serviceTitle: string;
  serviceSummary: string;
  issueDateLabel: string;
  dueDateLabel: string;
  serviceDateLabel?: string;
  status: PortalInvoiceCustomerStatus;
  itemLines: PortalPreviewFinanceLine[];
  subtotalCents: number;
  taxes: PortalPreviewFinanceTax[];
  totalCents: number;
  amountPaidCents: number;
  remainingBalanceCents: number;
  notes: string;
  paymentTerms: string;
  documents: PortalPreviewFinanceDocument[];
};

export type PortalPreviewFinanceEstimate = {
  id: string;
  number: string;
  jobId: string;
  jobNumber: string;
  serviceTitle: string;
  serviceSummary: string;
  createdDateLabel: string;
  dueDateLabel?: string;
  status: PortalEstimateCustomerStatus;
  itemLines: PortalPreviewFinanceLine[];
  subtotalCents: number;
  taxes: PortalPreviewFinanceTax[];
  totalCents: number;
  notes: string;
  paymentTerms: string;
  documents: PortalPreviewFinanceDocument[];
};

export type PortalPreviewFinancePayment = {
  id: string;
  dateLabel: string;
  typeLabel: string;
  description: string;
  invoiceId?: string;
  invoiceNumber?: string;
  jobId: string;
  jobNumber: string;
  amountCents: number;
};

export type PortalPreviewFinanceSummary = {
  openInvoiceCount: number;
  openInvoiceAmountCents: number;
  pendingEstimateCount: number;
  pendingEstimateAmountCents: number;
  totalBalanceCents: number;
  remainingBalanceCents: number;
  lastPayment: { dateLabel: string; amountCents: number } | null;
  nextDueDateLabel?: string;
  recentEstimateNumber?: string;
};

export type PortalPreviewFinance = {
  issuerAddress: string;
  summary: PortalPreviewFinanceSummary;
  invoices: PortalPreviewFinanceInvoice[];
  estimates: PortalPreviewFinanceEstimate[];
  payments: PortalPreviewFinancePayment[];
};

export type PortalFinanceSelection =
  | { kind: "invoice"; id: string }
  | { kind: "estimate"; id: string };

export type PortalUiPreviewProfile = {
  displayName: string;
  customerType: "Homeowner";
  cityLabel: string;
  initials: string;
  coverImageSrc: string;
  coverImageAlt: string;
  metrics: {
    visits: number;
    activeJobs: number;
    documents: number;
  };
  activity: PortalPreviewActivity[];
  jobs: PortalPreviewJob[];
  documents: PortalPreviewLibraryDocument[];
  appointments: PortalPreviewVisit[];
  home: PortalPreviewHome;
  nextAppointment: PortalPreviewAppointment;
  settings: PortalPreviewSettings;
  finance: PortalPreviewFinance;
};

const SERVICE_ADDRESS = "1428 32 Ave SW, Calgary, Alberta";

export const portalUiPreviewProfile: PortalUiPreviewProfile = {
  displayName: "Alex Johnson",
  customerType: "Homeowner",
  cityLabel: "Calgary, Alberta",
  initials: "AJ",
  coverImageSrc: "/images/photos/hero-city-home.jpg",
  coverImageAlt: "Fireplace in a home living room",
  metrics: {
    visits: 3,
    activeJobs: 2,
    documents: 2,
  },
  activity: [
    {
      id: "act-wett-complete",
      title: "WETT Inspection completed",
      dateLabel: "May 12, 2026",
      reference: "Job #PHX-250512",
      status: "Completed",
      kind: "completed",
    },
    {
      id: "act-sweep-scheduled",
      title: "Chimney Cleaning scheduled",
      dateLabel: "May 20, 2026",
      reference: "Job #PHX-250508",
      status: "Scheduled",
      kind: "scheduled",
    },
    {
      id: "act-report-uploaded",
      title: "Inspection report uploaded",
      dateLabel: "May 12, 2026",
      reference: "WETT Inspection Report",
      kind: "document",
    },
  ],
  jobs: [
    {
      id: "job-repair",
      serviceTitle: "Gas Fireplace Repair",
      jobNumber: "Job #PHX-250518",
      dateLabel: "May 18, 2026",
      status: "In Progress",
      serviceAddress: SERVICE_ADDRESS,
      thumbnailSrc: "/images/photos/gallery-04.jpeg",
    },
    {
      id: "job-sweep",
      serviceTitle: "Chimney Cleaning",
      jobNumber: "Job #PHX-250508",
      dateLabel: "May 20, 2026",
      status: "Scheduled",
      serviceAddress: SERVICE_ADDRESS,
      thumbnailSrc: "/images/photos/gallery-02.jpeg",
    },
    {
      id: "job-wett",
      serviceTitle: "WETT Inspection",
      jobNumber: "Job #PHX-250512",
      dateLabel: "May 12, 2026",
      status: "Completed",
      serviceAddress: SERVICE_ADDRESS,
      thumbnailSrc: "/images/photos/gallery-01.jpg",
      inspection: {
        summary: "Documentation-focused inspection, venting check, and appliance safety review.",
        status: "Completed",
      },
      photos: [
        { src: "/images/photos/gallery-01.jpg", alt: "Fireplace after inspection" },
        { src: "/images/photos/gallery-03.jpeg", alt: "Chimney exterior" },
      ],
      documents: [{ title: "WETT Inspection Report", dateLabel: "May 12, 2026", fileType: "PDF" }],
      warranty: { summary: "Workmanship coverage for the completed inspection visit." },
    },
    {
      id: "job-gas",
      serviceTitle: "Gas Fireplace Service",
      jobNumber: "Job #PHX-250430",
      dateLabel: "April 30, 2026",
      status: "Completed",
      serviceAddress: SERVICE_ADDRESS,
      thumbnailSrc: "/images/photos/gallery-03.jpeg",
      quote: { summary: "Annual service visit with cleaning and safety check.", status: "Accepted" },
      invoice: { summary: "Visit closed and billed to the homeowner.", status: "Paid" },
      payments: [{ summary: "Payment received", dateLabel: "May 1, 2026" }],
    },
  ],
  documents: [
    {
      id: "doc-wett",
      title: "WETT Inspection Report",
      kind: "wett",
      jobId: "job-wett",
      jobNumber: "Job #PHX-250512",
      dateLabel: "May 12, 2026",
      fileType: "PDF",
    },
    {
      id: "doc-inspection",
      title: "Inspection notes",
      kind: "inspection",
      jobId: "job-wett",
      jobNumber: "Job #PHX-250512",
      dateLabel: "May 12, 2026",
      fileType: "PDF",
    },
  ],
  appointments: [
    {
      id: "visit-sweep",
      jobId: "job-sweep",
      serviceTitle: "Chimney Cleaning",
      dateLabel: "May 20, 2026",
      windowLabel: "9:00 AM – 12:00 PM",
      address: SERVICE_ADDRESS,
      jobNumber: "Job #PHX-250508",
      status: "Scheduled",
      timing: "upcoming",
    },
    {
      id: "visit-repair",
      jobId: "job-repair",
      serviceTitle: "Gas Fireplace Repair",
      dateLabel: "May 18, 2026",
      windowLabel: "1:00 PM – 4:00 PM",
      address: SERVICE_ADDRESS,
      jobNumber: "Job #PHX-250518",
      status: "In Progress",
      timing: "upcoming",
    },
    {
      id: "visit-wett",
      jobId: "job-wett",
      serviceTitle: "WETT Inspection",
      dateLabel: "May 12, 2026",
      windowLabel: "10:00 AM – 12:00 PM",
      address: SERVICE_ADDRESS,
      jobNumber: "Job #PHX-250512",
      status: "Completed",
      timing: "past",
    },
  ],
  home: {
    serviceAddress: "1428 32 Ave SW",
    cityLabel: "Calgary, Alberta",
  },
  nextAppointment: {
    serviceTitle: "Chimney Cleaning",
    dateLabel: "May 20, 2026",
    windowLabel: "9:00 AM – 12:00 PM",
    jobNumber: "Job #PHX-250508",
  },
  settings: {
    displayName: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "(403) 555-0148",
    serviceAddress: "1428 32 Ave SW",
    cityLabel: "Calgary, Alberta",
    preferredContact: "Phone",
    notifications: "Visit reminders and document notices",
    accessNote:
      "Portal sign-in uses a magic link sent to the email on your Phoenix job. Editing these details will be available after account integration.",
  },
  finance: {
    issuerAddress: "Calgary, Alberta",
    summary: {
      openInvoiceCount: 2,
      openInvoiceAmountCents: 148500,
      pendingEstimateCount: 1,
      pendingEstimateAmountCents: 95000,
      totalBalanceCents: 206500,
      remainingBalanceCents: 148500,
      lastPayment: { dateLabel: "May 18, 2026", amountCents: 58000 },
      nextDueDateLabel: "May 22, 2026",
      recentEstimateNumber: "EST-250610",
    },
    invoices: [
      {
        id: "inv-250553",
        number: "INV-250553",
        jobId: "job-repair",
        jobNumber: "Job #PHX-250518",
        serviceTitle: "Fireplace Crown Repair",
        serviceSummary: "Crown repair, masonry material, and cap replacement for the gas fireplace chimney.",
        issueDateLabel: "May 16, 2026",
        dueDateLabel: "May 30, 2026",
        serviceDateLabel: "May 18, 2026",
        status: "Partially Paid",
        itemLines: [
          { description: "Diagnostic Visit & Assessment", quantity: 1, rateCents: 18500, amountCents: 18500 },
          { description: "Chimney Crown Repair — Labor", quantity: 8, rateCents: 7500, amountCents: 60000 },
          { description: "Crown / masonry material", quantity: 1, rateCents: 16400, amountCents: 16400 },
          { description: "Chimney cap", quantity: 1, rateCents: 7000, amountCents: 7000 },
        ],
        subtotalCents: 101900,
        taxes: [{ label: "GST", amountCents: 5100 }],
        totalCents: 107000,
        amountPaidCents: 58000,
        remainingBalanceCents: 49000,
        notes: "Work completed at the service address on file. Remaining balance is due on the date shown.",
        paymentTerms: "Payment due within 14 days of issue.",
        documents: [{ title: "Invoice INV-250553", dateLabel: "May 16, 2026", fileType: "PDF" }],
      },
      {
        id: "inv-250612",
        number: "INV-250612",
        jobId: "job-sweep",
        jobNumber: "Job #PHX-250508",
        serviceTitle: "Chimney Cleaning",
        serviceSummary: "Sweep, camera inspection, and creosote treatment for the scheduled cleaning visit.",
        issueDateLabel: "May 8, 2026",
        dueDateLabel: "May 22, 2026",
        serviceDateLabel: "May 20, 2026",
        status: "Due",
        itemLines: [
          { description: "Chimney sweeping", quantity: 1, rateCents: 40000, amountCents: 40000 },
          { description: "Camera inspection", quantity: 1, rateCents: 28000, amountCents: 28000 },
          { description: "Travel", quantity: 1, rateCents: 15000, amountCents: 15000 },
          { description: "Creosote treatment", quantity: 1, rateCents: 12000, amountCents: 12000 },
        ],
        subtotalCents: 95000,
        taxes: [{ label: "GST", amountCents: 4500 }],
        totalCents: 99500,
        amountPaidCents: 0,
        remainingBalanceCents: 99500,
        notes: "Invoice issued ahead of the scheduled chimney cleaning visit.",
        paymentTerms: "Payment due within 14 days of issue.",
        documents: [{ title: "Invoice INV-250612", dateLabel: "May 8, 2026", fileType: "PDF" }],
      },
      {
        id: "inv-250401",
        number: "INV-250401",
        jobId: "job-gas",
        jobNumber: "Job #PHX-250430",
        serviceTitle: "Gas Fireplace Service",
        serviceSummary: "Annual gas fireplace service visit with cleaning and safety check.",
        issueDateLabel: "April 30, 2026",
        dueDateLabel: "May 14, 2026",
        serviceDateLabel: "April 30, 2026",
        status: "Paid",
        itemLines: [{ description: "Annual gas fireplace service", quantity: 1, rateCents: 47620, amountCents: 47620 }],
        subtotalCents: 47620,
        taxes: [{ label: "GST", amountCents: 2380 }],
        totalCents: 50000,
        amountPaidCents: 50000,
        remainingBalanceCents: 0,
        notes: "This visit is paid in full. Thank you.",
        paymentTerms: "Payment due within 14 days of issue.",
        documents: [{ title: "Invoice INV-250401", dateLabel: "April 30, 2026", fileType: "PDF" }],
      },
    ],
    estimates: [
      {
        id: "est-250620",
        number: "EST-250620",
        jobId: "job-sweep",
        jobNumber: "Job #PHX-250508",
        serviceTitle: "Chimney Cleaning",
        serviceSummary: "Proposed chimney cleaning and cap upgrade for the scheduled visit.",
        createdDateLabel: "May 6, 2026",
        dueDateLabel: "May 20, 2026",
        status: "Pending Review",
        itemLines: [
          { description: "Chimney Cleaning", quantity: 1, rateCents: 65000, amountCents: 65000 },
          { description: "Cap upgrade", quantity: 1, rateCents: 25500, amountCents: 25500 },
        ],
        subtotalCents: 90500,
        taxes: [{ label: "GST", amountCents: 4500 }],
        totalCents: 95000,
        notes: "This estimate is for review only. No payment is requested until an invoice is issued.",
        paymentTerms: "Estimate is valid for 30 days.",
        documents: [{ title: "Estimate EST-250620", dateLabel: "May 6, 2026", fileType: "PDF" }],
      },
      {
        id: "est-250610",
        number: "EST-250610",
        jobId: "job-wett",
        jobNumber: "Job #PHX-250512",
        serviceTitle: "WETT Inspection",
        serviceSummary: "Documentation-focused WETT inspection and reporting package.",
        createdDateLabel: "May 2, 2026",
        dueDateLabel: "May 16, 2026",
        status: "Accepted",
        itemLines: [
          { description: "WETT Inspection", quantity: 1, rateCents: 28000, amountCents: 28000 },
          { description: "Documentation package", quantity: 1, rateCents: 9500, amountCents: 9500 },
        ],
        subtotalCents: 37500,
        taxes: [{ label: "GST", amountCents: 1875 }],
        totalCents: 39375,
        notes: "This estimate was accepted. The related inspection visit is on file.",
        paymentTerms: "Estimate is valid for 30 days.",
        documents: [
          { title: "Estimate EST-250610", dateLabel: "May 2, 2026", fileType: "PDF" },
          { title: "WETT Inspection Report", dateLabel: "May 12, 2026", fileType: "PDF" },
        ],
      },
    ],
    payments: [
      {
        id: "pay-250553",
        dateLabel: "May 18, 2026",
        typeLabel: "Payment",
        description: "Payment received",
        invoiceId: "inv-250553",
        invoiceNumber: "INV-250553",
        jobId: "job-repair",
        jobNumber: "Job #PHX-250518",
        amountCents: 58000,
      },
      {
        id: "pay-250401",
        dateLabel: "May 1, 2026",
        typeLabel: "Payment",
        description: "Payment received",
        invoiceId: "inv-250401",
        invoiceNumber: "INV-250401",
        jobId: "job-gas",
        jobNumber: "Job #PHX-250430",
        amountCents: 50000,
      },
    ],
  },
};

export function parsePortalProfileTab(value?: string | string[] | null): PortalProfileTabId {
  const tab = Array.isArray(value) ? value[0] : value;

  return PORTAL_PROFILE_TABS.some((item) => item.id === tab) ? (tab as PortalProfileTabId) : "overview";
}

export function parsePortalJobId(value: string | string[] | null | undefined, jobs: PortalPreviewJob[]) {
  const id = Array.isArray(value) ? value[0] : value;
  if (!id) {
    return null;
  }

  return jobs.some((job) => job.id === id) ? id : null;
}

export function portalJobHref(jobId: string) {
  return `/portal?tab=jobs&job=${encodeURIComponent(jobId)}`;
}

export function portalInvoiceHref(invoiceId: string) {
  return `/portal?tab=finance&invoice=${encodeURIComponent(invoiceId)}`;
}

export function portalEstimateHref(estimateId: string) {
  return `/portal?tab=finance&estimate=${encodeURIComponent(estimateId)}`;
}

export function portalFinancePdfHref(kind: "invoice" | "estimate", id: string) {
  return `/portal/finance/pdf?${kind}=${encodeURIComponent(id)}`;
}

export function portalFinancePdfFilename(kind: "invoice" | "estimate", number: string) {
  return `${kind}-${number}.pdf`;
}

export function parsePortalInvoiceId(
  value: string | string[] | null | undefined,
  invoices: PortalPreviewFinanceInvoice[],
) {
  const id = Array.isArray(value) ? value[0] : value;
  if (!id) {
    return null;
  }

  return invoices.some((invoice) => invoice.id === id) ? id : null;
}

export function parsePortalEstimateId(
  value: string | string[] | null | undefined,
  estimates: PortalPreviewFinanceEstimate[],
) {
  const id = Array.isArray(value) ? value[0] : value;
  if (!id) {
    return null;
  }

  return estimates.some((estimate) => estimate.id === id) ? id : null;
}

export function parsePortalFinanceSelection(
  invoiceValue: string | string[] | null | undefined,
  estimateValue: string | string[] | null | undefined,
  finance: PortalPreviewFinance,
): PortalFinanceSelection | null {
  const invoiceId = parsePortalInvoiceId(invoiceValue, finance.invoices);
  if (invoiceId) {
    return { kind: "invoice", id: invoiceId };
  }

  const estimateId = parsePortalEstimateId(estimateValue, finance.estimates);
  if (estimateId) {
    return { kind: "estimate", id: estimateId };
  }

  return null;
}

export function formatPortalMoney(cents: number) {
  const amount = (cents / 100).toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  });

  return amount;
}

export function groupPreviewJobs(jobs: PortalPreviewJob[]) {
  return {
    active: jobs.filter((job) => job.status === "In Progress" || job.status === "Awaiting Action"),
    upcoming: jobs.filter((job) => job.status === "Scheduled"),
    completed: jobs.filter((job) => job.status === "Completed" || job.status === "Cancelled"),
  };
}

export function jobStatusClass(status: PortalJobCustomerStatus) {
  if (status === "Completed") {
    return "bg-[rgba(34,90,58,0.12)] text-[#2a5a3a]";
  }

  if (status === "Scheduled" || status === "In Progress" || status === "Awaiting Action") {
    return "bg-[rgba(185,71,29,0.12)] text-[var(--color-ember-dark)]";
  }

  return "bg-[rgba(90,108,122,0.12)] text-[#4d5d6b]";
}

export function invoiceStatusClass(status: PortalInvoiceCustomerStatus) {
  if (status === "Paid") {
    return "bg-[rgba(34,90,58,0.12)] text-[#2a5a3a]";
  }

  if (status === "Partially Paid") {
    return "bg-[rgba(185,71,29,0.12)] text-[var(--color-ember-dark)]";
  }

  return "bg-[rgba(201,95,43,0.12)] text-[#8a4b1f]";
}

export function estimateStatusClass(status: PortalEstimateCustomerStatus) {
  if (status === "Accepted") {
    return "bg-[rgba(34,90,58,0.12)] text-[#2a5a3a]";
  }

  if (status === "Pending Review" || status === "Sent") {
    return "bg-[rgba(185,71,29,0.12)] text-[var(--color-ember-dark)]";
  }

  return "bg-[rgba(90,108,122,0.12)] text-[#4d5d6b]";
}
