"use client";

import Link from "next/link";
import { Bold, Code2, Eye, Heading2, Heading3, Italic, Link2, List, PencilLine, Quote, Rows2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type EditorMode = "write" | "split" | "preview";

type MarkdownEditorProps = {
  name: string;
  defaultValue?: string;
  rows?: number;
};

type SelectionTransform = {
  nextValue: string;
  selectionStart: number;
  selectionEnd: number;
};

const modeOptions: Array<{ value: EditorMode; label: string; icon: typeof PencilLine }> = [
  { value: "write", label: "Write", icon: PencilLine },
  { value: "split", label: "Split", icon: Rows2 },
  { value: "preview", label: "Preview", icon: Eye },
];

export function MarkdownEditor({ name, defaultValue = "", rows = 24 }: MarkdownEditorProps) {
  const [mode, setMode] = useState<EditorMode>("split");
  const [value, setValue] = useState(defaultValue);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const wordCount = useMemo(
    () => value.trim().split(/\s+/).filter(Boolean).length,
    [value],
  );

  function applyTransform(transformer: (selected: string, start: number, end: number) => SelectionTransform) {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);
    const result = transformer(selected, start, end);
    setValue(result.nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }

  function wrapSelection(before: string, after = before, placeholder = "text") {
    applyTransform((selected, start, end) => {
      const target = selected || placeholder;
      const nextValue = `${value.slice(0, start)}${before}${target}${after}${value.slice(end)}`;
      const selectionStart = start + before.length;
      const selectionEnd = selectionStart + target.length;

      return { nextValue, selectionStart, selectionEnd };
    });
  }

  function prefixSelectedLines(prefix: string) {
    applyTransform((selected, start, end) => {
      const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
      const rawLineEnd = value.indexOf("\n", end);
      const lineEnd = rawLineEnd === -1 ? value.length : rawLineEnd;
      const block = value.slice(lineStart, lineEnd) || "text";
      const nextBlock = block
        .split("\n")
        .map((line) => `${prefix}${line || "text"}`)
        .join("\n");
      const nextValue = `${value.slice(0, lineStart)}${nextBlock}${value.slice(lineEnd)}`;

      return {
        nextValue,
        selectionStart: lineStart,
        selectionEnd: lineStart + nextBlock.length,
      };
    });
  }

  const preview = (
    <div className="article-markdown min-h-[22rem] rounded-[1.5rem] border border-[var(--color-border)] bg-white/70 p-5 text-[var(--color-muted)]">
      {value.trim() ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => {
              if (!href) {
                return <span>{children}</span>;
              }

              if (href.startsWith("/")) {
                return <Link href={href}>{children}</Link>;
              }

              return (
                <a href={href} target="_blank" rel="noreferrer">
                  {children}
                </a>
              );
            },
          }}
        >
          {value}
        </ReactMarkdown>
      ) : (
        <p className="text-sm text-[var(--color-muted)]">Preview will appear here as you write.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-white/65 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <ToolbarButton label="H2" icon={Heading2} onClick={() => prefixSelectedLines("## ")} />
          <ToolbarButton label="H3" icon={Heading3} onClick={() => prefixSelectedLines("### ")} />
          <ToolbarButton label="Bold" icon={Bold} onClick={() => wrapSelection("**")} />
          <ToolbarButton label="Italic" icon={Italic} onClick={() => wrapSelection("_")} />
          <ToolbarButton label="List" icon={List} onClick={() => prefixSelectedLines("- ")} />
          <ToolbarButton label="Quote" icon={Quote} onClick={() => prefixSelectedLines("> ")} />
          <ToolbarButton label="Link" icon={Link2} onClick={() => wrapSelection("[", "](https://)", "link text")} />
          <ToolbarButton label="Code" icon={Code2} onClick={() => wrapSelection("```\n", "\n```", "code") } />
        </div>
        <div className="flex items-center gap-2">
          {modeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = mode === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                  isActive
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-ink)]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className={mode === "split" ? "grid gap-4 xl:grid-cols-2" : "space-y-4"}>
        {mode !== "preview" ? (
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={rows}
            required
            className="min-h-[22rem] rounded-[1.5rem] border border-[var(--color-border)] bg-white px-4 py-3 font-mono text-sm leading-7 outline-none"
          />
        ) : (
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            rows={rows}
            required
            className="sr-only"
          />
        )}

        {mode !== "write" ? preview : null}
      </div>

      <div className="flex flex-wrap justify-between gap-3 text-xs leading-6 text-[var(--color-muted)]">
        <p>Markdown shortcuts are applied directly at the current selection.</p>
        <p>{wordCount} words</p>
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof Bold;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)] transition hover:border-[var(--color-ink)]"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}