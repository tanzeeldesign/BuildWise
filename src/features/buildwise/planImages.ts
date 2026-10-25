import hero01 from "@/assets/plan-heroes/hero-01.jpg";
import hero02 from "@/assets/plan-heroes/hero-02.jpg";
import hero03 from "@/assets/plan-heroes/hero-03.jpg";
import hero04 from "@/assets/plan-heroes/hero-04.jpg";
import hero05 from "@/assets/plan-heroes/hero-05.jpg";
import hero06 from "@/assets/plan-heroes/hero-06.jpg";
import hero07 from "@/assets/plan-heroes/hero-07.jpg";
import hero08 from "@/assets/plan-heroes/hero-08.jpg";

/** Local architecture / home photos for plan cards. */
const PLAN_HERO_IMAGES = [
  hero01,
  hero02,
  hero03,
  hero04,
  hero05,
  hero06,
  hero07,
  hero08,
] as const;

function hashId(id: string): number {
  let hash = 2166136261;
  for (let i = 0; i < id.length; i += 1) {
    hash ^= id.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * Stable image per plan. When siblingIds are provided, each plan in the set
 * gets a unique photo (until the pool wraps).
 */
export function planHeroImage(planId: string, siblingIds: string[] = []): string {
  const pool = PLAN_HERO_IMAGES;
  const siblings = siblingIds.length > 0 ? [...new Set(siblingIds)] : [planId];
  const ordered = [...siblings].sort((a, b) => a.localeCompare(b));
  const rank = Math.max(0, ordered.indexOf(planId));
  const rotation = hashId(ordered.join("|")) % pool.length;
  return pool[(rotation + rank) % pool.length];
}
