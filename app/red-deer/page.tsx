import { cityPages } from "@/lib/cities";
import { buildCityPage } from "@/lib/seo";
const city = cityPages.redDeer;
export const metadata = buildCityPage(city);
export default function RedDeerPage() { return <section className="container-shell py-14"><h1 className="text-4xl font-semibold">{city.title}</h1><p className="mt-4 text-lg text-[var(--text-secondary)]">{city.intro}</p></section>; }