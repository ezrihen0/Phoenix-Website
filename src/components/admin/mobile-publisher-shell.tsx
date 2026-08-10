import type { ReactNode } from "react";

type MobilePublisherShellProps = {
  children: ReactNode;
  userLabel: string;
};

export function MobilePublisherShell({ children, userLabel }: MobilePublisherShellProps) {
  return (
    <>
      <style>{`
        body:has([data-publisher-shell="true"]) > div.relative > header,
        body:has([data-publisher-shell="true"]) > div.relative > footer,
        body:has([data-publisher-shell="true"]) > div.relative > div.fixed {
          display: none;
        }

        body:has([data-publisher-shell="true"]) > div.relative {
          padding-bottom: 0;
        }
      `}</style>

      <div data-publisher-shell="true" className="mx-auto w-full max-w-lg px-4 pb-32 pt-5 sm:px-5">
        <header className="mb-6 space-y-2">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-ember)]">
            Article publisher
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
            New article
          </h1>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Signed in as {userLabel}. Create and publish content for your articles section.
          </p>
        </header>

        {children}
      </div>
    </>
  );
}
