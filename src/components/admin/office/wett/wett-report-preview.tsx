import type { WettReportViewModel } from "@/lib/wett/report-view-model";

export function WettReportPreview({ model }: { model: WettReportViewModel }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-[#d8d0c6] bg-white shadow-sm">
      <header className="bg-[#1c1816] px-5 py-5 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand/logo.webp" alt="" className="h-12 w-12 rounded-full bg-white object-contain" />
            <div>
              <p className="text-sm text-[#e7b89a]">Phoenix Fireplace</p>
              <h2 className="text-xl font-semibold">{model.title}</h2>
            </div>
          </div>
          <p className="text-right text-sm font-semibold">{model.reportNumber}</p>
        </div>
      </header>
      <div className="h-1 bg-[#c56a3a]" />
      <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
        <Field label="Customer" value={model.customerName} />
        <Field label="Inspection date" value={model.inspectionDate} />
        <Field label="Inspector" value={model.inspectorName} />
        <Field label="WETT number" value={model.wettInspectorNumber} />
        <Field label="Inspection level" value={model.inspectionLevel} />
        <Field label="Reason" value={model.reason} />
        <div className="sm:col-span-2">
          <Field label="Property" value={model.propertyLines.join(", ")} />
        </div>
      </div>
      <section className="border-t border-[#d8d0c6] px-5 py-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b625a]">System</h3>
        <p className="mt-2 text-base leading-7">{model.systemLabel}</p>
        {model.identification.length === 0 ? <p className="mt-1 text-sm leading-6 text-[#6b625a]">Not recorded</p> : null}
        <dl className="mt-3 grid gap-2">
          {model.identification.map((item) => (
            <div key={item.label}>
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b625a]">{item.label}</dt>
              <dd className="text-sm leading-6">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="border-t border-[#d8d0c6] px-5 py-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b625a]">Executive summary</h3>
        <ul className="mt-3 grid gap-1 text-sm leading-6">
          {model.executiveSummary.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>
      {model.measurements.length > 0 ? <ListSection title="Measurements & system checks" rows={model.measurements} reportId={model.reportId} photos={model.photos} /> : null}
      {model.sectionResults.length > 0 ? <ListSection title="Inspection" rows={model.sectionResults} reportId={model.reportId} photos={model.photos} /> : null}
      {model.cleaning ? (
        <section className="border-t border-[#d8d0c6] px-5 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b625a]">Maintenance / combustible deposits</h3>
          {model.cleaning.observation ? <p className="mt-2 text-sm leading-6">Observation: {model.cleaning.observation}</p> : null}
          <p className="mt-2 text-sm leading-6">Assessment: {model.cleaning.assessment}</p>
          {model.cleaning.recommendation ? <p className="mt-2 text-sm leading-6">Technician recommendation: {model.cleaning.recommendation}</p> : null}
          {model.cleaning.technicalBasis ? <p className="mt-2 text-sm leading-6">Technical basis: {model.cleaning.technicalBasis}</p> : null}
          <ReportPhotos reportId={model.reportId} photos={model.photos} photoIds={model.cleaning.photoIds} />
        </section>
      ) : null}
      {model.findings.length > 0 ? (
        <section className="border-t border-[#d8d0c6] px-5 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b625a]">Additional findings</h3>
          {model.findings.map((finding) => (
            <div key={`${finding.title}-${finding.body}`} className="mt-3">
              <p className="text-sm leading-6">
                <span className="font-semibold">{finding.title}. </span>
                {finding.body}
              </p>
              <ReportPhotos reportId={model.reportId} photos={model.photos} photoIds={finding.photoIds} />
            </div>
          ))}
        </section>
      ) : null}
      {unplacedPhotos(model).length > 0 ? (
        <section className="border-t border-[#d8d0c6] px-5 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b625a]">Photo evidence</h3>
          <ReportPhotos reportId={model.reportId} photos={unplacedPhotos(model)} photoIds={unplacedPhotos(model).map((photo) => photo.id)} />
        </section>
      ) : null}
      {model.recommendations.length > 0 ? (
        <section className="border-t border-[#d8d0c6] px-5 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b625a]">Technician recommendations</h3>
          {model.recommendationDisclaimer ? <p className="mt-2 text-sm leading-6">{model.recommendationDisclaimer}</p> : null}
          {model.recommendations.map((line) => <p key={line} className="mt-2 text-sm leading-6">{line}</p>)}
        </section>
      ) : null}
      {model.technicianNote ? (
        <section className="border-t border-[#d8d0c6] px-5 py-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b625a]">Technician notes</h3>
          <p className="mt-2 whitespace-pre-wrap text-base leading-7">{model.technicianNote}</p>
        </section>
      ) : null}
      <footer className="border-t border-[#d8d0c6] bg-[#f4efe8] px-5 py-5 text-sm leading-6 text-[#6b625a]">
        <p>{model.signOff}</p>
      </footer>
    </article>
  );
}

function placedPhotoIds(model: WettReportViewModel) {
  return new Set([
    ...model.measurements.flatMap((item) => item.photoIds),
    ...model.sectionResults.flatMap((item) => item.photoIds),
    ...model.findings.flatMap((item) => item.photoIds),
    ...(model.cleaning?.photoIds || []),
  ]);
}

function unplacedPhotos(model: WettReportViewModel) {
  const placed = placedPhotoIds(model);
  return model.photos.filter((photo) => !placed.has(photo.id));
}

function ListSection({
  title,
  rows,
  reportId,
  photos,
}: {
  title: string;
  rows: Array<{ label: string; value: string; photoIds?: string[] }>;
  reportId: string;
  photos: WettReportViewModel["photos"];
}) {
  return (
    <section className="border-t border-[#d8d0c6] px-5 py-5">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6b625a]">{title}</h3>
      <dl className="mt-3 divide-y divide-[#d8d0c6]">
        {rows.map((item) => (
          <div key={item.label} className="py-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[#6b625a]">{item.label}</dt>
              <dd className="max-w-[65%] whitespace-pre-line text-right font-medium">{item.value}</dd>
            </div>
            <ReportPhotos reportId={reportId} photos={photos} photoIds={item.photoIds || []} />
          </div>
        ))}
      </dl>
    </section>
  );
}

function ReportPhotos({
  reportId,
  photos,
  photoIds,
}: {
  reportId: string;
  photos: WettReportViewModel["photos"];
  photoIds: string[];
}) {
  const shown = photos.filter((photo) => photoIds.includes(photo.id));
  if (shown.length === 0) return null;

  return (
    <div className="mt-3 grid gap-3">
      {shown.map((photo) => (
        <figure key={photo.id}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/admin/wett/reports/${reportId}/photos/${photo.id}`} alt={photo.caption} className="max-h-80 w-full rounded-2xl object-cover" />
          <figcaption className="mt-1 text-sm text-[#6b625a]">{photo.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b625a]">{label}</p>
      <p className="mt-1 text-base">{value}</p>
    </div>
  );
}
