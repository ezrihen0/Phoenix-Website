import type { Metadata } from "next";

import { portalRobots } from "@/lib/portal/metadata";

export const metadata: Metadata = {
  title: "Customer Portal | Phoenix Chimney & Fireplace",
  description:
    "Phoenix customer portal for job status, quotes, invoices, inspections, and warranty documents.",
  robots: portalRobots,
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-portal-shell="true" className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      {children}
    </div>
  );
}
