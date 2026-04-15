import { notFound } from "next/navigation";

import { saveArticleAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { requireAdmin } from "@/lib/auth/options";
import { getArticleBySlug } from "@/lib/cms/storage";
import type { Article } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ generated?: string; saved?: string }>;
}) {
  const session = await requireAdmin();
  const [{ slug }, pageState] = await Promise.all([params, searchParams]);
  const article = await getArticleBySlug(slug, { includeDrafts: true });

  if (!article) {
    notFound();
  }

  return (
    <AdminShell
      title={`Edit: ${article.title}`}
      description="Update article copy, SEO fields, internal links, and publish status."
      currentPath="/admin/articles"
      userLabel={session.username}
    >
      {pageState.generated ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          AI article created. Review the draft, make any edits you want, and save when you are ready.
        </div>
      ) : null}

      {pageState.saved ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          Article saved.
        </div>
      ) : null}

      <ArticleEditor article={article} />
    </AdminShell>
  );
}

export function ArticleEditor({ article }: { article?: Article }) {
  return (
    <form action={saveArticleAction} className="space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
      <input type="hidden" name="originalSlug" value={article?.slug || ""} />
      <input type="hidden" name="createdAt" value={article?.createdAt || ""} />

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Title" name="title" defaultValue={article?.title} required />
        <Field label="Slug" name="slug" defaultValue={article?.slug} placeholder="auto-from-title" />
        <Field label="Excerpt" name="excerpt" defaultValue={article?.excerpt} required className="md:col-span-2" />
        <Field label="SEO title" name="seoTitle" defaultValue={article?.seoTitle} required className="md:col-span-2" />
        <Field label="SEO description" name="seoDescription" defaultValue={article?.seoDescription} required className="md:col-span-2" />
        <Field label="Cover image path" name="coverImage" defaultValue={article?.coverImage} placeholder="/images/photos/hero-fireplace.jpg" className="md:col-span-2" />
        <Field label="Keywords" name="keywords" defaultValue={article?.keywords.join(", ")} required className="md:col-span-2" />
        <Field label="Related slugs" name="relatedSlugs" defaultValue={article?.relatedSlugs.join(", ")} className="md:col-span-2" />
        <Field label="Author" name="authorName" defaultValue={article?.authorName || "Phoenix Editorial Team"} required />
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
          <span>Status</span>
          <select
            name="status"
            defaultValue={article?.status || "draft"}
            className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
        <div className="md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-[var(--color-ink)]">Body markdown</span>
          <MarkdownEditor name="body" defaultValue={article?.body} />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-full bg-[var(--color-ink)] px-6 py-3 font-semibold text-[var(--color-paper)]"
      >
        Save article
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
  className = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)] ${className}`}>
      <span>{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}