"use client";

import { useState, useTransition } from "react";
import { CalendarCheck, CalendarX, Mail, Phone, Send, ShieldCheck } from "lucide-react";

import {
  markLeadAddedToCalendarAction,
  markLeadNotAddedAction,
} from "@/app/admin/lead-actions";
import { LeadDispositionDialog } from "@/components/admin/lead-disposition-dialog";
import type { Lead, LeadDispositionReason } from "@/lib/cms/types";
import { formatServiceAddressLines } from "@/lib/request-service";
import {
  formatDurationMinutes,
  formatLeadDateTime,
  formatLeadTime,
  getElapsedMinutes,
  getLeadDisposition,
  getLeadDispositionLabel,
  getLeadDispositionReasonLabel,
  getLeadDomainLabel,
  getLeadHandlingTimeMinutes,
  getLeadSlaClasses,
  getLeadSlaTier,
  getLeadSourceLabel,
  isLeadHandled,
} from "@/lib/leads/handling";

type LeadCardProps = {
  lead: Lead;
};

export function LeadCard({ lead }: LeadCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const disposition = getLeadDisposition(lead);
  const handled = isLeadHandled(lead);
  const elapsedMinutes = getElapsedMinutes(lead.createdAt);
  const slaTier = getLeadSlaTier(elapsedMinutes);
  const handlingMinutes = getLeadHandlingTimeMinutes(lead);

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
      <article className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <DispositionBadge disposition={disposition} elapsedMinutes={elapsedMinutes} slaTier={slaTier} />
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                {lead.city}
              </span>
              <StatusPill label="Email" status={lead.emailDeliveryStatus} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                {lead.firstName} {lead.lastName}
              </h2>
              <p className="mt-1 text-sm font-semibold text-[var(--color-ink)]">{lead.service}</p>
            </div>

            {lead.urgency ? (
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                Urgency: {lead.urgency}
                {lead.urgencyDetail ? ` · ${lead.urgencyDetail}` : ""}
              </p>
            ) : null}

            <p className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-[var(--color-muted)]">
              {lead.message}
            </p>

            <AttributionBlock lead={lead} />

            {handled ? (
              <HandlingDetails lead={lead} handlingMinutes={handlingMinutes} disposition={disposition} />
            ) : null}

            {errorMessage ? (
              <p className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {errorMessage}
              </p>
            ) : null}

            {!handled ? (
              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleAddedToCalendar}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Added to Calendar
                </button>
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CalendarX className="h-4 w-4" />
                  Not Added to Calendar
                </button>
              </div>
            ) : null}
          </div>

          <div className="grid gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 p-4 text-sm text-[var(--color-muted)] sm:min-w-[18rem]">
            <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 font-semibold text-[var(--color-ink)]">
              <Phone className="h-4 w-4 text-[var(--color-ember)]" />
              {lead.phone}
            </a>
            <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 font-semibold text-[var(--color-ink)]">
              <Mail className="h-4 w-4 text-[var(--color-ember)]" />
              {lead.email}
            </a>
            <p>
              <span className="font-semibold text-[var(--color-ink)]">Lead ID:</span> {lead.id}
            </p>
            {formatServiceAddressLines(lead).length ? (
              <div className="space-y-1">
                <p className="font-semibold text-[var(--color-ink)]">Service address</p>
                {formatServiceAddressLines(lead).map((line) => {
                  const separatorIndex = line.indexOf(": ");
                  const label = separatorIndex >= 0 ? line.slice(0, separatorIndex) : "Address";
                  const value = separatorIndex >= 0 ? line.slice(separatorIndex + 2) : line;

                  return (
                    <p key={line}>
                      <span className="font-semibold text-[var(--color-ink)]">{label}:</span> {value}
                    </p>
                  );
                })}
              </div>
            ) : lead.address ? (
              <p>
                <span className="font-semibold text-[var(--color-ink)]">Address:</span> {lead.address}
              </p>
            ) : null}
            {lead.preferredContactMethod ? (
              <p>
                <span className="font-semibold text-[var(--color-ink)]">Preferred contact:</span>{" "}
                {lead.preferredContactMethod}
              </p>
            ) : null}
            <p>
              <span className="font-semibold text-[var(--color-ink)]">Preferred day:</span>{" "}
              {lead.preferredDay || "Not provided"}
            </p>
            <p>
              <span className="font-semibold text-[var(--color-ink)]">Preferred time:</span>{" "}
              {lead.preferredTime || "Not provided"}
            </p>
            {lead.emailDeliveryNote ? (
              <p>
                <span className="font-semibold text-[var(--color-ink)]">Email note:</span>{" "}
                {lead.emailDeliveryNote}
              </p>
            ) : null}
          </div>
        </div>
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

function DispositionBadge({
  disposition,
  elapsedMinutes,
  slaTier,
}: {
  disposition: ReturnType<typeof getLeadDisposition>;
  elapsedMinutes: number;
  slaTier: ReturnType<typeof getLeadSlaTier>;
}) {
  if (disposition === "pending") {
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getLeadSlaClasses(slaTier)}`}
      >
        Pending · {formatDurationMinutes(elapsedMinutes)}
      </span>
    );
  }

  const classes =
    disposition === "added-to-calendar"
      ? "bg-emerald-50 text-emerald-800"
      : "bg-red-50 text-red-800";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${classes}`}
    >
      {getLeadDispositionLabel(disposition)}
    </span>
  );
}

function AttributionBlock({ lead }: { lead: Lead }) {
  return (
    <div className="grid gap-2 rounded-[1.25rem] border border-[var(--color-border)] bg-white/60 p-4 text-sm text-[var(--color-muted)] sm:grid-cols-2">
      <p>
        <span className="font-semibold text-[var(--color-ink)]">Website / Domain:</span>{" "}
        {getLeadDomainLabel(lead)}
      </p>
      <p>
        <span className="font-semibold text-[var(--color-ink)]">City:</span> {lead.city}
      </p>
      <p>
        <span className="font-semibold text-[var(--color-ink)]">Source:</span>{" "}
        {getLeadSourceLabel(lead.source)}
      </p>
      <p>
        <span className="font-semibold text-[var(--color-ink)]">Campaign:</span>{" "}
        {lead.utmCampaign || "Not provided"}
      </p>
      <p className="sm:col-span-2 break-all">
        <span className="font-semibold text-[var(--color-ink)]">Landing Page:</span>{" "}
        {lead.sourceUrl || "Not provided"}
      </p>
      <p>
        <span className="font-semibold text-[var(--color-ink)]">Received:</span>{" "}
        {formatLeadDateTime(lead.createdAt)}
      </p>
    </div>
  );
}

function HandlingDetails({
  lead,
  handlingMinutes,
  disposition,
}: {
  lead: Lead;
  handlingMinutes: number | null;
  disposition: ReturnType<typeof getLeadDisposition>;
}) {
  return (
    <div className="grid gap-2 rounded-[1.25rem] border border-[var(--color-border)] bg-white/60 p-4 text-sm text-[var(--color-muted)] sm:grid-cols-2">
      <p>
        <span className="font-semibold text-[var(--color-ink)]">Received:</span>{" "}
        {formatLeadTime(lead.createdAt)}
      </p>
      <p>
        <span className="font-semibold text-[var(--color-ink)]">Handled:</span>{" "}
        {lead.handledAt ? formatLeadTime(lead.handledAt) : "—"}
      </p>
      <p>
        <span className="font-semibold text-[var(--color-ink)]">Handling Time:</span>{" "}
        {handlingMinutes == null ? "—" : formatDurationMinutes(handlingMinutes)}
      </p>
      <p>
        <span className="font-semibold text-[var(--color-ink)]">Handled By:</span>{" "}
        {lead.handledBy || "—"}
      </p>
      <p className="sm:col-span-2">
        <span className="font-semibold text-[var(--color-ink)]">Result:</span>{" "}
        {getLeadDispositionLabel(disposition)}
        {disposition === "not-added" && lead.dispositionReason
          ? ` · ${getLeadDispositionReasonLabel(lead.dispositionReason)}`
          : ""}
      </p>
      {lead.officeNote ? (
        <p className="sm:col-span-2 whitespace-pre-wrap">
          <span className="font-semibold text-[var(--color-ink)]">Office Note:</span> {lead.officeNote}
        </p>
      ) : null}
    </div>
  );
}

function StatusPill({
  label,
  status,
}: {
  label: string;
  status: "sent" | "skipped" | "failed";
}) {
  const classes =
    status === "sent"
      ? "bg-emerald-50 text-emerald-700"
      : status === "failed"
        ? "bg-red-50 text-red-700"
        : "bg-stone-100 text-stone-700";
  const Icon = status === "sent" ? ShieldCheck : Send;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}: {status}
    </span>
  );
}
