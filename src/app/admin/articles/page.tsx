import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { GenerateAiArticleForm } from "@/components/admin/generate-ai-article-form";
import { requireArticlesAccess } from "@/lib/auth/permissions";
import { cities, getCityBySlug, getCityHref } from "@/lib/cities";
import { formatArticleDateTime, getArticleAdminDateLabel } from "@/lib/cms/helpers";
import { getCmsStorageStatus, listArticles } from "@/lib/cms/storage";
import { deleteArticleAction } from "@/app/admin/actions";

import type { Article, ArticleStatus } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

function statusBadgeClass(status: ArticleStatus) {
  switch (status) {
    case "published":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "scheduled":
      return "border-amber-200 bg-amber-50 text-amber-900";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function statusLabel(status: ArticleStatus) {
  switch (status) {
    case "published":
      return "Published";
    case "scheduled":
      return "Scheduled";
    default:
      return "Draft";
  }
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ skipped?: string; deleted?: string; error?: string; city?: string; status?: string }>;
}) {
  const session = await requireArticlesAccess();
  const storageStatus = getCmsStorageStatus();
  const params = await searchParams;
  const selectedCity = getCityBySlug(params.city || "")?.slug;
  const selectedStatus =
    params.status === "draft" || params.status === "scheduled" || params.status === "published"
      ? params.status
      : undefined;

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Articles"
        description="Create, edit, publish, or delete blog posts. Legacy AI generation creates drafts for owner review only."
        currentPath="/admin/articles"
        userLabel={session.username}
        userRole={session.role}
        storageStatus={storageStatus}
      >
        {params.error ? (
          <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
            {params.error}
          </div>
        ) : null}

        <AdminStorageUnavailablePanel
          title="Article publishing is disabled on this deployment."
          description="AI generation, article saves, and deletes should stay paused until shared Blob storage is healthy again."
        />
      </AdminShell>
    );
  }

  const allArticles = await listArticles({ includeDrafts: true, city: selectedCity });
  const articles = selectedStatus
    ? allArticles.filter((article) => article.status === selectedStatus)
    : allArticles;

  const draftCount = allArticles.filter((article) => article.status === "draft").length;
  const scheduledCount = allArticles.filter((article) => article.status === "scheduled").length;
  const publishedCount = allArticles.filter((article) => article.status === "published").length;
  const nextScheduled = allArticles
    .filter((article) => article.status === "scheduled" && article.scheduledAt)
    .sort(
      (first, second) =>
        new Date(first.scheduledAt || 0).getTime() - new Date(second.scheduledAt || 0).getTime(),
    )[0];

  const buildFilterHref = (status?: ArticleStatus) => {
    const query = new URLSearchParams();

    if (selectedCity) {
      query.set("city", selectedCity);
    }

    if (status) {
      query.set("status", status);
    }

    const queryString = query.toString();

    return queryString ? `/admin/articles?${queryString}` : "/admin/articles";
  };

  return (
    <AdminShell
      title="Articles"
      description="Create, edit, publish, or delete blog posts. You can also trigger the AI writer manually here."
      currentPath="/admin/articles"
      userLabel={session.username}
      userRole={session.role}
      storageStatus={storageStatus}
    >
      {params.skipped ? (
        <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          An AI-generated article for that city already exists for today, so a second one was not created.
        </div>
      ) : null}

      {params.deleted ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          Article deleted.
        </div>
      ) : null}

      {params.error ? (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
          {params.error}
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
            <span>
              <strong className="text-[var(--color-ink)]">Draft:</strong> {draftCount}
            </span>
            <span>
              <strong className="text-[var(--color-ink)]">Scheduled:</strong> {scheduledCount}
            </span>
            <span>
              <strong className="text-[var(--color-ink)]">Published:</strong> {publishedCount}
            </span>
          </div>
          {nextScheduled?.scheduledAt ? (
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              <strong className="text-[var(--color-ink)]">Next scheduled publication:</strong>{" "}
              {formatArticleDateTime(nextScheduled.scheduledAt)} — {nextScheduled.title}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={buildFilterHref()}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedStatus ? "border border-[var(--color-border)] bg-white/65 hover:bg-white" : "bg-[var(--color-ink)] text-[var(--color-paper)]"}`}
          >
            All
          </Link>
          <Link
            href={buildFilterHref("draft")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedStatus === "draft" ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-border)] bg-white/65 hover:bg-white"}`}
          >
            Draft
          </Link>
          <Link
            href={buildFilterHref("scheduled")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedStatus === "scheduled" ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-border)] bg-white/65 hover:bg-white"}`}
          >
            Scheduled
          </Link>
          <Link
            href={buildFilterHref("published")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedStatus === "published" ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-border)] bg-white/65 hover:bg-white"}`}
          >
            Published
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={selectedStatus ? `/admin/articles?status=${selectedStatus}` : "/admin/articles"}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCity ? "border border-[var(--color-border)] bg-white/65 hover:bg-white" : "bg-[var(--color-ink)] text-[var(--color-paper)]"}`}
          >
            All cities
          </Link>
          {cities.map((city) => {
            const query = new URLSearchParams({ city: city.slug });

            if (selectedStatus) {
              query.set("status", selectedStatus);
            }

            return (
            <Link
              key={city.slug}
              href={`/admin/articles?${query.toString()}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCity === city.slug ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-border)] bg-white/65 hover:bg-white"}`}
            >
              {city.name}
            </Link>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/articles/new"
            className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
          >
            New article
          </Link>
          <GenerateAiArticleForm />
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <article
            key={article.id}
            className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusBadgeClass(article.status)}`}
                  >
                    {statusLabel(article.status)}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                    {article.city} · {article.aiGenerated ? "AI-assisted" : "Manual"}
                  </p>
                </div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {getArticleAdminDateLabel(article)}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  {article.title}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                  {article.excerpt}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/admin/articles/${article.id}`}
                  className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-paper)]"
                >
                  Edit
                </Link>
                <Link
                  href={getCityHref(article.city, `/articles/${article.slug}`)}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  View
                </Link>
                <form action={deleteArticleAction}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input type="hidden" name="slug" value={article.slug} />
                  <input type="hidden" name="city" value={article.city} />
                  <button
                    type="submit"
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}