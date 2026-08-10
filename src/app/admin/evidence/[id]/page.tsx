import { notFound } from "next/navigation";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { EvidenceEditor } from "@/components/admin/evidence-editor";
import { requireAdmin } from "@/lib/auth/options";
import { getCmsStorageStatus, getEvidenceById } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export default async function EditEvidencePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const session = await requireAdmin();
  const storageStatus = getCmsStorageStatus();
  const [{ id }, pageState] = await Promise.all([params, searchParams]);

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Edit evidence"
        description="Review field context, image provenance, and publication safety before anything goes public."
        currentPath="/admin/evidence"
        userLabel={session.username}
        storageStatus={storageStatus}
      >
        <AdminStorageUnavailablePanel
          title="Evidence editing is paused."
          description="Restore shared Blob storage before loading or saving evidence drafts on this deployment."
        />
      </AdminShell>
    );
  }

  const evidence = await getEvidenceById(id);

  if (!evidence) {
    notFound();
  }

  return (
    <AdminShell
      title="Edit evidence"
      description="Review field context, image provenance, and publication safety before anything goes public."
      currentPath="/admin/evidence"
      userLabel={session.username}
      storageStatus={storageStatus}
    >
      {pageState.saved ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          Evidence saved.
        </div>
      ) : null}

      {pageState.error ? (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
          {pageState.error}
        </div>
      ) : null}

      <EvidenceEditor evidence={evidence} />
    </AdminShell>
  );
}
