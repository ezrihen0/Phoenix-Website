import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE_NAME,
  createAdminSessionToken,
  readAdminSessionToken,
} from "@/lib/auth/token";

type AdminSession = {
  username: string;
};

type AdminLoginResult =
  | {
      ok: true;
      username: string;
    }
  | {
      ok: false;
      reason: "invalid" | "locked" | "not-configured";
      retryAfterSeconds?: number;
      remainingAttempts?: number;
    };

type LoginAttemptRecord = {
  count: number;
  firstAttemptAt: number;
  lockedUntil: number;
};

const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const LOGIN_DELAY_MS = 700;

function getConfiguredAdminUsername() {
  return (process.env.ADMIN_USERNAME || "").trim();
}

function getConfiguredAdminPassword() {
  return (process.env.ADMIN_PASSWORD || "").trim();
}

function getConfiguredAdminPasswordHash() {
  return (process.env.ADMIN_PASSWORD_HASH || "").trim();
}

function getConfiguredSessionSecret() {
  return (process.env.ADMIN_SESSION_SECRET || process.env.NEXTAUTH_SECRET || "").trim();
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    priority: "high" as const,
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}

function safeEqual(input: string, expected: string) {
  const left = Buffer.from(input);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function verifyPasswordHash(password: string, storedHash: string) {
  const [scheme, salt, hash] = storedHash.split(":");

  if (scheme !== "scrypt" || !salt || !hash) {
    return false;
  }

  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");

  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}

function getRateLimitStore() {
  const key = "__phoenixAdminLoginRateLimit";
  const globalScope = globalThis as typeof globalThis & {
    __phoenixAdminLoginRateLimit?: Map<string, LoginAttemptRecord>;
  };

  if (!globalScope[key]) {
    globalScope[key] = new Map<string, LoginAttemptRecord>();
  }

  return globalScope[key];
}

function getRateLimitKey(clientIp: string) {
  return clientIp || "unknown";
}

async function waitForDelay(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function createPasswordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export async function verifyAdminLoginAttempt({
  username,
  password,
  clientIp,
}: {
  username: string;
  password: string;
  clientIp: string;
}): Promise<AdminLoginResult> {
  if (!authIsConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  const rateLimitStore = getRateLimitStore();
  const rateLimitKey = getRateLimitKey(clientIp);
  const currentAttempt = rateLimitStore.get(rateLimitKey);
  const now = Date.now();

  if (currentAttempt?.lockedUntil && currentAttempt.lockedUntil > now) {
    return {
      ok: false,
      reason: "locked",
      retryAfterSeconds: Math.ceil((currentAttempt.lockedUntil - now) / 1000),
    };
  }

  await waitForDelay(LOGIN_DELAY_MS);

  const normalizedUsername = username.trim();
  const usernameMatches = safeEqual(normalizedUsername, getConfiguredAdminUsername());
  const configuredHash = getConfiguredAdminPasswordHash();
  const passwordMatches = configuredHash
    ? verifyPasswordHash(password, configuredHash)
    : safeEqual(password, getConfiguredAdminPassword());

  if (usernameMatches && passwordMatches) {
    rateLimitStore.delete(rateLimitKey);
    return { ok: true, username: getConfiguredAdminUsername() };
  }

  const withinWindow = currentAttempt && now - currentAttempt.firstAttemptAt < LOGIN_WINDOW_MS;
  const nextAttempt: LoginAttemptRecord = withinWindow
    ? {
        ...currentAttempt,
        count: currentAttempt.count + 1,
      }
    : {
        count: 1,
        firstAttemptAt: now,
        lockedUntil: 0,
      };

  if (nextAttempt.count >= MAX_LOGIN_ATTEMPTS) {
    nextAttempt.lockedUntil = now + LOGIN_LOCK_MS;
  }

  rateLimitStore.set(rateLimitKey, nextAttempt);

  if (nextAttempt.lockedUntil > now) {
    return {
      ok: false,
      reason: "locked",
      retryAfterSeconds: Math.ceil((nextAttempt.lockedUntil - now) / 1000),
    };
  }

  return {
    ok: false,
    reason: "invalid",
    remainingAttempts: Math.max(0, MAX_LOGIN_ATTEMPTS - nextAttempt.count),
  };
}

export async function buildAdminSessionCookie(username: string) {
  return {
    name: ADMIN_SESSION_COOKIE_NAME,
    value: await createAdminSessionToken({
      username,
      expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000,
    }),
    options: getAdminSessionCookieOptions(),
  };
}

export async function createAdminSession(username: string) {
  const cookieStore = await cookies();
  const sessionCookie = await buildAdminSessionCookie(username);
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.options);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  const session = await readAdminSessionToken(token);

  if (!session) {
    return null;
  }

  return {
    username: session.username,
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export function authIsConfigured() {
  return Boolean(
    getConfiguredAdminUsername() &&
      (getConfiguredAdminPasswordHash() || getConfiguredAdminPassword()) &&
      getConfiguredSessionSecret(),
  );
}