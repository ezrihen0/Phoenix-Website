import Link from "next/link";

import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { PublishWorkspace } from "@/components/admin/publish-workspace";
import { MobilePublisherShell } from "@/components/admin/mobile-publisher-shell";
import { requireAdmin } from "@/lib/auth/options";
import { getCityBySlug, getCityHref } from "@/lib/cities";
import { getCmsStorageStatus, getSiteSettings } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export default async function AdminPublishPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; slug?: string; city?: string }>;
}) {
  const session = await requireAdmin();
  const storageStatus = getCmsStorageStatus();
  const [params, settings] = await Promise.all([searchParams, getSiteSettings()]);

  const savedCity = getCityBySlug(params.city || "")?.slug;
  const savedSlug = params.slug || "";
  const liveArticleHref =
    savedCity && savedSlug ? getCityHref(savedCity, `/articles/${savedSlug}`) : null;

  return (
    <MobilePublisherShell userLabel={session.username}>
      {params.saved && liveArticleHref ? (
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm leading-6 text-emerald-800">
          <p className="font-semibold">Article saved.</p>
          <Link href={liveArticleHref} className="mt-2 inline-block font-semibold underline">
            View live article
          </Link>
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm leading-6 text-red-800">
          {params.error}
        </div>
      ) : null}

      {storageStatus.healthy ? (
        <PublishWorkspace defaultAuthorName={settings.defaultAuthorName} />
      ) : (
        <AdminStorageUnavailablePanel
          title="Publishing is paused."
          description="Restore shared Blob storage before creating or saving articles on this deployment."
        />
      )}
    </MobilePublisherShell>
  );
}
