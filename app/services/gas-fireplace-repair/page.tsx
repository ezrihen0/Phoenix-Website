import { servicePages } from "@/lib/services";
import { buildServicePage } from "@/lib/seo";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { RelatedServices } from "@/components/services/RelatedServices";
import { serviceSchema, faqSchema } from "@/lib/schema";
import { FinalCTA } from "@/components/home/FinalCTA";
const s = servicePages.gasFireplaceRepair;
export const metadata = buildServicePage(s);
export default function Page() {
  const highlights = [
    { title: "Failure Pattern Review", text: "We map recent start/stop behavior to pinpoint ignition and airflow causes faster." },
    { title: "Safety-First Diagnostics", text: "Every visit starts with practical checks that confirm the appliance can operate safely." },
    { title: "Plain-Language Next Steps", text: "You get concise options and clear priorities before any repair decision is made." }
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(s.title)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(s.faq)) }} />
      <ServiceHero title={s.title} description={s.description} />
      <section className="container-shell py-12">
        <div className="premium-panel p-6 md:p-8">
          <h2 className="text-2xl font-semibold">Common Problems</h2>
          <p className="mt-3 text-[var(--text-secondary)]">Pilot failure, delayed ignition, weak flame, and repeated restart attempts are common service triggers.</p>
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
            <p className="mt-2 text-[var(--text-secondary)]">We isolate root causes, confirm safe operation, and explain repair options in plain language.</p>
          </article>
          <article className="premium-panel p-5 md:p-6">
            <h2 className="text-xl font-semibold">Why This Matters</h2>
            <p className="mt-2 text-[var(--text-secondary)]">Early diagnostics reduce repeat failure risk and help avoid avoidable component damage.</p>
          </article>
        </div>
        <article className="inner-page-section premium-panel p-5 md:p-6">
          <h2 className="text-xl font-semibold">Why Choose Phoenix</h2>
          <p className="mt-2 text-[var(--text-secondary)]">Alberta-focused field experience, clean in-home process, and concise reporting.</p>
        </article>
      </section>
      <RelatedServices currentSlug={s.slug} />
      <ServiceFAQ items={s.faq} />
      <FinalCTA className="mt-24 mb-16 md:mt-10 md:mb-10" />
    </>
  );
}

