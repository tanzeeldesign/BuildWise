import { ArrowRight, Check, Home, Sparkles } from "lucide-react";
import { planHeroImage } from "../planImages";
import type { PlanProgress } from "../plans";
import type { HomePlan } from "../types";

type PlanProgressCardProps = {
  plan: HomePlan;
  progress: PlanProgress;
  /** Other plan ids in the same list — used to keep hero images unique. */
  siblingPlanIds?: string[];
  updatedLabel?: string;
  onClick: () => void;
};

export function PlanProgressCard({
  plan,
  progress,
  siblingPlanIds,
  updatedLabel,
  onClick,
}: PlanProgressCardProps) {
  const detail =
    updatedLabel && updatedLabel.length > 0
      ? `${progress.detailLabel} · ${updatedLabel}`
      : progress.detailLabel;
  const cta = progress.unlocked ? "Open Plan" : "Continue";
  const heroSrc = planHeroImage(plan.id, siblingPlanIds);

  return (
    <button
      type="button"
      onClick={onClick}
      className="bw-press w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <article className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_12px_40px_-18px_rgba(42,38,32,0.35)]">
        <div className="relative h-44 overflow-hidden bg-muted">
          <img
            src={heroSrc}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                progress.complete
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/95 text-primary"
              }`}
            >
              {progress.complete ? (
                <Check className="size-3.5" strokeWidth={3} />
              ) : (
                <Sparkles className="size-3.5" />
              )}
              {progress.statusLabel}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <h2 className="min-w-0 truncate text-2xl font-semibold tracking-tight text-background">
              {plan.name}
            </h2>
            <span
              className={`grid size-12 shrink-0 place-items-center rounded-2xl border backdrop-blur-md ${
                progress.complete
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-background/20 bg-background/15 text-background"
              }`}
            >
              {progress.complete ? (
                <Check className="size-5" strokeWidth={2.5} />
              ) : (
                <Home className="size-5" />
              )}
            </span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm leading-snug text-muted-foreground">{detail}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${Math.max(progress.percent, progress.filled ? 6 : 0)}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              {progress.percent}% complete
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              {cta} <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </article>
    </button>
  );
}
