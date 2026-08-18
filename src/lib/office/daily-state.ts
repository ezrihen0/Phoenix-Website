import type {
  Article,
  OfficeArticleTaskState,
  OfficeDailyStateRecord,
} from "@/lib/cms/types";

import type { OfficeDailySummaryStatus } from "@/lib/office/daily-checklist";
import {
  getChecklistProgressLabel,
  getDailyChecklistSummaryStatus,
  isChecklistTaskComplete,
} from "@/lib/office/daily-checklist";
import { OFFICE_DAILY_STATE_RETENTION_DAYS } from "@/lib/office/constants";

export type OfficeArticleTaskStatus = OfficeArticleTaskState["status"];

export function createEmptyOfficeDailyState(date: string, username: string): OfficeDailyStateRecord {
  return {
    date,
    username,
    checklist: [],
    updatedAt: new Date().toISOString(),
  };
}

export function articleMeetsPublishGate(article: Pick<Article, "status"> | null | undefined) {
  return article?.status === "published" || article?.status === "scheduled";
}

export function canMarkArticleTaskDone(
  articleTask: OfficeArticleTaskState | undefined,
  article: Pick<Article, "status"> | null | undefined,
) {
  if (!articleTask?.linkedArticleId) {
    return { ok: false as const, reason: "Link the article you created before marking this task complete." };
  }

  if (!articleMeetsPublishGate(article)) {
    return {
      ok: false as const,
      reason: "The linked article must be Published or Scheduled before this task can be marked Done.",
    };
  }

  if (!articleTask.aiImageProvidedAt) {
    return { ok: false as const, reason: "Mark the AI image as provided before completing this task." };
  }

  if (!articleTask.realImageProvidedAt) {
    return {
      ok: false as const,
      reason:
        "A real Phoenix image is required to complete this task. Waiting for Manager Image does not count as complete.",
    };
  }

  return { ok: true as const };
}

export function deriveArticleTaskStatus(
  articleTask: OfficeArticleTaskState | undefined,
  article: Pick<Article, "status"> | null | undefined,
): OfficeArticleTaskStatus {
  if (!articleTask) {
    return "pending";
  }

  if (articleTask.completedAt && canMarkArticleTaskDone(articleTask, article).ok) {
    return "done";
  }

  if (articleTask.managerImageRequestedAt && !articleTask.realImageProvidedAt) {
    return "waiting-for-manager-image";
  }

  if (
    articleTask.linkedArticleId ||
    articleTask.aiImageProvidedAt ||
    articleTask.realImageProvidedAt ||
    articleMeetsPublishGate(article)
  ) {
    return "in-progress";
  }

  return articleTask.status === "pending" ? "pending" : "in-progress";
}

export function getOfficeDailySummaryStatus(
  state: OfficeDailyStateRecord,
  article: Pick<Article, "status"> | null | undefined,
  articleRequiredToday = true,
): OfficeDailySummaryStatus {
  const checklistStatus = getDailyChecklistSummaryStatus(state.checklist, articleRequiredToday);
  const articleStatus = deriveArticleTaskStatus(state.articleTask, article);

  if (!articleRequiredToday) {
    return checklistStatus;
  }

  if (checklistStatus === "completed" && (!state.articleTask || articleStatus === "done")) {
    return "completed";
  }

  if (checklistStatus === "not-started" && articleStatus === "pending") {
    return "not-started";
  }

  return "in-progress";
}

export function syncArticleChecklistCompletion(
  state: OfficeDailyStateRecord,
  article: Pick<Article, "status"> | null | undefined,
  username: string,
): OfficeDailyStateRecord {
  let articleTask = state.articleTask
    ? { ...state.articleTask, status: deriveArticleTaskStatus(state.articleTask, article) }
    : undefined;

  if (articleTask && canMarkArticleTaskDone(articleTask, article).ok && !articleTask.completedAt) {
    articleTask = {
      ...articleTask,
      status: "done",
      completedAt: new Date().toISOString(),
      completedBy: username,
    };
  }

  let checklist = [...state.checklist];

  if (articleTask && canMarkArticleTaskDone(articleTask, article).ok) {
    if (!isChecklistTaskComplete(checklist, "complete-todays-article")) {
      checklist = [
        ...checklist,
        {
          taskId: "complete-todays-article",
          completedAt: articleTask.completedAt || new Date().toISOString(),
          completedBy: articleTask.completedBy || username,
        },
      ];
    }
  }

  return {
    ...state,
    articleTask,
    checklist,
    updatedAt: new Date().toISOString(),
  };
}

export function pruneOfficeDailyStateRecords(
  records: OfficeDailyStateRecord[],
  retentionDays = OFFICE_DAILY_STATE_RETENTION_DAYS,
  now = new Date(),
) {
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - retentionDays);
  const cutoffKey = cutoff.toISOString().slice(0, 10);

  return records.filter((record) => record.date >= cutoffKey);
}

export function getOfficeDailyProgressLabel(
  state: OfficeDailyStateRecord,
  articleRequiredToday = true,
) {
  return getChecklistProgressLabel(state.checklist, articleRequiredToday).label;
}
