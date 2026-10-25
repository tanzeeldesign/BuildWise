import { useState } from "react";
import { ArrowRight, CheckCircle2, ClipboardList, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { planProgress } from "../plans";
import type { HomePlan, Session } from "../types";
import { NamePlan } from "./NamePlan";
import { PlanProgressCard } from "./PlanProgressCard";
type HomeProps = {
  session: Session;
  focusPlan: HomePlan | null;
  planCount: number;
  completedCount: number;
  onOpenPlan: (planId: string) => void;
  onContinuePlan: (planId: string) => void;
  onStartNewPlan: (name: string) => void;
  onBrowsePlans: () => void;
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
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

export function Home({
  session,
  focusPlan,
  planCount,
  completedCount,
  onOpenPlan,
  onContinuePlan,
  onStartNewPlan,
  onBrowsePlans,
}: HomeProps) {
  const [naming, setNaming] = useState(false);
  const firstName = session.name.split(" ")[0] || session.name;
  const hello = greeting();
  const progress = focusPlan ? planProgress(focusPlan) : null;

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
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-10 z-[1] size-56 rounded-full bg-accent/55 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-24 z-[1] size-44 rounded-full bg-[#F3E4C0]/55 blur-3xl"
      />

      <div className="bw-pad-x relative z-10 pt-8">
        <h1 className="bw-title">
          {hello}, {firstName}!
        </h1>
        <p className="bw-body mt-3 max-w-[34ch]">
          Pick up where you left off, or start a new plan.
        </p>
      </div>

      <div className="bw-pad-x relative z-10 mt-7 grid grid-cols-2 gap-3">
        <div className="bw-card py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground">
              <ClipboardList className="size-4" strokeWidth={2} aria-hidden />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Plans
            </p>
          </div>
          <p className="mt-2 text-right text-2xl font-semibold tabular-nums tracking-tight">
            {planCount}
          </p>
        </div>
        <div className="bw-card py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-accent text-primary">
              <CheckCircle2 className="size-4" strokeWidth={2} aria-hidden />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Complete
            </p>
          </div>
          <p className="mt-2 text-right text-2xl font-semibold tabular-nums tracking-tight text-primary">
            {completedCount}
          </p>
        </div>
      </div>

      <section className="bw-pad-x relative z-10 mt-7">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Current Plan Progress</h2>
          {planCount > 0 && (
            <button
              type="button"
              onClick={onBrowsePlans}
              className="text-xs font-semibold text-primary"
            >
              All plans
            </button>
          )}
        </div>

        {!focusPlan || !progress ? (
          <div className="bw-card mt-3 border-dashed">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-muted text-muted-foreground">
                <Sparkles className="size-5 shrink-0" strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="font-semibold tracking-tight">No plans yet</p>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">
                  Your progress will show up here once you start.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-3">
            <PlanProgressCard
              plan={focusPlan}
              progress={progress}
              updatedLabel={
                focusPlan.updatedAt ? `Updated ${formatUpdated(focusPlan.updatedAt)}` : undefined
              }
              onClick={() =>
                progress.unlocked ? onOpenPlan(focusPlan.id) : onContinuePlan(focusPlan.id)
              }
            />
          </div>
        )}
      </section>

      <section className="bw-pad-x relative z-10 mt-8 pb-4">
        <h2 className="text-lg font-semibold tracking-tight">What next?</h2>
        <div className="mt-3 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setNaming(true)}
            className="bw-press flex w-full items-center gap-4 rounded-[1.35rem] border border-border bg-card p-4 text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Plus className="size-5" strokeWidth={2.25} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold tracking-tight">Start a New Plan</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                For another home, plot, or city.
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          </button>

          {planCount > 0 && (
            <Button variant="outline" size="lg" className="w-full" onClick={onBrowsePlans}>
              Browse plans
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
