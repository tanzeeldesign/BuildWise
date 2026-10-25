import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LayoutTemplate,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import floorPlanCardImage from "@/assets/floor-plan.png";
import homeImage from "@/assets/buildwise-home.jpg";
import ventilationImage from "@/assets/buildwise-ventilation.jpg";
import { hasCompletedPlan } from "../answers";
import { isTopicComplete, planProgress } from "../plans";
import { buildPlan } from "../recommendations";
import { topicVisual } from "../topicVisual";
import type { BuiltPlan, HomePlan, PlanTabMode, TopicId } from "../types";
import { FloorPlanViewer } from "./FloorPlanViewer";
import { NamePlan } from "./NamePlan";
import { PlanProgressCard } from "./PlanProgressCard";
type PlanHubProps = {
  mode: PlanTabMode;
  plans: HomePlan[];
  activePlan: HomePlan | null;
  built: BuiltPlan | null;
  onOpenPlan: (planId: string) => void;
  onBackToList: () => void;
  onStartNewPlan: (name: string) => void;
  onContinuePlan: (planId: string) => void;
  onEditAnswers: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  onOpenGuide: (id: TopicId) => void;
  onOpenFinalPlan: () => void;
};

function heroFor(id: TopicId) {
  return id === "materials" || id === "design-direction" || id === "spatial"
    ? homeImage
    : ventilationImage;
}

function profileChips(strip: string) {
  return strip
    .split("·")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatUpdated(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function PlansList({
  plans,
  onOpenPlan,
  onContinuePlan,
  onStartNewPlan,
}: {
  plans: HomePlan[];
  onOpenPlan: (planId: string) => void;
  onContinuePlan: (planId: string) => void;
  onStartNewPlan: (name: string) => void;
}) {
  const [naming, setNaming] = useState(false);

  if (naming) {
    return (
      <NamePlan
        onBack={() => setNaming(false)}
        onConfirm={(name) => {
          setNaming(false);
          onStartNewPlan(name);
        }}
      />
    );
  }

  return (
    <main className="bw-page fade-in relative bg-transparent">
      <div className={`bw-pad-x relative z-10 pt-8 ${plans.length === 0 ? "pb-4" : ""}`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="bw-title">Your Home Plans</h1>
            <p className="bw-body mt-3 max-w-[34ch]">
              Separate plans for each city, plot, or project.
            </p>
          </div>
        </div>

        {plans.length === 0 ? (
          <>
            <div className="bw-card mt-6 border-dashed py-5">
              <p className="font-semibold leading-none tracking-tight">No plans yet</p>
              <p className="bw-body mt-2">Start your first plan when you’re ready.</p>
            </div>
            <Button
              size="lg"
              className="mt-4 w-full leading-none"
              onClick={() => setNaming(true)}
            >
              Create New Plan
            </Button>
          </>
        ) : (
          <Button
            size="lg"
            className="mt-6 w-full leading-none"
            onClick={() => setNaming(true)}
          >
            Create New Plan
          </Button>
        )}
      </div>

      {plans.length > 0 && (
        <div className="bw-pad-x relative z-10 mt-7 flex flex-col gap-4 pb-4">
          {plans.map((plan) => {
            const progress = planProgress(plan);
            return (
              <PlanProgressCard
                key={plan.id}
                plan={plan}
                progress={progress}
                siblingPlanIds={plans.map((p) => p.id)}
                updatedLabel={plan.updatedAt ? formatUpdated(plan.updatedAt) : undefined}
                onClick={() =>
                  progress.unlocked ? onOpenPlan(plan.id) : onContinuePlan(plan.id)
                }
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

function PlanDetail({
  plan,
  built,
  onBackToList,
  onEditAnswers,
  onDeletePlan,
  onContinuePlan,
  onOpenGuide,
  onOpenFinalPlan,
}: {
  plan: HomePlan;
  built: BuiltPlan;
  onBackToList: () => void;
  onEditAnswers: (planId: string) => void;
  onDeletePlan: (planId: string) => void;
  onContinuePlan: (planId: string) => void;
  onOpenGuide: (id: TopicId) => void;
  onOpenFinalPlan: () => void;
}) {
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);
  const unlocked = hasCompletedPlan(plan.answers);
  const progress = planProgress(plan);
  const rest = built.topics;
  const spotlightVisual = topicVisual[built.topTopicId];
  const SpotlightIcon = spotlightVisual.icon;
  const chips = profileChips(built.profileStrip);
  const topDone = isTopicComplete(plan, built.topTopicId);

  if (!unlocked) {
    return (
      <main className="bw-page fade-in relative bg-transparent pb-4">
        <div className="bw-pad-x relative z-10 pt-6">
          <button
            type="button"
            onClick={onBackToList}
            aria-label="Back to all plans"
            className="bw-back"
          >
            <ArrowLeft className="size-[18px]" strokeWidth={2} />
          </button>
          <h1 className="bw-title mt-4">{plan.name}</h1>
          <p className="bw-body mt-3">
            Finish the questions to unlock recommendations.
          </p>

          <div className="bw-card mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">Progress</span>
              <span className="font-semibold tabular-nums text-primary">{progress.percent}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max(progress.percent, progress.filled ? 6 : 0)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{progress.detailLabel}</p>
          </div>

          <div className="bw-cta mt-8">
            <Button size="lg" className="w-full" onClick={() => onContinuePlan(plan.id)}>
              Continue <ArrowRight />
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => onEditAnswers(plan.id)}>
              <Pencil className="size-4" /> Edit answers
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="w-full text-red-800 hover:bg-red-50 hover:text-red-900"
              onClick={() => onDeletePlan(plan.id)}
            >
              <Trash2 className="size-4" /> Delete plan
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bw-page fade-in relative bg-transparent pb-4">
      <div className="relative z-10 min-w-0 max-w-full">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-0 size-48 rounded-full bg-accent/50 blur-3xl"
      />

      <div className="bw-pad-x relative min-w-0 max-w-full pt-6">
        <button
          type="button"
          onClick={onBackToList}
          aria-label="Back to all plans"
          className="bw-back"
        >
          <ArrowLeft className="size-[18px]" strokeWidth={2} />
        </button>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="bw-title">{plan.name}</h1>
          </div>
          <div className="mt-2 shrink-0 text-right">
            <p className="text-xs font-semibold tabular-nums tracking-tight text-muted-foreground">
              {String(progress.guidesDone).padStart(2, "0")}/
              {String(progress.guidesTotal).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[10px] font-medium tracking-wide text-muted-foreground">
              Completion
            </p>
          </div>
        </div>

        <div className="bw-card mt-4 py-3.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-muted-foreground">{progress.detailLabel}</span>
            <span className="font-semibold tabular-nums text-primary">{progress.percent}%</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.max(progress.percent, progress.filled ? 6 : 0)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips.map((chip) => (
            <span
              key={chip}
              className="shrink-0 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-sm"
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={() => onEditAnswers(plan.id)}
          >
            <Pencil className="size-4" /> Edit answers
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="shrink-0 px-4 text-red-800 hover:bg-red-50 hover:text-red-900"
            aria-label="Delete plan"
            onClick={() => onDeletePlan(plan.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenGuide(built.topTopicId)}
        className="bw-press bw-pad-x relative mt-6 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <article className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_12px_40px_-18px_rgba(42,38,32,0.35)]">
          <div className="relative h-44 overflow-hidden">
            <img
              src={heroFor(built.topTopicId)}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                <Sparkles className="size-3.5" />
                Start here
              </span>
              {topDone && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1.5 text-[11px] font-bold text-primary-foreground shadow-sm">
                  <Check className="size-3.5" strokeWidth={3} /> Done
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-background/65">
                  Top pick
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-background">
                  {built.topTitle}
                </h2>
              </div>
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-2xl border backdrop-blur-md ${
                  topDone
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-background/20 bg-background/15 text-background"
                }`}
              >
                {topDone ? <Check className="size-5" strokeWidth={2.5} /> : <SpotlightIcon className="size-5" />}
              </span>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm leading-snug text-muted-foreground">{built.topSummary}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              {topDone ? "Review again" : "Dive in"} <ArrowRight className="size-4" />
            </span>
          </div>
        </article>
      </button>

      <button
        type="button"
        onClick={() => setFloorPlanOpen(true)}
        className="bw-press bw-pad-x relative mt-4 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <article className="relative overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-[0_12px_40px_-18px_rgba(42,38,32,0.35)]">
          <div className="relative h-44 overflow-hidden bg-muted">
            <img
              src={floorPlanCardImage}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/25 to-transparent" />
            <div className="absolute left-4 top-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                <LayoutTemplate className="size-3.5" />
                Layout
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-background/65">
                  Visual
                </p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-background">
                  Floor Plan
                </h2>
              </div>
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-background/20 bg-background/15 text-background backdrop-blur-md">
                <LayoutTemplate className="size-5" />
              </span>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm leading-snug text-muted-foreground">
              A sample layout to discuss rooms, kitchen flow, and outdoor living with your
              architect before walls go up.
            </p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              View plan <ArrowRight className="size-4" />
            </span>
          </div>
        </article>
      </button>

      <FloorPlanViewer open={floorPlanOpen} onClose={() => setFloorPlanOpen(false)} />

      <div className="bw-pad-x mt-5">
        <Button variant="outline" size="lg" className="w-full" onClick={onOpenFinalPlan}>
          Share Plan <ArrowRight />
        </Button>
      </div>

      <div className="bw-pad-x mt-8 min-w-0 max-w-full">
        <h2 className="text-lg font-semibold tracking-tight">Jump to Guide Page</h2>
        <p className="mt-1 text-xs text-muted-foreground">Tap a card to open it.</p>

        <div className="mt-4 flex flex-col gap-3">
          {rest.map((topic, index) => {
            const visual = topicVisual[topic.id];
            const Icon = visual.icon;
            const done = isTopicComplete(plan, topic.id);
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onOpenGuide(topic.id)}
                className={`bw-press group relative w-full overflow-hidden rounded-[1.35rem] border bg-card text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  done ? "border-primary/35" : "border-border"
                }`}
                style={{
                  animation: "reveal-up 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both",
                  animationDelay: `${80 + index * 70}ms`,
                }}
              >
                <div
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${visual.tint}`}
                />
                <div className={`absolute -right-6 -top-6 size-24 rounded-full ${visual.glow} blur-xl`} />
                <div className="relative flex items-start gap-3.5 p-4 pl-5">
                  <div
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : `bg-gradient-to-br ${visual.tint}`
                    }`}
                  >
                    {done ? (
                      <Check className="size-5" strokeWidth={2.5} />
                    ) : (
                      <Icon className="size-5" strokeWidth={1.9} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${visual.chip}`}
                      >
                        {topic.number}
                      </span>
                      {done ? (
                        <span className="text-[11px] font-bold text-primary">Reviewed</span>
                      ) : (
                        <span className="truncate text-[11px] font-medium text-muted-foreground">
                          {topic.label}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 text-[1.05rem] font-semibold tracking-tight">
                      {topic.cardTitle}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {topic.blurb}
                    </p>
                  </div>
                  <span
                    className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full border ${
                      done
                        ? "border-primary/30 bg-accent text-primary"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="size-4" strokeWidth={2.5} /> : <ArrowRight className="size-4" />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {built.topics.map((topic) => {
            const visual = topicVisual[topic.id];
            const Icon = visual.icon;
            const isTop = topic.id === built.topTopicId;
            const done = isTopicComplete(plan, topic.id);
            return (
              <button
                key={`chip-${topic.id}`}
                type="button"
                onClick={() => onOpenGuide(topic.id)}
                className={`bw-press inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${
                  done
                    ? "border-primary/30 bg-accent text-primary"
                    : isTop
                      ? "border-primary/30 bg-card text-primary shadow-sm"
                      : "border-border bg-card shadow-sm"
                }`}
              >
                {done ? <Check className="size-3.5" strokeWidth={2.5} /> : <Icon className="size-3.5" />}
                {topic.title}
              </button>
            );
          })}
        </div>
      </div>
      </div>
    </main>
  );
}

export function PlanHub({
  mode,
  plans,
  activePlan,
  built,
  onOpenPlan,
  onBackToList,
  onStartNewPlan,
  onContinuePlan,
  onEditAnswers,
  onDeletePlan,
  onOpenGuide,
  onOpenFinalPlan,
}: PlanHubProps) {
  if (mode === "detail" && activePlan) {
    const planBuilt = built ?? buildPlan(activePlan.answers);
    return (
      <PlanDetail
        plan={activePlan}
        built={planBuilt}
        onBackToList={onBackToList}
        onEditAnswers={onEditAnswers}
        onDeletePlan={onDeletePlan}
        onContinuePlan={onContinuePlan}
        onOpenGuide={onOpenGuide}
        onOpenFinalPlan={onOpenFinalPlan}
      />
    );
  }

  return (
    <PlansList
      plans={plans}
      onOpenPlan={onOpenPlan}
      onContinuePlan={onContinuePlan}
      onStartNewPlan={onStartNewPlan}
    />
  );
}
