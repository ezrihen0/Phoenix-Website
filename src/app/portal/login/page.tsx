import Link from "next/link";

import { PortalLoginForm } from "@/components/portal/portal-login-form";
import { getPortalConnectionStatus } from "@/lib/portal/adapter";

export default function PortalLoginPage() {
  const connection = getPortalConnectionStatus();

  return (
    <section className="section-pad">
      <div className="page-frame">
        <div className="mx-auto max-w-xl rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-12 shadow-[0_24px_70px_rgba(31,26,22,0.12)] sm:px-10">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[var(--color-ember)]">
            Passwordless access
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[var(--color-ink)]">
            Customer portal login
          </h1>
          <p className="mt-5 text-sm leading-7 text-[var(--color-muted)]">
            Enter the email on your Phoenix job. When WizField is connected, a magic link will open a
            bound portal session. Staff login stays at /admin.
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">{connection.message}</p>
          <div className="mt-8">
            <PortalLoginForm />
          </div>
          <p className="mt-8 text-sm">
            <Link href="/portal" className="font-semibold text-[var(--color-ember)]">
              Return to portal
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
