import { OfficeChecklistCard } from "@/components/admin/office-checklist-card";
import { TodaysArticleCard } from "@/components/admin/todays-article-card";
import type { Article } from "@/lib/cms/types";
import type { ArticleCalendarEntry } from "@/lib/office/article-calendar";
import type { OfficeArticleTaskState, OfficeChecklistCompletion } from "@/lib/cms/types";

type ArticleOption = {
  id: string;
  title: string;
  status: Article["status"];
};

type OfficeDailyDashboardProps = {
  checklist: OfficeChecklistCompletion[];
  dateLabel: string;
  articleRequiredToday: boolean;
  calendarLoaded: boolean;
  calendarMessage: string;
  calendarEntry: ArticleCalendarEntry | null;
  nextCalendarEntry: ArticleCalendarEntry | null;
  articleTask?: OfficeArticleTaskState;
  linkedArticle?: Pick<Article, "id" | "title" | "status"> | null;
  articleOptions: ArticleOption[];
};

export function OfficeDailyDashboard({
  checklist,
  dateLabel,
  articleRequiredToday,
  calendarLoaded,
  calendarMessage,
  calendarEntry,
  nextCalendarEntry,
  articleTask,
  linkedArticle,
  articleOptions,
}: OfficeDailyDashboardProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <OfficeChecklistCard
        checklist={checklist}
        dateLabel={dateLabel}
        articleRequiredToday={articleRequiredToday}
      />
      <TodaysArticleCard
        calendarLoaded={calendarLoaded}
        calendarMessage={calendarMessage}
        calendarEntry={calendarEntry}
        nextCalendarEntry={nextCalendarEntry}
        articleTask={articleTask}
        linkedArticle={linkedArticle}
        articleOptions={articleOptions}
        dateLabel={dateLabel}
      />
    </div>
  );
}
