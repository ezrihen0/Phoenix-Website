import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccessAdminPath, getDefaultAdminPathForRole } from "@/lib/auth/permissions";
import { resolveSessionRole } from "@/lib/auth/types";
import { ADMIN_SESSION_COOKIE_NAME, readAdminSessionToken } from "@/lib/auth/token";

function authIsConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
      (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD) &&
      (process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET),
  );
}

export default async function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/admin/login" ||
    request.nextUrl.pathname === "/admin/login/submit"
  ) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);

  if (!authIsConfigured()) {
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl);
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const session = await readAdminSessionToken(token);

  if (!session) {
    return NextResponse.redirect(loginUrl);
  }

  const role = resolveSessionRole(session.role);
  const pathname = request.nextUrl.pathname;

  if (!canAccessAdminPath(pathname, role)) {
    return NextResponse.redirect(new URL(getDefaultAdminPathForRole(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
