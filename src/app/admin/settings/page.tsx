import { AI_MODEL_OPTIONS } from "@/lib/ai/model-options";
import { saveSettingsAction } from "@/app/admin/actions";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminStorageUnavailablePanel } from "@/components/admin/admin-storage-status";
import { requireAdmin } from "@/lib/auth/permissions";
import { getCmsStorageStatus, getSiteSettings } from "@/lib/cms/storage";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const session = await requireAdmin();
  const storageStatus = getCmsStorageStatus();
  const params = await searchParams;

  if (!storageStatus.healthy) {
    return (
      <AdminShell
        title="Site settings"
        description="Manage business details and the AI article configuration that powers daily content generation."
        currentPath="/admin/settings"
        userLabel={session.username}
        storageStatus={storageStatus}
      >
        <AdminStorageUnavailablePanel
          title="Settings changes are paused."
          description="Restore shared Blob storage before editing business details or AI content configuration on this deployment."
        />
      </AdminShell>
    );
  }

  const settings = await getSiteSettings();

  return (
    <AdminShell
      title="Site settings"
      description="Manage business details and the AI article configuration that powers daily content generation."
      currentPath="/admin/settings"
      userLabel={session.username}
      storageStatus={storageStatus}
    >
      {params.error ? (
        <div className="rounded-[1.75rem] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-7 text-red-800">
          {params.error}
        </div>
      ) : null}

      {params.saved ? (
        <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          Settings saved.
        </div>
      ) : null}

      <form action={saveSettingsAction} className="space-y-6 rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Business name" name="businessName" defaultValue={settings.businessName} required />
          <Field label="Legal name" name="legalName" defaultValue={settings.legalName} required />
          <Field label="Site URL" name="siteUrl" defaultValue={settings.siteUrl} required />
          <Field label="Public business email" name="email" defaultValue={settings.email} required />
          <Field label="Sending email (SMTP / Gmail)" name="sendingEmail" defaultValue={settings.sendingEmail} required />
          <Field label="Phone display" name="phoneDisplay" defaultValue={settings.phoneDisplay} required />
          <Field label="Phone href" name="phoneHref" defaultValue={settings.phoneHref} required />
          <Field label="Hours label" name="hoursLabel" defaultValue={settings.hoursLabel} required />
          <Field label="Hours detail" name="hoursDetail" defaultValue={settings.hoursDetail} required />
          <Field label="Map embed URL" name="mapEmbedUrl" defaultValue={settings.mapEmbedUrl} required className="md:col-span-2" />
          <Field label="Service radius" name="serviceRadius" defaultValue={settings.serviceRadius} required className="md:col-span-2" />
          <Field label="Social preview image" name="socialPreview" defaultValue={settings.socialPreview} required className="md:col-span-2" />
          <Field label="Default author name" name="defaultAuthorName" defaultValue={settings.defaultAuthorName} required />
          <Field label="Blog index title" name="blogIndexTitle" defaultValue={settings.blogIndexTitle} required className="md:col-span-2" />
          <Field label="Blog index description" name="blogIndexDescription" defaultValue={settings.blogIndexDescription} required className="md:col-span-2" />
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
            <span>AI model</span>
            <select
              name="aiModel"
              defaultValue={settings.aiModel}
              className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
            >
              {AI_MODEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-start gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--color-muted)]">
            <input
              type="checkbox"
              name="sendLeadEmails"
              defaultChecked={settings.sendLeadEmails}
              className="mt-1 h-4 w-4 rounded border-[var(--color-border)]"
            />
            <span>
              <span className="block font-semibold text-[var(--color-ink)]">Email new leads to the recipient inbox</span>
              Send each website and contact-form lead to the recipient inbox below. Uses Brevo when BREVO_API_KEY is set on the server; otherwise Gmail SMTP with the app password.
            </span>
          </label>
          <Field label="Recipient inbox email (receives notifications)" name="notificationEmail" defaultValue={settings.notificationEmail} required />
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
            <span>Google app password for the sending email</span>
            <input
              type="password"
              name="googleAppPassword"
              placeholder="Leave blank to keep the current sender app password"
              className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)] md:col-span-2">
            <span>AI system prompt</span>
            <textarea
              name="aiSystemPrompt"
              defaultValue={settings.aiSystemPrompt}
              rows={8}
              required
              className="rounded-[1.5rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm leading-7 outline-none"
            />
          </label>
        </div>

        <p className="text-xs leading-6 text-[var(--color-muted)]">
          The public business email is shown across the site. The sending email must be verified in Brevo or Gmail. The recipient inbox email receives new lead notifications. For Brevo, add BREVO_API_KEY in Vercel env vars. For Gmail SMTP, add a Google app password for the sending account below.
        </p>

        <button
          type="submit"
          className="rounded-full bg-[var(--color-ink)] px-6 py-3 font-semibold text-[var(--color-paper)]"
        >
          Save settings
        </button>
      </form>
    </AdminShell>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  className = "",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)] ${className}`}>
      <span>{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}