import type { Answers } from "./types";

/** @deprecated Prefer plans store — kept for migration/tests. */
export const STORAGE_KEY = "buildwise-answers";

export const emptyAnswers: Answers = {};

/** Normalize multi-select fields; also accepts legacy single-string climate. */
export function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string" && Boolean(v.trim()));
  }
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

export function formatAnswerList(value: unknown, fallback = "—"): string {
  const list = asStringList(value);
  return list.length ? list.join(" · ") : fallback;
}

export function hasCompletedPlan(answers: Answers): boolean {
  return Boolean(
    answers.project &&
      answers.location &&
      answers.plot &&
      asStringList(answers.climate).length > 0 &&
      answers.family &&
      answers.outdoor &&
      answers.future &&
      answers.style &&
      asStringList(answers.priorities).length > 0,
  );
}
