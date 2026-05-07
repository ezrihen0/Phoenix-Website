import { cityPages } from "@/lib/cities";
import { buildCityPage } from "@/lib/seo";
import Link from "next/link";
import { FinalCTA } from "@/components/home/FinalCTA";
const city = cityPages.redDeer;
export const metadata = buildCityPage(city);
export default function RedDeerPage() {
  const localProof = [
    "Seasonal sweep and inspection requests tied to steady year-round use.",
    "Chimney condition checks to catch draft and wear concerns early.",
    "Alberta-focused recommendations homeowners can use right away."
  ];
  return (
    <>
      <section className="container-shell py-14">
        <p className="section-kicker">Red Deer Area</p>
        <h1 className="inner-page-title">{city.title}</h1>
        <p className="inner-page-subtitle">{city.intro}</p>
        <h2 className="inner-page-section text-2xl font-semibold">Services Available in Red Deer</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="premium-chip" href="/services/gas-fireplace-repair">Gas Fireplace Repair</Link>
          <Link className="premium-chip" href="/services/wett-inspection">WETT Inspection</Link>
          <Link className="premium-chip" href="/services/chimney-sweep">Chimney Sweep</Link>
          <Link className="premium-chip" href="/services/chimney-repair">Chimney Repair</Link>
        </div>
        <h2 className="inner-page-section text-2xl font-semibold">Common Local Issues</h2>
        <p className="mt-3 text-[var(--text-secondary)]">In Red Deer, we commonly see maintenance gaps, reduced draft performance, and inspection requests tied to property planning.</p>
        <section className="inner-page-section premium-panel p-6 md:p-7">
          <h2 className="text-xl font-semibold">Red Deer Service Snapshot</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {localProof.map((item) => (
              <p key={item} className="card-premium p-4 text-sm leading-6 text-[var(--text-secondary)]">{item}</p>
            ))}
          </div>
        </section>
      </section>
      <FinalCTA className="mt-20 mb-20 md:mt-16 md:mb-10" />
    </>
  );
}
