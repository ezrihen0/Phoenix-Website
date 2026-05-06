import { servicePages } from "@/lib/services";
import { buildServicePage } from "@/lib/seo";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { RelatedServices } from "@/components/services/RelatedServices";
const s = servicePages.wettInspection;
export const metadata = buildServicePage(s);
export default function Page() { return <><ServiceHero title={s.title} description={s.description} /><section className="container-shell py-12"><h2 className="text-2xl font-semibold">Why This Matters</h2><p className="mt-3 text-[var(--text-secondary)]">Clear inspection results support safer operation and better insurance/home-sale decisions.</p></section><ServiceFAQ items={s.faq} /><RelatedServices currentSlug={s.slug} /></>; }