import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
export const metadata: Metadata = { title: "Contact", description: "Contact Phoenix for fireplace and chimney service in Alberta." };
export default function ContactPage() {
  return (
    <section className="container-shell py-16">
      <h1 className="text-4xl font-semibold">Contact Phoenix</h1>
      <p className="mt-4 text-lg text-[var(--text-secondary)]">Call now or book online for service in Calgary, Edmonton, Red Deer, and surrounding Alberta communities.</p>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Typical service focus: gas fireplace repair, WETT inspections, chimney sweep, and chimney repair.</p>
      <p className="mt-2 text-sm text-[var(--text-muted)]">Hours: Monday to Saturday, by appointment.</p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a className="rounded-full bg-[var(--button-primary-bg)] px-6 py-3 text-[var(--button-primary-text)]" href={siteConfig.phoneHref}>Call Now</a>
        <a className="rounded-full border border-[var(--border-soft)] px-6 py-3" href={siteConfig.booking.url} target="_blank" rel="noopener noreferrer">Book Online</a>
      </div>
    </section>
  );
}
