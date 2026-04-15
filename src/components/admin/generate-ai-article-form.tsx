"use client";

import { LoaderCircle, Sparkles, WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";

const generationSteps = [
  {
    title: "Briefing the writer",
    preview: "Reviewing recent Calgary topics and avoiding duplicate angles...",
  },
  {
    title: "Building the outline",
    preview: "Structuring headings, FAQ points, and service links for the draft...",
  },
  {
    title: "Writing the article",
    preview: "Drafting homeowner-friendly copy, examples, and a practical CTA...",
  },
  {
    title: "Polishing SEO",
    preview: "Refining the title, excerpt, keywords, and meta description...",
  },
] as const;

const previewRows = ["92%", "74%", "86%", "68%"] as const;

type GenerateAiArticleFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export function GenerateAiArticleForm({ action }: GenerateAiArticleFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [animationState, setAnimationState] = useState({ stepIndex: 0, typedLength: 0 });

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    const typeTimer = window.setInterval(() => {
      setAnimationState((current) => {
        const preview = generationSteps[current.stepIndex].preview;

        if (current.typedLength >= preview.length) {
          return current;
        }

        return {
          ...current,
          typedLength: current.typedLength + 1,
        };
      });
    }, 24);

    const stepTimer = window.setInterval(() => {
      setAnimationState((current) => ({
        stepIndex: (current.stepIndex + 1) % generationSteps.length,
        typedLength: 0,
      }));
    }, 2200);

    return () => {
      window.clearInterval(typeTimer);
      window.clearInterval(stepTimer);
    };
  }, [isGenerating]);

  const activeStep = generationSteps[animationState.stepIndex];

  return (
    <div className="space-y-4">
      <form
        action={action}
        onSubmit={() => {
          setAnimationState({ stepIndex: 0, typedLength: 0 });
          setIsGenerating(true);
        }}
      >
        <button
          type="submit"
          disabled={isGenerating}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-5 py-3 text-sm font-semibold disabled:opacity-70"
        >
          {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
          {isGenerating ? "Generating article..." : "Generate daily AI article now"}
        </button>
      </form>

      {isGenerating ? (
        <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-card)] p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="space-y-4">
              <p className="eyebrow">AI writer in progress</p>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                Building the draft now.
              </h2>
              <p className="text-sm leading-7 text-[var(--color-muted)]">
                The article is being outlined, written, and packaged for SEO. You will be redirected when it is ready.
              </p>
              <div className="space-y-3">
                {generationSteps.map((step, index) => {
                  const isActive = index === animationState.stepIndex;

                  return (
                    <div
                      key={step.title}
                      className={`rounded-[1.4rem] border px-4 py-3 text-sm transition ${
                        isActive
                          ? "border-[var(--color-ink)] bg-white text-[var(--color-ink)]"
                          : "border-[var(--color-border)] bg-white/55 text-[var(--color-muted)]"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <Sparkles className={`h-4 w-4 ${isActive ? "text-[var(--color-ember)]" : "text-[var(--color-muted)]"}`} />
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[var(--color-ink)] p-5 text-[var(--color-paper)] shadow-[0_18px_40px_rgba(31,26,22,0.22)]">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                Live draft preview
              </p>
              <p className="mt-4 min-h-[4.5rem] font-mono text-sm leading-7 text-[var(--color-paper)]/88">
                {activeStep.preview.slice(0, animationState.typedLength)}
                <span className="animate-pulse text-[var(--color-gold)]">|</span>
              </p>
              <div className="mt-6 space-y-3">
                {previewRows.map((width, index) => (
                  <div
                    key={`${width}-${index}`}
                    className="h-3 rounded-full bg-white/10"
                    style={{ width }}
                  >
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(203,152,82,0.22),rgba(203,152,82,0.7),rgba(203,152,82,0.22))] animate-pulse"
                      style={{ width: `${30 + animationState.stepIndex * 15 + index * 8}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}