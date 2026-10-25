export type Tab = "home" | "plan" | "profile";

export type View =
  | "splash"
  | "get-started"
  | "sign-in"
  | "sign-up"
  | "choose-plan"
  | "home"
  | "plan"
  | "profile"
  | "planner"
  | "processing"
  | "guide"
  | "final-plan"
  | "disclaimer"
  | "edit-profile";

/** Customer subscription / package tier (not a home plan). */
export type SubscriptionId = "free" | "home-planning";

export type SubscriptionBilling = "free" | "one-time";

export type SubscriptionTier = {
  id: SubscriptionId;
  name: string;
  tagline: string;
  priceLabel: string;
  priceNote: string;
  billing: SubscriptionBilling;
  audience: string;
  features: string[];
  highlight: boolean;
  ctaLabel: string;
};

export type SubscriptionRecord = {
  tierId: SubscriptionId;
  selectedAt: string;
};

export type TopicId =
  | "orientation"
  | "ventilation"
  | "sunlight"
  | "materials"
  | "spatial"
  | "design-direction";

export type AnswerKey =
  | "project"
  | "location"
  | "plot"
  | "climate"
  | "family"
  | "outdoor"
  | "future"
  | "style"
  | "priorities";

export type Answers = {
  project?: string;
  location?: string;
  plot?: string;
  /** Multi-select climate challenges (legacy single strings are normalized on load). */
  climate?: string[];
  family?: string;
  outdoor?: string;
  future?: string;
  style?: string;
  priorities?: string[];
};

export type MultiAnswerKey = "climate" | "priorities";

export type QuestionOption = {
  value: string;
  description: string;
};

export type Question = {
  key: AnswerKey;
  title: string;
  text: string;
  options: QuestionOption[];
  multi?: boolean;
  maxSelect?: number;
};

export type TopicContent = {
  id: TopicId;
  number: string;
  title: string;
  cardTitle: string;
  blurb: string;
  label: string;
  hero: string;
  why: string;
  discuss: string[];
  tip: string;
  planLabel: string;
};

export type BuiltPlan = {
  greetingName: string;
  profileStrip: string;
  profileRows: Array<[string, string]>;
  topTopicId: TopicId;
  topTitle: string;
  topSummary: string;
  topics: TopicContent[];
  discussList: string[];
  planText: string;
};

export type Session = {
  name: string;
  email: string;
};

export type HomePlan = {
  id: string;
  name: string;
  /** When true, keep the user-chosen name instead of deriving from answers. */
  nameIsCustom?: boolean;
  createdAt: string;
  updatedAt: string;
  answers: Answers;
  /** Guide topics the user marked complete on recommendation screens. */
  completedTopics: TopicId[];
};

export type PlansStore = {
  plans: HomePlan[];
  activePlanId: string | null;
};

export type PlanTabMode = "list" | "detail";
