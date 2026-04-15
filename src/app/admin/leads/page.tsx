import { Mail, Phone, Send, ShieldCheck } from "lucide-react";

import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { requireAdmin } from "@/lib/auth/options";
import { getCmsStorageStatus, listLeads } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const session = await requireAdmin();
  const storageStatus = getCmsStorageStatus();

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Lead inbox"
        description="Every contact-form submission is captured here, along with booking-sync and email-delivery status."
        currentPath="/admin/leads"
        userLabel={session.username}
        storageStatus={storageStatus}
      >
        <AdminStorageUnavailablePanel
          title="Lead inbox data is temporarily unavailable."
          description="Shared Blob storage needs to be healthy before admin can rely on stored lead history for this deployment."
        />
      </AdminShell>
    );
  }

  const leads = await listLeads();

  return (
    <AdminShell
      title="Lead inbox"
      description="Every contact-form submission is captured here, along with booking-sync and email-delivery status."
      currentPath="/admin/leads"
      userLabel={session.username}
      storageStatus={storageStatus}
    >
      {leads.length ? (
        <div className="space-y-4">
          {leads.map((lead) => (
            <article
              key={lead.id}
              className="rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                    <span>{formatLeadDate(lead.createdAt)}</span>
                    <StatusPill label="Booking sync" status={lead.bookingDeliveryStatus} />
                    <StatusPill label="Email" status={lead.emailDeliveryStatus} />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  <p className="text-sm font-semibold text-[var(--color-ink)]">{lead.service}</p>
                  <p className="max-w-3xl whitespace-pre-wrap text-sm leading-7 text-[var(--color-muted)]">
                    {lead.message}
                  </p>
                </div>
                <div className="grid gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 p-4 text-sm text-[var(--color-muted)] sm:min-w-[18rem]">
                  <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-2 font-semibold text-[var(--color-ink)]">
                    <Phone className="h-4 w-4 text-[var(--color-ember)]" />
                    {lead.phone}
                  </a>
                  <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-2 font-semibold text-[var(--color-ink)]">
                    <Mail className="h-4 w-4 text-[var(--color-ember)]" />
                    {lead.email}
                  </a>
                  <p>
                    <span className="font-semibold text-[var(--color-ink)]">Preferred day:</span>{" "}
                    {lead.preferredDay || "Not provided"}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--color-ink)]">Preferred time:</span>{" "}
                    {lead.preferredTime || "Not provided"}
                  </p>
                  {lead.bookingDeliveryNote ? (
                    <p>
                      <span className="font-semibold text-[var(--color-ink)]">Booking note:</span>{" "}
                      {lead.bookingDeliveryNote}
                    </p>
                  ) : null}
                  {lead.emailDeliveryNote ? (
                    <p>
                      <span className="font-semibold text-[var(--color-ink)]">Email note:</span>{" "}
                      {lead.emailDeliveryNote}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
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

function StatusPill({
  label,
  status,
}: {
  label: string;
  status: "sent" | "skipped" | "failed";
}) {
  const classes =
    status === "sent"
      ? "bg-emerald-50 text-emerald-700"
      : status === "failed"
        ? "bg-red-50 text-red-700"
        : "bg-stone-100 text-stone-700";
  const Icon = status === "sent" ? ShieldCheck : status === "failed" ? Send : Send;

  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}: {status}
    </span>
  );
}

function formatLeadDate(value: string) {
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}