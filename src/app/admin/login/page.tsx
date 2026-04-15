import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { authIsConfigured, getAdminSession } from "@/lib/auth/options";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    attempts?: string;
    retry?: string;
    loggedOut?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const configured = authIsConfigured();
  const [params, session] = await Promise.all([searchParams, getAdminSession()]);

  if (session) {
    redirect("/admin");
  }

  const error = params.error;
  const remainingAttempts = Number.parseInt(params.attempts || "", 10);
  const retryMinutes = Number.parseInt(params.retry || "", 10);

  const statusMessage =
    error === "locked"
      ? `Too many failed login attempts. Sign-in is temporarily locked. Try again in about ${Number.isFinite(retryMinutes) ? retryMinutes : 15} minute(s).`
      : error === "invalid"
        ? `Incorrect username or password.${Number.isFinite(remainingAttempts) ? ` ${remainingAttempts} attempt(s) left before a temporary lock.` : ""}`
        : error === "config"
          ? "Admin login is not configured yet."
          : params.loggedOut
            ? "You have been signed out."
            : null;

  const statusTone =
    error === "locked"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : error === "invalid"
        ? "border-red-200 bg-red-50 text-red-700"
        : params.loggedOut
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-amber-200 bg-amber-50 text-amber-900";

  return (
    <section className="pb-16 pt-6 sm:pb-20 sm:pt-8">
      <div className="page-frame">
        <div className="glass-panel rounded-[2.5rem] px-6 py-12 sm:px-10">
          <p className="eyebrow">Admin access</p>
          <h1 className="mt-5 text-balance text-5xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-6xl">
            Admin login
          </h1>

          {statusMessage ? (
            <div className={`mt-8 rounded-[1.75rem] border p-5 text-sm leading-7 ${statusTone}`}>
              {statusMessage}
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap items-start gap-3">
            {configured ? <AdminLoginForm /> : null}
          </div>

          {!configured ? (
            <div className="mt-8 rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
              Configure `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` before using the admin panel.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}