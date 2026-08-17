import Link from "next/link";
import { CalendarDays, FileText, Images, Inbox, Settings } from "lucide-react";

import { updateAiModelAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { requireAdmin } from "@/lib/auth/options";
import { AI_MODEL_OPTIONS, getAiModelLabel } from "@/lib/ai/model-options";
import { getCmsStorageStatus, getSiteSettings, listArticles, listEvidence, listLeads } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ aiModelSaved?: string; error?: string }>;
}) {
  const session = await requireAdmin();
  const storageStatus = getCmsStorageStatus();
  const params = await searchParams;

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Website admin"
        description="Manage articles, update website settings, and control the daily AI publishing pipeline from one protected workspace."
        currentPath="/admin"
        userLabel={session.username}
        storageStatus={storageStatus}
      >
        <AdminStorageUnavailablePanel
          title="Dashboard content actions are paused."
          description="Shared Blob storage needs attention before dashboard metrics, AI article generation, and settings changes can be trusted on this deployment."
        />
      </AdminShell>
    );
  }

  const [articles, evidence, leads, settings] = await Promise.all([
    listArticles({ includeDrafts: true }),
    listEvidence(),
    listLeads(),
    getSiteSettings(),
  ]);
  const publishedCount = articles.filter((article) => article.status === "published").length;

  return (
    <AdminShell
      title="Website admin"
      description="Manage articles, update website settings, and control the daily AI publishing pipeline from one protected workspace."
      currentPath="/admin"
      userLabel={session.username}
      storageStatus={storageStatus}
    >
      {params.error ? (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
          {params.error}
        </div>
      ) : null}

      {params.aiModelSaved ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          AI model updated.
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <Card title="Articles" value={String(articles.length)} icon={<FileText className="h-5 w-5" />} />
        <Card title="Published" value={String(publishedCount)} icon={<CalendarDays className="h-5 w-5" />} />
        <Card title="Evidence" value={String(evidence.length)} icon={<Images className="h-5 w-5" />} />
        <Card title="Leads" value={String(leads.length)} icon={<Inbox className="h-5 w-5" />} />
        <Card title="AI model" value={getAiModelLabel(settings.aiModel)} icon={<Settings className="h-5 w-5" />} />
      </div>

      <div className="grid gap-5 xl:grid-cols-4">
        <ActionPanel
          title="Content"
          description="Create manual articles, review AI-generated posts, and maintain internal linking coverage."
          href="/admin/articles"
          cta="Manage articles"
        />
        <ActionPanel
          title="Evidence"
          description="Capture real field examples, review image provenance, and control what proof can be shown publicly."
          href="/admin/evidence"
          cta="Open evidence"
        />
        <ActionPanel
          title="Lead inbox"
          description="Review every website and contact-form submission, including inbox email delivery status."
          href="/admin/leads"
          cta="Open lead inbox"
        />
        <ActionPanel
          title="Site settings"
          description="Update inbox email settings, business details, and the AI content prompt used by the daily publishing job."
          href="/admin/settings"
          cta="Edit settings"
        />
      </div>

      <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">AI model</p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
              Switch the article generator without leaving the dashboard.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Choose the model you want the daily writer to use. The current selection is highlighted.
            </p>
          </div>
          <form action={updateAiModelAction} className="flex flex-wrap gap-3 lg:max-w-xl lg:justify-end">
            {AI_MODEL_OPTIONS.map((option) => {
              const isActive = settings.aiModel === option.value;

              return (
                <button
                  key={option.value}
                  type="submit"
                  name="aiModel"
                  value={option.value}
                  className={`rounded-[1.5rem] border px-4 py-3 text-left text-sm transition ${isActive
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border-[var(--color-border)] bg-white hover:border-[var(--color-ink)]"
                    }`}
                >
                  <span className="block font-semibold">{option.label}</span>
                  <span className={`mt-1 block text-xs leading-5 ${isActive ? "text-[var(--color-paper)]/70" : "text-[var(--color-muted)]"}`}>
                    {option.description}
                  </span>
                </button>
              );
            })}
          </form>
        </div>
      </div>
    </AdminShell>
  );
}

function Card({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6">
      <div className="flex items-center justify-between gap-3 text-[var(--color-ember)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em]">{title}</p>
        {icon}
      </div>
      <p className="mt-4 text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

function ActionPanel({
  title,
  description,
  href,
  cta,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-[2rem] border border-[var(--color-border)] bg-white/75 p-6">
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{description}</p>
      <Link href={href} className="mt-5 inline-flex rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]">
        {cta}
      </Link>
    </div>
  );
}