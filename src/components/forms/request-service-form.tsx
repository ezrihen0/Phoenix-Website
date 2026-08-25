"use client";

import Image from "next/image";
import Script from "next/script";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AddressMapField } from "@/components/forms/address-map-field";
import { cities, evaluateServiceArea, type CitySlug } from "@/lib/cities";
import type { PublicSiteSettings } from "@/lib/cms/types";
import { trackFormStart, trackLeadSubmitted } from "@/lib/analytics/events";
import { CONTACT_FORM_RECAPTCHA_ACTION } from "@/lib/recaptcha";
import {
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
  city?: CitySlug;
  cityName?: string;
  settings: Pick<PublicSiteSettings, "phoneDisplay" | "phoneHref">;
  attribution?: Attribution;
  initialService?: string;
  initialProblem?: string;
  initialUrgency?: string;
  ctaLocation?: string;
  lockCity?: boolean;
};

const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || "";

const steps = [
  { id: 1, label: "City" },
  { id: 2, label: "Service" },
  { id: 3, label: "Problem" },
  { id: 4, label: "Timing" },
  { id: 5, label: "Contact" },
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

function resolveInitialService(value?: string) {
  if (!value) {
    return "";
  }

  const bySlug = SERVICE_REQUEST_CATALOG.find((item) => item.slug === value);
  if (bySlug) {
    return bySlug.title;
  }

  const byTitle = SERVICE_REQUEST_CATALOG.find((item) => item.title === value);
  return byTitle?.title || "";
}

function getStartingStep({
  lockCity,
  hasCity,
  hasService,
  hasProblem,
  hasUrgency,
}: {
  lockCity: boolean;
  hasCity: boolean;
  hasService: boolean;
  hasProblem: boolean;
  hasUrgency: boolean;
}) {
  if (!hasCity && !lockCity) {
    return 1;
  }

  if (!hasService) {
    return 2;
  }

  if (!hasProblem) {
    return 3;
  }

  if (!hasUrgency) {
    return 4;
  }

  return 5;
}

export function RequestServiceForm({
  city: initialCity,
  cityName: initialCityName,
  settings,
  attribution,
  initialService = "",
  initialProblem = "",
  initialUrgency = "",
  ctaLocation = "request-service-form",
  lockCity = false,
}: RequestServiceFormProps) {
  const router = useRouter();
  const resolvedService = resolveInitialService(initialService);
  const [step, setStep] = useState(() =>
    getStartingStep({
      lockCity,
      hasCity: Boolean(initialCity),
      hasService: Boolean(resolvedService),
      hasProblem: initialProblem.trim().length >= 10,
      hasUrgency: Boolean(initialUrgency),
    }),
  );
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [city, setCity] = useState<CitySlug | "">(initialCity || "");
  const [service, setService] = useState(resolvedService);
  const [message, setMessage] = useState(initialProblem);
  const [urgency, setUrgency] = useState(initialUrgency);
  const [urgencyDetail, setUrgencyDetail] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState(initialCityName || "");
  const [addressProvince, setAddressProvince] = useState("AB");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [formattedAddress, setFormattedAddress] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState("Phone");
  const [stepError, setStepError] = useState("");
  const [formStarted, setFormStarted] = useState(false);

  const selectedCity = cities.find((item) => item.slug === city);
  const cityName = selectedCity?.name || initialCityName || city;
  const coverage =
    latitude != null && longitude != null ? evaluateServiceArea(latitude, longitude) : undefined;

  const selectedService = useMemo(
    () => SERVICE_REQUEST_CATALOG.find((item) => item.title === service),
    [service],
  );
  const urgencyDetailOptions = useMemo(() => getUrgencyDetailOptions(urgency), [urgency]);
  const visibleSteps = lockCity ? steps.filter((item) => item.id !== 1) : steps;

  function markFormStarted() {
    if (formStarted) {
      return;
    }

    setFormStarted(true);
    trackFormStart("request_service");
  }

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
    if (nextStep === 2 && !city) {
      setStepError("Choose your city.");
      return;
    }

    if (nextStep === 3 && !service) {
      setStepError("Choose the service you need.");
      return;
    }

    if (nextStep === 4 && message.trim().length < 10) {
      setStepError("Tell us a little more about what is happening.");
      return;
    }

    if (nextStep === 5) {
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

    if (step < 5) {
      goToStep(step + 1);
      return;
    }

    if (
      !city ||
      !addressStreet.trim() ||
      !addressCity.trim() ||
      !addressProvince.trim() ||
      !addressPostalCode.trim()
    ) {
      setStepError(!city ? "Choose your city." : "Enter the full service address.");
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
          latitude,
          longitude,
          ctaLocation,
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

      trackLeadSubmitted("request_service");
      router.push("/thank-you");
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
          id="google-recaptcha-v3-request-service"
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}

      <form className="glass-panel rounded-[2rem] p-5 sm:p-8" onSubmit={handleSubmit}>
        <div className="mb-6 flex items-center justify-between gap-3">
          {visibleSteps.map((item, index) => {
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
                    {isComplete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </span>
                  <span
                    className={`hidden text-sm font-semibold sm:inline ${
                      isCurrent ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < visibleSteps.length - 1 ? (
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
                Which city should we dispatch from?
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Phoenix serves Alberta through Calgary, Edmonton, and Red Deer hubs. If a city was
                preselected from the page you came from, you can still change it.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {cities.map((option) => (
                <button
                  key={option.slug}
                  type="button"
                  onClick={() => {
                    markFormStarted();
                    setCity(option.slug);
                    setAddressCity(option.name);
                    setStepError("");
                  }}
                  className={`rounded-[1.5rem] border px-4 py-5 text-left ${
                    city === option.slug
                      ? "border-[var(--color-ember)] bg-white shadow-[0_10px_24px_rgba(185,71,29,0.12)]"
                      : "border-[var(--color-border)] bg-white/70"
                  }`}
                >
                  <p className="text-lg font-semibold text-[var(--color-ink)]">{option.name}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{option.serviceRadius}</p>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
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
                      markFormStarted();
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
            {selectedService?.slug === "gas-fireplace-repair" ? (
              <p className="rounded-2xl bg-[var(--color-paper-strong)] px-4 py-3 text-sm leading-6 text-[var(--color-muted)]">
                When the problem is unknown, Phoenix starts with a $99 diagnostic/inspection visit: assessment, findings, options, then an accurate quote. Complex repairs are not priced by guessing over the phone.
              </p>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                Tell us what is happening
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                A short description is enough. Phoenix inspects the system before quoting complex repairs.
                {selectedService?.slug === "gas-fireplace-repair"
                  ? " Unknown gas problems start with a $99 diagnostic visit, then options."
                  : ""}
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-ink)]">
              <span>What is going on?</span>
              <textarea
                name="message"
                required
                rows={4}
                value={message}
                onChange={(event) => {
                  markFormStarted();
                  setMessage(event.target.value);
                }}
                placeholder="Example: The gas fireplace will not ignite, or we need a WETT inspection for a home sale."
                className="rounded-[1.5rem] border border-[var(--color-border)] bg-white px-4 py-3 text-base outline-none transition focus:border-[var(--color-ember)]"
              />
            </label>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                When do you need help?
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Timing helps the office route the visit. It is not a confirmed appointment.
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
          </div>
        ) : null}

        {step === 5 ? (
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
              <AddressMapField
                value={{
                  addressStreet,
                  addressCity,
                  addressProvince,
                  addressPostalCode,
                  latitude,
                  longitude,
                  formattedAddress,
                }}
                locationBias={
                  selectedCity
                    ? { lat: selectedCity.latitude, lng: selectedCity.longitude }
                    : undefined
                }
                onChange={(next) => {
                  setAddressStreet(next.addressStreet);
                  setAddressCity(next.addressCity);
                  setAddressProvince(next.addressProvince || "AB");
                  setAddressPostalCode(next.addressPostalCode);
                  setLatitude(next.latitude);
                  setLongitude(next.longitude);
                  setFormattedAddress(next.formattedAddress || "");
                }}
                serviceAreaNote={
                  coverage
                    ? coverage.inCoverage
                      ? `Nearest hub: ${coverage.nearestCityName} (about ${coverage.distanceKm} km).`
                      : `This address is about ${coverage.distanceKm} km from ${coverage.nearestCityName}. You can still submit; the office will confirm coverage.`
                    : undefined
                }
              />
              <input type="hidden" name="addressProvince" value={addressProvince || "AB"} />
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
          {step > (lockCity ? 2 : 1) ? (
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
              Step {visibleSteps.findIndex((item) => item.id === step) + 1} of {visibleSteps.length}
            </p>
          )}

          <button
            type="submit"
            disabled={state.status === "submitting"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ember)] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-ember-dark)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state.status === "submitting" ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : step < 5 ? (
              <ArrowRight className="h-4 w-4" />
            ) : null}
            {state.status === "submitting" ? "Sending request" : step < 5 ? "Continue" : "Request Service"}
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
