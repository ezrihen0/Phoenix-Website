import type { ReactNode } from "react";

import { WettFieldGuideButton } from "@/components/admin/office/wett/wett-help";

import Link from "next/link";

export function WettWorkspaceShell({
  title,
  eyebrow = "WETT Reports",
  backHref,
  backLabel = "All reports",
  saveLabel,
  progressLabel,
  showHelp = false,
  children,
}: {
  title: string;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
  saveLabel?: string;
  progressLabel?: string;
  showHelp?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4efe8] text-[#1f1a16]">
      <header className="sticky top-0 z-20 border-b border-[#d8d0c6] bg-[#1c1816] text-white">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            {backHref ? (
              <Link href={backHref} className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e7b89a]">
                {backLabel}
              </Link>
            ) : (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e7b89a]">{eyebrow}</p>
            )}
            <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {showHelp ? <WettFieldGuideButton /> : null}
            <div className="text-right">
              {saveLabel ? <p className="text-sm font-semibold text-[#f4efe8]">{saveLabel}</p> : null}
              {progressLabel ? <p className="text-xs text-[#d8d0c6]">{progressLabel}</p> : null}
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-4 py-5">{children}</main>
    </div>
  );
}
