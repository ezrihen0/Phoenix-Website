import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { OfficeDailyDashboard } from "@/components/admin/office-daily-dashboard";
import { requireOfficeDashboardAccess } from "@/lib/auth/permissions";
import {
  getArticleById,
  getCmsStorageStatus,
  getOfficeDailyState,
  listArticles,
  saveOfficeDailyState,
} from "@/lib/cms/storage";
import { formatSiteDate, getSiteDateKey } from "@/lib/datetime";
import {
  getNextArticleCalendarEntry,
  getTodaysArticleCalendarEntry,
} from "@/lib/office/article-calendar";
import { isArticleScheduledToday } from "@/lib/office/daily-checklist";
import { createEmptyOfficeDailyState, syncArticleChecklistCompletion } from "@/lib/office/daily-state";

export const dynamic = "force-dynamic";

export default async function OfficeDashboardPage() {
  const session = await requireOfficeDashboardAccess();
  const storageStatus = getCmsStorageStatus();
  const dateKey = getSiteDateKey();
  const dateLabel = formatSiteDate(new Date());

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Office dashboard"
        description="Start each day with today's operational checklist and article task."
        currentPath="/admin/office"
        userLabel={session.username}
        userRole={session.role}
        storageStatus={storageStatus}
      >
        <AdminStorageUnavailablePanel
          title="Office daily state is temporarily unavailable."
          description="Shared Blob storage needs to be healthy before today's checklist and article task can be saved."
        />
      </AdminShell>
    );
  }

  const calendar = getTodaysArticleCalendarEntry(dateKey);
  const articleRequiredToday = isArticleScheduledToday(calendar);
  const nextCalendarEntry = calendar.loaded && !calendar.entry ? getNextArticleCalendarEntry(dateKey) : null;
  let dailyState =
    (await getOfficeDailyState(dateKey, session.username)) || createEmptyOfficeDailyState(dateKey, session.username);
  const storedState = dailyState;

  if (calendar.loaded && calendar.entry && !dailyState.articleTask) {
    dailyState = {
      ...dailyState,
      articleTask: {
        calendarDate: calendar.date,
        website: calendar.entry.website,
        topic: calendar.entry.topic,
        status: "pending",
      },
    };
  }

  const linkedArticle = dailyState.articleTask?.linkedArticleId
    ? await getArticleById(dailyState.articleTask.linkedArticleId, { includeDrafts: true })
    : null;

  dailyState = syncArticleChecklistCompletion(dailyState, linkedArticle, session.username);

  if (
    dailyState.checklist.length !== storedState.checklist.length ||
    dailyState.articleTask?.status !== storedState.articleTask?.status ||
    dailyState.articleTask?.linkedArticleId !== storedState.articleTask?.linkedArticleId ||
    Boolean(dailyState.articleTask) !== Boolean(storedState.articleTask)
  ) {
    await saveOfficeDailyState(dailyState);
  }

  const articles = await listArticles({ includeDrafts: true });
  const articleOptions = articles
    .slice()
    .sort((first, second) => new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime())
    .slice(0, 25)
    .map((article) => ({
      id: article.id,
      title: article.title,
      status: article.status,
    }));

  return (
    <AdminShell
      title="Office dashboard"
      description="Start each day with today's operational checklist and article task."
      currentPath="/admin/office"
      userLabel={session.username}
      userRole={session.role}
      storageStatus={storageStatus}
    >
      <OfficeDailyDashboard
        checklist={dailyState.checklist}
        dateLabel={dateLabel}
        articleRequiredToday={articleRequiredToday}
        calendarLoaded={calendar.loaded}
        calendarMessage={calendar.loaded ? "" : calendar.message}
        calendarEntry={calendar.loaded ? calendar.entry : null}
        nextCalendarEntry={nextCalendarEntry}
        articleTask={dailyState.articleTask}
        linkedArticle={
          linkedArticle
            ? {
                id: linkedArticle.id,
                title: linkedArticle.title,
                status: linkedArticle.status,
              }
            : null
        }
        articleOptions={articleOptions}
      />
    </AdminShell>
  );
}
