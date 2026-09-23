"use client";

import { WettHelpControl } from "@/components/admin/office/wett/wett-help";
import { WettIdentificationSection } from "@/components/admin/office/wett/wett-identification-section";
import { WettMeasurementsSection } from "@/components/admin/office/wett/wett-measurements-section";
import { EVIDENCE_TYPE_LABELS, PHOENIX_EVIDENCE_LABEL } from "@/lib/wett/knowledge/evidence";
import { UTI_REASON_LABELS, UTI_VALID_REASONS } from "@/lib/wett/knowledge/engines";
import { cleaningHelp, inspectionGroupHelp, inspectionItemHelp, sharedHelp } from "@/lib/wett/knowledge/help";
import { chimneyRouteQuestion, itemApplies, workflowFor } from "@/lib/wett/knowledge/index";
import {
  INSPECTION_LEVEL_LABELS,
  INSPECTION_REASON_LABELS,
  KNOWN_HISTORY_FIELDS,
  SAFETY_GATE_FIELDS,
} from "@/lib/wett/knowledge/common-site";
import {
  CLEANING_ASSESSMENT_LABELS,
  CLEANING_ITEM_ID,
  DEPOSIT_CONDITION_LABELS,
  DEPOSIT_LEVEL_LABELS,
  WETT_CLEANING_ASSESSMENTS,
  WETT_DEPOSIT_CONDITIONS,
  WETT_DEPOSIT_LEVELS,
  WETT_LAST_CLEANING,
  cleaningEvidenceOpen,
  cleaningLocationsFor,
  cleaningPhotoEncouraged,
  cleaningRecommendationCopy,
  sanitizeCleaning,
} from "@/lib/wett/cleaning";
import { TECHNICIAN_CORRECTIVE_OPTIONS, TECHNICIAN_RECOMMENDATION_DISCLAIMER, recommendationTargets } from "@/lib/wett/recommendations";
import { PHOENIX_ALBERTA } from "@/lib/wett/knowledge/phoenix-alberta";
import {
  WETT_EVIDENCE_TYPES,
  WETT_INSPECTION_LEVELS,
  WETT_INSPECTION_REASONS,
  WETT_YES_NO,
  type WettChecklistItem,
  type WettEditableDraft,
  type WettEvidenceType,
  type WettItemStatus,
  type WettReport,
} from "@/lib/wett/schema";

const STATUS_BUTTONS: Array<{ value: WettItemStatus; label: string }> = [
  { value: "compliant", label: "Compliant" },
  { value: "not-compliant", label: "Not Compliant" },
  { value: "not-applicable", label: "N/A" },
  { value: "unable-to-inspect", label: "UTI" },
];

export type PhotoLink = {
  checklistItemId?: string;
  findingId?: string;
  measurementId?: string;
  inspectionSection?: string;
  caption?: string;
};

type UpdateDraft = (updater: (draft: WettEditableDraft) => WettEditableDraft) => void;

function upsertChecklist(draft: WettEditableDraft, id: string, patch: Partial<WettChecklistItem>): WettEditableDraft {
  const current = draft.checklist.find((item) => item.id === id) ?? { id };
  const next = { ...current, ...patch, id };
  return {
    ...draft,
    checklist: [...draft.checklist.filter((item) => item.id !== id), next],
  };
}

export function WettKnowledgeSections({
  section,
  report,
  disabled,
  onChange,
  onUploadPhoto,
  onLookup,
  onRewriteText,
}: {
  section: string;
  report: WettReport;
  disabled: boolean;
  onChange: UpdateDraft;
  onUploadPhoto?: (file: File, link: PhotoLink) => void;
  onLookup?: (requirement: string) => Promise<string | undefined>;
  onRewriteText?: (text: string) => Promise<string | undefined>;
}) {
  const draft = report;
  const workflow = workflowFor(draft.system.type);

  if (section === "setup") {
    return (
      <div className="grid gap-4">
        <p className="text-sm leading-6 text-[#6b625a]">Select the inspection level. It is not inferred from the reason.</p>
        <SelectField
          label="Inspection level"
          value={draft.inspection.inspectionLevel || ""}
          disabled={disabled}
          options={WETT_INSPECTION_LEVELS.map((level) => ({ value: level, label: INSPECTION_LEVEL_LABELS[level] }))}
          onChange={(value) =>
            onChange((current) => ({
              ...current,
              inspection: { ...current.inspection, inspectionLevel: (value || undefined) as WettEditableDraft["inspection"]["inspectionLevel"] },
            }))
          }
        />
        <SelectField
          label="Reason"
          value={draft.inspection.reason || ""}
          disabled={disabled}
          options={WETT_INSPECTION_REASONS.map((reason) => ({ value: reason, label: INSPECTION_REASON_LABELS[reason] }))}
          onChange={(value) =>
            onChange((current) => ({
              ...current,
              inspection: { ...current.inspection, reason: (value || undefined) as WettEditableDraft["inspection"]["reason"] },
            }))
          }
        />
        <TextInput label="Inspection date" type="date" value={draft.inspection.inspectionDate || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, inspection: { ...current.inspection, inspectionDate: value } }))} />
        <TextInput label="Responsible inspector" value={draft.inspection.inspectorName || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, inspection: { ...current.inspection, inspectorName: value } }))} />
        <TextInput label="WETT number" value={draft.inspection.wettInspectorNumber || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, inspection: { ...current.inspection, wettInspectorNumber: value } }))} />
        <p className="text-sm font-semibold">Safety gate</p>
        {SAFETY_GATE_FIELDS.map((field) => (
          <SelectField
            key={field.key}
            label={field.label}
            value={draft.inspection[field.key] || ""}
            disabled={disabled}
            options={WETT_YES_NO.map((value) => ({ value, label: value }))}
            onChange={(value) =>
              onChange((current) => ({
                ...current,
                inspection: { ...current.inspection, [field.key]: value || undefined },
              }))
            }
          />
        ))}
        <SelectField
          label="Roof or ladder conditions acceptable?"
          value={draft.inspection.roofAccessAcceptable || ""}
          disabled={disabled}
          options={[
            { value: "yes", label: "yes" },
            { value: "no", label: "no" },
            { value: "na", label: "na" },
          ]}
          onChange={(value) =>
            onChange((current) => ({
              ...current,
              inspection: { ...current.inspection, roofAccessAcceptable: (value || undefined) as WettEditableDraft["inspection"]["roofAccessAcceptable"] },
            }))
          }
        />
        {KNOWN_HISTORY_FIELDS.map((field) => (
          <SelectField
            key={field.key}
            label={field.label}
            value={draft.inspection[field.key] || ""}
            disabled={disabled}
            options={WETT_YES_NO.map((value) => ({ value, label: value }))}
            onChange={(value) =>
              onChange((current) => ({
                ...current,
                inspection: { ...current.inspection, [field.key]: value || undefined },
              }))
            }
          />
        ))}
      </div>
    );
  }

  if (section === "property") {
    return (
      <div className="grid gap-4">
        <TextInput label="Customer name" value={draft.customer.name || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, customer: { ...current.customer, name: value } }))} />
        <TextInput label="Phone" value={draft.customer.phone || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, customer: { ...current.customer, phone: value } }))} />
        <TextInput label="Email" value={draft.customer.email || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, customer: { ...current.customer, email: value } }))} />
        <TextInput label="Street address" value={draft.property.addressLine || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, property: { ...current.property, addressLine: value } }))} />
        <TextInput label="City" value={draft.property.city || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, property: { ...current.property, city: value } }))} />
        <TextInput label="Municipality" value={draft.property.municipality || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, property: { ...current.property, municipality: value } }))} />
        <label className="grid gap-2 text-sm font-semibold">
          Province
          <input value={PHOENIX_ALBERTA.provinceLabel} readOnly className="min-h-12 rounded-2xl border border-[#d8d0c6] bg-[#f4efe8] px-3 text-base font-normal" />
        </label>
        <TextInput label="Postal code" value={draft.property.postalCode || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, property: { ...current.property, postalCode: value } }))} />
      </div>
    );
  }

  if (section === "identification") {
    return <WettIdentificationSection report={report} disabled={disabled} onChange={onChange} />;
  }

  if (section === "system") {
    if (!workflow) {
      return <p className="text-sm leading-6">Choose a system type to load its inspection sections.</p>;
    }

    const routeQuestion = chimneyRouteQuestion(draft);

    return (
      <div className="grid gap-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm leading-6 text-[#6b625a]">{workflow.label}. Record what was observed. A condition does not set Not Compliant by itself.</p>
          <WettHelpControl guidance={sharedHelp("status")} report={draft} currentSection="Inspection" inspectionItem="Status" />
        </div>
        {routeQuestion === "factory-enclosure" ? (
          <SelectField
            label="Chimney route"
            value={draft.venting.route || ""}
            disabled={disabled}
            options={[
              { value: "factory-chase", label: "Factory-Built Pipe — Inside Chase" },
              { value: "factory-direct", label: "Factory-Built Pipe — Direct / Exposed Through Roof" },
              { value: "unknown", label: "Unknown / Unable to Verify" },
            ]}
            onChange={(value) => onChange((current) => ({ ...current, venting: { route: (value || undefined) as WettEditableDraft["venting"]["route"] } }))}
          />
        ) : null}
        {draft.system.type === "masonry-fireplace" ? <p className="text-sm leading-6 text-[#6b625a]">This fireplace uses the masonry chimney inspection. Record the liner as a component. A liner is not a chimney type.</p> : null}
        {draft.system.type === "wood-stove" && draft.system.chimneyType === "masonry" ? <p className="text-sm leading-6 text-[#6b625a]">Masonry chimney inspection follows the chimney type from Identification.</p> : null}
        {draft.system.type === "fireplace-insert" && draft.system.originalFireplaceType === "masonry" ? <p className="text-sm leading-6 text-[#6b625a]">A masonry fireplace can have a masonry chimney and a stainless liner. The liner is not the chimney.</p> : null}
        {workflow.sections.map((group) => {
          const visible = group.items.filter((item) => itemApplies(item, draft));
          if (visible.length === 0) {
            return null;
          }

          return (
            <div id={`wett-group-${group.id}`} key={group.id} className="grid scroll-mt-24 gap-3 rounded-2xl bg-[#f4efe8] p-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{group.label}</h3>
                <WettHelpControl guidance={inspectionGroupHelp(draft.system.type, group.id)} report={draft} currentSection="Inspection" inspectionGroup={group.label} onLookup={onLookup} />
              </div>
              {visible.map((item) => (
                <ChecklistCard key={item.id} itemId={item.id} label={item.label} instructions={item.instructions} sectionLabel={group.label} naAllowed={item.naAllowed} utiAllowed={item.utiAllowed} help={inspectionItemHelp(draft.system.type, item.id)} report={draft} stored={draft.checklist.find((entry) => entry.id === item.id)} disabled={disabled} onChange={onChange} onUploadPhoto={onUploadPhoto} onLookup={onLookup} onRewriteText={onRewriteText} />
              ))}
            </div>
          );
        })}
        <CleaningAssessment report={draft} disabled={disabled} onChange={onChange} onUploadPhoto={onUploadPhoto} onRewriteText={onRewriteText} />
      </div>
    );
  }

  if (section === "measurements") {
    return <WettMeasurementsSection report={report} disabled={disabled} onChange={onChange} onLookup={onLookup} />;
  }

  if (section === "findings") {
    return <FindingsSection report={draft} disabled={disabled} onChange={onChange} onUploadPhoto={onUploadPhoto} onRewriteText={onRewriteText} />;
  }

  if (section === "recommendations") {
    return <RecommendationsSection report={draft} disabled={disabled} onChange={onChange} />;
  }

  return null;
}

function ChecklistCard({
  itemId,
  label,
  instructions,
  sectionLabel,
  naAllowed,
  utiAllowed,
  help,
  report,
  stored,
  disabled,
  onChange,
  onUploadPhoto,
  onLookup,
  onRewriteText,
}: {
  itemId: string;
  label: string;
  instructions: string;
  sectionLabel: string;
  naAllowed: boolean;
  utiAllowed: boolean;
  help?: ReturnType<typeof inspectionItemHelp>;
  report: WettReport;
  stored?: WettChecklistItem;
  disabled: boolean;
  onChange: UpdateDraft;
  onUploadPhoto?: (file: File, link: PhotoLink) => void;
  onLookup?: (requirement: string) => Promise<string | undefined>;
  onRewriteText?: (text: string) => Promise<string | undefined>;
}) {
  const statuses = STATUS_BUTTONS.filter((status) => (status.value === "not-applicable" ? naAllowed : status.value === "unable-to-inspect" ? utiAllowed : true));
  const photos = report.photos.filter((photo) => photo.checklistItemId === itemId);

  return (
    <div className="grid gap-3 rounded-2xl border border-[#d8d0c6] bg-white p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold">{label}</p>
        <WettHelpControl guidance={help} report={report} currentSection="Inspection" inspectionGroup={sectionLabel} inspectionItem={label} currentStatus={stored?.status} onLookup={onLookup} onTakePhoto={onUploadPhoto ? (file) => onUploadPhoto(file, { checklistItemId: itemId, inspectionSection: sectionLabel }) : undefined} />
      </div>
      <p className="text-sm leading-6 text-[#6b625a]">{instructions}</p>
      <div className="grid grid-cols-2 gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            type="button"
            disabled={disabled}
            className={`min-h-12 rounded-2xl px-3 text-sm font-semibold ${stored?.status === status.value ? "bg-[#1c1816] text-white" : "border border-[#d8d0c6] bg-white"}`}
            onClick={() =>
              onChange((current) =>
                upsertChecklist(current, itemId, {
                  status: status.value,
                  workflowControl: undefined,
                  uti: status.value === "unable-to-inspect" ? { component: label, reason: current.checklist.find((item) => item.id === itemId)?.uti?.reason, notVerified: current.checklist.find((item) => item.id === itemId)?.uti?.notVerified } : undefined,
                }),
              )
            }
          >
            {status.label}
          </button>
        ))}
      </div>
      {stored?.status === "not-compliant" ? (
        <div className="grid gap-3">
          <Area
            label="What did you observe?"
            value={stored.observation || ""}
            disabled={disabled}
            onChange={(value) => onChange((current) => upsertChecklist(current, itemId, { observation: value, observationRaw: value }))}
          />
          <button type="button" disabled={disabled || !stored.observation} className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold disabled:opacity-50" onClick={() => { const raw = stored.observationRaw || stored.observation || ""; void onRewriteText?.(raw).then((candidate) => { if (candidate) onChange((current) => upsertChecklist(current, itemId, { observationCandidate: candidate, observationRaw: raw })); }); }}>Rewrite with AI</button>
          {stored.observationCandidate ? <p className="rounded-2xl bg-[#f4efe8] p-3 text-sm leading-6">{stored.observationCandidate}</p> : null}
          {stored.observationCandidate ? <button type="button" className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white" onClick={() => onChange((current) => upsertChecklist(current, itemId, { observation: stored.observationCandidate, observationRaw: stored.observationRaw || stored.observation }))}>Accept rewrite</button> : null}
          <PhotoEvidence report={report} photos={photos} disabled={disabled} onUploadPhoto={onUploadPhoto} link={{ checklistItemId: itemId, inspectionSection: sectionLabel }} onChange={onChange} />
        </div>
      ) : null}
      {stored?.status === "unable-to-inspect" ? (
        <div className="grid gap-3">
          <SelectField
            label="Reason"
            value={stored.uti?.reason || ""}
            disabled={disabled}
            options={UTI_VALID_REASONS.map((reason) => ({ value: reason, label: UTI_REASON_LABELS[reason] }))}
            onChange={(value) => onChange((current) => upsertChecklist(current, itemId, { status: "unable-to-inspect", uti: { component: label, reason: value, notVerified: stored.uti?.notVerified || value } }))}
          />
          <Area label="What was not verified" value={stored.uti?.notVerified || ""} disabled={disabled} onChange={(value) => onChange((current) => upsertChecklist(current, itemId, { uti: { component: label, reason: stored.uti?.reason, notVerified: value } }))} />
        </div>
      ) : null}
    </div>
  );
}

function PhotoEvidence({
  report,
  photos,
  disabled,
  link,
  onChange,
  onUploadPhoto,
}: {
  report: WettReport;
  photos: WettReport["photos"];
  disabled: boolean;
  link: PhotoLink;
  onChange: UpdateDraft;
  onUploadPhoto?: (file: File, link: PhotoLink) => void;
}) {
  const unused = report.photos.filter((photo) => !photos.some((item) => item.id === photo.id));

  return (
    <div className="grid gap-2">
      <p className="text-sm font-semibold">Photo Evidence</p>
      <div className="flex flex-wrap gap-2">
        <label className="inline-flex min-h-12 items-center rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white">
          Take Photo
          <input type="file" accept="image/*" capture="environment" disabled={disabled} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) onUploadPhoto?.(file, link); }} />
        </label>
        <label className="inline-flex min-h-12 items-center rounded-full border border-[#1c1816] px-4 text-sm font-semibold">
          Choose Existing Photo
          <input type="file" accept="image/*" disabled={disabled} className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; event.target.value = ""; if (file) onUploadPhoto?.(file, link); }} />
        </label>
      </div>
      {unused.length > 0 ? (
        <SelectField
          label="Attach a photo already on this report"
          value=""
          disabled={disabled}
          options={unused.map((photo) => ({ value: photo.id, label: photo.caption || "Untitled photo" }))}
          onChange={(value) => {
            if (!value) return;
            onChange((current) => ({
              ...current,
              photoMetadata: current.photoMetadata.map((photo) => photo.id === value ? { ...photo, checklistItemId: link.checklistItemId, findingId: link.findingId, measurementId: link.measurementId, inspectionSection: link.inspectionSection, systemType: current.system.type } : photo),
            }));
          }}
        />
      ) : null}
      {photos.map((photo) => (
        <p key={photo.id} className="text-sm text-[#6b625a]">{photo.caption || "Photo attached"}</p>
      ))}
    </div>
  );
}

function FindingsSection({
  report,
  disabled,
  onChange,
  onUploadPhoto,
  onRewriteText,
}: {
  report: WettReport;
  disabled: boolean;
  onChange: UpdateDraft;
  onUploadPhoto?: (file: File, link: PhotoLink) => void;
  onRewriteText?: (text: string) => Promise<string | undefined>;
}) {
  const showCards = report.notes.additionalIssues === "yes" || report.findings.length > 0;

  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold">Did you observe any additional issue not covered above?</p>
        <WettHelpControl guidance={sharedHelp("finding")} report={report} currentSection="Additional Findings" inspectionItem="Additional finding" />
      </div>
      <div className="flex gap-2">
        <button type="button" disabled={disabled} className={`min-h-12 flex-1 rounded-full px-4 text-sm font-semibold ${report.notes.additionalIssues === "no" ? "bg-[#1c1816] text-white" : "border border-[#1c1816]"}`} onClick={() => onChange((current) => ({ ...current, notes: { ...current.notes, additionalIssues: "no" }, findings: current.findings.length > 0 ? current.findings : [] }))}>No</button>
        <button type="button" disabled={disabled} className={`min-h-12 flex-1 rounded-full px-4 text-sm font-semibold ${report.notes.additionalIssues === "yes" ? "bg-[#1c1816] text-white" : "border border-[#1c1816]"}`} onClick={() => onChange((current) => ({ ...current, notes: { ...current.notes, additionalIssues: "yes" } }))}>Yes</button>
      </div>
      {showCards ? report.findings.map((finding) => (
        <div key={finding.id} className="grid gap-3 rounded-2xl border border-[#d8d0c6] p-3">
          <Area label="Observation / Description" value={finding.observation || ""} disabled={disabled} onChange={(value) => onChange((current) => ({ ...current, findings: current.findings.map((item) => item.id === finding.id ? { ...item, observation: value, rawTechnicianText: value } : item) }))} />
          <button type="button" disabled={disabled || !finding.observation} className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold disabled:opacity-50" onClick={() => { const raw = finding.rawTechnicianText || finding.observation || ""; void onRewriteText?.(raw).then((candidate) => { if (candidate) onChange((current) => ({ ...current, findings: current.findings.map((item) => item.id === finding.id ? { ...item, aiCandidate: candidate, rawTechnicianText: raw } : item) })); }); }}>Rewrite with AI</button>
          {finding.aiCandidate ? <p className="rounded-2xl bg-[#f4efe8] p-3 text-sm leading-6">{finding.aiCandidate}</p> : null}
          {finding.aiCandidate ? (
            <button type="button" className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white" onClick={() => onChange((current) => ({ ...current, findings: current.findings.map((item) => item.id === finding.id ? { ...item, observation: item.aiCandidate, acceptedFinalText: item.aiCandidate } : item) }))}>Accept rewrite</button>
          ) : null}
          <PhotoEvidence report={report} photos={report.photos.filter((photo) => photo.findingId === finding.id)} disabled={disabled} link={{ findingId: finding.id, inspectionSection: "Additional Findings" }} onChange={onChange} onUploadPhoto={onUploadPhoto} />
        </div>
      )) : null}
      {report.notes.additionalIssues === "yes" ? (
        <button type="button" disabled={disabled} className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white" onClick={() => onChange((current) => ({ ...current, notes: { ...current.notes, additionalIssues: "yes" }, findings: [...current.findings, { id: crypto.randomUUID() }] }))}>Add Another Finding</button>
      ) : null}
    </div>
  );
}

function RecommendationsSection({ report, disabled, onChange }: { report: WettReport; disabled: boolean; onChange: UpdateDraft }) {
  const targets = recommendationTargets(report);
  const rows = [
    ...targets.checklist.map((item) => ({ key: item.id, label: item.label, inspectionItemId: item.id, findingId: undefined as string | undefined })),
    ...targets.findings.map((finding) => ({ key: finding.id, label: "Additional finding", inspectionItemId: undefined as string | undefined, findingId: finding.id })),
    ...targets.cleaning.map((item) => ({ key: item.id, label: item.priority === "before-continued-use" ? `${item.label} — before continued use` : item.label, inspectionItemId: item.id, findingId: undefined as string | undefined })),
  ];

  return (
    <div className="grid gap-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-6">{TECHNICIAN_RECOMMENDATION_DISCLAIMER}</p>
        <WettHelpControl guidance={sharedHelp("recommendation")} report={report} currentSection="Technician Recommendations" inspectionItem="Recommendation" />
      </div>
      {rows.map((row) => {
        const stored = report.recommendations.find((item) => item.inspectionItemId === row.inspectionItemId && item.findingId === row.findingId) || report.recommendations.find((item) => item.inspectionItemId === row.inspectionItemId || item.findingId === row.findingId);
        return (
          <div key={row.key} className="grid gap-3 rounded-2xl border border-[#d8d0c6] p-3">
            <p className="text-sm font-semibold">{row.label}</p>
            <div className="flex flex-wrap gap-2">
              {TECHNICIAN_CORRECTIVE_OPTIONS.map((option) => {
                const selected = stored?.options?.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={disabled}
                    className={`min-h-12 rounded-full px-4 text-sm font-semibold ${selected ? "bg-[#1c1816] text-white" : "border border-[#d8d0c6]"}`}
                    onClick={() => onChange((current) => {
                      const existing = current.recommendations.find((item) => (row.inspectionItemId && item.inspectionItemId === row.inspectionItemId) || (row.findingId && item.findingId === row.findingId));
                      const options = new Set(existing?.options || []);
                      if (options.has(option.id)) options.delete(option.id);
                      else options.add(option.id);
                      const next = { id: existing?.id || crypto.randomUUID(), inspectionItemId: row.inspectionItemId, findingId: row.findingId, options: [...options], text: existing?.text };
                      return { ...current, recommendations: [...current.recommendations.filter((item) => item.id !== existing?.id), next] };
                    })}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <Area label="Technician recommendation" value={stored?.text || ""} disabled={disabled} onChange={(value) => onChange((current) => {
              const existing = current.recommendations.find((item) => (row.inspectionItemId && item.inspectionItemId === row.inspectionItemId) || (row.findingId && item.findingId === row.findingId));
              const next = { id: existing?.id || crypto.randomUUID(), inspectionItemId: row.inspectionItemId, findingId: row.findingId, options: existing?.options, text: value };
              return { ...current, recommendations: [...current.recommendations.filter((item) => item.id !== existing?.id), next] };
            })} />
          </div>
        );
      })}
    </div>
  );
}

function CleaningAssessment({
  report,
  disabled,
  onChange,
  onUploadPhoto,
  onRewriteText,
}: {
  report: WettReport;
  disabled: boolean;
  onChange: UpdateDraft;
  onUploadPhoto?: (file: File, link: PhotoLink) => void;
  onRewriteText?: (text: string) => Promise<string | undefined>;
}) {
  const cleaning = report.cleaning?.locations ? report.cleaning : { ...report.cleaning, locations: [] };
  const locations = cleaningLocationsFor(report.system.type);
  if (!report.system.type || locations.length === 0) return null;
  const evidence = cleaningEvidenceOpen(cleaning);

  function updateLocation(id: string, patch: Partial<WettReport["cleaning"]["locations"][number]>) {
    save({
      locations: locations.map((item) => {
        const current = cleaning.locations.find((entry) => entry.id === item.id) || { id: item.id };
        return item.id === id ? { ...current, ...patch, id } : current;
      }),
    });
  }

  function save(patch: Partial<WettReport["cleaning"]>) {
    onChange((current) => {
      const next = sanitizeCleaning(current.system.type, { ...current.cleaning, ...patch, locations: patch.locations || current.cleaning.locations });
      const copy = cleaningRecommendationCopy(next.assessment);
      const existing = current.recommendations.find((item) => item.inspectionItemId === CLEANING_ITEM_ID);
      const recommendations = current.recommendations.filter((item) => item.inspectionItemId !== CLEANING_ITEM_ID);
      if (copy) {
        recommendations.push({
          id: existing?.id || crypto.randomUUID(),
          inspectionItemId: CLEANING_ITEM_ID,
          priority: copy.priority,
          options: ["cleaning"],
          text: existing && existing.priority === copy.priority && existing.text ? existing.text : copy.text,
          photoIds: current.photoMetadata.filter((photo) => photo.checklistItemId === CLEANING_ITEM_ID).map((photo) => photo.id),
        });
      }
      return { ...current, cleaning: next, recommendations };
    });
  }

  return (
    <div id="wett-group-cleaning" className="grid scroll-mt-24 gap-3 rounded-2xl bg-[#f4efe8] p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">Maintenance / Combustible Deposits</h3>
        <WettHelpControl guidance={cleaningHelp(report.system.type)} report={report} currentSection="Inspection" inspectionGroup="Maintenance / Combustible Deposits" onLookup={undefined} onTakePhoto={onUploadPhoto ? (file) => onUploadPhoto(file, { checklistItemId: CLEANING_ITEM_ID, inspectionSection: "Maintenance / Combustible Deposits" }) : undefined} />
      </div>
      <p className="text-sm leading-6 text-[#6b625a]">Does this system require cleaning based on the accessible conditions observed? The last cleaning date is context only and does not set the assessment.</p>
      {locations.map((location) => {
        const stored = cleaning.locations.find((item) => item.id === location.id);
        return (
          <div key={location.id} className="grid gap-2 rounded-2xl bg-white p-3">
            <p className="text-sm font-semibold">{location.label}</p>
            <SelectField label="Deposits at this location" value={stored?.deposits || ""} disabled={disabled} options={WETT_DEPOSIT_LEVELS.map((value) => ({ value, label: DEPOSIT_LEVEL_LABELS[value] }))} onChange={(value) => updateLocation(location.id, { deposits: (value || undefined) as WettReport["cleaning"]["deposits"] })} />
            <SelectField label="Access" value={stored?.utiReason || ""} disabled={disabled} options={UTI_VALID_REASONS.map((reason) => ({ value: reason, label: `UTI — ${UTI_REASON_LABELS[reason]}` }))} onChange={(value) => updateLocation(location.id, { utiReason: (value || undefined) as WettReport["cleaning"]["locations"][number]["utiReason"] })} />
          </div>
        );
      })}
      <SelectField label="Deposits observed" value={cleaning.deposits || ""} disabled={disabled} options={WETT_DEPOSIT_LEVELS.map((value) => ({ value, label: DEPOSIT_LEVEL_LABELS[value] }))} onChange={(value) => save({ deposits: (value || undefined) as WettReport["cleaning"]["deposits"] })} />
      <div className="flex flex-wrap gap-2">
        {WETT_DEPOSIT_CONDITIONS.map((condition) => {
          const selected = cleaning.conditions?.includes(condition);
          return (
            <button key={condition} type="button" disabled={disabled} className={`min-h-12 rounded-full px-4 text-sm font-semibold ${selected ? "bg-[#1c1816] text-white" : "border border-[#d8d0c6] bg-white"}`} onClick={() => {
              const next = new Set(cleaning.conditions || []);
              if (next.has(condition)) next.delete(condition);
              else next.add(condition);
              save({ conditions: [...next] });
            }}>{DEPOSIT_CONDITION_LABELS[condition]}</button>
          );
        })}
      </div>
      <SelectField label="Cleaning assessment" value={cleaning.assessment || ""} disabled={disabled} options={WETT_CLEANING_ASSESSMENTS.map((value) => ({ value, label: CLEANING_ASSESSMENT_LABELS[value] }))} onChange={(value) => save({ assessment: (value || undefined) as WettReport["cleaning"]["assessment"] })} />
      <SelectField label="Last cleaning known?" value={cleaning.lastCleaningKnown || ""} disabled={disabled} options={WETT_LAST_CLEANING.map((value) => ({ value, label: value === "yes" ? "Yes" : value === "no" ? "No" : "Unknown" }))} onChange={(value) => save({ lastCleaningKnown: (value || undefined) as WettReport["cleaning"]["lastCleaningKnown"] })} />
      {cleaning.lastCleaningKnown === "yes" ? <TextInput label="Approx. last cleaning date" type="date" value={cleaning.lastCleaningDate || ""} disabled={disabled} onChange={(value) => save({ lastCleaningDate: value })} /> : null}
      {evidence ? (
        <div className="grid gap-3">
          <Area label="Observation / cleaning notes" value={cleaning.observation || ""} disabled={disabled} onChange={(value) => save({ observation: value, observationRaw: value })} />
          <button type="button" disabled={disabled || !cleaning.observation} className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold disabled:opacity-50" onClick={() => { const raw = cleaning.observationRaw || cleaning.observation || ""; void onRewriteText?.(raw).then((candidate) => { if (candidate) save({ observationCandidate: candidate, observationRaw: raw }); }); }}>Rewrite with AI</button>
          {cleaning.observationCandidate ? <p className="rounded-2xl bg-white p-3 text-sm leading-6">{cleaning.observationCandidate}</p> : null}
          {cleaning.observationCandidate ? <button type="button" className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white" onClick={() => save({ observation: cleaning.observationCandidate, acceptedFinalText: cleaning.observationCandidate })}>Accept rewrite</button> : null}
          <PhotoEvidence report={report} photos={report.photos.filter((photo) => photo.checklistItemId === CLEANING_ITEM_ID)} disabled={disabled} link={{ checklistItemId: CLEANING_ITEM_ID, inspectionSection: "Maintenance / Combustible Deposits" }} onChange={onChange} onUploadPhoto={onUploadPhoto} />
          {cleaningPhotoEncouraged(cleaning) ? <p className="text-sm leading-6 text-[#6b625a]">A photo of this deposit condition is strongly encouraged. This is a Phoenix evidence practice, not an official WETT mandatory-photo requirement.</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export function photoEvidenceFields(report: WettReport, disabled: boolean, onChange: UpdateDraft) {
  return report.photos.map((photo) => (
    <div key={`${photo.id}-meta`} className="grid gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6b625a]">{PHOENIX_EVIDENCE_LABEL}</p>
      <SelectField
        label="Evidence type"
        value={photo.evidenceType || ""}
        disabled={disabled}
        options={WETT_EVIDENCE_TYPES.map((type) => ({ value: type, label: EVIDENCE_TYPE_LABELS[type] }))}
        onChange={(value) =>
          onChange((current) => ({
            ...current,
            photoMetadata: current.photoMetadata.map((item) =>
              item.id === photo.id ? { ...item, evidenceType: (value || undefined) as WettEvidenceType | undefined } : item,
            ),
          }))
        }
      />
    </div>
  ));
}

function TextInput({
  label,
  value,
  onChange,
  disabled,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <input type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-2xl border border-[#d8d0c6] px-3 text-base font-normal" />
    </label>
  );
}

function Area({ label, value, onChange, disabled }: { label: string; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <textarea value={value} disabled={disabled} rows={4} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-[#d8d0c6] px-3 py-3 text-base font-normal" />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-2xl border border-[#d8d0c6] bg-white px-3 text-base font-normal">
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

