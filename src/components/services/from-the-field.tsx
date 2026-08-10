import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { cities, getCityBySlug, type CitySlug } from "@/lib/cities";
import { getCmsStorageStatus, listPublicEvidence } from "@/lib/cms/storage";
import { getServiceLandingPage } from "@/lib/site-data";

type FromTheFieldProps = {
  serviceSlug: string;
  city?: CitySlug;
};

function getEvidenceTitle(record: Awaited<ReturnType<typeof listPublicEvidence>>[number]) {
  return (
    record.publicData.summaryLabel ||
    record.publicData.homeownerProblem ||
    "Verified field example"
  );
}

function getEvidenceSections(record: Awaited<ReturnType<typeof listPublicEvidence>>[number]) {
  return [
    { label: "Observed", value: record.publicData.observed },
    { label: "Found", value: record.publicData.found },
    { label: "Work performed", value: record.publicData.workPerformed },
    { label: "Inspected", value: record.publicData.inspected },
    { label: "Homeowner lesson", value: record.publicData.homeownerLesson },
  ].filter((entry) => entry.value?.trim());
}

export async function FromTheField({ serviceSlug, city }: FromTheFieldProps) {
  if (!getCmsStorageStatus().healthy) {
    return null;
  }

  const evidence = await listPublicEvidence({
    serviceSlug,
    city,
    limit: city ? 2 : 3,
  });

  if (evidence.length === 0) {
    return null;
  }

  const cityName = city ? getCityBySlug(city)?.name : null;
  const serviceTitle = getServiceLandingPage(serviceSlug)?.title || "service";

  return (
    <section className="section-pad bg-[rgba(255,255,255,0.45)]">
      <div className="page-frame">
        <Reveal>
          <SectionHeading
            eyebrow="From the field"
            title={
              cityName
                ? `Real ${cityName} examples for ${serviceTitle.toLowerCase()}`
                : `Real field examples for ${serviceTitle.toLowerCase()}`
            }
            description="These are public-approved examples based on verified job notes and photos. Details are trimmed for privacy and only shown when the owner approved them for public use."
          />
        </Reveal>

        <div className="mt-10 grid gap-5 xl:grid-cols-2">
          {evidence.map((record, index) => {
            const primaryImage =
              record.images.find((image) => image.isPrimary) || record.images[0];
            const sections = getEvidenceSections(record);
            const recordCityName =
              cities.find((entry) => entry.slug === record.jobCity)?.name || record.jobCity;

            return (
              <Reveal key={record.id} delay={index * 70}>
                <article className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_18px_40px_rgba(31,26,22,0.06)]">
                  {primaryImage ? (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-paper)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.alt || "Verified field example"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="space-y-4 p-6">
                    <div className="flex flex-wrap gap-2">
                      {!cityName ? (
                        <span className="rounded-full bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
                          {recordCityName}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-[rgba(191,88,43,0.12)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
                        Verified field example
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                      {getEvidenceTitle(record)}
                    </h2>
                    {record.publicData.homeownerProblem ? (
                      <p className="text-sm leading-7 text-[var(--color-muted)]">
                        {record.publicData.homeownerProblem}
                      </p>
                    ) : null}
                    <div className="grid gap-3">
                      {sections.map((section) => (
                        <div
                          key={`${record.id}-${section.label}`}
                          className="rounded-[1.4rem] bg-white px-4 py-4"
                        >
                          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ember)]">
                            {section.label}
                          </p>
                          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                            {section.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    {primaryImage?.caption ? (
                      <p className="text-xs leading-6 text-[var(--color-muted)]">
                        {primaryImage.caption}
                      </p>
                    ) : null}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
