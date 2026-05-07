import { cityPages } from "@/lib/cities";
import { buildCityPage } from "@/lib/seo";
import Link from "next/link";
import { FinalCTA } from "@/components/home/FinalCTA";
const city = cityPages.calgary;
export const metadata = buildCityPage(city);
export default function CalgaryPage() {
  const localProof = [
    "Seasonal startup troubleshooting during rapid temperature swings.",
    "WETT-focused reporting support for home sale and insurance planning.",
    "Service calls across established and newer Calgary neighborhoods."
  ];
  return (
    <>
      <section className="container-shell py-14">
        <p className="section-kicker">Calgary Area</p>
        <h1 className="inner-page-title">{city.title}</h1>
        <p className="inner-page-subtitle">{city.intro}</p>
        <h2 className="inner-page-section text-2xl font-semibold">Services Available in Calgary</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="premium-chip" href="/services/gas-fireplace-repair">Gas Fireplace Repair</Link>
          <Link className="premium-chip" href="/services/wett-inspection">WETT Inspection</Link>
          <Link className="premium-chip" href="/services/chimney-sweep">Chimney Sweep</Link>
          <Link className="premium-chip" href="/services/chimney-repair">Chimney Repair</Link>
        </div>
        <h2 className="inner-page-section text-2xl font-semibold">Common Local Issues</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Seasonal startup failures, aging gas components, and chimney draft concerns are frequent service requests in Calgary homes.</p>
        <section className="inner-page-section premium-panel p-6 md:p-7">
          <h2 className="text-xl font-semibold">Calgary Service Snapshot</h2>
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
