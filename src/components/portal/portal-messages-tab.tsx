import { Mail, Phone } from "lucide-react";

import { siteConfig } from "@/lib/site-data";

export function PortalMessagesTab() {
  return (
    <div className="mx-auto max-w-xl rounded-[1.75rem] border border-[var(--color-border)] bg-white/90 px-5 py-10 text-center shadow-[0_10px_30px_rgba(31,26,22,0.05)] sm:px-8">
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">Messages</h2>
      <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
        Need help with a current service or document? Contact Phoenix and reference your job number when available.
      </p>
      <p className="mt-3 text-sm font-medium text-[var(--color-ink)]">
        Secure portal messaging is not currently enabled.
      </p>
      <div className="mt-8 grid gap-3">
        <a
          href={`tel:${siteConfig.phoneHref}`}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-ember)] px-5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call Phoenix
        </a>
        <a
          href="/request-service?city=calgary&cta=portal-messages"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--color-border)] px-5 text-sm font-semibold text-[var(--color-ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
        >
          Request Service
        </a>
        {siteConfig.email ? (
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-[var(--color-ember)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ember)]"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Email Phoenix
          </a>
        ) : null}
      </div>
    </div>
  );
}
