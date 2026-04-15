import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/options";
import { ArticleEditor } from "@/app/admin/articles/[slug]/page";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const session = await requireAdmin();

  return (
    <AdminShell
      title="New article"
      description="Write or paste a new SEO article in markdown. Internal links and structured metadata are controlled directly here."
      currentPath="/admin/articles"
      userLabel={session.username}
    >
      <ArticleEditor />
    </AdminShell>
  );
}