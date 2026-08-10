"use client";

import { useMemo, useState, useTransition } from "react";

import {
  applyArticleMigrationAction,
  dryRunArticleMigrationAction,
  restoreArticleSnapshotAction,
} from "@/app/admin/actions";
import type {
  ArticleInventoryEntry,
  ArticleMigrationProposal,
  ArticleMigrationReport,
} from "@/lib/cms/article-migration";

type ArticleMigrationPanelProps = {
  initialReport: ArticleMigrationReport;
  defaultApprovedIds: string[];
  snapshots: Array<{ key: string; uploadedAt: string }>;
};

export function ArticleMigrationPanel({
  initialReport,
  defaultApprovedIds,
  snapshots,
}: ArticleMigrationPanelProps) {
  const [report, setReport] = useState(initialReport);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(defaultApprovedIds));
  const [isRefreshing, startRefresh] = useTransition();

  const proposalsById = useMemo(() => {
    return new Map(report.proposals.map((proposal) => [proposal.articleId, proposal]));
  }, [report.proposals]);

  function toggleProposal(articleId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(articleId)) {
        next.delete(articleId);
      } else {
        next.add(articleId);
      }

      return next;
    });
  }

  function refreshReport() {
    startRefresh(async () => {
      const result = await dryRunArticleMigrationAction();
      setReport(result.report);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={refreshReport}
          disabled={isRefreshing}
          className="rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-50"
        >
          {isRefreshing ? "Refreshing inventory..." : "Refresh inventory / dry run"}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Stored articles" value={String(report.storedArticleCount)} />
        <Metric label="Merged inventory" value={String(report.mergedArticleCount)} />
        <Metric label="Proposals" value={String(report.proposals.length)} />
      </div>

      <form action={applyArticleMigrationAction} className="space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div>
          <h2 className="text-xl font-semibold text-[var(--color-ink)]">Migration proposals</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            Seed rewrites are pre-selected. Unknown or protected articles stay unchecked until you approve them.
          </p>
        </div>

        <div className="space-y-4">
          {report.inventory.map((entry) => (
            <InventoryCard
              key={entry.id}
              entry={entry}
              proposal={proposalsById.get(entry.id)}
              checked={selectedIds.has(entry.id)}
              onToggle={() => toggleProposal(entry.id)}
            />
          ))}
        </div>

        {Array.from(selectedIds).map((articleId) => (
          <input key={articleId} type="hidden" name="approvedIds" value={articleId} />
        ))}

        <button
          type="submit"
          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
        >
          Apply selected migrations (creates snapshot first)
        </button>
      </form>

      <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h2 className="text-xl font-semibold text-[var(--color-ink)]">Restore snapshot</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          Roll back stored articles to a pre-migration snapshot if needed.
        </p>

        {snapshots.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-muted)]">No snapshots recorded yet.</p>
        ) : (
          <form action={restoreArticleSnapshotAction} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <select
              name="snapshotKey"
              defaultValue={snapshots[0]?.key}
              className="min-h-11 flex-1 rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
            >
              {snapshots.map((snapshot) => (
                <option key={snapshot.key} value={snapshot.key}>
                  {snapshot.key} · {snapshot.uploadedAt}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
            >
              Restore selected snapshot
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

function InventoryCard({
  entry,
  proposal,
  checked,
  onToggle,
}: {
  entry: ArticleInventoryEntry;
  proposal?: ArticleMigrationProposal;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {entry.sourceType} · {entry.recommendation}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--color-ink)]">{entry.title}</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {entry.city} · {entry.slug} · {entry.status}
          </p>
          {entry.qualityFlags.length > 0 ? (
            <p className="mt-2 text-xs text-[var(--color-muted)]">
              Flags: {entry.qualityFlags.join(", ")}
            </p>
          ) : null}
        </div>

        {proposal ? (
          <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-ink)]">
            <input type="checkbox" checked={checked} onChange={onToggle} />
            Apply proposal
          </label>
        ) : (
          <span className="text-sm text-[var(--color-muted)]">No automatic change</span>
        )}
      </div>

      {proposal ? (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <PreviewBlock title="Before" proposal={proposal.before} reason={proposal.reason} />
          <PreviewBlock title="After" proposal={proposal.after} reason={proposal.reason} after />
        </div>
      ) : null}
    </div>
  );
}

function PreviewBlock({
  title,
  proposal,
  reason,
  after = false,
}: {
  title: string;
  proposal: ArticleMigrationProposal["before"];
  reason: string;
  after?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
      <p className="text-sm font-semibold text-[var(--color-ink)]">{title}</p>
      {after ? <p className="mt-1 text-xs text-[var(--color-muted)]">{reason}</p> : null}
      <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">{proposal.title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{proposal.excerpt}</p>
      <p className="mt-3 line-clamp-6 whitespace-pre-wrap text-xs leading-6 text-[var(--color-muted)]">
        {proposal.bodyPreview}
      </p>
    </div>
  );
}
