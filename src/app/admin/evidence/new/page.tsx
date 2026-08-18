import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { EvidenceEditor } from "@/components/admin/evidence-editor";
import { requireAdmin } from "@/lib/auth/permissions";
import { getCmsStorageStatus } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export default async function NewEvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireAdmin();
  const storageStatus = getCmsStorageStatus();
  const params = await searchParams;

  return (
    <AdminShell
      title="New evidence"
      description="Save a real field example without needing to publish an article first."
      currentPath="/admin/evidence"
      userLabel={session.username}
      storageStatus={storageStatus}
    >
      {params.error ? (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
          {params.error}
        </div>
      ) : null}

      {storageStatus.healthy ? (
        <EvidenceEditor />
      ) : (
        <AdminStorageUnavailablePanel
          title="Evidence creation is paused."
          description="Restore shared Blob storage before creating or saving evidence drafts on this deployment."
        />
      )}
    </AdminShell>
  );
}
