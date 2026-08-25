import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  groupPreviewJobs,
  jobStatusClass,
  portalJobHref,
  type PortalPreviewJob,
} from "@/lib/portal/ui-preview";

type PortalJobsTabProps = {
  jobs: PortalPreviewJob[];
  invalidJobRequested?: boolean;
};

function JobCard({ job }: { job: PortalPreviewJob }) {
  return (
    <li>
      <Link
        href={portalJobHref(job.id)}
        scroll={false}
        className="flex w-full min-h-14 items-start gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white/90 p-4 shadow-[0_8px_24px_rgba(31,26,22,0.04)] transition hover:border-[rgba(185,71,29,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
      >
        {job.thumbnailSrc ? (
          <span className="relative mt-0.5 h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[var(--color-paper-strong)]">
            <Image src={job.thumbnailSrc} alt="" fill className="object-cover" sizes="56px" />
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--color-ink)]">{job.serviceTitle}</h3>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${jobStatusClass(job.status)}`}>
              {job.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{job.jobNumber}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{job.serviceAddress}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{job.dateLabel}</p>
        </div>
        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--color-muted)]" aria-hidden="true" />
      </Link>
    </li>
  );
}

function JobSection({ title, jobs }: { title: string; jobs: PortalPreviewJob[] }) {
  if (jobs.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold tracking-tight text-[var(--color-ink)]">{title}</h2>
      <ul className="grid gap-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </ul>
    </section>
  );
}

export function PortalJobsTab({ jobs, invalidJobRequested = false }: PortalJobsTabProps) {
  const grouped = groupPreviewJobs(jobs);

  if (jobs.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 px-5 py-10 text-center shadow-[0_10px_30px_rgba(31,26,22,0.05)]">
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">No service history yet</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">Your Phoenix service visits will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      {invalidJobRequested ? (
        <p className="rounded-2xl bg-[rgba(201,95,43,0.08)] px-4 py-3 text-sm text-[var(--color-muted)]">
          That job isn’t available. Showing your service history instead.
        </p>
      ) : null}
      <JobSection title="Active" jobs={grouped.active} />
      <JobSection title="Upcoming" jobs={grouped.upcoming} />
      <JobSection title="Completed" jobs={grouped.completed} />
    </div>
  );
}
