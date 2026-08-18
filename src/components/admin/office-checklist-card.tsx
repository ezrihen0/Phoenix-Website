"use client";

import { useTransition } from "react";

import { completeOfficeChecklistTaskAction } from "@/app/admin/office/actions";
import type { OfficeChecklistCompletion, OfficeChecklistTaskId } from "@/lib/cms/types";
import {
  getActiveChecklistTasks,
  getChecklistProgressLabel,
  isDailyChecklistComplete,
} from "@/lib/office/daily-checklist";

type OfficeChecklistCardProps = {
  checklist: OfficeChecklistCompletion[];
  dateLabel: string;
  articleRequiredToday: boolean;
};

export function OfficeChecklistCard({
  checklist,
  dateLabel,
  articleRequiredToday,
}: OfficeChecklistCardProps) {
  const [isPending, startTransition] = useTransition();
  const activeTasks = getActiveChecklistTasks(checklist, articleRequiredToday);
  const isComplete = isDailyChecklistComplete(checklist, articleRequiredToday);
  const progress = getChecklistProgressLabel(checklist, articleRequiredToday);

  function completeTask(taskId: OfficeChecklistTaskId) {
    startTransition(async () => {
      await completeOfficeChecklistTaskAction(taskId);
    });
  }

  return (
    <section className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Daily checklist</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            Today&apos;s Office Checklist
          </h2>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            {dateLabel} ({progress.label} complete)
          </p>
        </div>
        <p className="text-xs leading-6 text-[var(--color-muted)] sm:max-w-xs">
          Customer work comes first. Finish leads and calendar issues before article work when needed.
        </p>
      </div>

      {isComplete ? (
        <div className="mt-6 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-800">
          Today&apos;s Office Checklist Complete
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {activeTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-start gap-4 rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 px-4 py-4"
            >
              <button
                type="button"
                disabled={isPending || task.id === "complete-todays-article"}
                onClick={() => completeTask(task.id)}
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[var(--color-border)] bg-white text-xs font-semibold text-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label={`Mark ${task.label} complete`}
              >
                ✓
              </button>
              <div>
                <p className="font-semibold text-[var(--color-ink)]">{task.label}</p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">{task.description}</p>
                {task.id === "complete-todays-article" ? (
                  <p className="mt-2 text-xs leading-5 text-[var(--color-muted)]">
                    This item completes automatically when today&apos;s article task is Done.
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
