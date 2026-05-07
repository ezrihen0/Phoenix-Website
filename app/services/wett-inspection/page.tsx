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
  const highlights = [
    { title: "Code-Aware Assessment", text: "We review venting and installation context with practical Alberta expectations in mind." },
    { title: "Insurance-Ready Notes", text: "Reporting is structured so homeowners can share findings clearly when needed." },
    { title: "Decision Clarity", text: "You get next-step guidance without jargon or unnecessary complexity." }
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(s.title)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(s.faq)) }} />
      <ServiceHero title={s.title} description={s.description} />
      <section className="container-shell py-12">
        <div className="premium-panel p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Common Problems</h2>
          <p className="mt-3 text-[var(--text-secondary)]">Unclear appliance history, compliance questions, and insurance-requested documentation.</p>
          <div className="inner-page-section grid gap-4 md:grid-cols-3">
            {highlights.map((item) => (
              <article key={item.title} className="rounded-2xl border border-[var(--card-border)] bg-[var(--surface-overlay-strong)] p-4">
                <h3 className="text-base font-semibold text-[var(--inner-page-title)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="inner-page-section grid gap-4 md:grid-cols-2">
          <article className="premium-panel p-5 md:p-6">
            <h2 className="text-xl font-semibold">What Phoenix Does</h2>
            <p className="mt-2 text-[var(--text-secondary)]">Inspection-first assessment with concise findings and practical next steps for homeowners.</p>
          </article>
          <article className="premium-panel p-5 md:p-6">
            <h2 className="text-xl font-semibold">Why This Matters</h2>
            <p className="mt-2 text-[var(--text-secondary)]">Clear reporting supports safer operation and stronger decision-making during transactions or policy updates.</p>
          </article>
        </div>
        <article className="inner-page-section premium-panel p-5 md:p-6">
          <h2 className="text-xl font-semibold">Why Choose Phoenix</h2>
          <p className="mt-2 text-[var(--text-secondary)]">Professional communication, Alberta context, and documentation clarity.</p>
        </article>
      </section>
      <RelatedServices currentSlug={s.slug} />
      <ServiceFAQ items={s.faq} />
      <FinalCTA className="mt-24 mb-16 md:mt-10 md:mb-10" />
    </>
  );
}

