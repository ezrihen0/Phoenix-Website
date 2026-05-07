import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
export const metadata: Metadata = { title: "Book Online", description: "Securely book your Phoenix service appointment online." };
export default function BookPage() {
  return (
    <section className="container-shell py-16">
      <p className="section-kicker">Fast Scheduling</p>
      <h1 className="inner-page-title">Book Your Fireplace Service</h1>
      <p className="inner-page-subtitle">For faster scheduling, use our secure booking system.</p>
      <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">You will open our external booking partner in a new tab and can return here anytime.</p>
      <div className="inner-page-section premium-panel p-6 md:p-7">
        <p className="text-sm uppercase tracking-[0.08em] text-[var(--text-muted)]">Booking Notes</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <p className="card-premium p-4 text-sm text-[var(--text-secondary)]">Use online booking for the fastest calendar access.</p>
          <p className="card-premium p-4 text-sm text-[var(--text-secondary)]">Appointment details can be confirmed by phone if preferred.</p>
          <p className="card-premium p-4 text-sm text-[var(--text-secondary)]">Service areas include Calgary, Edmonton, Red Deer, and nearby Alberta communities.</p>
        </div>
      </div>
      <a className="mt-8 inline-block rounded-full bg-[var(--button-primary-bg)] px-6 py-3 font-medium text-[var(--button-primary-text)] premium-glow" href={siteConfig.booking.url} target="_blank" rel="noopener noreferrer">Continue to Booking</a>
      <div className="mt-5">
        <a className="rounded-full border border-[var(--border-soft)] px-6 py-3 font-medium" href={siteConfig.phoneHref}>Prefer phone? Call Now</a>
      </div>
    </section>
  );
}
