import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { requireAdmin } from "@/lib/auth/options";
import { cities, getCityBySlug } from "@/lib/cities";
import { getCmsStorageStatus, listEvidence } from "@/lib/cms/storage";
import { evidenceServiceOptions } from "@/lib/evidence";

export const dynamic = "force-dynamic";

export default async function AdminEvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; saved?: string; error?: string }>;
}) {
  const session = await requireAdmin();
  const storageStatus = getCmsStorageStatus();
  const params = await searchParams;
  const selectedCity = getCityBySlug(params.city || "")?.slug;

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Evidence"
        description="Capture real field examples, review image context, and control what proof can be shown publicly."
        currentPath="/admin/evidence"
        userLabel={session.username}
        storageStatus={storageStatus}
      >
        <AdminStorageUnavailablePanel
          title="Evidence publishing is disabled on this deployment."
          description="Create, review, and publish evidence only after shared Blob storage is healthy again."
        />
      </AdminShell>
    );
  }

  const evidence = await listEvidence({ city: selectedCity });

  return (
    <AdminShell
      title="Evidence"
      description="Capture real field examples, review image context, and control what proof can be shown publicly."
      currentPath="/admin/evidence"
      userLabel={session.username}
      storageStatus={storageStatus}
    >
      {params.saved ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          Evidence saved.
        </div>
      ) : null}

      {params.error ? (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
          {params.error}
        </div>
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/evidence"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedCity
                ? "border border-[var(--color-border)] bg-white/65 hover:bg-white"
                : "bg-[var(--color-ink)] text-[var(--color-paper)]"
            }`}
          >
            All cities
          </Link>
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/admin/evidence?city=${city.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCity === city.slug
                  ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "border border-[var(--color-border)] bg-white/65 hover:bg-white"
              }`}
            >
              {city.name}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/evidence/new"
            className="rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)]"
          >
            New evidence record
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {evidence.length ? (
          evidence.map((record) => {
            const serviceLabels = record.serviceSlugs
              .map(
                (slug) =>
                  evidenceServiceOptions.find((option) => option.slug === slug)?.title ||
                  slug,
              )
              .join(", ");

            return (
              <article
                key={record.id}
                className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                      {record.jobCity} · {record.status} · {record.evidenceType}
                    </p>
                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                      {record.publicData.summaryLabel ||
                        record.publicData.homeownerProblem ||
                        "Untitled field example"}
                    </h2>
                    <p className="max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                      {serviceLabels || "No services attached yet"}
                    </p>
                    {record.publicData.observed || record.publicData.found ? (
                      <p className="max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
                        {record.publicData.observed || record.publicData.found}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/evidence/${record.id}`}
                      className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-[var(--color-paper)]"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-sm leading-7 text-[var(--color-muted)]">
            No evidence records have been saved yet.
          </div>
        )}
      </div>
    </AdminShell>
  );
}
