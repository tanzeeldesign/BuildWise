import type { Answers } from "./types";

export const STORAGE_KEY = "buildwise-answers";

export const emptyAnswers: Answers = {};

export function loadAnswers(): Answers {
  if (typeof window === "undefined") return emptyAnswers;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAnswers;
    const parsed = JSON.parse(raw) as Answers;
    return {
      ...emptyAnswers,
      ...parsed,
      priorities: Array.isArray(parsed.priorities) ? parsed.priorities : [],
    };
  } catch {
    return emptyAnswers;
  }
}

export function saveAnswers(answers: Answers) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export function hasCompletedPlan(answers: Answers): boolean {
  return Boolean(
    answers.project &&
      answers.location &&
      answers.plot &&
      answers.climate &&
      answers.family &&
      answers.outdoor &&
      answers.future &&
      answers.style &&
      answers.priorities &&
      answers.priorities.length > 0,
  );
}
