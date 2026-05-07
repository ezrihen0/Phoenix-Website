import { servicePages } from "@/lib/services";
import { buildServicePage } from "@/lib/seo";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { RelatedServices } from "@/components/services/RelatedServices";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { FinalCTA } from "@/components/home/FinalCTA";
const s = servicePages.wettInspection;
export const metadata = buildServicePage(s);
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(s.title)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(s.faq)) }} />
      <ServiceHero title={s.title} description={s.description} />
      <section className="container-shell py-12">
        <h2 className="text-2xl font-semibold">Common Problems</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Unclear appliance history, compliance questions, and insurance-requested documentation.</p>
        <h2 className="mt-8 text-2xl font-semibold">What Phoenix Does</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Inspection-first assessment with concise findings and practical next steps for homeowners.</p>
        <h2 className="mt-8 text-2xl font-semibold">Why This Matters</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Clear reporting supports safer operation and stronger decision-making during transactions or policy updates.</p>
        <h2 className="mt-8 text-2xl font-semibold">Why Choose Phoenix</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Professional communication, Alberta context, and documentation clarity.</p>
      </section>
      <RelatedServices currentSlug={s.slug} />
      <ServiceFAQ items={s.faq} />
      <FinalCTA className="mt-14 mb-16 md:mt-10 md:mb-10" />
    </>
  );
}
