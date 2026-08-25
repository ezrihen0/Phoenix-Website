import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccessAdminPath, getDefaultAdminPathForRole } from "@/lib/auth/permissions";
import { resolveSessionRole } from "@/lib/auth/types";
import { ADMIN_SESSION_COOKIE_NAME, readAdminSessionToken } from "@/lib/auth/token";
import { isPortalHost } from "@/lib/portal/host";

const PORTAL_ROBOTS_TAG = "noindex, nofollow, noarchive";
const PORTAL_ROBOTS_BODY = "User-agent: *\nDisallow: /\n";

function authIsConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
      (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD) &&
      (process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET),
  );
}

function getRequestHostname(request: NextRequest) {
  const hostHeader = request.headers.get("host")?.split(",")[0]?.trim();
  return (hostHeader || request.nextUrl.hostname).split(":")[0].toLowerCase();
}

function applyPortalRobotsHeader(response: NextResponse) {
  response.headers.set("X-Robots-Tag", PORTAL_ROBOTS_TAG);
  return response;
}

function isAllowedPortalPath(pathname: string) {
  return (
    pathname === "/portal" ||
    pathname.startsWith("/portal/") ||
    pathname === "/api/portal" ||
    pathname.startsWith("/api/portal/")
  );
}

function handlePortalHost(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" || pathname === "") {
    const destination = request.nextUrl.clone();
    destination.pathname = "/portal";
    return applyPortalRobotsHeader(NextResponse.redirect(destination, 307));
  }

  if (pathname === "/login" || pathname === "/login/") {
    const destination = request.nextUrl.clone();
    destination.pathname = "/portal/login";
    return applyPortalRobotsHeader(NextResponse.redirect(destination, 307));
  }

  if (pathname === "/robots.txt") {
    return new NextResponse(PORTAL_ROBOTS_BODY, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": PORTAL_ROBOTS_TAG,
      },
    });
  }

  if (isAllowedPortalPath(pathname)) {
    return applyPortalRobotsHeader(NextResponse.next());
  }

  return applyPortalRobotsHeader(
    new NextResponse("Not Found", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }),
  );
}

export default async function proxy(request: NextRequest) {
  if (isPortalHost(getRequestHostname(request))) {
    return handlePortalHost(request);
  }

  const pathname = request.nextUrl.pathname;

  if (pathname !== "/admin" && !pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  if (
    pathname === "/admin/login" ||
    pathname === "/admin/login/submit"
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

  if (!canAccessAdminPath(pathname, role)) {
    return NextResponse.redirect(new URL(getDefaultAdminPathForRole(role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    {
      source: "/",
      has: [{ type: "host", value: "portal.phoenixfireplace.ca" }],
    },
    {
      source: "/((?!_next/static|_next/image|favicon.ico|images/).*)",
      has: [{ type: "host", value: "portal.phoenixfireplace.ca" }],
    },
  ],
};
