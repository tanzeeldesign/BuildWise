import type { Answers, BuiltPlan, TopicContent, TopicId } from "./types";

const cityClimate: Record<string, string> = {
  Karachi: "coastal heat and humidity",
  Lahore: "hot summers and cooler winters",
  Islamabad: "milder foothill seasons",
  Other: "local climate conditions",
};

export const topicCatalog: Record<TopicId, Omit<TopicContent, "why" | "hero"> & { whyTemplate: string; heroTemplate: string }> = {
  orientation: {
    id: "orientation",
    number: "01",
    title: "Orientation",
    cardTitle: "Orientation",
    blurb: "How sunlight and positioning can influence comfort.",
    label: "Site & sun",
    heroTemplate: "Face the sun with intention.",
    whyTemplate:
      "In {location}, plot orientation shapes which rooms catch morning light, afternoon heat and prevailing breezes. Getting this right early reduces uncomfortable spaces later.",
    discuss: ["Plot facing and road edge", "Morning vs afternoon rooms", "Shade on west façades", "Courtyard placement"],
    tip: "Decide room placement with the sun path — not only with the street view.",
    planLabel: "Orientation",
  },
  ventilation: {
    id: "ventilation",
    number: "02",
    title: "Ventilation",
    cardTitle: "Ventilation",
    blurb: "Plan natural airflow before you rely on mechanical cooling.",
    label: "Climate & comfort",
    heroTemplate: "Make natural airflow work for you.",
    whyTemplate:
      "{location} homes can hold heat long after sunset. Thoughtful openings, shaded edges and a clear path for air help rooms feel comfortable with less reliance on cooling — especially when {climate} is a priority.",
    discuss: ["Window placement", "Cross ventilation", "Shading", "Room orientation"],
    tip: "Think about airflow during planning — not after construction.",
    planLabel: "Natural Ventilation",
  },
  sunlight: {
    id: "sunlight",
    number: "03",
    title: "Sunlight",
    cardTitle: "Sunlight",
    blurb: "Plan daylight into the spaces you use most.",
    label: "Light & day",
    heroTemplate: "Bring daylight where you live.",
    whyTemplate:
      "Natural light changes how a {style} home feels through the day. For a {plot} plot in {location}, window size, depth and shading decide whether rooms feel bright or harsh.",
    discuss: ["Daylit living areas", "Glare control", "Skylights and courts", "Evening room comfort"],
    tip: "Bright is not always better — aim for usable daylight without overheating.",
    planLabel: "Light & Sun",
  },
  materials: {
    id: "materials",
    number: "04",
    title: "Materials",
    cardTitle: "Materials",
    blurb: "Suggest finishes that suit climate, maintenance and character.",
    label: "Fabric & finish",
    heroTemplate: "Choose materials that work with the climate.",
    whyTemplate:
      "Dummy material guidance for {location}: thermal mass, breathable finishes and locally familiar options matter when dealing with {climate}. A {style} direction still needs practical envelopes.",
    discuss: ["Wall and roof insulation", "Breathable finishes", "Flooring for heat", "Maintenance reality"],
    tip: "Beautiful materials fail if they fight the climate — match look to performance.",
    planLabel: "Materials",
  },
  spatial: {
    id: "spatial",
    number: "05",
    title: "Spatial",
    cardTitle: "Spatial considerations",
    blurb: "Shape rooms around family life, privacy and outdoor use.",
    label: "Plan & living",
    heroTemplate: "Plan spaces for how you actually live.",
    whyTemplate:
      "With {family} and outdoor use “{outdoor}”, circulation, privacy and shared rooms need early attention. Future needs like “{future}” should leave room to adapt.",
    discuss: ["Public vs private zones", "Flexible rooms", "Outdoor connections", "Storage and service"],
    tip: "A plan that fits daily life beats a plan that only looks good in drawings.",
    planLabel: "Spatial Considerations",
  },
  "design-direction": {
    id: "design-direction",
    number: "06",
    title: "Design direction",
    cardTitle: "Design direction",
    blurb: "Align architecture with the character you want at home.",
    label: "Character & form",
    heroTemplate: "Set a clear design direction.",
    whyTemplate:
      "Your preference for {style} gives architects a shared language — from openings and materials to courtyard character — while still responding to {location} and a {plot} site.",
    discuss: ["Façade language", "Indoor–outdoor threshold", "Material palette", "Cultural cues"],
    tip: "A clear design direction saves months of mismatched revisions later.",
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

function fill(template: string, answers: Answers): string {
  return template
    .replaceAll("{location}", answers.location ?? "your city")
    .replaceAll("{climate}", (answers.climate ?? "your climate").toLowerCase())
    .replaceAll("{style}", (answers.style ?? "your preferred").toLowerCase())
    .replaceAll("{plot}", (answers.plot ?? "your").toLowerCase())
    .replaceAll("{family}", answers.family ?? "your household")
    .replaceAll("{outdoor}", answers.outdoor ?? "occasionally")
    .replaceAll("{future}", answers.future ?? "future change");
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
  const priorities = answers.priorities ?? [];
  for (const p of priorities) {
    const mapped = priorityToTopic[p];
    if (mapped) return mapped;
  }
  if (answers.climate) {
    const fromClimate = climateToTopic[answers.climate];
    if (fromClimate) return fromClimate;
  }
  if (answers.location === "Karachi") return "ventilation";
  if (answers.location === "Lahore") return "orientation";
  if (answers.location === "Islamabad") return "sunlight";
  return "orientation";
}

function rankTopics(answers: Answers, top: TopicId): TopicId[] {
  const scored = new Map<TopicId, number>(topicOrder.map((id, i) => [id, topicOrder.length - i]));
  scored.set(top, 100);
  for (const [i, p] of (answers.priorities ?? []).entries()) {
    const id = priorityToTopic[p];
    if (id) scored.set(id, (scored.get(id) ?? 0) + 40 - i * 5);
  }
  if (answers.climate) {
    const id = climateToTopic[answers.climate];
    if (id) scored.set(id, (scored.get(id) ?? 0) + 15);
  }
  return [...topicOrder].sort((a, b) => (scored.get(b) ?? 0) - (scored.get(a) ?? 0));
}

function topSummary(answers: Answers, topic: TopicContent): string {
  const place = answers.location ?? "Your location";
  const climate = cityClimate[answers.location ?? ""] ?? cityClimate["Other"];
  const focus = answers.climate ? answers.climate.toLowerCase() : climate;
  return `${place}'s ${focus} makes ${topic.title.toLowerCase()} an important area to discuss during planning.`;
}

function greetingName(answers: Answers): string {
  if (answers.location === "Karachi") return "neighbour";
  if (answers.family?.startsWith("6")) return "family";
  return "there";
}

export function buildPlan(answers: Answers): BuiltPlan {
  const topTopicId = pickTopTopic(answers);
  const ranked = rankTopics(answers, topTopicId);
  const topics = ranked.map((id) => resolveTopic(id, answers));
  const topTopic = topics.find((t) => t.id === topTopicId) ?? topics[0]!;
  const priorities = answers.priorities?.length
    ? answers.priorities.join(" · ")
    : "Not set yet";

  const profileRows: Array<[string, string]> = [
    ["Location", answers.location ?? "—"],
    ["Project", answers.project ?? "—"],
    ["Plot / space", answers.plot ?? "—"],
    ["Climate focus", answers.climate ?? "—"],
    ["Style", answers.style ?? "—"],
    ["Family", answers.family ?? "—"],
    ["Outdoor use", answers.outdoor ?? "—"],
    ["Future", answers.future ?? "—"],
    ["Top priorities", priorities],
  ];

  const profileStrip = [
    answers.location,
    answers.project,
    answers.style,
    answers.family,
  ]
    .filter(Boolean)
    .join(" · ");

  const discussList = topics.slice(0, 6).map((t) => t.planLabel);

  const planText = [
    "BuildWise — Your smarter home plan (prototype)",
    "",
    `Location: ${answers.location ?? "—"}`,
    `Project: ${answers.project ?? "—"}`,
    `Plot: ${answers.plot ?? "—"}`,
    `Climate focus: ${answers.climate ?? "—"}`,
    `Style: ${answers.style ?? "—"}`,
    `Family: ${answers.family ?? "—"}`,
    `Outdoor: ${answers.outdoor ?? "—"}`,
    `Future: ${answers.future ?? "—"}`,
    `Priorities: ${priorities}`,
    "",
    "Things to discuss before you build:",
    ...discussList.map((label, i) => `${String(i + 1).padStart(2, "0")} — ${label}`),
    "",
    "Disclaimer: BuildWise is a prototype planning guide. It does not replace professional architectural or engineering consultation.",
  ].join("\n");

  return {
    greetingName: greetingName(answers),
    profileStrip: profileStrip || "Complete the planner to personalise this view",
    profileRows,
    topTopicId,
    topTitle: topTopic.cardTitle.includes(" ")
      ? topTopic.cardTitle
      : topTopic.id === "ventilation"
        ? "Heat & Ventilation"
        : topTopic.cardTitle,
    topSummary: topSummary(answers, topTopic),
    topics,
    discussList,
    planText,
  };
}

export function getTopic(id: TopicId, answers: Answers): TopicContent {
  return resolveTopic(id, answers);
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
