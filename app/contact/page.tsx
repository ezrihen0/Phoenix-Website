import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
export const metadata: Metadata = { title: "Contact", description: "Contact Phoenix for fireplace and chimney service in Alberta." };
export default function ContactPage() {
  return (
    <section className="container-shell py-16">
      <p className="section-kicker">Quick Contact</p>
      <h1 className="inner-page-title">Contact Phoenix</h1>
      <p className="inner-page-subtitle">Call now or book online for service in Calgary, Edmonton, Red Deer, and surrounding Alberta communities.</p>
      <div className="inner-page-section premium-panel p-6 md:p-7">
        <p className="text-sm uppercase tracking-[0.08em] text-[var(--text-muted)]">Service Focus</p>
        <p className="mt-2 text-[var(--text-secondary)]">Gas fireplace repair, WETT inspections, chimney sweep, and chimney repair.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <p className="card-premium p-4 text-sm text-[var(--text-secondary)]">Response style: practical, concise, and homeowner-friendly.</p>
          <p className="card-premium p-4 text-sm text-[var(--text-secondary)]">Coverage: Alberta service areas with clear scheduling communication.</p>
          <p className="card-premium p-4 text-sm text-[var(--text-secondary)]">Hours: Monday to Saturday, by appointment.</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <a className="rounded-full bg-[var(--button-primary-bg)] px-6 py-3 font-medium text-[var(--button-primary-text)] premium-glow" href={siteConfig.phoneHref}>Call Now</a>
        <a className="rounded-full border border-[var(--border-soft)] px-6 py-3 font-medium" href={siteConfig.booking.url} target="_blank" rel="noopener noreferrer">Book Online</a>
      </div>
    </section>
  );
}
