import { servicePages } from "@/lib/services";
import { buildServicePage } from "@/lib/seo";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { RelatedServices } from "@/components/services/RelatedServices";
const s = servicePages.chimneyRepair;
export const metadata = buildServicePage(s);
export default function Page() { return <><ServiceHero title={s.title} description={s.description} /><section className="container-shell py-12"><h2 className="text-2xl font-semibold">Why Choose Phoenix</h2><p className="mt-3 text-[var(--text-secondary)]">Targeted repairs with clear recommendations that protect your home and long-term system safety.</p></section><ServiceFAQ items={s.faq} /><RelatedServices currentSlug={s.slug} /></>; }