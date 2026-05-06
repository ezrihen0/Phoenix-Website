import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { RealWorkProof } from "@/components/home/RealWorkProof";
import { StaticReviews } from "@/components/home/StaticReviews";
import { FinalCTA } from "@/components/home/FinalCTA";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <section className="container-shell py-14">
        <h2 className="text-3xl font-semibold">Why Homeowners Call Phoenix</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-[var(--card-border)] bg-white p-5">
            <h3 className="font-semibold">Clear Diagnostics</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">We explain root causes and options without confusion.</p>
          </article>
          <article className="rounded-2xl border border-[var(--card-border)] bg-white p-5">
            <h3 className="font-semibold">Professional In-Home Service</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Respectful, clean work with practical communication.</p>
          </article>
          <article className="rounded-2xl border border-[var(--card-border)] bg-white p-5">
            <h3 className="font-semibold">Easy Booking</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">Call now or book online in seconds.</p>
          </article>
        </div>
      </section>
      <section className="container-shell py-6">
        <h2 className="text-3xl font-semibold">Service Areas</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-full border border-[var(--border-soft)] px-4 py-2" href="/calgary">Calgary</Link>
          <Link className="rounded-full border border-[var(--border-soft)] px-4 py-2" href="/edmonton">Edmonton</Link>
          <Link className="rounded-full border border-[var(--border-soft)] px-4 py-2" href="/red-deer">Red Deer</Link>
        </div>
      </section>
      <section className="container-shell py-14">
        <h2 className="text-3xl font-semibold">WETT and Insurance-Ready Reporting</h2>
        <p className="mt-3 max-w-3xl text-[var(--text-secondary)]">
          We provide clear inspection findings and practical next steps homeowners can use for
          planning, insurance-related requests, and property decisions.
        </p>
      </section>
      <RealWorkProof />
      <StaticReviews />
      <section className="container-shell py-14">
        <h2 className="text-3xl font-semibold">Common Fireplace and Chimney Problems</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <p className="rounded-xl border border-[var(--card-border)] bg-white p-4">Fireplace won’t start or pilot won’t stay lit</p>
          <p className="rounded-xl border border-[var(--card-border)] bg-white p-4">Weak flame, delayed ignition, or unusual odors</p>
          <p className="rounded-xl border border-[var(--card-border)] bg-white p-4">Chimney draft issues and seasonal performance drops</p>
          <p className="rounded-xl border border-[var(--card-border)] bg-white p-4">Visible wear requiring sweep or repair planning</p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
