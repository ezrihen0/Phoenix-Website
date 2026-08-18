"use client";

import { useState } from "react";

import type { LeadDispositionReason } from "@/lib/cms/types";
import { LEAD_DISPOSITION_REASONS } from "@/lib/leads/handling";

type LeadDispositionDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: { dispositionReason: LeadDispositionReason; officeNote?: string }) => void;
  isPending: boolean;
};

export function LeadDispositionDialog({
  open,
  onClose,
  onSubmit,
  isPending,
}: LeadDispositionDialogProps) {
  const [reason, setReason] = useState<LeadDispositionReason | "">("");
  const [officeNote, setOfficeNote] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  function handleSubmit() {
    if (!reason) {
      setValidationError("Select one reason before completing this action.");
      return;
    }

    setValidationError(null);
    onSubmit({
      dispositionReason: reason,
      officeNote: officeNote.trim() || undefined,
    });
  }

  function handleClose() {
    if (isPending) {
      return;
    }

    setReason("");
    setOfficeNote("");
    setValidationError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-ink)]/45 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-disposition-title"
        className="w-full max-w-lg rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-2xl"
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
            Lead disposition
          </p>
          <h2 id="lead-disposition-title" className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            Not Added to Calendar
          </h2>
          <p className="text-sm leading-7 text-[var(--color-muted)]">
            Select the reason this lead did not become a booking. An office note is optional.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {LEAD_DISPOSITION_REASONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-[1.25rem] border px-4 py-3 text-sm transition ${reason === option.value ? "border-[var(--color-ink)] bg-white" : "border-[var(--color-border)] bg-white/70 hover:bg-white"}`}
            >
              <input
                type="radio"
                name="dispositionReason"
                value={option.value}
                checked={reason === option.value}
                onChange={() => setReason(option.value)}
                className="mt-1"
              />
              <span className="leading-6 text-[var(--color-ink)]">{option.label}</span>
            </label>
          ))}
        </div>

        <div className="mt-5">
          <label htmlFor="office-note" className="block text-sm font-semibold text-[var(--color-ink)]">
            Office Note — optional
          </label>
          <textarea
            id="office-note"
            value={officeNote}
            onChange={(event) => setOfficeNote(event.target.value)}
            rows={4}
            maxLength={500}
            placeholder="Add context for the owner if helpful."
            className="mt-2 w-full rounded-[1.25rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm leading-6 text-[var(--color-ink)] outline-none focus:border-[var(--color-ink)]"
          />
        </div>

        {validationError ? (
          <p className="mt-4 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {validationError}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-full bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Complete Not Added"}
          </button>
        </div>
      </div>
    </div>
  );
}
