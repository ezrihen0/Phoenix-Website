import { NextResponse } from "next/server";
import { z } from "zod";

import {
  authIsConfigured,
  buildAdminSessionCookie,
  verifyAdminLoginAttempt,
} from "@/lib/auth/options";
import { getDefaultAdminPathForRole } from "@/lib/auth/permissions";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(120),
  password: z.string().min(1).max(200),
});

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function buildRequestUrl(pathname: string, request: Request) {
  const requestUrl = new URL(request.url);
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    requestUrl.protocol.replace(":", "");
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host")?.trim() ||
    requestUrl.host;

  return new URL(pathname, `${protocol}://${host}`);
}

function buildLoginUrl(request: Request) {
  return buildRequestUrl("/admin/login", request);
}

export async function POST(request: Request) {
  const loginUrl = buildLoginUrl(request);

  if (!authIsConfigured()) {
    loginUrl.searchParams.set("error", "config");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const formData = await request.formData();
  const parsed = loginSchema.safeParse({
    username: String(formData.get("username") || ""),
    password: String(formData.get("password") || ""),
  });

  if (!parsed.success) {
    loginUrl.searchParams.set("error", "invalid");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const result = await verifyAdminLoginAttempt({
    username: parsed.data.username,
    password: parsed.data.password,
    clientIp: getClientIp(request),
  });

  if (!result.ok) {
    if (result.reason === "locked") {
      loginUrl.searchParams.set("error", "locked");
      loginUrl.searchParams.set(
        "retry",
        String(Math.max(1, Math.ceil((result.retryAfterSeconds || 60) / 60))),
      );
      return NextResponse.redirect(loginUrl, { status: 303 });
    }

    loginUrl.searchParams.set(
      "error",
      result.reason === "not-configured" ? "config" : "invalid",
    );
    if (typeof result.remainingAttempts === "number") {
      loginUrl.searchParams.set("attempts", String(result.remainingAttempts));
    }
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const response = NextResponse.redirect(
    buildRequestUrl(getDefaultAdminPathForRole(result.role), request),
    { status: 303 },
  );
  const sessionCookie = await buildAdminSessionCookie(result.username, result.role);
  response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
  return response;
}