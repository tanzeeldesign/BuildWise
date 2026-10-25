import { asStringList, formatAnswerList } from "./answers";
import type { Answers, BuiltPlan, TopicContent, TopicId } from "./types";

const cityClimate: Record<string, string> = {
  Karachi: "coastal heat and humidity",
  Lahore: "hot summers and cooler winters",
  Islamabad: "milder foothill seasons",
  Other: "local climate conditions",
};

type CatalogEntry = Omit<TopicContent, "why" | "hero"> & {
  whyTemplate: string;
  heroTemplate: string;
};

export const topicCatalog: Record<TopicId, CatalogEntry> = {
  orientation: {
    id: "orientation",
    number: "01",
    title: "Orientation",
    cardTitle: "Orientation",
    blurb: "Plan rooms around sunlight, shade, and comfort.",
    label: "Site & climate",
    heroTemplate: "Let orientation work for your home in {location}.",
    whyTemplate:
      "On your {plot} plot in {location}, orientation affects sunlight and heat. Factor in local conditions, your {style} style, and your {family} household before locking the layout.",
    discuss: [
      "How does the plot’s direction affect sunlight and afternoon heat?",
      "Which rooms need morning light or less direct sun?",
      "Where can shading improve comfort without blocking useful daylight?",
      "How should the layout respond to neighbors, privacy, and outdoor space?",
    ],
    tip: "Check the sun’s path and plot orientation before fixing the layout.",
    planLabel: "Orientation",
  },
  ventilation: {
    id: "ventilation",
    number: "02",
    title: "Ventilation",
    cardTitle: "Natural Ventilation",
    blurb: "Improve airflow with smarter window placement.",
    label: "Climate & comfort",
    heroTemplate: "Make natural airflow work in {location}.",
    whyTemplate:
      "With {climate} as a focus, ventilation matters early. In {location}, airflow depends on wind, layout, and windows. Plan for comfort for your {family} household and {style} style.",
    discuss: [
      "Can windows support cross-ventilation in key rooms?",
      "How will nearby buildings and wind affect airflow?",
      "Where do shading, privacy, and insect protection matter too?",
      "When is mechanical cooling better than open windows?",
    ],
    tip: "Window count isn’t everything — placement and airflow paths matter more.",
    planLabel: "Natural Ventilation",
  },
  sunlight: {
    id: "sunlight",
    number: "03",
    title: "Sunlight",
    cardTitle: "Natural Light",
    blurb: "Bring useful daylight into the rooms you use most.",
    label: "Light & wellbeing",
    heroTemplate: "Bring daylight into everyday spaces in your {style} home.",
    whyTemplate:
      "Your {style} style and light priorities make daylight important. In {location}, orientation, neighbors, windows, and shading shape how light reaches rooms. Consider how your {family} household uses each space.",
    discuss: [
      "Which rooms need morning or indirect daylight most?",
      "How can windows balance daylight with heat and glare?",
      "Could courtyards or skylights light deeper rooms?",
      "How do privacy and neighbors affect daylight without blocking it?",
    ],
    tip: "Plan daylight around how rooms are used — not just window size.",
    planLabel: "Light & Sun",
  },
  materials: {
    id: "materials",
    number: "04",
    title: "Materials",
    cardTitle: "Materials & Protection",
    blurb: "Choose materials for comfort, durability, and upkeep.",
    label: "Materials & durability",
    heroTemplate: "Choose materials that suit conditions in {location}.",
    whyTemplate:
      "With {climate} in mind, materials and protection are worth discussing early. Choices depend on exposure, quality, upkeep, and budget — and should fit your {location} home and {style} style.",
    discuss: [
      "Which roof and wall assemblies suit the local climate?",
      "What waterproofing and drainage fit this plot’s exposure?",
      "Which finishes handle weather, dust, moisture, and daily use?",
      "How do cost, upkeep, durability, and repairs compare?",
    ],
    tip: "Compare materials by long-term performance and upkeep, not just price or looks.",
    planLabel: "Materials",
  },
  spatial: {
    id: "spatial",
    number: "05",
    title: "Spatial considerations",
    cardTitle: "Space & Privacy",
    blurb: "Make your space work for your household and future.",
    label: "Space & everyday living",
    heroTemplate: "Make every part of your {plot} home work harder.",
    whyTemplate:
      "Your {plot} plot and {family} household call for efficient planning. Balance circulation, privacy, storage, and room sizes. Factor in {outdoor} outdoor use and plans for {future}.",
    discuss: [
      "How should the layout balance rooms, circulation, and storage?",
      "Which spaces need more privacy or quieter separation?",
      "How should indoor spaces connect to outdoor areas?",
      "Can the layout adapt as family needs change?",
    ],
    tip: "Plan around daily routines and furniture before locking room sizes.",
    planLabel: "Spatial Considerations",
  },
  "design-direction": {
    id: "design-direction",
    number: "06",
    title: "Design direction",
    cardTitle: "Design Direction",
    blurb: "Align your style with practical, lasting choices.",
    label: "Design & identity",
    heroTemplate: "Give your {style} home a clear direction.",
    whyTemplate:
      "Your {style} preference is a starting point. Turn it into practical choices for layout, materials, openings, and finishes. In {location}, also respond to local conditions and your {family} household.",
    discuss: [
      "Which features express the style without hurting function?",
      "How can materials, colors, and finishes stay consistent?",
      "How do you balance aesthetics with light, air, privacy, and upkeep?",
      "What deserves investment now vs. simpler alternatives?",
    ],
    tip: "Set a clear design direction early so every choice stays coherent.",
    planLabel: "Design Direction",
  },
};

const priorityToTopic: Record<string, TopicId> = {
  "Natural light": "sunlight",
  Ventilation: "ventilation",
  "Energy efficiency": "ventilation",
  Privacy: "spatial",
  Space: "spatial",
  Aesthetics: "design-direction",
};

const climateToTopic: Record<string, TopicId> = {
  "Intense heat": "ventilation",
  Humidity: "ventilation",
  "Monsoon rains": "materials",
  "Dust & haze": "materials",
  "Mild seasons": "orientation",
};

const topicOrder: TopicId[] = [
  "orientation",
  "ventilation",
  "sunlight",
  "materials",
  "spatial",
  "design-direction",
];

const PLACEHOLDER_DEFAULTS = {
  location: "your city",
  climate: "your climate",
  style: "your preferred",
  plot: "your",
  family: "your household",
  outdoor: "occasionally",
  future: "future change",
} as const;

function textOr(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

function climatePhrase(answers: Answers): string {
  const list = asStringList(answers.climate).map((c) => c.toLowerCase());
  if (!list.length) return PLACEHOLDER_DEFAULTS.climate;
  if (list.length === 1) return list[0]!;
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(", ")}, and ${list[list.length - 1]}`;
}

function fill(template: string, answers: Answers): string {
  const location = textOr(answers.location, PLACEHOLDER_DEFAULTS.location);
  const climate = climatePhrase(answers);
  const style = textOr(answers.style, PLACEHOLDER_DEFAULTS.style).toLowerCase();
  const plot = textOr(answers.plot, PLACEHOLDER_DEFAULTS.plot).toLowerCase();
  const family = textOr(answers.family, PLACEHOLDER_DEFAULTS.family);
  const outdoor = textOr(answers.outdoor, PLACEHOLDER_DEFAULTS.outdoor).toLowerCase();
  const future = textOr(answers.future, PLACEHOLDER_DEFAULTS.future).toLowerCase();

  return template
    .replaceAll("{location}", location)
    .replaceAll("{climate}", climate)
    .replaceAll("{style}", style)
    .replaceAll("{plot}", plot)
    .replaceAll("{family}", family)
    .replaceAll("{outdoor}", outdoor)
    .replaceAll("{future}", future)
    .replace(/\{[a-zA-Z]+\}/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function resolveTopic(id: TopicId, answers: Answers): TopicContent {
  const base = topicCatalog[id];
  return {
    id: base.id,
    number: base.number,
    title: base.title,
    cardTitle: base.cardTitle,
    blurb: base.blurb,
    label: base.label,
    discuss: base.discuss,
    tip: base.tip,
    planLabel: base.planLabel,
    hero: fill(base.heroTemplate, answers),
    why: fill(base.whyTemplate, answers),
  };
}

function pickTopTopic(answers: Answers): TopicId {
  const priorities = asStringList(answers.priorities);
  for (const p of priorities) {
    const mapped = priorityToTopic[p];
    if (mapped) return mapped;
  }
  for (const climate of asStringList(answers.climate)) {
    const fromClimate = climateToTopic[climate];
    if (fromClimate) return fromClimate;
  }
  const location = answers.location?.trim();
  if (location === "Karachi") return "ventilation";
  if (location === "Lahore") return "orientation";
  if (location === "Islamabad") return "sunlight";
  return "orientation";
}

function rankTopics(answers: Answers, top: TopicId): TopicId[] {
  const scored = new Map<TopicId, number>(topicOrder.map((id, i) => [id, topicOrder.length - i]));
  scored.set(top, 100);
  const priorities = asStringList(answers.priorities);
  for (const [i, p] of priorities.entries()) {
    const id = priorityToTopic[p];
    if (id) scored.set(id, (scored.get(id) ?? 0) + 40 - i * 5);
  }
  for (const [i, climate] of asStringList(answers.climate).entries()) {
    const id = climateToTopic[climate];
    if (id) scored.set(id, (scored.get(id) ?? 0) + 15 - i * 2);
  }
  return [...topicOrder].sort((a, b) => (scored.get(b) ?? 0) - (scored.get(a) ?? 0));
}

function topSummary(answers: Answers, topic: TopicContent): string {
  const place = textOr(answers.location, "Your location");
  const climateKey = answers.location?.trim() ?? "";
  const cityFocus = cityClimate[climateKey] ?? cityClimate["Other"];
  const focus = asStringList(answers.climate).length ? climatePhrase(answers) : cityFocus;
  return `${place}'s ${focus} makes ${topic.title.toLowerCase()} worth discussing early.`;
}

function greetingName(answers: Answers): string {
  if (answers.location?.trim() === "Karachi") return "neighbour";
  if (answers.family?.trim().startsWith("6")) return "family";
  return "there";
}

function displayValue(value: string | undefined): string {
  return textOr(value, "—");
}

export function buildPlan(answers: Answers): BuiltPlan {
  const safeAnswers: Answers = answers ?? {};
  const topTopicId = pickTopTopic(safeAnswers);
  const ranked = rankTopics(safeAnswers, topTopicId);
  const topics = ranked.map((id) => resolveTopic(id, safeAnswers));
  const topTopic = topics.find((t) => t.id === topTopicId) ?? topics[0]!;
  const priorities = formatAnswerList(safeAnswers.priorities, "Not set yet");
  const climateFocus = formatAnswerList(safeAnswers.climate);

  const profileRows: Array<[string, string]> = [
    ["Location", displayValue(safeAnswers.location)],
    ["Project", displayValue(safeAnswers.project)],
    ["Plot / space", displayValue(safeAnswers.plot)],
    ["Climate focus", climateFocus],
    ["Style", displayValue(safeAnswers.style)],
    ["Family", displayValue(safeAnswers.family)],
    ["Outdoor use", displayValue(safeAnswers.outdoor)],
    ["Future", displayValue(safeAnswers.future)],
    ["Top priorities", priorities],
  ];

  const profileStrip = [
    safeAnswers.location?.trim(),
    safeAnswers.project?.trim(),
    safeAnswers.style?.trim(),
    safeAnswers.family?.trim(),
  ]
    .filter(Boolean)
    .join(" · ");

  const discussList = topics.slice(0, 6).map((t) => t.planLabel);

  const planText = [
    "BuildWise — Your smarter home plan (prototype)",
    "",
    `Location: ${displayValue(safeAnswers.location)}`,
    `Project: ${displayValue(safeAnswers.project)}`,
    `Plot: ${displayValue(safeAnswers.plot)}`,
    `Climate focus: ${climateFocus}`,
    `Style: ${displayValue(safeAnswers.style)}`,
    `Family: ${displayValue(safeAnswers.family)}`,
    `Outdoor: ${displayValue(safeAnswers.outdoor)}`,
    `Future: ${displayValue(safeAnswers.future)}`,
    `Priorities: ${priorities}`,
    "",
    "Topics to discuss:",
    ...discussList.map((label, i) => `${String(i + 1).padStart(2, "0")} — ${label}`),
    "",
    "Disclaimer: BuildWise is a prototype. It does not replace professional advice.",
  ].join("\n");

  return {
    greetingName: greetingName(safeAnswers),
    profileStrip: profileStrip || "Complete the planner to personalize this view",
    profileRows,
    topTopicId,
    topTitle: topTopic.cardTitle.includes(" ")
      ? topTopic.cardTitle
      : topTopic.id === "ventilation"
        ? "Heat & Ventilation"
        : topTopic.cardTitle,
    topSummary: topSummary(safeAnswers, topTopic),
    topics,
    discussList,
    planText,
  };
}

export function getTopic(id: TopicId, answers: Answers): TopicContent {
  return resolveTopic(id, answers ?? {});
}

export function nextTopicId(current: TopicId, plan: BuiltPlan): TopicId {
  const ids = plan.topics.map((t) => t.id);
  const idx = ids.indexOf(current);
  if (idx < 0 || idx >= ids.length - 1) return ids[0] ?? "orientation";
  return ids[idx + 1] ?? ids[0] ?? "orientation";
}

export async function sharePlanText(text: string): Promise<"shared" | "copied"> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title: "BuildWise Plan", text });
      return "shared";
    } catch {
      /* fall through to clipboard */
    }
  }
  await navigator.clipboard.writeText(text);
  return "copied";
}

export function downloadPlanText(text: string, filename = "buildwise-plan.txt") {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
