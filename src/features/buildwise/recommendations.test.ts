import { describe, expect, it } from "vitest";
import { buildPlan, getTopic, nextTopicId, topicCatalog } from "./recommendations";
import type { Answers, TopicId } from "./types";

const ALL_TOPIC_IDS: TopicId[] = [
  "orientation",
  "ventilation",
  "sunlight",
  "materials",
  "spatial",
  "design-direction",
];

const FORBIDDEN_FRAGMENTS = [
  "undefined",
  "null",
  "{location}",
  "{climate}",
  "{style}",
  "{plot}",
  "{family}",
  "{outdoor}",
  "{future}",
  "Dummy",
] as const;

function assertCleanText(value: string) {
  for (const fragment of FORBIDDEN_FRAGMENTS) {
    expect(value, `unexpected fragment "${fragment}" in: ${value}`).not.toContain(fragment);
  }
  expect(value).not.toMatch(/\{[a-zA-Z]+\}/);
}

function assertBuiltPlanShape(plan: ReturnType<typeof buildPlan>) {
  expect(ALL_TOPIC_IDS).toContain(plan.topTopicId);
  expect(typeof plan.greetingName).toBe("string");
  expect(plan.greetingName.length).toBeGreaterThan(0);
  expect(typeof plan.profileStrip).toBe("string");
  expect(plan.profileStrip.length).toBeGreaterThan(0);
  expect(Array.isArray(plan.profileRows)).toBe(true);
  expect(plan.profileRows.length).toBeGreaterThan(0);
  for (const row of plan.profileRows) {
    expect(row).toHaveLength(2);
    expect(typeof row[0]).toBe("string");
    expect(typeof row[1]).toBe("string");
    assertCleanText(row[0]);
    assertCleanText(row[1]);
  }
  expect(typeof plan.topTitle).toBe("string");
  expect(plan.topTitle.length).toBeGreaterThan(0);
  expect(typeof plan.topSummary).toBe("string");
  expect(plan.topSummary.length).toBeGreaterThan(0);
  assertCleanText(plan.topSummary);
  expect(plan.topics).toHaveLength(6);
  expect(new Set(plan.topics.map((t) => t.id))).toEqual(new Set(ALL_TOPIC_IDS));
  expect(plan.topics[0]?.id).toBe(plan.topTopicId);
  for (const topic of plan.topics) {
    expect(ALL_TOPIC_IDS).toContain(topic.id);
    expect(topic.number).toMatch(/^\d{2}$/);
    expect(topic.discuss).toHaveLength(4);
    assertCleanText(topic.hero);
    assertCleanText(topic.why);
    assertCleanText(topic.blurb);
    assertCleanText(topic.tip);
    assertCleanText(topic.cardTitle);
    assertCleanText(topic.planLabel);
  }
  expect(plan.discussList).toHaveLength(6);
  for (const label of plan.discussList) {
    assertCleanText(label);
  }
  expect(typeof plan.planText).toBe("string");
  assertCleanText(plan.planText);
}

describe("topicCatalog", () => {
  it("exposes exactly the six fixed topic IDs", () => {
    expect(Object.keys(topicCatalog).sort()).toEqual([...ALL_TOPIC_IDS].sort());
    for (const id of ALL_TOPIC_IDS) {
      expect(topicCatalog[id].id).toBe(id);
      expect(topicCatalog[id].number).toMatch(/^\d{2}$/);
      expect(topicCatalog[id].discuss).toHaveLength(4);
      expect(topicCatalog[id].heroTemplate.length).toBeGreaterThan(0);
      expect(topicCatalog[id].whyTemplate.length).toBeGreaterThan(0);
    }
  });
});

describe("priority → topic mapping", () => {
  const cases: Array<[string, TopicId]> = [
    ["Natural light", "sunlight"],
    ["Ventilation", "ventilation"],
    ["Energy efficiency", "ventilation"],
    ["Privacy", "spatial"],
    ["Space", "spatial"],
    ["Aesthetics", "design-direction"],
  ];

  it.each(cases)("%s selects %s as top topic", (priority, expected) => {
    const plan = buildPlan({ priorities: [priority] });
    expect(plan.topTopicId).toBe(expected);
  });
});

describe("climate → topic mapping", () => {
  const cases: Array<[string, TopicId]> = [
    ["Intense heat", "ventilation"],
    ["Humidity", "ventilation"],
    ["Monsoon rains", "materials"],
    ["Dust & haze", "materials"],
    ["Mild seasons", "orientation"],
  ];

  it.each(cases)("%s selects %s when no priority is set", (climate, expected) => {
    const plan = buildPlan({ climate: [climate], priorities: [] });
    expect(plan.topTopicId).toBe(expected);
  });

  it("uses the first mapped climate when several are selected", () => {
    const plan = buildPlan({
      climate: ["Monsoon rains", "Intense heat", "Mild seasons"],
      priorities: [],
    });
    expect(plan.topTopicId).toBe("materials");
  });

  it("boosts every selected climate in ranking", () => {
    const plan = buildPlan({
      climate: ["Intense heat", "Dust & haze"],
      priorities: [],
    });
    expect(plan.topTopicId).toBe("ventilation");
    const ids = plan.topics.map((t) => t.id);
    expect(ids.indexOf("ventilation")).toBeLessThan(ids.indexOf("materials"));
    expect(ids.indexOf("materials")).toBeLessThan(ids.indexOf("orientation"));
  });
});

describe("city fallback", () => {
  it.each([
    ["Karachi", "ventilation"],
    ["Lahore", "orientation"],
    ["Islamabad", "sunlight"],
    ["Other", "orientation"],
  ] as const)("%s falls back to %s", (location, expected) => {
    const plan = buildPlan({ location, priorities: [] });
    expect(plan.topTopicId).toBe(expected);
  });

  it("defaults to orientation for unknown/missing location", () => {
    expect(buildPlan({}).topTopicId).toBe("orientation");
    expect(buildPlan({ location: "Atlantis", priorities: [] }).topTopicId).toBe("orientation");
  });
});

describe("multi-priority and tie-breaking (current behavior)", () => {
  it("uses the first mapped priority as topTopicId", () => {
    const plan = buildPlan({
      priorities: ["Privacy", "Natural light", "Aesthetics"],
      climate: ["Intense heat"],
      location: "Karachi",
    });
    expect(plan.topTopicId).toBe("spatial");
    expect(plan.topics[0]?.id).toBe("spatial");
  });

  it("skips unmapped priorities and uses the next valid one", () => {
    const plan = buildPlan({
      priorities: ["Unlisted priority", "Natural light", "Ventilation"],
    });
    expect(plan.topTopicId).toBe("sunlight");
  });

  it("boosts later priorities in ranking without changing top from first mapped", () => {
    const plan = buildPlan({
      priorities: ["Aesthetics", "Natural light"],
    });
    expect(plan.topTopicId).toBe("design-direction");
    const ids = plan.topics.map((t) => t.id);
    expect(ids.indexOf("design-direction")).toBeLessThan(ids.indexOf("sunlight"));
  });

  it("Case 2: Privacy/Space priority beats monsoon climate for top topic", () => {
    const plan = buildPlan({
      project: "Renovate",
      location: "Lahore",
      plot: "10–20 marla",
      climate: ["Monsoon rains"],
      family: "6+ people",
      outdoor: "Every day",
      future: "Parents moving in",
      style: "Traditional",
      priorities: ["Privacy", "Space"],
    });
    expect(plan.topTopicId).toBe("spatial");
    const materials = getTopic("materials", {
      climate: ["Monsoon rains"],
      location: "Lahore",
    });
    expect(materials.discuss.some((d) => /waterproof|drainage/i.test(d))).toBe(true);
  });
});

describe("manual scenario cases", () => {
  it("Case 1 — Heat + ventilation priority", () => {
    const answers: Answers = {
      project: "Build a new home",
      location: "Karachi",
      plot: "5–10 marla",
      climate: ["Intense heat", "Humidity"],
      family: "3–5 people",
      outdoor: "On weekends",
      future: "Working from home",
      style: "Modern",
      priorities: ["Ventilation", "Energy efficiency"],
    };
    const plan = buildPlan(answers);
    expect(plan.topTopicId).toBe("ventilation");
    assertBuiltPlanShape(plan);
    expect(plan.topics.find((t) => t.id === "ventilation")?.why.toLowerCase()).toContain("karachi");
    expect(plan.profileRows.find(([label]) => label === "Climate focus")?.[1]).toBe(
      "Intense heat · Humidity",
    );
  });

  it("Case 3 — Natural light priority", () => {
    const plan = buildPlan({
      project: "Redesign",
      location: "Islamabad",
      plot: "1 kanal or more",
      climate: ["Mild seasons"],
      family: "1–2 people",
      outdoor: "Occasionally",
      future: "No major changes",
      style: "Minimal",
      priorities: ["Natural light"],
    });
    expect(plan.topTopicId).toBe("sunlight");
    const sunlight = plan.topics.find((t) => t.id === "sunlight")!;
    expect(sunlight.discuss.some((d) => /glare|heat|privacy/i.test(d))).toBe(true);
  });

  it("Case 4 — partial answers", () => {
    const plan = buildPlan({ location: "Other", priorities: [] });
    expect(plan.topTopicId).toBe("orientation");
    assertBuiltPlanShape(plan);
    expect(plan.profileStrip).toContain("Other");
  });

  it("Case 5 — unexpected values stay safe", () => {
    const plan = buildPlan({
      location: "Atlantis",
      climate: ["Snowstorms"],
      style: "Space-age",
      priorities: ["Unlisted priority", "Natural light", "Natural light", "Ventilation", "Space"],
    });
    expect(plan.topTopicId).toBe("sunlight");
    assertBuiltPlanShape(plan);
    expect(ALL_TOPIC_IDS).toContain(plan.topTopicId);
  });

  it("Case 7 — identical inputs yield identical output", () => {
    const answers: Answers = {
      location: "Lahore",
      climate: ["Dust & haze", "Monsoon rains"],
      style: "Cultural",
      priorities: ["Energy efficiency", "Space"],
    };
    const a = buildPlan(answers);
    const b = buildPlan(answers);
    expect(a).toEqual(b);
    expect(a.topTopicId).toBe(b.topTopicId);
    expect(a.topics.map((t) => t.id)).toEqual(b.topics.map((t) => t.id));
    expect(a.planText).toBe(b.planText);
  });
});

describe("missing and empty answers", () => {
  it("builds a complete plan from empty answers", () => {
    const plan = buildPlan({});
    assertBuiltPlanShape(plan);
    expect(plan.profileStrip).toBe("Complete the planner to personalize this view");
    expect(plan.profileRows.some(([, v]) => v === "Not set yet" || v === "—")).toBe(true);
  });

  it("treats blank strings as missing for placeholders", () => {
    const plan = buildPlan({
      location: "   ",
      climate: [],
      style: "  ",
      plot: "",
      family: "",
      outdoor: "",
      future: "",
    });
    assertBuiltPlanShape(plan);
    const why = plan.topics.map((t) => t.why).join(" ");
    expect(why.toLowerCase()).toContain("your city");
  });
});

describe("getTopic and nextTopicId", () => {
  it("getTopic returns resolved hero/why for each id", () => {
    for (const id of ALL_TOPIC_IDS) {
      const topic = getTopic(id, { location: "Karachi", style: "Modern" });
      expect(topic.id).toBe(id);
      expect(topic.hero).toBeTruthy();
      expect(topic.why).toBeTruthy();
      assertCleanText(topic.hero);
      assertCleanText(topic.why);
      expect(topic).not.toHaveProperty("heroTemplate");
      expect(topic).not.toHaveProperty("whyTemplate");
    }
  });

  it("nextTopicId walks the ranked order and wraps to the first", () => {
    const plan = buildPlan({
      priorities: ["Natural light"],
      climate: ["Intense heat"],
    });
    const ids = plan.topics.map((t) => t.id);
    expect(ids[0]).toBe("sunlight");

    for (let i = 0; i < ids.length - 1; i++) {
      expect(nextTopicId(ids[i]!, plan)).toBe(ids[i + 1]);
    }
    expect(nextTopicId(ids[ids.length - 1]!, plan)).toBe(ids[0]);
  });

  it("nextTopicId falls back to first topic for unknown current id", () => {
    const plan = buildPlan({ priorities: ["Aesthetics"] });
    expect(nextTopicId("not-a-topic" as TopicId, plan)).toBe(plan.topics[0]?.id);
  });
});
