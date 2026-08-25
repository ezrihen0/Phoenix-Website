import Link from "next/link";

import { getPortalConnectionStatus, getPortalSnapshot } from "@/lib/portal/adapter";

export default async function PortalHomePage() {
  const connection = getPortalConnectionStatus();
  const snapshot = await getPortalSnapshot(null);

  return (
    <section className="section-pad">
      <div className="page-frame">
        <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-12 shadow-[0_24px_70px_rgba(31,26,22,0.12)] sm:px-10">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[var(--color-ember)]">
            Customer Portal
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
            Your job details will live here
          </h1>
          <p className="mt-5 text-base leading-8 text-[var(--color-muted)]">
            {connection.message}
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            The portal is job-centric: customer, job, quote, invoice, inspection, and warranty.
            Staff admin remains a separate sign-in.
          </p>

          {snapshot ? (
            <p className="mt-6 text-sm text-[var(--color-ink)]">Welcome, {snapshot.customer.displayName}.</p>
          ) : (
            <div className="mt-8 rounded-[1.75rem] border border-dashed border-[var(--color-border)] bg-[rgba(201,95,43,0.06)] px-5 py-5 text-sm leading-7 text-[var(--color-muted)]">
              No customer record is shown while WizField is deferred. Demo homeowners are not used in production.
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/portal/login"
              className="inline-flex rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white"
            >
              Portal sign-in
            </Link>
            <Link
              href="/"
              className="inline-flex rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold"
            >
              Back to Phoenix
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
