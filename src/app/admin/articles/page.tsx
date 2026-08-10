import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { GenerateAiArticleForm } from "@/components/admin/generate-ai-article-form";
import { requireAdmin } from "@/lib/auth/options";
import { cities, getCityBySlug, getCityHref } from "@/lib/cities";
import { formatArticleDate } from "@/lib/cms/helpers";
import { getCmsStorageStatus, listArticles } from "@/lib/cms/storage";
import { deleteArticleAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ skipped?: string; deleted?: string; error?: string; city?: string }>;
}) {
  const session = await requireAdmin();
  const storageStatus = getCmsStorageStatus();
  const params = await searchParams;
  const selectedCity = getCityBySlug(params.city || "")?.slug;

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Articles"
        description="Create, edit, publish, or delete blog posts. You can also trigger the AI writer manually here."
        currentPath="/admin/articles"
        userLabel={session.username}
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

  const articles = await listArticles({ includeDrafts: true, city: selectedCity });

  return (
    <AdminShell
      title="Articles"
      description="Create, edit, publish, or delete blog posts. You can also trigger the AI writer manually here."
      currentPath="/admin/articles"
      userLabel={session.username}
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
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/articles"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCity ? "border border-[var(--color-border)] bg-white/65 hover:bg-white" : "bg-[var(--color-ink)] text-[var(--color-paper)]"}`}
          >
            All cities
          </Link>
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/admin/articles?city=${city.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCity === city.slug ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-border)] bg-white/65 hover:bg-white"}`}
            >
              {city.name}
            </Link>
          ))}
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
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                  {article.city} · {article.status} · {article.aiGenerated ? "AI-assisted" : "Manual"}
                </p>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  {formatArticleDate(article.status === "published" ? article.publishedAt : article.updatedAt)}
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