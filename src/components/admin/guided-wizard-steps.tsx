"use client";

import type { ReactNode } from "react";

export function WizardStepShell({
  step,
  totalSteps,
  title,
  description,
  children,
}: {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
          {step} / {totalSteps}
        </p>
        <h2 className="mt-2 text-xl font-semibold text-[var(--color-ink)]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function WizardField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-[var(--color-ink)]">{label}</span>
      {hint ? <span className="text-xs leading-5 text-[var(--color-muted)]">{hint}</span> : null}
      {children}
    </label>
  );
}

export function WizardTextInput({
  value,
  onChange,
  placeholder,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      required={required}
      className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none"
    />
  );
}

export function WizardTextArea({
  value,
  onChange,
  placeholder,
  rows = 5,
  required,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      required={required}
      className="min-h-[6rem] w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base leading-7 outline-none"
    />
  );
}

export function ReviewStatusBadge({ status }: { status: "PASS" | "WARNING" | "ACTION NEEDED" }) {
  const classes =
    status === "PASS"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : status === "WARNING"
        ? "border-amber-200 bg-amber-50 text-amber-900"
        : "border-red-200 bg-red-50 text-red-800";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${classes}`}>
      {status}
    </span>
  );
}
