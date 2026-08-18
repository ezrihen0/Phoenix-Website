"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import {
  completeOfficeArticleTaskAction,
  linkOfficeArticleAction,
  markOfficeAiImageProvidedAction,
  markOfficeRealImageProvidedAction,
  requestOfficeManagerImageAction,
} from "@/app/admin/office/actions";
import type { ArticleCalendarEntry } from "@/lib/office/article-calendar";
import type { Article, OfficeArticleTaskState } from "@/lib/cms/types";
import { deriveArticleTaskStatus } from "@/lib/office/daily-state";

type ArticleOption = {
  id: string;
  title: string;
  status: Article["status"];
};

type TodaysArticleCardProps = {
  calendarLoaded: boolean;
  calendarMessage: string;
  calendarEntry: ArticleCalendarEntry | null;
  nextCalendarEntry: ArticleCalendarEntry | null;
  articleTask?: OfficeArticleTaskState;
  linkedArticle?: Pick<Article, "id" | "title" | "status"> | null;
  articleOptions: ArticleOption[];
  dateLabel: string;
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  "in-progress": "In Progress",
  "waiting-for-manager-image": "Waiting for Manager Image",
  done: "Done",
};

export function TodaysArticleCard({
  calendarLoaded,
  calendarMessage,
  calendarEntry,
  nextCalendarEntry,
  articleTask,
  linkedArticle,
  articleOptions,
  dateLabel,
}: TodaysArticleCardProps) {
  const [selectedArticleId, setSelectedArticleId] = useState(linkedArticle?.id || "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const status = deriveArticleTaskStatus(articleTask, linkedArticle || null);

  if (status === "done") {
    return (
      <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <p className="eyebrow">Today&apos;s article</p>
        <div className="mt-4 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
          Today&apos;s article task is complete for {dateLabel}.
        </div>
      </section>
    );
  }

  if (!calendarLoaded) {
    return (
      <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <p className="eyebrow">Today&apos;s article</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">Today&apos;s Article</h2>
        <p className="mt-4 rounded-[1.5rem] border border-dashed border-[var(--color-border)] bg-white/70 px-5 py-4 text-sm leading-7 text-[var(--color-muted)]">
          {calendarMessage}
        </p>
      </section>
    );
  }

  if (!calendarEntry) {
    return (
      <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <p className="eyebrow">Today&apos;s article</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">Today&apos;s Article</h2>
        <p className="mt-4 rounded-[1.5rem] border border-dashed border-[var(--color-border)] bg-white/70 px-5 py-4 text-sm leading-7 text-[var(--color-muted)]">
          No article is scheduled for {dateLabel}.
        </p>
        {nextCalendarEntry ? (
          <div className="mt-4 rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Next scheduled article
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">{nextCalendarEntry.topic}</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {nextCalendarEntry.date} · {nextCalendarEntry.city} · {nextCalendarEntry.website}
            </p>
          </div>
        ) : null}
      </section>
    );
  }

  function runAction(action: () => Promise<{ ok: boolean; message?: string }>) {
    setMessage(null);
    startTransition(async () => {
      const result = await action();

      if (!result.ok) {
        setMessage(result.message || "Something went wrong.");
      }
    });
  }

  return (
    <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="eyebrow">Today&apos;s article</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">Today&apos;s Article</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Status: <span className="font-semibold text-[var(--color-ink)]">{STATUS_LABELS[status]}</span>
          </p>
        </div>
        <Link
          href="/admin/articles"
          className="inline-flex rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
        >
          Open Articles
        </Link>
      </div>

      <dl className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Topic" value={calendarEntry.topic} />
        <Field label="Website" value={calendarEntry.website} />
        <Field label="City" value={calendarEntry.city} />
        <Field label="Category" value={calendarEntry.category} />
        <Field label="Primary Keyword" value={calendarEntry.primaryKeyword} />
        <Field label="Internal Link" value={calendarEntry.internalLinkTarget || "—"} />
      </dl>

      <div className="mt-5 space-y-4">
        <Field label="Writing Direction" value={calendarEntry.writingAngle} />
        {calendarEntry.requiredPoints.length > 0 ? (
          <div>
            <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              Required Points
            </dt>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-[var(--color-ink)]">
              {calendarEntry.requiredPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {calendarEntry.imageInstructions ? (
          <Field label="Image Instructions" value={calendarEntry.imageInstructions} />
        ) : null}
      </div>

      {!articleTask ? (
        <p className="mt-6 text-sm leading-7 text-[var(--color-muted)]">
          Loading today&apos;s article task… refresh if this message persists.
        </p>
      ) : (
        <div className="mt-6 space-y-5 rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <label className="block text-sm">
              <span className="font-semibold text-[var(--color-ink)]">Link article created today</span>
              <select
                value={selectedArticleId}
                onChange={(event) => setSelectedArticleId(event.target.value)}
                className="mt-2 w-full rounded-[1rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm"
              >
                <option value="">Select an article…</option>
                {articleOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.title} ({option.status})
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              disabled={isPending || !selectedArticleId}
              onClick={() => runAction(() => linkOfficeArticleAction(selectedArticleId))}
              className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] disabled:opacity-50"
            >
              Link Article
            </button>
          </div>

          {linkedArticle ? (
            <p className="text-sm text-[var(--color-muted)]">
              Linked article: <span className="font-semibold text-[var(--color-ink)]">{linkedArticle.title}</span>{" "}
              ({linkedArticle.status})
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <ImageRequirement
              title="AI Image — Required"
              complete={Boolean(articleTask.aiImageProvidedAt)}
              actionLabel="Mark AI Image Provided"
              onAction={() => runAction(markOfficeAiImageProvidedAction)}
              disabled={isPending}
            />
            <ImageRequirement
              title="Real Phoenix Image — Required"
              complete={Boolean(articleTask.realImageProvidedAt)}
              actionLabel="Mark Real Image Provided"
              onAction={() => runAction(markOfficeRealImageProvidedAction)}
              disabled={isPending}
              helper={
                status === "waiting-for-manager-image"
                  ? "Waiting for manager image. This state does not complete the task."
                  : "Use an authentic Phoenix field/business image, not a second AI image."
              }
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isPending}
              onClick={() => runAction(requestOfficeManagerImageAction)}
              className="rounded-full border border-[var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-50"
            >
              Request Image From Manager
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => runAction(completeOfficeArticleTaskAction)}
              className="rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              Mark Article Task Done
            </button>
          </div>
        </div>
      )}

      {message ? (
        <p className="mt-4 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{message}</p>
      ) : null}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{label}</dt>
      <dd className="mt-2 text-sm leading-7 text-[var(--color-ink)]">{value}</dd>
    </div>
  );
}

function ImageRequirement({
  title,
  complete,
  actionLabel,
  onAction,
  disabled,
  helper,
}: {
  title: string;
  complete: boolean;
  actionLabel: string;
  onAction: () => void;
  disabled: boolean;
  helper?: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[var(--color-border)] bg-white p-4">
      <p className="font-semibold text-[var(--color-ink)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--color-muted)]">{complete ? "Provided" : "Not yet provided"}</p>
      {helper ? <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">{helper}</p> : null}
      {!complete ? (
        <button
          type="button"
          disabled={disabled}
          onClick={onAction}
          className="mt-3 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] disabled:opacity-50"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
