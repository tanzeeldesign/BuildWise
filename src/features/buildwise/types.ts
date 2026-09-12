export type Tab = "home" | "plan" | "profile";

export type View =
  | "splash"
  | "get-started"
  | "sign-in"
  | "sign-up"
  | "home"
  | "plan"
  | "profile"
  | "planner"
  | "processing"
  | "guide"
  | "final-plan"
  | "disclaimer";

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
  climate?: string;
  family?: string;
  outdoor?: string;
  future?: string;
  style?: string;
  priorities?: string[];
};

export type QuestionOption = {
  value: string;
  description: string;
};

export type Question = {
  key: Exclude<AnswerKey, "priorities"> | "priorities";
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
