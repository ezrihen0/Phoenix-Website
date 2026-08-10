import { AdminShell } from "@/components/admin/admin-shell";
import { ArticleMigrationPanel } from "@/components/admin/article-migration-panel";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { requireAdmin } from "@/lib/auth/options";
import {
  buildArticleMigrationReport,
  getDefaultApprovedSeedIds,
} from "@/lib/cms/article-migration";
import {
  getCmsStorageStatus,
  listArticleSnapshots,
  listArticles,
  readStoredArticlesRaw,
} from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export default async function AdminArticleMigrationPage({
  searchParams,
}: {
  searchParams: Promise<{
    applied?: string;
    restored?: string;
    count?: string;
    snapshot?: string;
    error?: string;
  }>;
}) {
  const session = await requireAdmin();
  const storageStatus = getCmsStorageStatus();
  const params = await searchParams;

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Article migration"
        description="Inventory stored articles, review Phase C proposals, and apply production-safe upgrades."
        currentPath="/admin/articles/migrate"
        userLabel={session.username}
        storageStatus={storageStatus}
      >
        <AdminStorageUnavailablePanel
          title="Article migration is paused."
          description="Blob storage must be healthy before running inventory or applying migrations."
        />
      </AdminShell>
    );
  }

  const [storedArticles, mergedArticles, snapshots] = await Promise.all([
    readStoredArticlesRaw(),
    listArticles({ includeDrafts: true }),
    listArticleSnapshots(),
  ]);
  const report = buildArticleMigrationReport(storedArticles, mergedArticles);
  const defaultApprovedIds = getDefaultApprovedSeedIds();

  return (
    <AdminShell
      title="Article migration"
      description="Inventory stored articles, review Phase C seed rewrites, and apply owner-approved updates with snapshot rollback."
      currentPath="/admin/articles/migrate"
      userLabel={session.username}
      storageStatus={storageStatus}
    >
      {params.error ? (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
          {params.error}
        </div>
      ) : null}

      {params.applied ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-800">
          Migration applied to {params.count || "stored"} articles.
          {params.snapshot ? ` Snapshot: ${params.snapshot}` : null}
        </div>
      ) : null}

      {params.restored ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-800">
          Snapshot restored ({params.count || "stored"} articles in storage).
        </div>
      ) : null}

      <ArticleMigrationPanel
        initialReport={report}
        defaultApprovedIds={defaultApprovedIds}
        snapshots={snapshots}
      />
    </AdminShell>
  );
}
