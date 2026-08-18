import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import { z } from "zod";

import { getSiteDateKey } from "@/lib/datetime";

const calendarEntrySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  website: z.string().trim().min(1),
  city: z.string().trim().min(1),
  category: z.string().trim().min(1),
  topic: z.string().trim().min(1),
  primaryKeyword: z.string().trim().min(1),
  writingAngle: z.string().trim().min(1),
  requiredPoints: z.array(z.string().trim().min(1)).default([]),
  imageInstructions: z.string().trim().default(""),
  internalLinkTarget: z.string().trim().default(""),
  status: z
    .enum(["pending", "in-progress", "waiting-for-manager-image", "done"])
    .optional(),
});

const calendarFileSchema = z.object({
  entries: z.array(calendarEntrySchema),
});

export type ArticleCalendarEntry = z.infer<typeof calendarEntrySchema>;

export type ArticleCalendarLoadResult =
  | { loaded: true; entry: ArticleCalendarEntry | null; date: string }
  | { loaded: false; message: string; date: string };

function getCalendarFilePath() {
  return path.join(process.cwd(), "article-calendar.json");
}

function readCalendarEntries(): ArticleCalendarEntry[] | null {
  const filePath = getCalendarFilePath();

  try {
    const raw = readFileSync(filePath, "utf8");
    const parsed = calendarFileSchema.safeParse(JSON.parse(raw));

    if (!parsed.success) {
      console.error("[article-calendar] Invalid article-calendar.json schema", parsed.error.flatten());
      return null;
    }

    return parsed.data.entries;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code === "ENOENT") {
      return null;
    }

    console.error("[article-calendar] Failed to read article-calendar.json", error);
    return null;
  }
}

export function getTodaysArticleCalendarEntry(dateKey = getSiteDateKey()): ArticleCalendarLoadResult {
  const entries = readCalendarEntries();

  if (entries === null) {
    return {
      loaded: false,
      message: "Content calendar not loaded.",
      date: dateKey,
    };
  }

  const entry =
    entries.find((candidate) => candidate.date === dateKey) ||
    entries.find((candidate) => candidate.date.slice(0, 10) === dateKey) ||
    null;

  return {
    loaded: true,
    entry,
    date: dateKey,
  };
}

export function getNextArticleCalendarEntry(dateKey = getSiteDateKey()): ArticleCalendarEntry | null {
  const entries = readCalendarEntries();

  if (!entries) {
    return null;
  }

  const sortedEntries = [...entries].sort((first, second) => first.date.localeCompare(second.date));

  return sortedEntries.find((entry) => entry.date > dateKey) || null;
}

/** For tests/fixtures only — parse inline calendar JSON without reading disk. */
export function parseArticleCalendarFixture(raw: unknown): ArticleCalendarEntry[] | null {
  const parsed = calendarFileSchema.safeParse(raw);
  return parsed.success ? parsed.data.entries : null;
}
