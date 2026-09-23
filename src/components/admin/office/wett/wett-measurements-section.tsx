"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { WettHelpControl } from "@/components/admin/office/wett/wett-help";
import { measurementGroupHelp } from "@/lib/wett/knowledge/help";
import { measurementProfileFor, type MeasurementDefinition } from "@/lib/wett/knowledge/measurement-profiles";
import {
  COMPONENT_CONDITION_LABELS,
  MEASUREMENT_SOURCE_LABELS,
  MEASUREMENT_STATUS_LABELS,
  WETT_COMPONENT_CONDITIONS,
  WETT_HISTORICAL_APPLICABILITY,
  WETT_LISTED_ANSWERS,
  WETT_MEASUREMENT_STATUSES,
  WETT_MEASUREMENT_UNITS,
  WETT_OBSERVABLE_ANSWERS,
  WETT_PRESENT_ANSWERS,
  measurementComparison,
  measurementIsActive,
  optionLabels,
  sanitizeMeasurements,
  sourceOptionsFor,
  type MeasurementItem,
} from "@/lib/wett/measurements";
import type { WettEditableDraft, WettReport } from "@/lib/wett/schema";

type UpdateDraft = (updater: (draft: WettEditableDraft) => WettEditableDraft) => void;

export function WettMeasurementsSection({
  report,
  disabled,
  onChange,
  onLookup,
}: {
  report: WettReport;
  disabled: boolean;
  onChange: UpdateDraft;
  onLookup?: (requirement: string) => Promise<string | undefined>;
}) {
  const profile = measurementProfileFor(report.system.type);
  const items = report.measurements.items;

  function save(id: string, patch: Partial<MeasurementItem>) {
    onChange((current) => {
      const existing = current.measurements.items.find((item) => item.id === id) ?? { id };
      const next = current.measurements.items.filter((item) => item.id !== id);
      return {
        ...current,
        measurements: sanitizeMeasurements(current.system, { items: [...next, { ...existing, ...patch, id }] }),
      };
    });
  }

  function remove(id: string) {
    onChange((current) => ({
      ...current,
      measurements: sanitizeMeasurements(current.system, {
        items: current.measurements.items.filter((item) => item.id !== id),
      }),
    }));
  }

  if (!profile) {
    return <p className="text-base leading-7">Select a system type in Identification to load its measurements and checks.</p>;
  }

  const visibleGroups = profile.groups.filter((group) => group.items.some((item) => measurementIsActive(item, report.system, items)));

  return (
    <div className="grid gap-3">
      <p className="text-sm leading-6 text-[#6b625a]">Only this system&apos;s measurements and checks are shown. A number does not set Compliant or Not Compliant.</p>
      {visibleGroups.map((group) => {
        const active = group.items.filter((item) => measurementIsActive(item, report.system, items));
        const addable = group.items.filter((item) => item.conditional === "when-applies" && !measurementIsActive(item, report.system, items));
        if (active.length === 0 && addable.length === 0) return null;
        return (
          <GroupCard
            key={group.id}
            label={group.label}
            help={
              <WettHelpControl
                guidance={measurementGroupHelp(report.system.type, group.id)}
                report={report}
                currentSection="Measurements"
                inspectionGroup={group.label}
                onLookup={onLookup}
              />
            }
          >
            <div className="grid gap-3 px-3 pb-3">
              {group.hint ? <p className="text-sm leading-6 text-[#6b625a]">{group.hint}</p> : null}
              {active.map((definition) => (
                <CheckCard
                  key={definition.id}
                  definition={definition}
                  item={items.find((entry) => entry.id === definition.id)}
                  photos={report.photos}
                  report={report}
                  disabled={disabled}
                  onChange={(patch) => save(definition.id, patch)}
                  onLookup={onLookup}
                  onAcceptLookup={(lookupId, patch) => {
                    onChange((current) => {
                      const existing = current.measurements.items.find((item) => item.id === definition.id) ?? { id: definition.id };
                      return {
                        ...current,
                        measurements: sanitizeMeasurements(current.system, { items: [...current.measurements.items.filter((item) => item.id !== definition.id), { ...existing, ...patch, id: definition.id }] }),
                        manufacturerLookups: current.manufacturerLookups.map((item) => item.id === lookupId ? { ...item, technicianAccepted: true } : item),
                      };
                    });
                  }}
                  onRemove={definition.conditional === "when-applies" ? () => remove(definition.id) : undefined}
                />
              ))}
              {addable.map((definition) => (
                <button key={definition.id} type="button" disabled={disabled} className="min-h-12 rounded-full border border-[#1c1816] px-4 text-left text-sm font-semibold" onClick={() => save(definition.id, { applies: true })}>
                  Add {definition.label}
                </button>
              ))}
            </div>
          </GroupCard>
        );
      })}
    </div>
  );
}

function GroupCard({ label, help, children }: { label: string; help?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)} className="rounded-2xl border border-[#d8d0c6] bg-white">
      <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-2 px-3 py-3 text-base font-semibold">
        <span>{label}</span>
        {help}
      </summary>
      {open ? children : null}
    </details>
  );
}

function CheckCard({
  definition,
  item,
  photos,
  report,
  disabled,
  onChange,
  onAcceptLookup,
  onLookup,
  onRemove,
}: {
  definition: MeasurementDefinition;
  item?: MeasurementItem;
  photos: WettReport["photos"];
  report?: WettReport;
  disabled: boolean;
  onChange: (patch: Partial<MeasurementItem>) => void;
  onAcceptLookup?: (lookupId: string, patch: Partial<MeasurementItem>) => void;
  onLookup?: (requirement: string) => Promise<string | undefined>;
  onRemove?: () => void;
}) {
  const comparison = item ? measurementComparison(item) : undefined;
  const sources = sourceOptionsFor(definition.sourceBehavior);

  return (
    <div className="grid gap-3 rounded-2xl bg-[#f4efe8] p-3">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold">{definition.label}</h3>
        {onRemove ? (
          <button type="button" disabled={disabled} className="min-h-12 shrink-0 rounded-full border border-[#1c1816] px-3 text-sm font-semibold" onClick={onRemove}>
            Remove
          </button>
        ) : null}
      </div>
      {definition.hint ? <p className="text-sm leading-6 text-[#6b625a]">{definition.hint}</p> : null}
      {definition.kind === "measurement" ? (
        <>
          <NumberField label="Observed" value={item?.observed} unit={item?.unit || (definition.sourceBehavior === "alberta-code" ? "mm" : "in")} disabled={disabled} onValue={(value) => onChange({ observed: value === "" ? undefined : Number(value) })} onUnit={(unit) => onChange({ unit })} />
          <NumberField label="Required" value={item?.required} unit={item?.requiredUnit || item?.unit || (definition.sourceBehavior === "alberta-code" ? "mm" : "in")} disabled={disabled} onValue={(value) => onChange({ required: value === "" ? undefined : Number(value) })} onUnit={(unit) => onChange({ requiredUnit: unit })} />
          <TextField label="Reference point" value={item?.referencePoint || ""} disabled={disabled} onChange={(value) => onChange({ referencePoint: value })} />
        </>
      ) : null}
      {definition.fields?.includes("present") ? <SelectField label="Present?" value={item?.present || ""} disabled={disabled} options={WETT_PRESENT_ANSWERS.map((value) => ({ value, label: value === "na" ? "N/A" : value === "yes" ? "Yes" : "No" }))} onChange={(value) => onChange({ present: value as MeasurementItem["present"] })} /> : null}
      {definition.fields?.includes("observable") ? <SelectField label="Observable?" value={item?.observable || ""} disabled={disabled} options={WETT_OBSERVABLE_ANSWERS.map((value) => ({ value, label: value === "yes" ? "Yes" : value === "partial" ? "Partial" : "No" }))} onChange={(value) => onChange({ observable: value as MeasurementItem["observable"] })} /> : null}
      {definition.fields?.includes("type") && (!definition.fields.includes("present") || item?.present === "yes") ? (
        <SelectField label="Type" value={item?.componentType || ""} disabled={disabled} options={Object.entries(optionLabels(definition.optionSet)).map(([value, label]) => ({ value, label }))} onChange={(value) => onChange({ componentType: value })} />
      ) : null}
      {definition.fields?.includes("condition") && (!definition.fields.includes("present") || item?.present === "yes") ? (
        <SelectField label="Condition" value={item?.condition || ""} disabled={disabled} options={WETT_COMPONENT_CONDITIONS.map((value) => ({ value, label: COMPONENT_CONDITION_LABELS[value] }))} onChange={(value) => onChange({ condition: value as MeasurementItem["condition"] })} />
      ) : null}
      {definition.fields?.includes("listed") && item?.present === "yes" ? (
        <SelectField label="Appears original / listed component?" value={item?.listedComponent || ""} disabled={disabled} options={WETT_LISTED_ANSWERS.map((value) => ({ value, label: value === "yes" ? "Yes" : value === "no" ? "No" : "Unknown" }))} onChange={(value) => onChange({ listedComponent: value as MeasurementItem["listedComponent"] })} />
      ) : null}
      {definition.fields?.includes("visibleCondition") && (!definition.fields.includes("observable") || item?.observable === "yes" || item?.observable === "partial") ? (
        <TextField label="Visible condition" value={item?.visibleCondition || ""} disabled={disabled} onChange={(value) => onChange({ visibleCondition: value })} />
      ) : null}
      {definition.fields?.includes("damage") && (item?.observable === "yes" || item?.observable === "partial") ? (
        <TextField label="Damage / cracking" value={item?.damage || ""} disabled={disabled} onChange={(value) => onChange({ damage: value })} />
      ) : null}
      {definition.fields?.includes("note") ? <TextField label="Notes" value={item?.note || ""} disabled={disabled} onChange={(value) => onChange({ note: value })} /> : null}
      {definition.historical ? (
        <SelectField
          label="Historical applicability"
          value={item?.historicalApplicability || ""}
          disabled={disabled}
          options={WETT_HISTORICAL_APPLICABILITY.map((value) => ({
            value,
            label: value === "current-provision" ? "Current provision applies" : value === "historic-not-applied" ? "Historic installation — current dimension not applied" : "Unresolved",
          }))}
          onChange={(value) => onChange({ historicalApplicability: value as MeasurementItem["historicalApplicability"] })}
        />
      ) : null}
      <SelectField label="Requirement source" value={item?.source || ""} disabled={disabled} options={sources.map((value) => ({ value, label: MEASUREMENT_SOURCE_LABELS[value] }))} onChange={(value) => onChange({ source: value as MeasurementItem["source"] })} />
      <TextField label="Manual / label reference" value={item?.sourceReference || ""} disabled={disabled} onChange={(value) => onChange({ sourceReference: value })} />
      <label className="flex min-h-12 items-center gap-3 text-base font-semibold">
        <input type="checkbox" checked={item?.sourceVerified === true} disabled={disabled} onChange={(event) => onChange({ sourceVerified: event.target.checked })} />
        Requirement source verified
      </label>
      <SelectField label="Photo" value={item?.photoId || ""} disabled={disabled} options={photos.map((photo) => ({ value: photo.id, label: photo.caption || "Phoenix Evidence Photo" }))} onChange={(value) => onChange({ photoId: value })} />
      <SelectField label="Inspector status" value={item?.status || ""} disabled={disabled} options={WETT_MEASUREMENT_STATUSES.map((value) => ({ value, label: MEASUREMENT_STATUS_LABELS[value] }))} onChange={(value) => onChange({ status: value as MeasurementItem["status"] })} />
      {comparison ? <p className="text-sm leading-6 text-[#6b625a]">{comparison}</p> : null}
      {report && definition.kind === "measurement" && definition.sourceBehavior !== "observation-only" && definition.sourceBehavior !== "alberta-code" ? (
        <ManufacturerLookup report={report} requirement={definition.label} disabled={disabled} onAccept={onAcceptLookup} onLookup={onLookup} />
      ) : null}
      <p className="text-sm leading-6 text-[#6b625a]">
        {definition.kind === "measurement"
          ? "Compliant or Not Compliant stays with the inspector after the observed value, required value, and verified source are recorded."
          : "This check does not set Compliant or Not Compliant by itself."}
      </p>
    </div>
  );
}

function ManufacturerLookup({
  report,
  requirement,
  disabled,
  onAccept,
  onLookup,
}: {
  report: WettReport;
  requirement: string;
  disabled: boolean;
  onAccept?: (lookupId: string, patch: Partial<MeasurementItem>) => void;
  onLookup?: (requirement: string) => Promise<string | undefined>;
}) {
  const [message, setMessage] = useState<string>();
  const latest = [...report.manufacturerLookups].reverse().find((item) => item.requestedRequirement === requirement);
  const unit = latest?.requirementUnit === "mm" || latest?.requirementUnit === "in" || latest?.requirementUnit === "ft" || latest?.requirementUnit === "cm" ? latest.requirementUnit : undefined;

  return (
    <div className="grid gap-2 rounded-2xl bg-[#f4efe8] p-3">
      <button
        type="button"
        disabled={disabled}
        className="min-h-12 rounded-full bg-[#1c1816] px-4 text-sm font-semibold text-white disabled:opacity-50"
        onClick={() => {
          void onLookup?.(requirement).then((next) => setMessage(next));
        }}
      >
        Find Manufacturer Requirement
      </button>
      {message ? <p className="text-sm leading-6">{message}</p> : null}
      {latest ? (
        <div className="grid gap-2 text-sm leading-6">
          <p>Status: {latest.status}</p>
          <p>{latest.auditNote}</p>
          {latest.requirementValue && latest.technicianAccepted !== true ? (
            <button type="button" className="min-h-12 rounded-full border border-[#1c1816] px-4 font-semibold" onClick={() => onAccept?.(latest.id, { required: Number(latest.requirementValue), requiredUnit: unit, source: "manufacturer-manual", sourceReference: latest.sourceDocument, sourceVerified: true })}>Use Requirement</button>
          ) : null}
          {latest.status === "no-verified-exact-match" || latest.status === "insufficient-appliance-id" ? (
            <p>To improve the search: retake the label photo, edit the manufacturer, exact model, suffix, serial, or manufacturing date, upload a customer manual, or paste an official manual link, then search again. A customer manual is not applied automatically.</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function NumberField({
  label,
  value,
  unit,
  disabled,
  onValue,
  onUnit,
}: {
  label: string;
  value?: number;
  unit?: MeasurementItem["unit"];
  disabled: boolean;
  onValue: (value: string) => void;
  onUnit: (unit: MeasurementItem["unit"]) => void;
}) {
  const [draft, setDraft] = useState(value === undefined ? "" : String(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setDraft(value === undefined ? "" : String(value));
  }, [value]);

  return (
    <div className="grid gap-2">
      <label className="grid gap-2 text-base font-semibold">
        {label}
        <input
          inputMode="decimal"
          value={draft}
          disabled={disabled}
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={() => {
            focused.current = false;
            setDraft(value === undefined ? "" : String(value));
          }}
          onChange={(event) => {
            const next = event.target.value.replace(/[^\d.]/g, "");
            setDraft(next);
            if (next === "" || /^\d+(\.\d+)?$/.test(next)) onValue(next);
          }}
          className="min-h-12 rounded-2xl border border-[#d8d0c6] bg-white px-3 text-base font-normal"
        />
      </label>
      <SelectField label="Unit" value={unit || "in"} disabled={disabled} options={WETT_MEASUREMENT_UNITS.map((item) => ({ value: item, label: item }))} onChange={(next) => onUnit(next as MeasurementItem["unit"])} />
    </div>
  );
}

function TextField({ label, value, disabled, onChange }: { label: string; value: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-base font-semibold">
      {label}
      <input value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="min-h-12 rounded-2xl border border-[#d8d0c6] bg-white px-3 text-base font-normal" />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-base font-semibold">
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
