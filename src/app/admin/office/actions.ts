"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireOfficeDashboardAccess } from "@/lib/auth/permissions";
import type { OfficeArticleTaskState, OfficeChecklistTaskId } from "@/lib/cms/types";
import {
  getArticleById,
  getOfficeDailyState,
  saveOfficeDailyState,
} from "@/lib/cms/storage";
import { getSiteDateKey } from "@/lib/datetime";
import { getTodaysArticleCalendarEntry } from "@/lib/office/article-calendar";
import {
  canMarkArticleTaskDone,
  createEmptyOfficeDailyState,
  deriveArticleTaskStatus,
  syncArticleChecklistCompletion,
} from "@/lib/office/daily-state";

export type OfficeActionResult = { ok: true } | { ok: false; message: string };

const checklistTaskSchema = z.object({
  taskId: z.enum([
    "review-new-overnight-leads",
    "review-todays-calendar",
    "check-office-inbox",
    "review-yesterdays-unresolved-leads",
    "complete-todays-article",
    "morning-review-completed",
  ] satisfies [OfficeChecklistTaskId, ...OfficeChecklistTaskId[]]),
});

async function loadOfficeDailyState(username: string, dateKey = getSiteDateKey()) {
  const existing = await getOfficeDailyState(dateKey, username);
  return existing || createEmptyOfficeDailyState(dateKey, username);
}

async function persistOfficeDailyState(
  state: Awaited<ReturnType<typeof loadOfficeDailyState>>,
  linkedArticleId?: string,
) {
  const article = linkedArticleId
    ? await getArticleById(linkedArticleId, { includeDrafts: true })
    : state.articleTask?.linkedArticleId
      ? await getArticleById(state.articleTask.linkedArticleId, { includeDrafts: true })
      : null;

  const synced = syncArticleChecklistCompletion(state, article, state.username);
  await saveOfficeDailyState(synced);
  revalidatePath("/admin/office");
  revalidatePath("/admin");
  return synced;
}

export async function completeOfficeChecklistTaskAction(
  taskId: OfficeChecklistTaskId,
): Promise<OfficeActionResult> {
  const session = await requireOfficeDashboardAccess();
  const parsed = checklistTaskSchema.safeParse({ taskId });

  if (!parsed.success) {
    return { ok: false, message: "Invalid checklist task." };
  }

  if (parsed.data.taskId === "complete-todays-article") {
    return {
      ok: false,
      message: "Today's article is completed automatically once publish and image requirements are satisfied.",
    };
  }

  const state = await loadOfficeDailyState(session.username);

  if (state.checklist.some((entry) => entry.taskId === parsed.data.taskId)) {
    return { ok: false, message: "This checklist item is already complete." };
  }

  const nextState = {
    ...state,
    checklist: [
      ...state.checklist,
      {
        taskId: parsed.data.taskId,
        completedAt: new Date().toISOString(),
        completedBy: session.username,
      },
    ],
    updatedAt: new Date().toISOString(),
  };

  await persistOfficeDailyState(nextState);

  return { ok: true };
}

export async function linkOfficeArticleAction(articleId: string): Promise<OfficeActionResult> {
  const session = await requireOfficeDashboardAccess();
  const trimmedArticleId = articleId.trim();

  if (!trimmedArticleId) {
    return { ok: false, message: "Select an article to link." };
  }

  const article = await getArticleById(trimmedArticleId, { includeDrafts: true });

  if (!article) {
    return { ok: false, message: "Article not found." };
  }

  const calendar = getTodaysArticleCalendarEntry();
  const dateKey = getSiteDateKey();
  const state = await loadOfficeDailyState(session.username);
  const calendarEntry = calendar.loaded ? calendar.entry : null;

  const articleTask: OfficeArticleTaskState = {
    calendarDate: dateKey,
    website: calendarEntry?.website || state.articleTask?.website || "unknown",
    topic: calendarEntry?.topic || article.title,
    status: "in-progress",
    linkedArticleId: article.id,
    aiImageProvidedAt: state.articleTask?.aiImageProvidedAt,
    realImageProvidedAt: state.articleTask?.realImageProvidedAt,
    managerImageRequestedAt: state.articleTask?.managerImageRequestedAt,
    completedAt: undefined,
    completedBy: undefined,
  };

  await persistOfficeDailyState({
    ...state,
    articleTask: {
      ...articleTask,
      status: deriveArticleTaskStatus(articleTask, article),
    },
  });

  return { ok: true };
}

export async function markOfficeAiImageProvidedAction(): Promise<OfficeActionResult> {
  const session = await requireOfficeDashboardAccess();
  const state = await loadOfficeDailyState(session.username);

  if (!state.articleTask) {
    return { ok: false, message: "Start today's article task before marking the AI image." };
  }

  const nextTask: OfficeArticleTaskState = {
    ...state.articleTask,
    aiImageProvidedAt: new Date().toISOString(),
    status: "in-progress",
  };

  await persistOfficeDailyState({
    ...state,
    articleTask: nextTask,
  });

  return { ok: true };
}

export async function markOfficeRealImageProvidedAction(): Promise<OfficeActionResult> {
  const session = await requireOfficeDashboardAccess();
  const state = await loadOfficeDailyState(session.username);

  if (!state.articleTask) {
    return { ok: false, message: "Start today's article task before marking the real image." };
  }

  const nextTask: OfficeArticleTaskState = {
    ...state.articleTask,
    realImageProvidedAt: new Date().toISOString(),
    managerImageRequestedAt: undefined,
    status: "in-progress",
  };

  await persistOfficeDailyState({
    ...state,
    articleTask: nextTask,
  });

  return { ok: true };
}

export async function requestOfficeManagerImageAction(): Promise<OfficeActionResult> {
  const session = await requireOfficeDashboardAccess();
  const state = await loadOfficeDailyState(session.username);

  if (!state.articleTask) {
    return { ok: false, message: "Start today's article task before requesting a manager image." };
  }

  const nextTask: OfficeArticleTaskState = {
    ...state.articleTask,
    managerImageRequestedAt: new Date().toISOString(),
    realImageProvidedAt: undefined,
    status: "waiting-for-manager-image",
  };

  await persistOfficeDailyState({
    ...state,
    articleTask: nextTask,
  });

  return { ok: true };
}

export async function completeOfficeArticleTaskAction(): Promise<OfficeActionResult> {
  const session = await requireOfficeDashboardAccess();
  const state = await loadOfficeDailyState(session.username);

  if (!state.articleTask) {
    return { ok: false, message: "No article task is in progress for today." };
  }

  const article = state.articleTask.linkedArticleId
    ? await getArticleById(state.articleTask.linkedArticleId, { includeDrafts: true })
    : null;
  const gate = canMarkArticleTaskDone(state.articleTask, article);

  if (!gate.ok) {
    return { ok: false, message: gate.reason };
  }

  const completedAt = new Date().toISOString();
  const nextTask: OfficeArticleTaskState = {
    ...state.articleTask,
    status: "done",
    completedAt,
    completedBy: session.username,
  };

  await persistOfficeDailyState({
    ...state,
    articleTask: nextTask,
  });

  return { ok: true };
}

export async function initializeOfficeArticleTaskAction(): Promise<OfficeActionResult> {
  const session = await requireOfficeDashboardAccess();
  const calendar = getTodaysArticleCalendarEntry();

  if (!calendar.loaded) {
    return { ok: false, message: calendar.message };
  }

  if (!calendar.entry) {
    return { ok: false, message: "No article is scheduled for today." };
  }

  const state = await loadOfficeDailyState(session.username);

  if (state.articleTask) {
    return { ok: true };
  }

  const articleTask: OfficeArticleTaskState = {
    calendarDate: calendar.date,
    website: calendar.entry.website,
    topic: calendar.entry.topic,
    status: "pending",
  };

  await persistOfficeDailyState({
    ...state,
    articleTask,
  });

  return { ok: true };
}
