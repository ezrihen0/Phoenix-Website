import Link from "next/link";
import { CalendarDays } from "lucide-react";

import type { PortalPreviewAppointment } from "@/lib/portal/ui-preview";

type PortalNextAppointmentProps = {
  appointment: PortalPreviewAppointment;
};

export function PortalNextAppointment({ appointment }: PortalNextAppointmentProps) {
  return (
    <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">Next Appointment</h2>
      <div className="mt-4 flex gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(185,71,29,0.12)] text-[var(--color-ember)]">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--color-ink)]">{appointment.serviceTitle}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{appointment.dateLabel}</p>
          <p className="mt-0.5 text-sm text-[var(--color-muted)]">{appointment.windowLabel}</p>
          <p className="mt-2 text-sm font-medium text-[var(--color-ink)]">{appointment.jobNumber}</p>
        </div>
      </div>
      <Link
        href="/portal?tab=appointments"
        scroll={false}
        className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-ember)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
      >
        View Appointment
      </Link>
    </article>
  );
}
