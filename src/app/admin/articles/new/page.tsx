import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { requireArticlesAccess } from "@/lib/auth/permissions";
import { getCmsStorageStatus } from "@/lib/cms/storage";
import { ArticleEditor } from "@/app/admin/articles/[slug]/page";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const session = await requireArticlesAccess();
  const storageStatus = getCmsStorageStatus();

  return (
    <AdminShell
      title="New article"
      description="Write or paste a new SEO article in markdown. Internal links and structured metadata are controlled directly here."
      currentPath="/admin/articles"
      userLabel={session.username}
      userRole={session.role}
      storageStatus={storageStatus}
    >
      {storageStatus.healthy ? (
        <ArticleEditor />
      ) : (
        <AdminStorageUnavailablePanel
          title="New article creation is paused."
          description="Restore shared Blob storage before creating or saving article drafts on this deployment."
        />
      )}
    </AdminShell>
  );
}