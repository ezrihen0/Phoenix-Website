"use client";

import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";

import { contactServiceOptions, siteConfig } from "@/lib/site-data";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
};

const initialState: FormState = {
  status: "idle",
};

type ContactFormProps = {
  className?: string;
};

export function ContactForm({ className = "" }: ContactFormProps) {
  const [state, setState] = useState<FormState>(initialState);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({ status: "submitting" });

    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { message?: string };

    if (response.ok) {
      form.reset();
      setState({
        status: "success",
        message:
          result.message ?? "Thanks. Your request has been sent successfully.",
      });
      return;
    }

    setState({
      status: "error",
      message:
        result.message ??
        "We could not send your request right now. Please call or book online.",
    });
  }

  return (
    <form
      className={`glass-panel rounded-[2rem] p-6 sm:p-8 ${className}`}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" name="firstName" placeholder="First name" required />
        <Field label="Last name" name="lastName" placeholder="Last name" required />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder={siteConfig.phoneDisplay}
          required
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="name@email.com"
          required
        />

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          <span>Service</span>
          <select
            name="service"
            required
            defaultValue=""
            className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-ember)]"
          >
            <option value="" disabled>
              Choose a service
            </option>
            {contactServiceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </label>

        <Field label="Preferred day" name="preferredDay" placeholder="Any day this week" />
        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
          <span>Preferred time</span>
          <select
            name="preferredTime"
            defaultValue=""
            className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-ember)]"
          >
            <option value="">Any time</option>
            <option value="9am - 12pm">9am - 12pm</option>
            <option value="12pm - 3pm">12pm - 3pm</option>
            <option value="3pm - 6pm">3pm - 6pm</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)] sm:col-span-2">
          <span>Message</span>
          <textarea
            name="message"
            required
            rows={5}
            placeholder="Describe the fireplace, chimney, or inspection need."
            className="rounded-[1.5rem] border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-ember)]"
          />
        </label>

        <input type="text" name="honey" className="hidden" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm leading-6 text-[var(--color-muted)]">
          Prefer instant scheduling? Use the Workiz booking link above for 24/7 booking.
        </div>
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ember)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-ember-dark)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {state.status === "submitting" ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send request
        </button>
      </div>

      {state.message ? (
        <p
          className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
            state.status === "success"
              ? "bg-emerald-50 text-emerald-800"
              : "bg-amber-50 text-amber-800"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: FieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
      <span>{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-ember)]"
      />
    </label>
  );
}