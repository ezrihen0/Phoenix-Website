import type { ReactNode } from "react";

import type { PortalPreviewSettings } from "@/lib/portal/ui-preview";

type PortalSettingsTabProps = {
  settings: PortalPreviewSettings;
};

function SettingsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 p-5 shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:p-6">
      <h2 className="text-lg font-semibold tracking-tight text-[var(--color-ink)]">{title}</h2>
      <div className="mt-4 grid gap-3 text-sm leading-7">{children}</div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-muted)]">{label}</span>
      <span className="text-[var(--color-ink)]">{value}</span>
    </p>
  );
}

export function PortalSettingsTab({ settings }: PortalSettingsTabProps) {
  return (
    <div className="grid max-w-3xl gap-5">
      <p className="rounded-2xl bg-[rgba(201,95,43,0.08)] px-4 py-3 text-sm text-[var(--color-muted)]">
        Editing will be available after account integration.
      </p>
      <SettingsCard title="Profile">
        <Field label="Name" value={settings.displayName} />
        <Field label="Email" value={settings.email} />
        <Field label="Phone" value={settings.phone} />
      </SettingsCard>
      <SettingsCard title="Service Address">
        <Field label="Address" value={settings.serviceAddress} />
        <Field label="City" value={settings.cityLabel} />
      </SettingsCard>
      <SettingsCard title="Preferences">
        <Field label="Preferred contact" value={settings.preferredContact} />
        <Field label="Notifications" value={settings.notifications} />
      </SettingsCard>
      <SettingsCard title="Portal Access">
        <p className="text-[var(--color-muted)]">{settings.accessNote}</p>
      </SettingsCard>
    </div>
  );
}
