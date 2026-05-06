import { servicePages } from "@/lib/services";
import { buildServicePage } from "@/lib/seo";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { RelatedServices } from "@/components/services/RelatedServices";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { FinalCTA } from "@/components/home/FinalCTA";
const s = servicePages.chimneyRepair;
export const metadata = buildServicePage(s);
export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(s.title)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(s.faq)) }} />
      <ServiceHero title={s.title} description={s.description} />
      <section className="container-shell py-12">
        <h2 className="text-2xl font-semibold">Common Problems</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Visible deterioration, moisture effects, and venting-related concerns.</p>
        <h2 className="mt-8 text-2xl font-semibold">What Phoenix Does</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Targeted chimney repair planning with clear scope and practical safety priorities.</p>
        <h2 className="mt-8 text-2xl font-semibold">Why This Matters</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Addressing issues early helps avoid escalation and protects long-term system use.</p>
        <h2 className="mt-8 text-2xl font-semibold">Why Choose Phoenix</h2>
        <p className="mt-3 text-[var(--text-secondary)]">Concise diagnostics, field-proven workflow, and homeowner-friendly communication.</p>
      </section>
      <RelatedServices currentSlug={s.slug} />
      <ServiceFAQ items={s.faq} />
      <FinalCTA />
    </>
  );
}
