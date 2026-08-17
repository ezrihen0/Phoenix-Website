"use client";

import Script from "next/script";
import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";

import { defaultCitySlug, getRequestServiceHref, type CitySlug } from "@/lib/cities";
import type { PublicSiteSettings } from "@/lib/cms/types";
import { CONTACT_FORM_RECAPTCHA_ACTION } from "@/lib/recaptcha";
import { contactServiceOptions, siteConfig } from "@/lib/site-data";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
};

const initialState: FormState = {
  status: "idle",
};

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || "";

type ContactFormProps = {
  className?: string;
  city?: CitySlug;
  settings?: Pick<PublicSiteSettings, "phoneDisplay">;
};

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function ContactForm({ className = "", city = defaultCitySlug, settings }: ContactFormProps) {
  const [state, setState] = useState<FormState>(initialState);
  const phoneDisplay = settings?.phoneDisplay || siteConfig.phoneDisplay;

  async function getRecaptchaToken() {
    if (!recaptchaSiteKey) {
      return "";
    }

    if (!window.grecaptcha) {
      throw new Error("Bot protection is still loading. Please try again in a moment.");
    }

    return await new Promise<string>((resolve, reject) => {
      window.grecaptcha?.ready(() => {
        window.grecaptcha
          ?.execute(recaptchaSiteKey, { action: CONTACT_FORM_RECAPTCHA_ACTION })
          .then(resolve)
          .catch(reject);
      });
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setState({ status: "submitting" });

    try {
      const recaptchaToken = await getRecaptchaToken();
      const payload = Object.fromEntries(formData.entries()) as Record<string, string>;

      payload.recaptchaToken = recaptchaToken;

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
          "We could not send your request right now. Please call the office.",
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "We could not send your request right now. Please call the office.",
      });
    }
  }

  return (
    <>
      {recaptchaSiteKey ? (
        <Script
          id="google-recaptcha-v3"
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}

      <form
        className={`glass-panel rounded-[2rem] p-6 sm:p-8 ${className}`}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" name="firstName" placeholder="First name" required />
        <Field label="Last name" name="lastName" placeholder="Last name" required />
        <input type="hidden" name="city" value={city} />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          placeholder={phoneDisplay}
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

        <input
          type="checkbox"
          name="honey"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
      </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-6 text-[var(--color-muted)]">
            Prefer a guided request? Use <a href={getRequestServiceHref(city)} className="font-semibold text-[var(--color-forest)]">Request Service</a>.
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
    </>
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