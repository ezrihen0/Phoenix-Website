import Link from "next/link";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Hero } from "@/components/home/Hero";
import { RealWorkProof } from "@/components/home/RealWorkProof";
import { ServicesOverview } from "@/components/home/ServicesOverview";
import { StaticReviews } from "@/components/home/StaticReviews";
import { TrustBar } from "@/components/home/TrustBar";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <section className="container-shell py-14">
        <p className="section-kicker">Service Promise</p>
        <h2 className="section-title">Why Homeowners Call Phoenix</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <article className="card-premium p-5">
            <h3 className="font-semibold text-[var(--inner-page-title)]">Clear Diagnostics</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              We explain root causes and options without confusion.
            </p>
          </article>
          <article className="card-premium p-5">
            <h3 className="font-semibold text-[var(--inner-page-title)]">Professional In-Home Service</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Respectful, clean work with practical communication.
            </p>
          </article>
          <article className="card-premium p-5">
            <h3 className="font-semibold text-[var(--inner-page-title)]">Easy Booking</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              Call now or book online in seconds.
            </p>
          </article>
        </div>
      </section>
      <section className="container-shell py-10 soft-divider">
        <p className="section-kicker">Local Coverage</p>
        <h2 className="section-title">Service Areas</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="premium-chip" href="/calgary">Calgary</Link>
          <Link className="premium-chip" href="/edmonton">Edmonton</Link>
          <Link className="premium-chip" href="/red-deer">Red Deer</Link>
        </div>
      </section>
      <section className="container-shell py-14">
        <p className="section-kicker">Reporting Clarity</p>
        <h2 className="section-title">WETT and Insurance-Ready Reporting</h2>
        <p className="section-subtitle">
          We provide clear inspection findings and practical next steps homeowners can use for
          planning, insurance-related requests, and property decisions.
        </p>
      </section>
      <RealWorkProof />
      <StaticReviews />
      <section className="container-shell py-14">
        <p className="section-kicker">Common Issues</p>
        <h2 className="section-title">Common Fireplace and Chimney Problems</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <p className="card-premium p-4">Fireplace won't start or pilot won't stay lit</p>
          <p className="card-premium p-4">Weak flame, delayed ignition, or unusual odors</p>
          <p className="card-premium p-4">Chimney draft issues and seasonal performance drops</p>
          <p className="card-premium p-4">Visible wear requiring sweep or repair planning</p>
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
