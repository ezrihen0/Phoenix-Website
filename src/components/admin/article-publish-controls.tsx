"use client";

import { useMemo, useState } from "react";

import {
  formatArticleDateTime,
  formatScheduleInputValues,
  parseScheduleDateTime,
} from "@/lib/cms/helpers";
import type { Article } from "@/lib/cms/types";

type ArticlePublishControlsProps = {
  article?: Article;
  layout?: "stacked" | "fixed";
};

function getDefaultScheduleInputs() {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return formatScheduleInputValues(tomorrow.toISOString());
}

export function ArticlePublishControls({
  article,
  layout = "stacked",
}: ArticlePublishControlsProps) {
  const initialSchedule = useMemo(() => {
    if (article?.status === "scheduled" && article.scheduledAt) {
      return formatScheduleInputValues(article.scheduledAt);
    }

    return getDefaultScheduleInputs();
  }, [article?.scheduledAt, article?.status]);

  const [scheduleDate, setScheduleDate] = useState(initialSchedule.date);
  const [scheduleTime, setScheduleTime] = useState(initialSchedule.time);
  const [showScheduleFields, setShowScheduleFields] = useState(
    article?.status === "scheduled",
  );

  const scheduledPreview = useMemo(() => {
    if (!showScheduleFields || !scheduleDate || !scheduleTime) {
      return null;
    }

    try {
      const iso = parseScheduleDateTime(scheduleDate, scheduleTime);
      return `Scheduled for:\n${formatArticleDateTime(iso)} (Alberta time)`;
    } catch {
      return null;
    }
  }, [scheduleDate, scheduleTime, showScheduleFields]);

  const buttonRow = (
    <div className={`flex gap-3 ${layout === "fixed" ? "mx-auto w-full max-w-lg flex-col sm:flex-row" : "flex-wrap"}`}>
      <button
        type="submit"
        name="status"
        value="draft"
        onClick={() => setShowScheduleFields(false)}
        className={`${layout === "fixed" ? "min-h-12 flex-1" : ""} rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-sm font-semibold`}
      >
        Save draft
      </button>
      <button
        type="button"
        onClick={() => setShowScheduleFields(true)}
        className={`${layout === "fixed" ? "min-h-12 flex-1" : ""} rounded-full px-6 py-3 text-sm font-semibold ${
          showScheduleFields
            ? "bg-amber-600 text-white"
            : "border border-amber-200 bg-amber-50 text-amber-900"
        }`}
      >
        Schedule publish
      </button>
      {showScheduleFields ? (
        <button
          type="submit"
          name="status"
          value="scheduled"
          className={`${layout === "fixed" ? "min-h-12 flex-1" : ""} rounded-full bg-amber-700 px-6 py-3 text-sm font-semibold text-white`}
        >
          Save scheduled
        </button>
      ) : null}
      <button
        type="submit"
        name="status"
        value="published"
        onClick={() => setShowScheduleFields(false)}
        className={`${layout === "fixed" ? "min-h-12 flex-1" : ""} rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)]`}
      >
        Publish now
      </button>
    </div>
  );

  return (
    <div className={`space-y-4 ${layout === "stacked" ? "md:col-span-2" : ""}`}>
      {article?.status === "scheduled" && article.scheduledAt ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Currently scheduled for {formatArticleDateTime(article.scheduledAt)} (Alberta time).
        </div>
      ) : null}

      {showScheduleFields ? (
        <div className="grid gap-4 rounded-2xl border border-[var(--color-border)] bg-white/70 p-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
            <span>Publish date</span>
            <input
              type="date"
              name="scheduleDate"
              value={scheduleDate}
              onChange={(event) => setScheduleDate(event.target.value)}
              required={showScheduleFields}
              className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
            <span>Publish time</span>
            <input
              type="time"
              name="scheduleTime"
              value={scheduleTime}
              onChange={(event) => setScheduleTime(event.target.value)}
              required={showScheduleFields}
              className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
            />
          </label>
          {scheduledPreview ? (
            <p className="whitespace-pre-line text-sm leading-6 text-[var(--color-muted)] md:col-span-2">
              {scheduledPreview}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <input type="hidden" name="scheduleDate" value="" />
          <input type="hidden" name="scheduleTime" value="" />
        </>
      )}

      {layout === "fixed" ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-paper)]/95 px-4 py-3 backdrop-blur">
          {buttonRow}
        </div>
      ) : (
        buttonRow
      )}
    </div>
  );
}
