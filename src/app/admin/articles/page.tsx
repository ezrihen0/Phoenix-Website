import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/options";
import { listArticles } from "@/lib/cms/storage";
import { deleteArticleAction, generateAiArticleAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const session = await requireAdmin();
  const articles = await listArticles({ includeDrafts: true });

  return (
    <AdminShell
      title="Articles"
      description="Create, edit, publish, or delete blog posts. You can also trigger the AI writer manually here."
      currentPath="/admin/articles"
      userLabel={session.username}
    >
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/articles/new"
          className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
        >
          New article
        </Link>
        <form action={generateAiArticleAction}>
          <button
            type="submit"
            className="rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
          >
            Generate daily AI article now
          </button>
        </form>
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
                  {article.status} · {article.aiGenerated ? "AI-assisted" : "Manual"}
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
                  href={`/admin/articles/${article.slug}`}
                  className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-paper)]"
                >
                  Edit
                </Link>
                <Link
                  href={`/articles/${article.slug}`}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  View
                </Link>
                <form action={deleteArticleAction}>
                  <input type="hidden" name="slug" value={article.slug} />
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