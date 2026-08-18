"use client";

import Image from "next/image";
import Script from "next/script";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";

import { defaultCitySlug, type CitySlug } from "@/lib/cities";
import type { PublicSiteSettings } from "@/lib/cms/types";
import { trackRequestServiceSubmit } from "@/lib/analytics/events";
import { CONTACT_FORM_RECAPTCHA_ACTION } from "@/lib/recaptcha";
import {
  CANADIAN_PROVINCES,
  SERVICE_REQUEST_CATALOG,
  SERVICE_REQUEST_CONTACT_METHODS,
  SERVICE_REQUEST_TIME_WINDOWS,
  SERVICE_REQUEST_URGENCY_OPTIONS,
  getUrgencyDetailOptions,
} from "@/lib/request-service";
import { siteConfig } from "@/lib/site-data";

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
  leadId?: string;
};

type Attribution = {
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

type RequestServiceFormProps = {
  city: CitySlug;
  cityName: string;
  settings: Pick<PublicSiteSettings, "phoneDisplay" | "phoneHref">;
  attribution?: Attribution;
};

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || "";

const steps = [
  { id: 1, label: "Service" },
  { id: 2, label: "Details" },
  { id: 3, label: "Contact" },
] as const;

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function getAttributionFromWindow(fallback?: Attribution): Attribution {
  if (typeof window === "undefined") {
    return fallback || {};
  }

  const params = new URLSearchParams(window.location.search);

  return {
    sourceUrl: fallback?.sourceUrl || window.location.href,
    utmSource: fallback?.utmSource || params.get("utm_source") || undefined,
    utmMedium: fallback?.utmMedium || params.get("utm_medium") || undefined,
    utmCampaign: fallback?.utmCampaign || params.get("utm_campaign") || undefined,
  };
}

export function RequestServiceForm({
  city = defaultCitySlug,
  cityName,
  settings,
  attribution,
}: RequestServiceFormProps) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [urgency, setUrgency] = useState("");
  const [urgencyDetail, setUrgencyDetail] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressProvince, setAddressProvince] = useState("");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState("Phone");
  const [stepError, setStepError] = useState("");

  const selectedService = useMemo(
    () => SERVICE_REQUEST_CATALOG.find((item) => item.title === service),
    [service],
  );
  const urgencyDetailOptions = useMemo(() => getUrgencyDetailOptions(urgency), [urgency]);

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

  function goToStep(nextStep: number) {
    if (nextStep === 2 && !service) {
      setStepError("Choose the service you need.");
      return;
    }

    if (nextStep === 3) {
      if (message.trim().length < 10) {
        setStepError("Tell us a little more about what is happening.");
        return;
      }

      if (!urgency) {
        setStepError("Choose how soon you need help.");
        return;
      }

      if (!urgencyDetail) {
        setStepError("Choose the timing option that fits best.");
        return;
      }
    }

    setStepError("");
    setState({ status: "idle" });
    setStep(nextStep);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step < 3) {
      goToStep(step + 1);
      return;
    }

    if (
      !addressStreet.trim() ||
      !addressCity.trim() ||
      !addressProvince.trim() ||
      !addressPostalCode.trim()
    ) {
      setStepError("Enter the full service address.");
      return;
    }

    const form = event.currentTarget;
    const honeyValue = form instanceof HTMLFormElement ? new FormData(form).get("honey") : "";
    const honey = typeof honeyValue === "string" ? honeyValue : "";

    setState({ status: "submitting" });
    setStepError("");

    try {
      const recaptchaToken = await getRecaptchaToken();
      const liveAttribution = getAttributionFromWindow(attribution);

      const response = await fetch("/api/request-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city,
          firstName,
          lastName,
          phone,
          email,
          service,
          message,
          urgency,
          urgencyDetail,
          preferredDay: urgency === "This week" ? urgencyDetail : undefined,
          preferredTime,
          addressStreet,
          addressCity,
          addressProvince,
          addressPostalCode,
          preferredContactMethod,
          sourceUrl: liveAttribution.sourceUrl,
          utmSource: liveAttribution.utmSource,
          utmMedium: liveAttribution.utmMedium,
          utmCampaign: liveAttribution.utmCampaign,
          honey,
          recaptchaToken,
        }),
      });

      const result = (await response.json()) as { message?: string; leadId?: string };

      if (!response.ok) {
        setState({
          status: "error",
          message: result.message ?? "We could not send your request right now. Please call the office.",
        });
        return;
      }

      setState({
        status: "success",
        leadId: result.leadId,
        message:
          result.message ??
          "Request received. Phoenix will review your request and contact you with the next step.",
      });
      trackRequestServiceSubmit();
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

  if (state.status === "success") {
    return (
      <div className="glass-panel rounded-[2rem] p-6 sm:p-10">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <p className="eyebrow mt-6">Request received</p>
          <h2 className="display-title mt-3 text-balance text-3xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-4xl">
            Phoenix will review your request and contact you with the next step.
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base">
            {selectedService
              ? `We have your ${selectedService.title.toLowerCase()} request for ${cityName}.`
              : `We have your ${cityName} service request.`}
          </p>
          {state.leadId ? (
            <p className="mt-3 text-xs leading-6 text-[var(--color-muted)]">
              Reference: {state.leadId}
            </p>
          ) : null}
          <a
            href={`tel:${settings.phoneHref || siteConfig.phoneHref}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold text-[var(--color-ink)]"
          >
            <Phone className="h-4 w-4 text-[var(--color-ember)]" />
            Need to talk now? Call {settings.phoneDisplay || siteConfig.phoneDisplay}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {recaptchaSiteKey ? (
        <Script
          id="google-recaptcha-v3-request-service"
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}

      <form className="glass-panel rounded-[2rem] p-5 sm:p-8" onSubmit={handleSubmit}>
        <div className="mb-6 flex items-center justify-between gap-3">
          {steps.map((item, index) => {
            const isComplete = step > item.id;
            const isCurrent = step === item.id;

            return (
              <div key={item.id} className="flex flex-1 items-center gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isCurrent || isComplete
                        ? "bg-[var(--color-ember)] text-white"
                        : "bg-white text-[var(--color-muted)]"
                    }`}
                  >
                    {isComplete ? <CheckCircle2 className="h-4 w-4" /> : item.id}
                  </span>
                  <span
                    className={`hidden text-sm font-semibold sm:inline ${
                      isCurrent ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < steps.length - 1 ? (
                  <div
                    className={`h-px flex-1 ${
                      isComplete ? "bg-[var(--color-ember)]" : "bg-[var(--color-border)]"
                    }`}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {step === 1 ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                What do you need help with?
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Choose the Phoenix service that best matches the job. You can add details on the next step.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
              {SERVICE_REQUEST_CATALOG.map((item) => {
                const isSelected = service === item.title;

                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => {
                      setService(item.title);
                      setStepError("");
                    }}
                    className={`flex min-h-[5.75rem] items-center gap-3 rounded-[1.25rem] border px-3 py-3 text-left transition sm:min-h-[6.25rem] sm:px-4 ${
                      isSelected
                        ? "border-[var(--color-ember)] bg-white shadow-[0_10px_24px_rgba(185,71,29,0.12)]"
                        : "border-[var(--color-border)] bg-white/70 hover:border-[var(--color-ember)]/40"
                    }`}
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-paper-strong)] sm:h-12 sm:w-12">
                      <Image
                        src={item.icon}
                        alt=""
                        aria-hidden
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                      />
                    </span>
                    <span className="min-w-0 text-sm font-semibold leading-5 text-[var(--color-ink)] sm:text-[0.95rem]">
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                When do you need help?
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Choose the timing first. Then add a short note about the issue.
              </p>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-[var(--color-ink)]">How soon do you need help?</legend>
              <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
                {SERVICE_REQUEST_URGENCY_OPTIONS.map((option) => {
                  const isSelected = urgency === option;
                  const hint =
                    option === "As soon as possible"
                      ? "Need it soon"
                      : option === "This week"
                        ? "Pick a day"
                        : "No rush";

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        if (urgency !== option) {
                          setUrgency(option);
                          setUrgencyDetail("");
                        }
                        setStepError("");
                      }}
                      className={`flex min-h-[5.5rem] flex-col items-start justify-center gap-1 rounded-[1.35rem] border px-2.5 py-3 text-left transition sm:min-h-[6rem] sm:px-4 ${
                        isSelected
                          ? "border-[var(--color-ember)] bg-white shadow-[0_12px_28px_rgba(185,71,29,0.12)]"
                          : "border-[var(--color-border)] bg-white/70 hover:border-[var(--color-ember)]/40"
                      }`}
                    >
                      <span
                        className={`text-[0.8rem] font-semibold leading-4 sm:text-sm sm:leading-5 ${
                          isSelected ? "text-[var(--color-ember)]" : "text-[var(--color-ink)]"
                        }`}
                      >
                        {option}
                      </span>
                      <span className="text-[0.7rem] leading-4 text-[var(--color-muted)] sm:text-xs">
                        {hint}
                      </span>
                    </button>
                  );
                })}
              </div>

              {urgency ? (
                <div className="rounded-[1.35rem] border border-[var(--color-ember)]/20 bg-white px-3 py-3 sm:px-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-ember)]">
                    {urgency === "As soon as possible"
                      ? "What works best?"
                      : urgency === "This week"
                        ? "Which day this week?"
                        : "What window works?"}
                  </p>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {urgencyDetailOptions.map((detail) => {
                      const isDetailSelected = urgencyDetail === detail;

                      return (
                        <button
                          key={detail}
                          type="button"
                          onClick={() => {
                            setUrgencyDetail(detail);
                            setStepError("");
                          }}
                          className={`rounded-2xl border px-3 py-3 text-sm font-semibold ${
                            isDetailSelected
                              ? "border-[var(--color-ember)] bg-[var(--color-paper)] text-[var(--color-ink)]"
                              : "border-[var(--color-border)] bg-[var(--color-paper)]/70 text-[var(--color-muted)]"
                          }`}
                        >
                          {detail}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-[var(--color-ink)]">
                Preferred time <span className="font-normal text-[var(--color-muted)]">(optional)</span>
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {SERVICE_REQUEST_TIME_WINDOWS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPreferredTime(preferredTime === option ? "" : option)}
                    className={`rounded-2xl border px-2 py-3 text-xs font-semibold sm:text-sm ${
                      preferredTime === option
                        ? "border-[var(--color-ember)] bg-white text-[var(--color-ink)]"
                        : "border-[var(--color-border)] bg-white/70 text-[var(--color-muted)]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <h3 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                Tell us what is happening
              </h3>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                A short description is enough. Phoenix will review it before contacting you.
              </p>
            </div>

            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
              <span>What is going on?</span>
              <textarea
                name="message"
                required
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Example: The gas fireplace will not ignite, or we need a WETT inspection for a home sale."
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--color-ember)]"
              />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                How should Phoenix reach you?
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                We only ask for what the office needs to follow up on this {cityName} request.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="First name"
                name="firstName"
                value={firstName}
                onChange={setFirstName}
                placeholder="First name"
                required
              />
              <Field
                label="Last name"
                name="lastName"
                value={lastName}
                onChange={setLastName}
                placeholder="Last name"
                required
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder={settings.phoneDisplay || siteConfig.phoneDisplay}
                required
              />
              <Field
                label="Email"
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="name@email.com"
                required
              />
              <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
                  <Field
                    label="Street address"
                    name="addressStreet"
                    value={addressStreet}
                    onChange={setAddressStreet}
                    placeholder="123 Main Street SW"
                    className="sm:col-span-2"
                    required
                  />
                  <Field
                    label="City"
                    name="addressCity"
                    value={addressCity}
                    onChange={setAddressCity}
                    placeholder="Calgary"
                    required
                  />
                  <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
                    <span>Province</span>
                    <select
                      name="addressProvince"
                      required
                      value={addressProvince}
                      onChange={(event) => setAddressProvince(event.target.value)}
                      className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-ember)]"
                    >
                      <option value="" disabled>
                        Select province
                      </option>
                      {CANADIAN_PROVINCES.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Postal code"
                    name="addressPostalCode"
                    value={addressPostalCode}
                    onChange={setAddressPostalCode}
                    placeholder="T2P 1A1"
                    required
                  />
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-[var(--color-ink)]">Preferred contact method</legend>
              <div className="grid grid-cols-3 gap-3">
                {SERVICE_REQUEST_CONTACT_METHODS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPreferredContactMethod(option)}
                    className={`rounded-[1.3rem] border px-3 py-3.5 text-sm font-semibold ${
                      preferredContactMethod === option
                        ? "border-[var(--color-ember)] bg-white text-[var(--color-ink)]"
                        : "border-[var(--color-border)] bg-white/70 text-[var(--color-muted)]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}

        <input
          type="checkbox"
          name="honey"
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <input type="hidden" name="city" value={city} />

        {stepError ? (
          <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{stepError}</p>
        ) : null}

        {state.status === "error" && state.message ? (
          <p className="mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{state.message}</p>
        ) : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => goToStep(step - 1)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3.5 text-sm font-semibold text-[var(--color-ink)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <p className="text-sm leading-6 text-[var(--color-muted)]">
              Step {step} of {steps.length}
            </p>
          )}

          <button
            type="submit"
            disabled={state.status === "submitting"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ember)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-ember-dark)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state.status === "submitting" ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : step < 3 ? (
              <ArrowRight className="h-4 w-4" />
            ) : null}
            {state.status === "submitting" ? "Sending request" : step < 3 ? "Continue" : "Request Service"}
          </button>
        </div>
      </form>
    </>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  className = "",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)] ${className}`}>
      <span>{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3.5 text-base outline-none transition focus:border-[var(--color-ember)]"
      />
    </label>
  );
}
