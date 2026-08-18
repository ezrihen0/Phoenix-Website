"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

type AdminLoginFormProps = {
  className?: string;
};

export function AdminLoginForm({ className = "" }: AdminLoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      action="/admin/login/submit"
      method="post"
      autoComplete="on"
      className={`grid w-full max-w-xl gap-4 ${className}`}
      onSubmit={() => setIsSubmitting(true)}
    >
      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
        <span>Username</span>
        <input
          type="text"
          name="username"
          autoComplete="username"
          required
          className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none"
        />
      </label>
      <label className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
        <input
          type="checkbox"
          name="remember"
          value="1"
          defaultChecked
          className="h-4 w-4 rounded border-[var(--color-border)]"
        />
        <span>Keep me signed in on this device</span>
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm font-semibold text-[var(--color-paper)] disabled:opacity-75"
      >
        {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
