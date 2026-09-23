"use client";

import { useEffect, useRef, useState } from "react";

import { applicableItems, SYSTEM_WORKFLOWS } from "@/lib/wett/knowledge/index";
import { MANUFACTURER_BRAND_LABELS } from "@/lib/wett/knowledge/manufacturer-routing";
import type { WettEditableDraft, WettReport, WettSystemType } from "@/lib/wett/schema";
import {
  ALTERATION_LABELS,
  CHIMNEY_TYPE_LABELS,
  CONNECTOR_TYPE_LABELS,
  INSERT_LINER_LABELS,
  LABEL_STATUS_LABELS,
  MANUAL_STATUS_LABELS,
  MASONRY_LINER_LABELS,
  ORIGINAL_FIREPLACE_LABELS,
  WETT_ALTERATION_ANSWERS,
  WETT_CHIMNEY_TYPES,
  WETT_CONNECTOR_TYPES,
  WETT_INSERT_LINER_TYPES,
  WETT_LABEL_STATUSES,
  WETT_MANUAL_STATUSES,
  WETT_MASONRY_LINER_TYPES,
  WETT_MEASURE_UNITS,
  WETT_ORIGINAL_FIREPLACE_TYPES,
  WETT_YEAR_STATUSES,
  LISTING_NOT_VERIFIED_NOTICE,
  sanitizeSystem,
  switchedSystemDraft,
  systemProfileHasData,
} from "@/lib/wett/system-profile";

type UpdateDraft = (updater: (draft: WettEditableDraft) => WettEditableDraft) => void;

export function WettIdentificationSection({
  report,
  disabled,
  onChange,
}: {
  report: WettReport;
  disabled: boolean;
  onChange: UpdateDraft;
}) {
  const system = report.system;
  const [pendingType, setPendingType] = useState<WettSystemType | null>(null);

  function chooseType(value: string) {
    if (!value || value === system.type) {
      setPendingType(null);
      return;
    }
    const next = value as WettSystemType;
    if (!systemProfileHasData(system, report.checklist.length, report.measurements)) {
      onChange((current) => ({
      ...current,
      ...switchedSystemDraft(next),
      photoMetadata: current.photoMetadata.map((photo) => ({ ...photo, checklistItemId: undefined, measurementId: undefined })),
    }));
      setPendingType(null);
      return;
    }
    setPendingType(next);
  }

  function confirmType() {
    if (!pendingType) return;
    const next = pendingType;
    setPendingType(null);
    onChange((current) => ({
      ...current,
      ...switchedSystemDraft(next),
      photoMetadata: current.photoMetadata.map((photo) => ({ ...photo, checklistItemId: undefined, measurementId: undefined })),
    }));
  }

  function patch(values: Record<string, unknown>) {
    onChange((current) => ({
      ...current,
      system: sanitizeSystem({ ...current.system, ...values }),
    }));
  }

  return (
    <div className="grid gap-4">
      <SelectField
        label="System type"
        value={system.type || ""}
        disabled={disabled}
        options={SYSTEM_WORKFLOWS.map((item) => ({ value: item.type, label: item.label }))}
        onChange={chooseType}
      />
      {pendingType ? (
        <div className="grid gap-3 rounded-2xl border border-[#c56a3a] bg-white p-4">
          <p className="text-base font-semibold">Change system type?</p>
          <p className="text-sm leading-6">
            Changing the system type will reset system-specific identification and inspection data for the current system.
          </p>
          <p className="text-sm leading-6">Customer/property and shared inspection information will remain.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold" onClick={() => setPendingType(null)}>
              Cancel
            </button>
            <button type="button" className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white" onClick={confirmType}>
              Change System Type
            </button>
          </div>
        </div>
      ) : null}

      {system.type === "wood-stove" || system.type === "fireplace-insert" || system.type === "factory-built-fireplace" ? (
        <p className="text-sm leading-6 text-[#6b625a]">
          Brand labels are identification aids. They are not manuals or clearances. {MANUFACTURER_BRAND_LABELS.join(", ")}.
        </p>
      ) : null}

      {system.type === "wood-stove" ? <WoodStoveFields system={system} disabled={disabled} patch={patch} onChange={onChange} /> : null}
      {system.type === "fireplace-insert" ? <InsertFields system={system} disabled={disabled} patch={patch} onChange={onChange} /> : null}
      {system.type === "masonry-fireplace" ? <MasonryFields system={system} disabled={disabled} patch={patch} /> : null}
      {system.type === "factory-built-fireplace" ? <FactoryFields system={system} disabled={disabled} patch={patch} onChange={onChange} /> : null}
      {!system.type ? <p className="text-sm leading-6">Select a system type to load its identification fields.</p> : null}
    </div>
  );
}

function WoodStoveFields({
  system,
  disabled,
  patch,
  onChange,
}: {
  system: Extract<WettEditableDraft["system"], { type: "wood-stove" }>;
  disabled: boolean;
  patch: (values: Record<string, unknown>) => void;
  onChange: UpdateDraft;
}) {
  return (
    <>
      <ApplianceIdentity system={system} disabled={disabled} patch={patch} />
      <LabelStatusControl system={system} disabled={disabled} patch={patch} onChange={onChange} />
      <SelectField label="Manual status" value={system.manualStatus || ""} disabled={disabled} options={options(WETT_MANUAL_STATUSES, MANUAL_STATUS_LABELS)} onChange={(value) => patch({ manualStatus: value })} />
      <YearField label="Installation year" status={system.installationYearStatus} year={system.installationYear} disabled={disabled} onStatus={(value) => patch({ installationYearStatus: value })} onYear={(value) => patch({ installationYearStatus: "known", installationYear: value })} />
      <SelectField label="Chimney type" value={system.chimneyType || ""} disabled={disabled} options={options(WETT_CHIMNEY_TYPES, CHIMNEY_TYPE_LABELS)} onChange={(value) => patch({ chimneyType: value })} />
      {system.chimneyType === "masonry" ? (
        <SelectField label="Liner type" value={system.linerType || ""} disabled={disabled} options={options(WETT_MASONRY_LINER_TYPES, MASONRY_LINER_LABELS)} onChange={(value) => patch({ linerType: value })} />
      ) : null}
      {system.chimneyType === "factory-built" ? (
        <>
          <TextInput label="Chimney manufacturer" value={system.chimneyManufacturer || ""} disabled={disabled} onChange={(value) => patch({ chimneyManufacturer: value })} />
          <TextInput label="Chimney series / model" value={system.chimneySeries || ""} disabled={disabled} onChange={(value) => patch({ chimneySeries: value })} />
          <p className="text-sm leading-6 text-[#6b625a]">If the chimney system cannot be established, use manufacturer lookup or not verified on the inspection items.</p>
        </>
      ) : null}
      <SelectField label="Connector type" value={system.connectorType || ""} disabled={disabled} options={options(WETT_CONNECTOR_TYPES, CONNECTOR_TYPE_LABELS)} onChange={(value) => patch({ connectorType: value })} />
      <Notes value={system.description || ""} disabled={disabled} onChange={(value) => patch({ description: value })} />
    </>
  );
}

function InsertFields({
  system,
  disabled,
  patch,
  onChange,
}: {
  system: Extract<WettEditableDraft["system"], { type: "fireplace-insert" }>;
  disabled: boolean;
  patch: (values: Record<string, unknown>) => void;
  onChange: UpdateDraft;
}) {
  return (
    <>
      <ApplianceIdentity system={system} disabled={disabled} patch={patch} />
      <LabelStatusControl system={system} disabled={disabled} patch={patch} onChange={onChange} />
      <SelectField label="Manual status" value={system.manualStatus || ""} disabled={disabled} options={options(WETT_MANUAL_STATUSES, MANUAL_STATUS_LABELS)} onChange={(value) => patch({ manualStatus: value })} />
      <YearField label="Installation year" status={system.installationYearStatus} year={system.installationYear} disabled={disabled} onStatus={(value) => patch({ installationYearStatus: value })} onYear={(value) => patch({ installationYearStatus: "known", installationYear: value })} />
      <SelectField label="Original fireplace type" value={system.originalFireplaceType || ""} disabled={disabled} options={options(WETT_ORIGINAL_FIREPLACE_TYPES, ORIGINAL_FIREPLACE_LABELS)} onChange={(value) => patch({ originalFireplaceType: value })} />
      {system.originalFireplaceType === "factory-built" ? (
        <>
          <TextInput label="Original fireplace manufacturer" value={system.originalFireplaceManufacturer || ""} disabled={disabled} onChange={(value) => patch({ originalFireplaceManufacturer: value })} />
          <TextInput label="Original fireplace model" value={system.originalFireplaceModel || ""} disabled={disabled} onChange={(value) => patch({ originalFireplaceModel: value })} />
          <p className="text-sm leading-6 text-[#6b625a]">Leave these unknown when they cannot be verified. Do not guess them.</p>
        </>
      ) : null}
      <SelectField label="Liner type" value={system.linerType || ""} disabled={disabled} options={options(WETT_INSERT_LINER_TYPES, INSERT_LINER_LABELS)} onChange={(value) => patch({ linerType: value })} />
      <DiameterField label="Liner diameter" value={system.linerDiameter} unit={system.linerDiameterUnit} disabled={disabled} onValue={(value) => patch({ linerDiameter: value })} onUnit={(value) => patch({ linerDiameterUnit: value })} />
      <Notes value={system.description || ""} disabled={disabled} onChange={(value) => patch({ description: value })} />
    </>
  );
}

function MasonryFields({
  system,
  disabled,
  patch,
}: {
  system: Extract<WettEditableDraft["system"], { type: "masonry-fireplace" }>;
  disabled: boolean;
  patch: (values: Record<string, unknown>) => void;
}) {
  return (
    <>
      <YearField label="Year home was built" status={system.homeBuiltYearStatus} year={system.homeBuiltYear} disabled={disabled} onStatus={(value) => patch({ homeBuiltYearStatus: value })} onYear={(value) => patch({ homeBuiltYearStatus: "known", homeBuiltYear: value })} />
      <SelectField label="Major fireplace / chimney alteration known?" value={system.majorAlteration || ""} disabled={disabled} options={options(WETT_ALTERATION_ANSWERS, ALTERATION_LABELS)} onChange={(value) => patch({ majorAlteration: value })} />
      {system.majorAlteration === "yes" ? (
        <YearDigits label="Approx. alteration year" year={system.alterationYear} disabled={disabled} onYear={(value) => patch({ alterationYear: value })} />
      ) : null}
      <SelectField label="Liner type" value={system.linerType || ""} disabled={disabled} options={options(WETT_MASONRY_LINER_TYPES, MASONRY_LINER_LABELS)} onChange={(value) => patch({ linerType: value })} />
      <p className="text-sm leading-6 text-[#6b625a]">Unable to Verify does not set Unable to Inspect. Record access on the inspection item.</p>
      <Notes value={system.description || ""} disabled={disabled} onChange={(value) => patch({ description: value })} />
    </>
  );
}

function FactoryFields({
  system,
  disabled,
  patch,
  onChange,
}: {
  system: Extract<WettEditableDraft["system"], { type: "factory-built-fireplace" }>;
  disabled: boolean;
  patch: (values: Record<string, unknown>) => void;
  onChange: UpdateDraft;
}) {
  return (
    <>
      <ApplianceIdentity system={system} disabled={disabled} patch={patch} />
      <LabelStatusControl system={system} disabled={disabled} patch={patch} onChange={onChange} />
      <TextInput label="Certification / listing" value={system.certificationListing || ""} disabled={disabled} onChange={(value) => patch({ certificationListing: value })} />
      <SelectField label="Manual status" value={system.manualStatus || ""} disabled={disabled} options={options(WETT_MANUAL_STATUSES, MANUAL_STATUS_LABELS)} onChange={(value) => patch({ manualStatus: value })} />
      <YearField label="Installation year" status={system.installationYearStatus} year={system.installationYear} disabled={disabled} onStatus={(value) => patch({ installationYearStatus: value })} onYear={(value) => patch({ installationYearStatus: "known", installationYear: value })} />
      <TextInput label="Chimney manufacturer" value={system.chimneyManufacturer || ""} disabled={disabled} onChange={(value) => patch({ chimneyManufacturer: value })} />
      <TextInput label="Chimney series / model" value={system.chimneySeries || ""} disabled={disabled} onChange={(value) => patch({ chimneySeries: value })} />
      <DiameterField label="Chimney diameter" value={system.chimneyDiameter} unit={system.chimneyDiameterUnit} disabled={disabled} onValue={(value) => patch({ chimneyDiameter: value })} onUnit={(value) => patch({ chimneyDiameterUnit: value })} />
      <p className="text-sm leading-6 text-[#6b625a]">If the chimney system cannot be identified, use manufacturer lookup. Do not identify the unit from decorative facing.</p>
      <Notes value={system.description || ""} disabled={disabled} onChange={(value) => patch({ description: value })} />
    </>
  );
}

const ALTERNATE_EVIDENCE = [
  "Official manufacturer manual",
  "Manufacturer archive",
  "Purchase documentation",
  "Permit record",
  "Certification documentation",
  "Manufacturer technical support",
  "Other defensible exact-product evidence",
] as const;

function LabelStatusControl({
  system,
  disabled,
  patch,
  onChange,
}: {
  system: { type?: string; labelStatus?: string; labelRecheckConfirmed?: boolean; alternateIdentity?: string; alternateEvidence?: string; listingStatus?: string };
  disabled: boolean;
  patch: (values: Record<string, unknown>) => void;
  onChange: UpdateDraft;
}) {
  const [checking, setChecking] = useState(false);

  function choose(value: string) {
    if (value === "missing") {
      setChecking(true);
      return;
    }
    patch({ labelStatus: value || undefined });
  }

  function markLookupRequired() {
    onChange((current) => {
      const ids = new Set(applicableItems(current).filter((item) => item.manufacturerDependent).map((item) => item.id));
      const checklist = current.checklist.map((item) => (ids.has(item.id) ? { ...item, status: undefined, workflowControl: "manufacturer-lookup-required" as const } : item));
      for (const id of ids) {
        if (!checklist.some((item) => item.id === id)) checklist.push({ id, workflowControl: "manufacturer-lookup-required" });
      }
      return {
        ...current,
        system: sanitizeSystem({ ...current.system, labelStatus: "missing", labelRecheckConfirmed: true, alternateIdentity: "no", listingStatus: "not-verified" }),
        checklist,
      };
    });
  }

  return (
    <div className="grid gap-3">
      <SelectField label="Label status" value={system.labelStatus || ""} disabled={disabled} options={options(WETT_LABEL_STATUSES, LABEL_STATUS_LABELS)} onChange={choose} />
      <LabelHint status={system.labelStatus} />
      {checking ? (
        <div className="grid gap-3 rounded-2xl border border-[#1c1816] bg-white p-4" role="dialog" aria-labelledby="label-recheck-title">
          <p id="label-recheck-title" className="text-base font-semibold">Check Again Before Continuing</p>
          <p className="text-sm leading-6">The certification/data label could not be located.</p>
          <p className="text-sm leading-6">Please check all accessible label locations again before confirming.</p>
          <p className="text-sm leading-6">Confirming that no label can be located means the appliance&apos;s exact listing/model-specific requirements may not be verifiable and may affect insurer acceptance.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold" onClick={() => setChecking(false)}>Go Back — Check Again</button>
            <button type="button" className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white" onClick={() => { patch({ labelStatus: "missing", labelRecheckConfirmed: true }); setChecking(false); }}>I Checked Again — Continue</button>
          </div>
        </div>
      ) : null}
      {system.labelStatus === "missing" && system.labelRecheckConfirmed ? (
        <div className="grid gap-3">
          <p className="text-sm font-semibold">Can the exact appliance identity/listing be established from another reliable source?</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={disabled} className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold" onClick={() => patch({ alternateIdentity: "yes", listingStatus: undefined })}>Yes</button>
            <button type="button" disabled={disabled} className="min-h-12 rounded-full border border-[#1c1816] px-4 text-sm font-semibold" onClick={markLookupRequired}>No</button>
          </div>
          {system.alternateIdentity === "yes" ? (
            <>
              <SelectField label="Evidence" value={system.alternateEvidence || ""} disabled={disabled} options={ALTERNATE_EVIDENCE.map((item) => ({ value: item, label: item }))} onChange={(value) => patch({ alternateEvidence: value })} />
              <button type="button" disabled={disabled || !system.alternateEvidence} className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white disabled:opacity-50" onClick={() => patch({ listingStatus: "verified" })}>Confirm exact match</button>
            </>
          ) : null}
          {system.listingStatus === "not-verified" ? <p className="text-sm leading-6">{LISTING_NOT_VERIFIED_NOTICE}</p> : null}
        </div>
      ) : null}
      <SelectField
        label="Confirmed unlisted"
        value={system.listingStatus === "confirmed-unlisted" ? "confirmed-unlisted" : ""}
        disabled={disabled}
        options={[{ value: "confirmed-unlisted", label: "Confirmed unlisted — sufficient evidence" }]}
        onChange={(value) => {
          if (value === "confirmed-unlisted") patch({ listingStatus: "confirmed-unlisted" });
          else if (system.listingStatus === "confirmed-unlisted") patch({ listingStatus: undefined });
        }}
      />
      <p className="text-sm leading-6 text-[#6b625a]">Confirmed unlisted is a separate classification. A missing label does not set it.</p>
    </div>
  );
}

function ApplianceIdentity({
  system,
  disabled,
  patch,
}: {
  system: { manufacturer?: string; model?: string; modelSuffix?: string; serial?: string };
  disabled: boolean;
  patch: (values: Record<string, unknown>) => void;
}) {
  return (
    <>
      <TextInput label="Manufacturer" value={system.manufacturer || ""} disabled={disabled} onChange={(value) => patch({ manufacturer: value })} />
      <TextInput label="Model" value={system.model || ""} disabled={disabled} onChange={(value) => patch({ model: value })} />
      <TextInput label="Model suffix" value={system.modelSuffix || ""} disabled={disabled} onChange={(value) => patch({ modelSuffix: value })} />
      <TextInput label="Serial number" value={system.serial || ""} disabled={disabled} onChange={(value) => patch({ serial: value })} />
    </>
  );
}

function YearField({
  label,
  status,
  year,
  disabled,
  onStatus,
  onYear,
}: {
  label: string;
  status?: "known" | "unknown";
  year?: string;
  disabled: boolean;
  onStatus: (value: string) => void;
  onYear: (value: string) => void;
}) {
  return (
    <>
      <SelectField
        label={label}
        value={status || ""}
        disabled={disabled}
        options={WETT_YEAR_STATUSES.map((value) => ({ value, label: value === "known" ? "Enter year" : "Unknown" }))}
        onChange={onStatus}
      />
      <YearDigits label="YYYY" year={status === "known" ? year : ""} disabled={disabled || status !== "known"} onYear={onYear} />
    </>
  );
}

function YearDigits({
  label,
  year,
  disabled,
  onYear,
}: {
  label: string;
  year?: string;
  disabled: boolean;
  onYear: (value: string) => void;
}) {
  const [draft, setDraft] = useState(year || "");
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(year || "");
  }, [year]);

  return (
    <TextInput
      label={label}
      value={disabled ? "" : draft}
      disabled={disabled}
      inputMode="numeric"
      onFocus={() => {
        focused.current = true;
      }}
      onBlur={() => {
        focused.current = false;
        setDraft(year || "");
      }}
      onChange={(value) => {
        const digits = value.replace(/\D/g, "").slice(0, 4);
        setDraft(digits);
        if (digits.length === 4 || digits.length === 0) onYear(digits);
        else if (year) onYear("");
      }}
    />
  );
}

function DiameterField({
  label,
  value,
  unit,
  disabled,
  onValue,
  onUnit,
}: {
  label: string;
  value?: number;
  unit?: "in" | "mm";
  disabled: boolean;
  onValue: (value: string) => void;
  onUnit: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <TextInput label={label} value={value === undefined ? "" : String(value)} disabled={disabled} inputMode="decimal" onChange={onValue} />
      <SelectField label="Unit" value={unit || "in"} disabled={disabled || value === undefined} options={WETT_MEASURE_UNITS.map((item) => ({ value: item, label: item === "mm" ? "mm" : "inches" }))} onChange={onUnit} />
    </div>
  );
}

function LabelHint({ status }: { status?: string }) {
  if (status !== "missing" && status !== "present-illegible") return null;
  return <p className="text-sm leading-6 text-[#6b625a]">If this does not establish the appliance, use manufacturer lookup on the inspection items. Do not guess the model.</p>;
}

function Notes({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-base font-semibold">
      System notes
      <textarea value={value} disabled={disabled} rows={4} onChange={(event) => onChange(event.target.value)} className="rounded-2xl border border-[#d8d0c6] px-3 py-3 text-base font-normal" />
    </label>
  );
}

function options<T extends string>(values: readonly T[], labels: Record<T, string>) {
  return values.map((value) => ({ value, label: labels[value] }));
}

function TextInput({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  inputMode?: "numeric" | "decimal";
}) {
  return (
    <label className="grid gap-2 text-base font-semibold">
      {label}
      <input value={value} disabled={disabled} inputMode={inputMode} onFocus={onFocus} onBlur={onBlur} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-2xl border border-[#d8d0c6] px-3 text-base font-normal" />
    </label>
  );
}

function SelectField({
  label,
  value,
  options: choices,
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
    <label className="grid gap-2 text-base font-semibold">
      {label}
      <select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-2xl border border-[#d8d0c6] bg-white px-3 text-base font-normal">
        <option value="">Select</option>
        {choices.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
