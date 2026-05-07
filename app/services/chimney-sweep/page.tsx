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
  const highlights = [
    { title: "Performance-Focused Cleaning", text: "Sweeping is paired with practical condition checks to support stable seasonal use." },
    { title: "Respectful In-Home Workflow", text: "We keep service visits clean, efficient, and homeowner-friendly from start to finish." },
    { title: "Practical Maintenance Advice", text: "You leave with clear upkeep guidance based on the current condition we observe." }
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(s.title)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(s.faq)) }} />
      <ServiceHero title={s.title} description={s.description} />
      <section className="container-shell py-12">
        <div className="premium-panel p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Common Problems</h2>
          <p className="mt-3 text-[var(--text-secondary)]">Draft inconsistency, buildup concerns, and seasonal performance decline.</p>
          <div className="inner-page-section grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[var(--card-border)] bg-white/90 p-4">
                <h3 className="text-base font-semibold text-[var(--inner-page-title)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="inner-page-section grid gap-4 md:grid-cols-2">
          <article className="premium-panel p-5 md:p-6">
            <h2 className="text-xl font-semibold">What Phoenix Does</h2>
            <p className="mt-2 text-[var(--text-secondary)]">Clean, safety-focused sweeping and condition checks that support better appliance performance.</p>
          </article>
          <article className="premium-panel p-5 md:p-6">
            <h2 className="text-xl font-semibold">Why This Matters</h2>
            <p className="mt-2 text-[var(--text-secondary)]">Routine maintenance helps preserve reliability during high-demand winter months.</p>
          </article>
        </div>
        <article className="inner-page-section premium-panel p-5 md:p-6">
          <h2 className="text-xl font-semibold">Why Choose Phoenix</h2>
          <p className="mt-2 text-[var(--text-secondary)]">Respectful in-home process, practical recommendations, and Alberta-ready service.</p>
        </article>
      </section>
      <RelatedServices currentSlug={s.slug} />
      <ServiceFAQ items={s.faq} />
      <FinalCTA className="mt-24 mb-16 md:mt-10 md:mb-10" />
    </>
  );
}
