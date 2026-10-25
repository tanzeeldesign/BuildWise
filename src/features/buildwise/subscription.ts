import type { SubscriptionId, SubscriptionRecord, SubscriptionTier } from "./types";

export const SUBSCRIPTION_KEY = "buildwise-subscription";

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "free",
    name: "Free",
    tagline: "Home planning preview",
    priceLabel: "Rs. 0",
    priceNote: "Forever free",
    billing: "free",
    audience: "For exploring your home-building needs.",
    features: [
      "Basic tips from city and plot details",
      "General climate and efficiency guidance",
      "Basic home-building checklist",
      "Preview of personalized recommendations",
      "Limited AI questions",
    ],
    highlight: false,
    ctaLabel: "Continue free",
  },
  {
    id: "home-planning",
    name: "Home Planning Package",
    tagline: "Personalized planning before you build",
    priceLabel: "Rs. 4,999",
    priceNote: "One-time payment",
    billing: "one-time",
    audience: "For homeowners who want guidance before construction.",
    features: [
      "Personalized report from location, plot, budget, and family needs",
      "Climate-smart tips for light, air, insulation, and energy",
      "Solar, drainage, and rainwater checklists",
      "Materials and future-expansion considerations",
      "Questions to discuss with an architect",
      "Step-by-step building roadmap",
      "Saved home profile and report access",
      "90-day construction-stage reminders",
      "One minor report revision",
      "Partner architect consultation discounts",
    ],
    highlight: true,
    ctaLabel: "Get this package",
  },
];

type SubscriptionStore = {
  byEmail: Record<string, SubscriptionRecord>;
};

function emptyStore(): SubscriptionStore {
  return { byEmail: {} };
}

function readStore(): SubscriptionStore {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw) as SubscriptionStore;
    if (!parsed || typeof parsed !== "object" || !parsed.byEmail) return emptyStore();
    return { byEmail: parsed.byEmail };
  } catch {
    return emptyStore();
  }
}

function writeStore(store: SubscriptionStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(store));
}

export function getTier(id: SubscriptionId): SubscriptionTier {
  return SUBSCRIPTION_TIERS.find((t) => t.id === id) ?? SUBSCRIPTION_TIERS[0]!;
}

export function loadSubscription(email: string | null | undefined): SubscriptionRecord | null {
  if (!email) return null;
  const key = email.trim().toLowerCase();
  if (!key) return null;
  return readStore().byEmail[key] ?? null;
}

export function saveSubscription(
  email: string,
  tierId: SubscriptionId,
): SubscriptionRecord {
  const key = email.trim().toLowerCase();
  const record: SubscriptionRecord = {
    tierId,
    selectedAt: new Date().toISOString(),
  };
  const store = readStore();
  store.byEmail[key] = record;
  writeStore(store);
  return record;
}

export function clearSubscription(email: string) {
  const key = email.trim().toLowerCase();
  const store = readStore();
  delete store.byEmail[key];
  writeStore(store);
}

export function migrateSubscriptionEmail(fromEmail: string, toEmail: string) {
  const from = fromEmail.trim().toLowerCase();
  const to = toEmail.trim().toLowerCase();
  if (!from || !to || from === to) return;
  const store = readStore();
  const record = store.byEmail[from];
  if (!record) return;
  store.byEmail[to] = record;
  delete store.byEmail[from];
  writeStore(store);
}

export function formatSelectedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
