import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { jobStatusClass, portalJobHref, type PortalPreviewJob } from "@/lib/portal/ui-preview";

type PortalJobsPreviewProps = {
  jobs: PortalPreviewJob[];
};

export function PortalJobsPreview({ jobs }: PortalJobsPreviewProps) {
  return (
    <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">My Jobs</h2>
      <ul className="mt-4 divide-y divide-[var(--color-border)]">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link
              href={portalJobHref(job.id)}
              scroll={false}
              className="flex min-h-14 items-center gap-3 py-3.5 first:pt-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
            >
              {job.thumbnailSrc ? (
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-[var(--color-paper-strong)]">
                  <Image src={job.thumbnailSrc} alt="" fill className="object-cover" sizes="48px" />
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--color-ink)]">{job.serviceTitle}</p>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  {job.jobNumber}
                  <span className="mx-1.5">·</span>
                  {job.dateLabel}
                </p>
              </div>
              <p className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${jobStatusClass(job.status)}`}>
                {job.status}
              </p>
              <span className="text-[var(--color-muted)]" aria-hidden="true">
                <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/portal?tab=jobs"
        scroll={false}
        className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-ember)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
      >
        View all jobs
      </Link>
    </article>
  );
}
