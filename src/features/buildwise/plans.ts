import { asStringList, emptyAnswers, hasCompletedPlan } from "./answers";
import type { Answers, HomePlan, PlansStore, TopicId } from "./types";

export const PLANS_KEY = "buildwise-plans";
/** Legacy single-plan answers — migrated once into PLANS_KEY. */
export const LEGACY_ANSWERS_KEY = "buildwise-answers";

export const GUIDE_TOPIC_IDS: TopicId[] = [
  "orientation",
  "ventilation",
  "sunlight",
  "materials",
  "spatial",
  "design-direction",
];

export const GUIDE_TOPIC_COUNT = GUIDE_TOPIC_IDS.length;

const ANSWER_FIELDS: Array<keyof Answers> = [
  "project",
  "location",
  "plot",
  "climate",
  "family",
  "outdoor",
  "future",
  "style",
  "priorities",
];

export const ANSWER_STEP_COUNT = ANSWER_FIELDS.length;

const TOPIC_SET = new Set<string>(GUIDE_TOPIC_IDS);

function uid() {
  return `plan_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeAnswers(raw: Answers | undefined): Answers {
  const parsed = raw ?? emptyAnswers;
  return {
    ...emptyAnswers,
    ...parsed,
    // Accept legacy single-string climate from older saved plans.
    climate: asStringList((parsed as Answers & { climate?: unknown }).climate),
    priorities: asStringList(parsed.priorities),
  };
}

function normalizeCompletedTopics(raw: unknown): TopicId[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<TopicId>();
  for (const item of raw) {
    if (typeof item === "string" && TOPIC_SET.has(item)) {
      seen.add(item as TopicId);
    }
  }
  return GUIDE_TOPIC_IDS.filter((id) => seen.has(id));
}

export function planDisplayName(answers: Answers): string {
  const location = answers.location?.trim();
  const project = answers.project?.trim();
  if (location && project) {
    const short =
      project.length > 22 ? `${project.slice(0, 20).trimEnd()}…` : project;
    return `${location} · ${short}`;
  }
  if (location) return `${location} plan`;
  if (project) return project;
  return "Untitled plan";
}

export function countAnswerSteps(answers: Answers): number {
  let filled = 0;
  for (const key of ANSWER_FIELDS) {
    if (key === "priorities" || key === "climate") {
      if (asStringList(answers[key]).length > 0) filled += 1;
    } else if (answers[key]?.trim()) {
      filled += 1;
    }
  }
  return filled;
}

export type PlanProgress = {
  filled: number;
  total: number;
  percent: number;
  answersFilled: number;
  answersTotal: number;
  guidesDone: number;
  guidesTotal: number;
  unlocked: boolean;
  complete: boolean;
  /** Short line for progress cards */
  detailLabel: string;
  status: "draft" | "exploring" | "complete";
  statusLabel: string;
};

/** Progress for the current phase: answers while drafting, guides after unlock. */
export function planProgress(plan: HomePlan): PlanProgress {
  const answersFilled = countAnswerSteps(plan.answers);
  const answersTotal = ANSWER_STEP_COUNT;
  const guidesDone = normalizeCompletedTopics(plan.completedTopics).length;
  const guidesTotal = GUIDE_TOPIC_COUNT;
  const unlocked = hasCompletedPlan(plan.answers);
  const complete = unlocked && guidesDone >= guidesTotal;

  // Show progress for the active phase so the bar matches the detail label.
  const filled = unlocked ? guidesDone : answersFilled;
  const total = unlocked ? guidesTotal : answersTotal;
  const percent = total > 0 ? Math.round((filled / total) * 100) : 0;

  let detailLabel: string;
  if (!unlocked) {
    detailLabel = `${answersFilled} of ${answersTotal} answers`;
  } else if (!complete) {
    detailLabel = `${guidesDone} of ${guidesTotal} guides reviewed`;
  } else {
    detailLabel = "All guides reviewed";
  }

  const status: PlanProgress["status"] = !unlocked
    ? "draft"
    : complete
      ? "complete"
      : "exploring";
  const statusLabel =
    status === "draft" ? "Draft" : status === "complete" ? "Complete" : "In progress";

  return {
    filled,
    total,
    percent,
    answersFilled,
    answersTotal,
    guidesDone,
    guidesTotal,
    unlocked,
    complete,
    detailLabel,
    status,
    statusLabel,
  };
}

export function isTopicComplete(plan: HomePlan, topicId: TopicId): boolean {
  return normalizeCompletedTopics(plan.completedTopics).includes(topicId);
}

export function isPlanFullyComplete(plan: HomePlan): boolean {
  return planProgress(plan).complete;
}

export function createEmptyPlan(partial?: Partial<HomePlan>): HomePlan {
  const now = new Date().toISOString();
  const answers = normalizeAnswers(partial?.answers);
  const customName = partial?.name?.trim();
  const nameIsCustom = Boolean(customName) || Boolean(partial?.nameIsCustom);
  return {
    id: partial?.id ?? uid(),
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,
    answers,
    name: customName || planDisplayName(answers),
    nameIsCustom,
    completedTopics: normalizeCompletedTopics(partial?.completedTopics),
  };
}

function withDerivedName(plan: HomePlan): HomePlan {
  const answers = normalizeAnswers(plan.answers);
  const customName = plan.nameIsCustom ? plan.name?.trim() : "";
  return {
    ...plan,
    answers,
    name: customName || planDisplayName(answers),
    nameIsCustom: Boolean(customName),
    completedTopics: normalizeCompletedTopics(plan.completedTopics),
  };
}

function touchPlan(plan: HomePlan): HomePlan {
  return {
    ...withDerivedName(plan),
    updatedAt: new Date().toISOString(),
  };
}

function emptyStore(): PlansStore {
  return { plans: [], activePlanId: null };
}

function migrateLegacy(): PlansStore | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEGACY_ANSWERS_KEY);
    if (!raw) return null;
    const answers = normalizeAnswers(JSON.parse(raw) as Answers);
    const hasAny = ANSWER_FIELDS.some((key) =>
      key === "priorities" || key === "climate"
        ? asStringList(answers[key]).length > 0
        : Boolean(answers[key]?.trim()),
    );
    if (!hasAny) {
      localStorage.removeItem(LEGACY_ANSWERS_KEY);
      return emptyStore();
    }
    const plan = withDerivedName(createEmptyPlan({ answers }));
    const store: PlansStore = { plans: [plan], activePlanId: plan.id };
    localStorage.setItem(PLANS_KEY, JSON.stringify(store));
    localStorage.removeItem(LEGACY_ANSWERS_KEY);
    return store;
  } catch {
    return null;
  }
}

export function loadPlansStore(): PlansStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    if (!raw) {
      return migrateLegacy() ?? emptyStore();
    }
    const parsed = JSON.parse(raw) as PlansStore;
    const plans = Array.isArray(parsed.plans)
      ? parsed.plans.map((p) =>
          withDerivedName({
            ...p,
            answers: normalizeAnswers(p.answers),
            completedTopics: normalizeCompletedTopics(
              (p as HomePlan).completedTopics ?? (p as { completedTopics?: unknown }).completedTopics,
            ),
          }),
        )
      : [];
    const activePlanId =
      plans.some((p) => p.id === parsed.activePlanId) ? parsed.activePlanId : plans[0]?.id ?? null;
    return { plans, activePlanId };
  } catch {
    return migrateLegacy() ?? emptyStore();
  }
}

export function savePlansStore(store: PlansStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLANS_KEY, JSON.stringify(store));
}

export function getPlan(store: PlansStore, id: string | null | undefined): HomePlan | null {
  if (!id) return null;
  return store.plans.find((p) => p.id === id) ?? null;
}

export function getActivePlan(store: PlansStore): HomePlan | null {
  return getPlan(store, store.activePlanId) ?? store.plans[0] ?? null;
}

/** Prefer unfinished plans, else most recently updated. */
export function getHomeFocusPlan(store: PlansStore): HomePlan | null {
  if (!store.plans.length) return null;
  const unfinished = store.plans
    .filter((p) => !isPlanFullyComplete(p))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (unfinished[0]) return unfinished[0];
  return [...store.plans].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;
}

export function upsertPlanAnswers(
  store: PlansStore,
  planId: string,
  answers: Answers,
): PlansStore {
  const plans = store.plans.map((p) =>
    p.id === planId ? touchPlan({ ...p, answers }) : p,
  );
  return { ...store, plans, activePlanId: planId };
}

export function setTopicComplete(
  store: PlansStore,
  planId: string,
  topicId: TopicId,
  complete: boolean,
): PlansStore {
  const plans = store.plans.map((p) => {
    if (p.id !== planId) return p;
    const current = new Set(normalizeCompletedTopics(p.completedTopics));
    if (complete) current.add(topicId);
    else current.delete(topicId);
    return touchPlan({
      ...p,
      completedTopics: GUIDE_TOPIC_IDS.filter((id) => current.has(id)),
    });
  });
  return { ...store, plans, activePlanId: planId };
}

export function toggleTopicComplete(
  store: PlansStore,
  planId: string,
  topicId: TopicId,
): PlansStore {
  const plan = getPlan(store, planId);
  if (!plan) return store;
  return setTopicComplete(store, planId, topicId, !isTopicComplete(plan, topicId));
}

export function addPlan(store: PlansStore, plan: HomePlan = createEmptyPlan()): PlansStore {
  return {
    plans: [plan, ...store.plans],
    activePlanId: plan.id,
  };
}

export function removePlan(store: PlansStore, planId: string): PlansStore {
  const plans = store.plans.filter((p) => p.id !== planId);
  const activePlanId =
    store.activePlanId === planId ? plans[0]?.id ?? null : store.activePlanId;
  return { plans, activePlanId };
}

export function setActivePlanId(store: PlansStore, planId: string | null): PlansStore {
  if (planId && !store.plans.some((p) => p.id === planId)) return store;
  return { ...store, activePlanId: planId };
}

/** Plans with every guide marked complete. */
export function completedCount(store: PlansStore): number {
  return store.plans.filter((p) => isPlanFullyComplete(p)).length;
}
