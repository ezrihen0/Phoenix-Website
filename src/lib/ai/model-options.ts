export const AI_MODEL_VALUES = ["gpt-4.1", "gpt-4.1-mini", "gpt-4o", "gpt-4o-mini"] as const;

export const AI_MODEL_OPTIONS = [
  { value: "gpt-4.1", label: "GPT-4.1", description: "Best overall quality for longer SEO drafts." },
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini", description: "Lower cost and faster generation for routine daily posts." },
  { value: "gpt-4o", label: "GPT-4o", description: "Balanced quality with strong general-purpose writing." },
  { value: "gpt-4o-mini", label: "GPT-4o Mini", description: "Fastest option for lightweight content experiments." },
] as const;

export function getAiModelLabel(value: string) {
  return AI_MODEL_OPTIONS.find((option) => option.value === value)?.label || value;
}