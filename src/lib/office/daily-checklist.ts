import type { OfficeChecklistCompletion, OfficeChecklistTaskId } from "@/lib/cms/types";

export const OFFICE_CHECKLIST_TASKS = [
  {
    id: "review-new-overnight-leads",
    label: "Review new / overnight leads",
    description: "Confirm new and overnight website leads have been reviewed.",
  },
  {
    id: "review-todays-calendar",
    label: "Review today's calendar",
    description: "Confirm today's technician/work calendar has been reviewed for obvious scheduling issues.",
  },
  {
    id: "check-office-inbox",
    label: "Check office inbox",
    description: "Confirm important new customer/operational email has been reviewed.",
  },
  {
    id: "review-yesterdays-unresolved-leads",
    label: "Review yesterday's unresolved leads",
    description: "Confirm unresolved/pending leads from the prior day have been reviewed.",
  },
  {
    id: "complete-todays-article",
    label: "Complete today's article",
    description: "Finish today's article task, including required images and publish/schedule.",
  },
  {
    id: "morning-review-completed",
    label: "Morning review completed",
    description: "Morning review completed — office ready for daily operations.",
  },
] as const satisfies ReadonlyArray<{ id: OfficeChecklistTaskId; label: string; description: string }>;

export type { OfficeChecklistCompletion, OfficeChecklistTaskId };

export function isArticleScheduledToday(
  calendar:
    | { loaded: true; entry: { date: string } | null; date: string }
    | { loaded: false; message: string; date: string },
) {
  return calendar.loaded && calendar.entry !== null;
}

export function getApplicableChecklistTasks(articleRequiredToday = true) {
  if (articleRequiredToday) {
    return OFFICE_CHECKLIST_TASKS;
  }

  return OFFICE_CHECKLIST_TASKS.filter((task) => task.id !== "complete-todays-article");
}

export function isChecklistTaskComplete(
  checklist: OfficeChecklistCompletion[],
  taskId: OfficeChecklistTaskId,
) {
  return checklist.some((entry) => entry.taskId === taskId);
}

export function getActiveChecklistTasks(
  checklist: OfficeChecklistCompletion[],
  articleRequiredToday = true,
) {
  const completedIds = new Set(checklist.map((entry) => entry.taskId));
  return getApplicableChecklistTasks(articleRequiredToday).filter((task) => !completedIds.has(task.id));
}

export function isDailyChecklistComplete(
  checklist: OfficeChecklistCompletion[],
  articleRequiredToday = true,
) {
  return getApplicableChecklistTasks(articleRequiredToday).every((task) =>
    isChecklistTaskComplete(checklist, task.id),
  );
}

export function getChecklistProgressLabel(
  checklist: OfficeChecklistCompletion[],
  articleRequiredToday = true,
) {
  const applicableTasks = getApplicableChecklistTasks(articleRequiredToday);
  const completedCount = applicableTasks.filter((task) =>
    isChecklistTaskComplete(checklist, task.id),
  ).length;

  return {
    completedCount,
    totalCount: applicableTasks.length,
    label: `${completedCount}/${applicableTasks.length}`,
  };
}

export type OfficeDailySummaryStatus = "not-started" | "in-progress" | "completed";

export function getDailyChecklistSummaryStatus(
  checklist: OfficeChecklistCompletion[],
  articleRequiredToday = true,
): OfficeDailySummaryStatus {
  const progress = getChecklistProgressLabel(checklist, articleRequiredToday);

  if (progress.completedCount === 0) {
    return "not-started";
  }

  if (isDailyChecklistComplete(checklist, articleRequiredToday)) {
    return "completed";
  }

  return "in-progress";
}
