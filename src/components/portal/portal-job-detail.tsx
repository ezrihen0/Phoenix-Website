import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { jobStatusClass, type PortalPreviewJob } from "@/lib/portal/ui-preview";

type PortalJobDetailProps = {
  job: PortalPreviewJob;
};

function DetailCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h3 className="text-base font-semibold text-[var(--color-ink)]">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{children}</div>
    </section>
  );
}

export function PortalJobDetail({ job }: PortalJobDetailProps) {
  return (
    <div className="grid gap-5">
      <Link
        href="/portal?tab=jobs"
        scroll={false}
        className="inline-flex min-h-11 w-fit items-center gap-2 text-sm font-semibold text-[var(--color-ember)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to jobs
      </Link>

      <header className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">{job.serviceTitle}</h2>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${jobStatusClass(job.status)}`}>
            {job.status}
          </span>
        </div>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{job.jobNumber}</p>
      </header>

      <DetailCard title="Overview">
        <p>
          <span className="font-semibold text-[var(--color-ink)]">Service:</span> {job.serviceTitle}
        </p>
        <p>
          <span className="font-semibold text-[var(--color-ink)]">Status:</span> {job.status}
        </p>
        <p>
          <span className="font-semibold text-[var(--color-ink)]">Service address:</span> {job.serviceAddress}
        </p>
        <p>
          <span className="font-semibold text-[var(--color-ink)]">Date:</span> {job.dateLabel}
        </p>
      </DetailCard>

      {job.quote ? (
        <DetailCard title="Quote">
          <p>{job.quote.summary}</p>
          <p className="mt-1 font-medium text-[var(--color-ink)]">{job.quote.status}</p>
        </DetailCard>
      ) : null}

      {job.invoice ? (
        <DetailCard title="Invoice">
          <p>{job.invoice.summary}</p>
          <p className="mt-1 font-medium text-[var(--color-ink)]">{job.invoice.status}</p>
        </DetailCard>
      ) : null}

      {job.payments && job.payments.length > 0 ? (
        <DetailCard title="Payments">
          <ul className="grid gap-2">
            {job.payments.map((payment) => (
              <li key={`${payment.summary}-${payment.dateLabel}`}>
                {payment.summary} · {payment.dateLabel}
              </li>
            ))}
          </ul>
        </DetailCard>
      ) : null}

      {job.inspection ? (
        <DetailCard title="Inspection">
          <p>{job.inspection.summary}</p>
          <p className="mt-1 font-medium text-[var(--color-ink)]">{job.inspection.status}</p>
        </DetailCard>
      ) : null}

      {job.photos && job.photos.length > 0 ? (
        <DetailCard title="Photos">
          <ul className="grid grid-cols-2 gap-3">
            {job.photos.map((photo) => (
              <li key={photo.src} className="relative h-28 overflow-hidden rounded-2xl bg-[var(--color-paper-strong)]">
                <Image src={photo.src} alt={photo.alt} fill className="object-cover" sizes="(min-width: 640px) 40vw, 50vw" />
              </li>
            ))}
          </ul>
        </DetailCard>
      ) : null}

      {job.documents && job.documents.length > 0 ? (
        <DetailCard title="Documents">
          <ul className="grid gap-2">
            {job.documents.map((document) => (
              <li key={document.title}>
                {document.title} · {document.dateLabel} · {document.fileType}
              </li>
            ))}
          </ul>
        </DetailCard>
      ) : null}

      {job.warranty ? <DetailCard title="Warranty">{job.warranty.summary}</DetailCard> : null}
    </div>
  );
}
