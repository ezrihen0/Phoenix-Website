"use client";

import { useState, useTransition, type ReactNode } from "react";
import { CalendarCheck, CalendarX, ChevronDown, Mail, Phone } from "lucide-react";

import {
  markLeadAddedToCalendarAction,
  markLeadNotAddedAction,
} from "@/app/admin/lead-actions";
import { LeadDispositionDialog } from "@/components/admin/lead-disposition-dialog";
import type { Lead, LeadDisposition, LeadDispositionReason } from "@/lib/cms/types";
import { formatSiteDateTime } from "@/lib/datetime";
import {
  formatLeadDateTime,
  getLeadDisposition,
  getLeadDispositionLabel,
  getLeadSourceLabel,
  isLeadHandled,
} from "@/lib/leads/handling";
import { formatServiceAddress } from "@/lib/request-service";

type LeadCardProps = {
  lead: Lead;
  expanded: boolean;
  onToggle: () => void;
};

export function LeadCard({ lead, expanded, onToggle }: LeadCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const disposition = getLeadDisposition(lead);
  const handled = isLeadHandled(lead);
  const fullName = `${lead.firstName} ${lead.lastName}`.trim();
  const fullAddress = formatServiceAddress(lead) || lead.address?.trim() || "Not provided";
  const receivedLabel = formatLeadDateTime(lead.createdAt);
  const scanDate = formatSiteDateTime(lead.createdAt);
  const statusLabel = getLeadDispositionLabel(disposition);

  function handleAddedToCalendar() {
    setErrorMessage(null);

    startTransition(async () => {
      const result = await markLeadAddedToCalendarAction(lead.id);

      if (!result.ok) {
        setErrorMessage(result.message);
      }
    });
  }

  function handleNotAdded(payload: {
    dispositionReason: LeadDispositionReason;
    officeNote?: string;
  }) {
    setErrorMessage(null);

    startTransition(async () => {
      const result = await markLeadNotAddedAction({
        leadId: lead.id,
        dispositionReason: payload.dispositionReason,
        officeNote: payload.officeNote,
      });

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      setIsDialogOpen(false);
    });
  }

  return (
    <>
      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex w-full min-w-0 items-start gap-3 p-3 text-left transition hover:bg-white/50 sm:p-4 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.1fr)_auto] lg:items-center lg:gap-4"
        >
          <ChevronDown
            className={`mt-0.5 h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform lg:mt-0 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-2 lg:contents">
            <ScanCell label="Name" value={fullName} className="font-semibold text-[var(--color-ink)]" />
            <ScanCell label="Phone" value={lead.phone} />
            <ScanCell label="Service" value={lead.service} truncate />
            <ScanCell label="Date" value={scanDate} />
            <div className="flex min-w-0 items-center lg:justify-end">
              <StatusBadge disposition={disposition} label={statusLabel} />
            </div>
          </div>
        </button>

        {expanded ? (
          <div className="border-t border-[var(--color-border)] px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <DetailField label="Full Name" value={fullName} />
              <DetailField label="Calendar Status" value={statusLabel} />
              <DetailField label="Full Address" value={fullAddress} className="sm:col-span-2" />
              <DetailField
                label="Phone"
                value={
                  <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 font-semibold text-[var(--color-ink)] underline-offset-2 hover:underline">
                    <Phone className="h-4 w-4 shrink-0 text-[var(--color-ember)]" />
                    {lead.phone}
                  </a>
                }
              />
              <DetailField
                label="Email"
                value={
                  <a href={`mailto:${lead.email}`} className="inline-flex min-w-0 items-center gap-2 break-all font-semibold text-[var(--color-ink)] underline-offset-2 hover:underline">
                    <Mail className="h-4 w-4 shrink-0 text-[var(--color-ember)]" />
                    {lead.email}
                  </a>
                }
              />
              <DetailField label="Source" value={getLeadSourceLabel(lead.source)} />
              <DetailField label="Requested Service" value={lead.service} />
              <DetailField label="Lead Received Date" value={receivedLabel} className="sm:col-span-2" />
            </dl>

            {errorMessage ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {errorMessage}
              </p>
            ) : null}

            {!handled ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button
                  type="button"
                  onClick={handleAddedToCalendar}
                  disabled={isPending}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Added to Calendar
                </button>
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={isPending}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <CalendarX className="h-4 w-4" />
                  Not Added to Calendar
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </article>

      <LeadDispositionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleNotAdded}
        isPending={isPending}
      />
    </>
  );
}

function ScanCell({
  label,
  value,
  className,
  truncate,
}: {
  label: string;
  value: string;
  className?: string;
  truncate?: boolean;
}) {
  return (
    <div className="min-w-0 lg:block">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] lg:sr-only">
        {label}
      </p>
      <p
        className={`text-sm text-[var(--color-ink)] ${truncate ? "truncate" : "break-words"} ${className ?? ""}`}
        title={truncate ? value : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function DetailField({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className ?? ""}`}>
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">{label}</dt>
      <dd className="mt-1 break-words text-sm text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

function StatusBadge({ disposition, label }: { disposition: LeadDisposition; label: string }) {
  const classes =
    disposition === "added-to-calendar"
      ? "bg-emerald-50 text-emerald-800"
      : disposition === "not-added"
        ? "bg-red-50 text-red-800"
        : "bg-amber-50 text-amber-900";

  return (
    <span className={`inline-flex max-w-full items-center rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}>
      <span className="truncate">{label}</span>
    </span>
  );
}
