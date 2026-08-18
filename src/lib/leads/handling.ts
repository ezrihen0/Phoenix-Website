import {
  formatSiteDateTime,
  formatSiteTime,
  SITE_TIMEZONE,
} from "@/lib/datetime";
import type {
  Lead,
  LeadDisposition,
  LeadDispositionReason,
  LeadSource,
} from "@/lib/cms/types";

export const LEAD_DISPOSITION_REASONS: Array<{
  value: LeadDispositionReason;
  label: string;
}> = [
  { value: "customer-no-response", label: "Customer did not respond" },
  { value: "customer-declined", label: "Customer declined / did not proceed" },
  { value: "service-not-accepted", label: "Service not accepted / not a job we can take" },
];

export type LeadSlaTier = "normal" | "attention" | "slow" | "overdue";

export function getLeadDisposition(lead: Pick<Lead, "disposition">): LeadDisposition {
  if (
    lead.disposition === "added-to-calendar" ||
    lead.disposition === "not-added" ||
    lead.disposition === "pending"
  ) {
    return lead.disposition;
  }

  return "pending";
}

export function isLeadHandled(lead: Pick<Lead, "handledAt" | "disposition">): boolean {
  return Boolean(lead.handledAt) || getLeadDisposition(lead) !== "pending";
}

export function getLeadDispositionReasonLabel(reason?: LeadDispositionReason): string | null {
  return LEAD_DISPOSITION_REASONS.find((entry) => entry.value === reason)?.label || null;
}

export function getLeadDispositionLabel(disposition: LeadDisposition): string {
  switch (disposition) {
    case "added-to-calendar":
      return "Added to Calendar";
    case "not-added":
      return "Not Added";
    default:
      return "Pending";
  }
}

export function getLeadSourceLabel(source: LeadSource): string {
  return source === "website" ? "Website" : "Contact form";
}

export function getLeadDomainLabel(lead: Pick<Lead, "source" | "sourceUrl">): string {
  if (lead.source === "contact-form") {
    return "Contact form";
  }

  if (!lead.sourceUrl) {
    return "Website";
  }

  try {
    return new URL(lead.sourceUrl).hostname.replace(/^www\./, "");
  } catch {
    return "Website";
  }
}

export function getElapsedMinutes(fromIso: string, toDate: Date = new Date()): number {
  const from = new Date(fromIso).getTime();
  const to = toDate.getTime();

  if (!Number.isFinite(from) || !Number.isFinite(to) || to <= from) {
    return 0;
  }

  return Math.floor((to - from) / (1000 * 60));
}

export function formatDurationMinutes(totalMinutes: number): string {
  if (totalMinutes < 1) {
    return "< 1 min";
  }

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

export function getLeadSlaTier(elapsedMinutes: number): LeadSlaTier {
  if (elapsedMinutes <= 30) {
    return "normal";
  }

  if (elapsedMinutes <= 60) {
    return "attention";
  }

  if (elapsedMinutes <= 120) {
    return "slow";
  }

  return "overdue";
}

export function getLeadSlaClasses(tier: LeadSlaTier): string {
  switch (tier) {
    case "normal":
      return "bg-emerald-50 text-emerald-800";
    case "attention":
      return "bg-amber-50 text-amber-800";
    case "slow":
      return "bg-orange-50 text-orange-800";
    case "overdue":
      return "bg-red-50 text-red-800";
  }
}

export function formatLeadDateTime(value: string): string {
  return formatSiteDateTime(value, { showTimeZone: true });
}

export function formatLeadTime(value: string): string {
  return formatSiteTime(value, { showTimeZone: true });
}

export { SITE_TIMEZONE };

export function getLeadHandlingTimeMinutes(lead: Pick<Lead, "createdAt" | "handledAt">): number | null {
  if (!lead.handledAt) {
    return null;
  }

  return getElapsedMinutes(lead.createdAt, new Date(lead.handledAt));
}

export function getMedianHandlingTimeMinutes(
  leads: Array<Pick<Lead, "createdAt" | "handledAt">>,
): number | null {
  const values = leads
    .map((lead) => getLeadHandlingTimeMinutes(lead))
    .filter((value): value is number => value != null)
    .sort((left, right) => left - right);

  if (!values.length) {
    return null;
  }

  const middle = Math.floor(values.length / 2);

  if (values.length % 2 === 0) {
    return Math.round((values[middle - 1]! + values[middle]!) / 2);
  }

  return values[middle]!;
}

export type LeadInboxSummary = {
  total: number;
  pending: number;
  addedToCalendar: number;
  notAdded: number;
  medianHandlingMinutes: number | null;
};

export function summarizeLeads(leads: Lead[]): LeadInboxSummary {
  const summary: LeadInboxSummary = {
    total: leads.length,
    pending: 0,
    addedToCalendar: 0,
    notAdded: 0,
    medianHandlingMinutes: getMedianHandlingTimeMinutes(leads),
  };

  for (const lead of leads) {
    const disposition = getLeadDisposition(lead);

    if (disposition === "added-to-calendar") {
      summary.addedToCalendar += 1;
    } else if (disposition === "not-added") {
      summary.notAdded += 1;
    } else {
      summary.pending += 1;
    }
  }

  return summary;
}
