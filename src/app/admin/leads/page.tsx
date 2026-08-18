import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { LeadCard } from "@/components/admin/lead-card";
import { LeadInboxSummary } from "@/components/admin/lead-inbox-summary";
import { requireLeadsAccess } from "@/lib/auth/permissions";
import { cities, getCityBySlug } from "@/lib/cities";
import { getCmsStorageStatus, listLeads } from "@/lib/cms/storage";
import { summarizeLeads } from "@/lib/leads/handling";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const session = await requireLeadsAccess();
  const storageStatus = getCmsStorageStatus();
  const params = await searchParams;
  const selectedCity = getCityBySlug(params.city || "")?.slug;

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Lead inbox"
        description="Review incoming leads, record booking outcomes, and track office handling time."
        currentPath="/admin/leads"
        userLabel={session.username}
        userRole={session.role}
        storageStatus={storageStatus}
      >
        <AdminStorageUnavailablePanel
          title="Lead inbox data is temporarily unavailable."
          description="Shared Blob storage needs to be healthy before admin can rely on stored lead history for this deployment."
        />
      </AdminShell>
    );
  }

  let leads: Awaited<ReturnType<typeof listLeads>> = [];
  let loadError: string | null = null;

  try {
    leads = await listLeads({ city: selectedCity });
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Lead inbox data could not be read from storage.";
  }

  const summary = summarizeLeads(leads);

  return (
    <AdminShell
      title="Lead inbox"
      description="Review incoming leads, record booking outcomes, and track office handling time."
      currentPath="/admin/leads"
      userLabel={session.username}
      userRole={session.role}
      storageStatus={storageStatus}
    >
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/leads"
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCity ? "border border-[var(--color-border)] bg-white/65 hover:bg-white" : "bg-[var(--color-ink)] text-[var(--color-paper)]"}`}
        >
          All cities
        </Link>
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/admin/leads?city=${city.slug}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCity === city.slug ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "border border-[var(--color-border)] bg-white/65 hover:bg-white"}`}
          >
            {city.name}
          </Link>
        ))}
      </div>

      {!loadError && leads.length ? <LeadInboxSummary summary={summary} /> : null}

      {loadError ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-sm leading-7 text-red-800">
          {loadError}
        </div>
      ) : leads.length ? (
        <div className="space-y-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-sm leading-7 text-[var(--color-muted)]">
          No leads have been submitted yet.
        </div>
      )}
    </AdminShell>
  );
}
