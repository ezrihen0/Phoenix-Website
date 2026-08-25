import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { jobStatusClass, portalJobHref, type PortalPreviewVisit } from "@/lib/portal/ui-preview";

type PortalAppointmentsTabProps = {
  appointments: PortalPreviewVisit[];
};

function AppointmentCard({ visit }: { visit: PortalPreviewVisit }) {
  return (
    <article className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/90 p-4 shadow-[0_8px_24px_rgba(31,26,22,0.04)] sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(185,71,29,0.12)] text-[var(--color-ember)]">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--color-ink)]">{visit.serviceTitle}</h3>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${jobStatusClass(visit.status)}`}>
              {visit.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{visit.dateLabel}</p>
          <p className="mt-0.5 text-sm text-[var(--color-muted)]">{visit.windowLabel}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{visit.address}</p>
          <p className="mt-1 text-sm font-medium text-[var(--color-ink)]">{visit.jobNumber}</p>
          <Link
            href={portalJobHref(visit.jobId)}
            scroll={false}
            className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-ember)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
          >
            View related job
          </Link>
        </div>
      </div>
    </article>
  );
}

export function PortalAppointmentsTab({ appointments }: PortalAppointmentsTabProps) {
  const upcoming = appointments.filter((visit) => visit.timing === "upcoming");
  const past = appointments.filter((visit) => visit.timing === "past");

  if (appointments.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 px-5 py-10 text-center shadow-[0_10px_30px_rgba(31,26,22,0.05)]">
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">No upcoming appointments</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">Need service?</p>
        <a
          href="/request-service?city=calgary&cta=portal"
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-ember)] px-5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
        >
          Request Service
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {upcoming.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold tracking-tight text-[var(--color-ink)]">Upcoming</h2>
          <div className="grid gap-3">
            {upcoming.map((visit) => (
              <AppointmentCard key={visit.id} visit={visit} />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 px-5 py-8 text-center">
          <h2 className="text-lg font-semibold text-[var(--color-ink)]">No upcoming appointments</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Need service?</p>
          <a
            href="/request-service?city=calgary&cta=portal"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--color-ember)] px-5 text-sm font-semibold text-white"
          >
            Request Service
          </a>
        </section>
      )}

      {past.length > 0 ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold tracking-tight text-[var(--color-ink)]">Past</h2>
          <div className="grid gap-3">
            {past.map((visit) => (
              <AppointmentCard key={visit.id} visit={visit} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
