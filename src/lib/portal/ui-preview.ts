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
  { id: "messages", label: "Messages", emptyLabel: "Messages" },
  { id: "settings", label: "Settings", emptyLabel: "Settings" },
] as const;

export const PORTAL_DOCUMENT_FILTERS = [
  { id: "all", label: "All" },
  { id: "wett", label: "WETT" },
  { id: "inspection", label: "Inspection" },
  { id: "quote", label: "Quotes" },
  { id: "invoice", label: "Invoices" },
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
    documents: 4,
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
    {
      id: "doc-quote",
      title: "Service quote",
      kind: "quote",
      jobId: "job-gas",
      jobNumber: "Job #PHX-250430",
      dateLabel: "April 28, 2026",
      fileType: "PDF",
    },
    {
      id: "doc-invoice",
      title: "Visit invoice",
      kind: "invoice",
      jobId: "job-gas",
      jobNumber: "Job #PHX-250430",
      dateLabel: "May 1, 2026",
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
