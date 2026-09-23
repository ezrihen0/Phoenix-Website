import { createWettDraftAction } from "@/app/admin/office/wett/actions";
import { WettWorkspaceShell } from "@/components/admin/office/wett/wett-workspace-shell";
import { requireWettReportAccess } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export default async function NewWettReportPage() {
  await requireWettReportAccess();

  return (
    <WettWorkspaceShell title="New WETT Report" backHref="/admin/office/wett">
      <form action={createWettDraftAction} className="rounded-3xl border border-[#d8d0c6] bg-white p-5">
        <p className="text-base leading-7">Create a server draft, then continue in the report workspace.</p>
        <button type="submit" className="mt-5 min-h-12 w-full rounded-full bg-[#1c1816] px-5 text-base font-semibold text-white">
          Create draft
        </button>
      </form>
    </WettWorkspaceShell>
  );
}
