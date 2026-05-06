import { cityPages } from "@/lib/cities";
import { buildCityPage } from "@/lib/seo";
import Link from "next/link";
import { FinalCTA } from "@/components/home/FinalCTA";
const city = cityPages.calgary;
export const metadata = buildCityPage(city);
export default function CalgaryPage() {
  return (
    <>
      <section className="container-shell py-14">
        <h1 className="text-4xl font-semibold">{city.title}</h1>
        <p className="mt-4 text-lg text-[var(--text-secondary)]">{city.intro}</p>
        <h2 className="mt-8 text-2xl font-semibold">Services Available in Calgary</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="rounded-full border border-[var(--border-soft)] px-4 py-2" href="/services/gas-fireplace-repair">Gas Fireplace Repair</Link>
          <Link className="rounded-full border border-[var(--border-soft)] px-4 py-2" href="/services/wett-inspection">WETT Inspection</Link>
          <Link className="rounded-full border border-[var(--border-soft)] px-4 py-2" href="/services/chimney-sweep">Chimney Sweep</Link>
          <Link className="rounded-full border border-[var(--border-soft)] px-4 py-2" href="/services/chimney-repair">Chimney Repair</Link>
        </div>
        <h2 className="mt-8 text-2xl font-semibold">Common Local Issues</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Seasonal startup failures, aging gas components, and chimney draft concerns are frequent service requests in Calgary homes.</p>
      </section>
      <FinalCTA className="mt-12 md:mt-16" />
    </>
  );
}
