import Link from "next/link";
import type { ReactNode } from "react";

import { AdminSignOutButton } from "@/components/admin/admin-sign-out-button";
import { AdminStorageStatusBanner } from "@/components/admin/admin-storage-status";
import type { CmsStorageStatus } from "@/lib/cms/storage";

type AdminShellProps = {
  children: ReactNode;
  title: string;
  description: string;
  currentPath: string;
  userLabel: string;
  storageStatus?: CmsStorageStatus;
};

const navLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminShell({
  children,
  title,
  description,
  currentPath,
  userLabel,
  storageStatus,
}: AdminShellProps) {
  return (
    <section className="pb-14 pt-4 sm:pb-18 sm:pt-6">
      <div className="page-frame space-y-6">
        <div className="flex flex-col gap-6 rounded-[2.5rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow">Admin</p>
              <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-5xl">
                {title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] sm:text-base">
                {description}
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-[1.75rem] border border-[var(--color-border)] bg-white/70 px-5 py-4 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
              <span>Signed in as {userLabel}</span>
              <AdminSignOutButton />
            </div>
          </div>
          <nav className="flex flex-wrap gap-3">
            {navLinks.map((item) => {
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                      : "border border-[var(--color-border)] bg-white/65 hover:bg-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {storageStatus ? <AdminStorageStatusBanner status={storageStatus} /> : null}

        {children}
      </div>
    </section>
  );
}