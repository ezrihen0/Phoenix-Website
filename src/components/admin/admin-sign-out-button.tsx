"use client";

import { logoutAdminAction } from "@/app/admin/actions";
import { purgeAllWettLocalRecovery } from "@/lib/wett/local-recovery";

export function AdminSignOutButton() {
  return (
    <form
      action={logoutAdminAction}
      onSubmit={() => {
        purgeAllWettLocalRecovery();
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold"
      >
        Sign out
      </button>
    </form>
  );
}