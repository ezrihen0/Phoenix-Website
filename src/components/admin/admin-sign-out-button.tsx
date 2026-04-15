import { logoutAdminAction } from "@/app/admin/actions";

export function AdminSignOutButton() {
  return (
    <form action={logoutAdminAction}>
      <button
        type="submit"
        className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold"
      >
        Sign out
      </button>
    </form>
  );
}