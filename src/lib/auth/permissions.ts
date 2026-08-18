import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/options";
import { resolveSessionRole, type SessionUser, type UserRole } from "@/lib/auth/types";

export type { SessionUser, UserRole };

export { resolveSessionRole };

const OFFICE_ALLOWED_PREFIXES = [
  "/admin/office",
  "/admin/articles",
  "/admin/publish",
  "/admin/leads",
] as const;

const OFFICE_DENIED_EXACT = ["/admin", "/admin/settings"] as const;

const OFFICE_DENIED_PREFIXES = ["/admin/evidence", "/admin/articles/migrate"] as const;

const ADMIN_DENIED_EXACT = ["/admin/office"] as const;

export function canAccessAdminPath(pathname: string, role: UserRole): boolean {
  if (role === "admin") {
    if (ADMIN_DENIED_EXACT.some((path) => pathname === path)) {
      return false;
    }

    return true;
  }

  if (
    OFFICE_DENIED_EXACT.some((path) => pathname === path) ||
    OFFICE_DENIED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  ) {
    return false;
  }

  return OFFICE_ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function getDefaultAdminPathForRole(role: UserRole): string {
  return role === "office" ? "/admin/office" : "/admin";
}

export function getNavLinksForRole(role: UserRole) {
  if (role === "admin") {
    return [
      { href: "/admin", label: "Overview" },
      { href: "/admin/articles", label: "Articles" },
      { href: "/admin/articles/migrate", label: "Migration" },
      { href: "/admin/evidence", label: "Evidence" },
      { href: "/admin/leads", label: "Leads" },
      { href: "/admin/settings", label: "Settings" },
    ];
  }

  return [
    { href: "/admin/office", label: "Today" },
    { href: "/admin/articles", label: "Articles" },
    { href: "/admin/publish", label: "Publish" },
    { href: "/admin/leads", label: "Leads" },
  ];
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();

  if (session.role !== "admin") {
    redirect(getDefaultAdminPathForRole(session.role));
  }

  return session;
}

export async function requireArticlesAccess(): Promise<SessionUser> {
  const session = await requireSession();

  if (session.role !== "admin" && session.role !== "office") {
    redirect("/admin/login");
  }

  return session;
}

export async function requireLeadsAccess(): Promise<SessionUser> {
  return requireArticlesAccess();
}

export async function requireOfficeDashboardAccess(): Promise<SessionUser> {
  const session = await requireSession();

  if (session.role !== "office") {
    redirect(getDefaultAdminPathForRole(session.role));
  }

  return session;
}
