/**
 * Stable Phoenix Portal API contract.
 * Job-centric. There is no Property entity — do not invent one.
 * Internal notes, staff records, and cost data must never appear on these types.
 */

export type PortalConnectionStatus = {
  connected: boolean;
  provider: "wizfield";
  status: "deferred" | "preparing" | "connected";
  message: string;
};

export type PortalSession = {
  token: string;
  expiresAt: string;
  issuedAt: string;
  customerId: string;
  organizationId: string;
};

export type PortalCustomer = {
  id: string;
  organizationId: string;
  displayName: string;
  email?: string;
  phone?: string;
  serviceAddress?: string;
};

export type PortalJob = {
  id: string;
  customerId: string;
  status: string;
  scheduledWindow?: string;
  serviceSummary?: string;
};

export type PortalQuote = {
  id: string;
  jobId: string;
  status: string;
  summary?: string;
};

export type PortalInvoice = {
  id: string;
  jobId: string;
  status: string;
  summary?: string;
};

export type PortalInspection = {
  id: string;
  customerId: string;
  jobId?: string;
  status: string;
  summary?: string;
};

export type PortalWarranty = {
  id: string;
  customerId: string;
  jobId?: string;
  status: string;
  summary?: string;
};

export type PortalFileRef = {
  id: string;
  kind: "document" | "photo";
  label: string;
  href: string;
};

export type PortalCustomerSnapshot = {
  customer: PortalCustomer;
  jobs: PortalJob[];
  quotes: PortalQuote[];
  invoices: PortalInvoice[];
  inspections: PortalInspection[];
  warranties: PortalWarranty[];
  files: PortalFileRef[];
};
