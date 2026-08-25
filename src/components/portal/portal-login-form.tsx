"use client";

import { useState } from "react";

type LoginState = "idle" | "submitting" | "preparing";

export function PortalLoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<LoginState>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    try {
      await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // The contract shell still shows the preparing state; live auth is not enabled.
    }

    setState("preparing");
  }

  if (state === "preparing") {
    return (
      <div className="rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-sm leading-7 text-[var(--color-muted)]">
        A magic link will be sent to this address when the customer portal is connected to WizField.
        Live passwordless sign-in is not enabled yet, and no session was created.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-2 text-sm">
        <span className="font-semibold text-[var(--color-ink)]">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-[var(--color-ink)]"
          placeholder="you@example.com"
        />
      </label>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex items-center justify-center rounded-full bg-[var(--color-ember)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
      >
        {state === "submitting" ? "Checking access…" : "Send magic link"}
      </button>
    </form>
  );
}
