import { CalendarDays, ChevronRight, FileText, ShieldCheck } from "lucide-react";

import type { PortalPreviewActivity, PortalPreviewStatus } from "@/lib/portal/ui-preview";

type PortalActivityFeedProps = {
  items: PortalPreviewActivity[];
};

function statusClass(status?: PortalPreviewStatus, kind?: PortalPreviewActivity["kind"]) {
  if (status === "Completed" || kind === "completed") {
    return "bg-[rgba(34,90,58,0.12)] text-[#2a5a3a]";
  }

  if (status === "Scheduled" || kind === "scheduled") {
    return "bg-[rgba(185,71,29,0.12)] text-[var(--color-ember-dark)]";
  }

  return "bg-[rgba(90,108,122,0.12)] text-[#4d5d6b]";
}

function ActivityIcon({ kind }: { kind: PortalPreviewActivity["kind"] }) {
  const iconClass = "h-4 w-4";

  if (kind === "completed") {
    return <ShieldCheck className={iconClass} aria-hidden="true" />;
  }

  if (kind === "scheduled") {
    return <CalendarDays className={iconClass} aria-hidden="true" />;
  }

  return <FileText className={iconClass} aria-hidden="true" />;
}

export function PortalActivityFeed({ items }: PortalActivityFeedProps) {
  return (
    <article className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">Recent Activity</h2>
      <ol className="relative mt-5 space-y-0 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-[var(--color-border)]">
        {items.map((item) => (
          <li key={item.id} className="relative flex gap-3 py-3 pl-1">
            <span
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${statusClass(item.status, item.kind)}`}
            >
              <ActivityIcon kind={item.kind} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-[var(--color-ink)]">{item.title}</p>
                <span className="mt-0.5 text-[var(--color-muted)]" aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                {item.dateLabel}
                {item.reference ? ` · ${item.reference}` : ""}
              </p>
              {item.status ? (
                <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(item.status, item.kind)}`}>
                  {item.status}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-2 px-1 pt-3 text-sm font-semibold text-[var(--color-muted)]">View all activity</p>
    </article>
  );
}
