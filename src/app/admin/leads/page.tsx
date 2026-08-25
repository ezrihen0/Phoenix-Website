import Link from "next/link";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { LeadInboxList } from "@/components/admin/lead-inbox-list";
import { LeadInboxSummary } from "@/components/admin/lead-inbox-summary";
import { requireLeadsAccess } from "@/lib/auth/permissions";
import { cities, getCityBySlug } from "@/lib/cities";
import { getCmsStorageStatus, listLeads } from "@/lib/cms/storage";
import { summarizeLeads } from "@/lib/leads/handling";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function buildLeadsHref(city?: string, page?: number) {
  const params = new URLSearchParams();
  if (city) {
    params.set("city", city);
  }
  if (page && page > 1) {
    params.set("page", String(page));
  }
  const query = params.toString();
  return query ? `/admin/leads?${query}` : "/admin/leads";
}

function resolvePage(rawPage: string | undefined, totalPages: number) {
  const parsed = Number.parseInt(rawPage ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  if (totalPages < 1) {
    return 1;
  }
  return Math.min(parsed, totalPages);
}

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; page?: string }>;
}) {
  const session = await requireLeadsAccess();
  const storageStatus = getCmsStorageStatus();
  const params = await searchParams;
  const selectedCity = getCityBySlug(params.city || "")?.slug;

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Lead inbox"
        description="Review incoming Request Service leads, record booking outcomes, and track office handling time."
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
  const totalPages = Math.max(1, Math.ceil(leads.length / PAGE_SIZE));
  const currentPage = resolvePage(params.page, totalPages);
  const paginatedLeads = leads.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const showPagination = !loadError && leads.length > PAGE_SIZE;

  return (
    <AdminShell
      title="Lead inbox"
      description="Review incoming Request Service leads, record booking outcomes, and track office handling time."
      currentPath="/admin/leads"
      userLabel={session.username}
      userRole={session.role}
      storageStatus={storageStatus}
    >
      <div className="flex flex-wrap gap-3">
        <Link
          href={buildLeadsHref()}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedCity ? "border border-[var(--color-border)] bg-white/65 hover:bg-white" : "bg-[var(--color-ink)] text-[var(--color-paper)]"}`}
        >
          All cities
        </Link>
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={buildLeadsHref(city.slug)}
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
        <>
          <LeadInboxList leads={paginatedLeads} />
          {showPagination ? (
            <nav
              aria-label="Lead inbox pagination"
              className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm font-semibold text-[var(--color-ink)]"
            >
              {currentPage > 1 ? (
                <Link
                  href={buildLeadsHref(selectedCity, currentPage - 1)}
                  className="rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 transition hover:bg-white"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-full border border-[var(--color-border)] bg-white/40 px-4 py-2 text-[var(--color-muted)]">
                  Previous
                </span>
              )}
              <span>
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={buildLeadsHref(selectedCity, currentPage + 1)}
                  className="rounded-full border border-[var(--color-border)] bg-white/70 px-4 py-2 transition hover:bg-white"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-full border border-[var(--color-border)] bg-white/40 px-4 py-2 text-[var(--color-muted)]">
                  Next
                </span>
              )}
            </nav>
          ) : null}
        </>
      ) : (
        <div className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-sm leading-7 text-[var(--color-muted)]">
          No leads have been submitted yet.
        </div>
      )}
    </AdminShell>
  );
}
