import { servicePages } from "@/lib/services";
import { buildServicePage } from "@/lib/seo";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { RelatedServices } from "@/components/services/RelatedServices";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { FinalCTA } from "@/components/home/FinalCTA";
const s = servicePages.chimneySweep;
export const metadata = buildServicePage(s);
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(s.title)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(s.faq)) }} />
      <ServiceHero title={s.title} description={s.description} />
      <section className="container-shell py-12">
        <h2 className="text-2xl font-semibold">Common Problems</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Draft inconsistency, buildup concerns, and seasonal performance decline.</p>
        <h2 className="mt-8 text-2xl font-semibold">What Phoenix Does</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Clean, safety-focused sweeping and condition checks that support better appliance performance.</p>
        <h2 className="mt-8 text-2xl font-semibold">Why This Matters</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Routine maintenance helps preserve reliability during high-demand winter months.</p>
        <h2 className="mt-8 text-2xl font-semibold">Why Choose Phoenix</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Respectful in-home process, practical recommendations, and Alberta-ready service.</p>
      </section>
      <RelatedServices currentSlug={s.slug} />
      <ServiceFAQ items={s.faq} />
      <FinalCTA />
    </>
  );
}
