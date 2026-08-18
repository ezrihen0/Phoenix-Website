import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Lightbulb, Phone } from "lucide-react";

import { getPublicSiteSettings } from "@/lib/cms/storage";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Thank You | Phoenix Chimney & Fireplace",
    description:
      "Confirmation page for Phoenix Chimney & Fireplace requests, with next-step guidance and urgent contact details.",
    path: "/thank-you",
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ThankYouPage() {
  const settings = await getPublicSiteSettings();

  return (
    <section className="section-pad">
      <div className="page-frame">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.8rem] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_28px_80px_rgba(31,26,22,0.14)]">
          <div className="relative overflow-hidden border-b border-[var(--color-border)] bg-[linear-gradient(180deg,rgba(31,41,55,1)_0%,rgba(15,23,42,1)_100%)] px-6 py-12 text-[var(--color-paper)] sm:px-10 sm:py-16 lg:px-12">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.22),transparent_58%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
              <div className="text-center lg:text-left">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/14 shadow-[0_0_0_12px_rgba(255,255,255,0.03)] lg:mx-0 sm:h-28 sm:w-28">
                  <CheckCircle2 className="h-14 w-14 text-emerald-300 sm:h-16 sm:w-16" />
                </div>
                <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[var(--color-gold)]">
                  Request Received
                </p>
                <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  Thank you for choosing Phoenix Chimney & Fireplace!
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--color-paper)]/80 lg:mx-0 sm:text-lg">
                  Your request has been received.
                </p>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-[var(--color-paper)]/72 lg:mx-0 sm:text-base">
                  Our team reviews every request before it becomes a finalized appointment so your timing, service scope, and contact details are all confirmed correctly.
                </p>

                <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                      Step One
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-paper)]/78">
                      SMS or email confirmation is sent once the request is verified.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                      Review
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-paper)]/78">
                      Every request is checked before dispatch details are locked in.
                    </p>
                  </div>
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/6 px-4 py-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                      Urgent Help
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-paper)]/78">
                      If the request is time-sensitive, call the office directly right away.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                <div className="relative min-h-[18rem] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_24px_60px_rgba(2,6,23,0.28)]">
                  <Image
                    src="/images/photos/team-fireplace.jpg"
                    alt="Phoenix Chimney team preparing a fireplace service visit"
                    fill
                    sizes="(max-width: 1024px) 100vw, 36vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.02)_0%,rgba(2,6,23,0.78)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold)]">
                      Professional Review
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/82">
                      Your request is reviewed by the Phoenix team before final confirmation is issued.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="relative min-h-[8.5rem] overflow-hidden rounded-[1.7rem] border border-white/10 shadow-[0_20px_45px_rgba(2,6,23,0.22)]">
                    <Image
                      src="/images/photos/wett-inspection.jpg"
                      alt="Inspection tools and paperwork prepared for a chimney appointment"
                      fill
                      sizes="(max-width: 640px) 100vw, 18vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.62)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
                        Inspection Ready
                      </p>
                    </div>
                  </div>
                  <div className="relative min-h-[8.5rem] overflow-hidden rounded-[1.7rem] border border-white/10 shadow-[0_20px_45px_rgba(2,6,23,0.22)]">
                    <Image
                      src="/images/photos/hero-fireplace.jpg"
                      alt="Warm interior fireplace showing the type of home service Phoenix supports"
                      fill
                      sizes="(max-width: 640px) 100vw, 18vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.08)_0%,rgba(2,6,23,0.62)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
                        Home Service Support
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
              <div className="max-w-2xl">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-ember)]">
                  What happens next?
                </p>
                <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                  Phoenix will review your request and contact you with the next step.
                </h2>
                <div className="mt-6 space-y-4 text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                  <p>
                    If everything is in order, you will receive a confirmation via SMS or Email shortly.
                  </p>
                  <p className="rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.72)] px-5 py-4 text-[var(--color-ink)]">
                    Please note: If you do not receive a confirmation, your appointment is not yet finalized.
                  </p>
                  <p>
                    In that case, one of our representatives will contact you to confirm the next step.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(255,255,255,0.62)] p-5">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-ember)]">
                  Request reminder
                </p>
                <div className="mt-4 space-y-3 text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                  <p>
                    Watch for a confirmation message before assuming the appointment is locked in.
                  </p>
                  <p>
                    If a confirmation does not arrive, the request is still pending review and scheduling.
                  </p>
                  <p className="font-semibold text-[var(--color-ink)]">
                    Phoenix will follow up directly if anything still needs to be confirmed.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[2rem] border border-[var(--color-border)] bg-[rgba(248,244,238,0.95)] p-5 shadow-[0_18px_42px_rgba(31,26,22,0.08)] sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[rgba(201,95,43,0.18)] bg-[rgba(201,95,43,0.1)] text-[var(--color-ember)]">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-ember)]">
                      Preparation Guide
                    </p>
                    <h2 className="mt-3 text-balance text-xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-2xl">
                      How to prepare for your technician&apos;s arrival
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-muted)] sm:text-base sm:leading-8">
                      A few quick steps before the visit help keep the appointment safe, efficient, and on schedule.
                    </p>
                  </div>
                </div>

                <ul className="mt-5 space-y-4 text-sm leading-7 text-[var(--color-muted)] sm:text-base sm:leading-8">
                  <li className="flex items-start gap-3 rounded-[1.4rem] border border-[rgba(31,26,22,0.08)] bg-white/72 px-4 py-4">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-ember)]" />
                    <p>
                      <span className="font-semibold text-[var(--color-ink)]">Cool Down:</span> Please ensure the fireplace or wood stove is not used for at least 24 hours prior to the appointment. It must be cold to the touch for a safe inspection.
                    </p>
                  </li>
                  <li className="flex items-start gap-3 rounded-[1.4rem] border border-[rgba(31,26,22,0.08)] bg-white/72 px-4 py-4">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-ember)]" />
                    <p>
                      <span className="font-semibold text-[var(--color-ink)]">Clear the Area:</span> Please clear a 5-foot space around the fireplace to allow the technician to work with their equipment.
                    </p>
                  </li>
                  <li className="flex items-start gap-3 rounded-[1.4rem] border border-[rgba(31,26,22,0.08)] bg-white/72 px-4 py-4">
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-ember)]" />
                    <p>
                      <span className="font-semibold text-[var(--color-ink)]">Pets:</span> For their safety and ours, please keep pets in a separate room during the service.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.6rem] border border-[var(--color-border)] bg-white/72 p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-ember)]">
                    01
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Request received and queued for review.
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-[var(--color-border)] bg-white/72 p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-ember)]">
                    02
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Dispatch details checked for timing, address, and service scope.
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-[var(--color-border)] bg-white/72 p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[var(--color-ember)]">
                    03
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                    Confirmation sent or a representative reaches out directly.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] bg-[rgba(242,234,223,0.58)] px-6 py-8 sm:px-10 sm:py-10 lg:border-l lg:border-t-0 lg:px-12">
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="relative min-h-[15rem] overflow-hidden rounded-[2rem] border border-[var(--color-border)] shadow-[0_20px_55px_rgba(31,26,22,0.12)]">
                  <Image
                    src="/images/photos/about-crew.jpg"
                    alt="Phoenix Chimney crew speaking with a homeowner before a fireplace service visit"
                    fill
                    sizes="(max-width: 1024px) 100vw, 34vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,41,55,0.04)_0%,rgba(31,41,55,0.72)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-[var(--color-paper)]">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.26em] text-[var(--color-gold)]">
                      Trusted Follow-Up
                    </p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/84">
                      If anything still needs to be confirmed, a Phoenix representative will contact you directly.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-ember)]">
                    Next Step
                  </p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-3xl">
                    Need to return to the website?
                  </h2>
                  <p className="mt-4 text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                    You can head back to the home page now, or call us directly if the request is urgent and needs immediate attention.
                  </p>
                </div>

                <div className="space-y-4">
                  <Link
                    href="/"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[var(--color-ink)] px-6 py-3.5 text-sm font-semibold text-[var(--color-paper)] transition hover:bg-[var(--color-ember)] sm:w-auto"
                  >
                    Back to Home
                  </Link>

                  <a
                    href={`tel:${settings.phoneHref}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-ink)]"
                  >
                    <Phone className="h-4 w-4 text-[var(--color-ember)]" />
                    Need urgent help? Call us at {settings.phoneDisplay}
                  </a>
                </div>

                <div className="rounded-[1.8rem] border border-[var(--color-border)] bg-white/78 p-5">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-ember)]">
                    Service assurance
                  </p>
                  <p className="mt-4 text-sm leading-8 text-[var(--color-muted)] sm:text-base">
                    Phoenix Chimney & Fireplace reviews each request before final confirmation so dispatch details, contact method, and service scope are correct before the appointment is locked in.
                  </p>
                  <div className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                      <p>Requests are checked for completeness before the appointment is finalized.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                      <p>Urgent callers can move straight to the phone line for faster follow-up.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}