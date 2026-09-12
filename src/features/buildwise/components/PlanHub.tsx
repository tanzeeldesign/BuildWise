import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import homeImage from "@/assets/buildwise-home.jpg";
import ventilationImage from "@/assets/buildwise-ventilation.jpg";
import type { BuiltPlan, TopicId } from "../types";

type PlanHubProps = {
  plan: BuiltPlan;
  hasPlan: boolean;
  onStartPlanning: () => void;
  onOpenGuide: (id: TopicId) => void;
  onOpenFinalPlan: () => void;
};

function heroFor(id: TopicId) {
  return id === "materials" || id === "design-direction" ? homeImage : ventilationImage;
}

export function PlanHub({ plan, hasPlan, onStartPlanning, onOpenGuide, onOpenFinalPlan }: PlanHubProps) {
  if (!hasPlan) {
    return (
      <main className="flex min-h-full flex-1 flex-col bg-background px-5 pb-6 pt-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Plan</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">No plan yet.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Answer a short set of questions to unlock recommendations on orientation, ventilation, light, materials and more.
        </p>
        <Button size="lg" className="mt-auto w-full" onClick={onStartPlanning}>
          Start planning <ArrowRight />
        </Button>
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-1 flex-col bg-background pb-6">
      <div className="border-b px-5 pb-6 pt-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Plan</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">Your home plan is taking shape.</h1>
        <p className="mt-3 text-sm font-medium">{plan.profileStrip}</p>
      </div>

      <article className="mx-5 mt-6 overflow-hidden bg-foreground text-background">
        <img
          src={heroFor(plan.topTopicId)}
          alt=""
          className="h-40 w-full object-cover"
          loading="lazy"
        />
        <div className="p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-background/55">Top consideration</p>
          <h2 className="mt-3 text-2xl font-semibold">{plan.topTitle}</h2>
          <p className="mt-3 text-sm leading-6 text-background/65">{plan.topSummary}</p>
          <Button variant="secondary" size="lg" className="mt-5 w-full" onClick={() => onOpenGuide(plan.topTopicId)}>
            Explore <ArrowRight />
          </Button>
        </div>
      </article>

      <div className="mt-8 px-5">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-semibold">Considerations</h2>
          <span className="text-xs text-muted-foreground">{String(plan.topics.length).padStart(2, "0")} areas</span>
        </div>
        <div className="mt-4 space-y-px border bg-border">
          {plan.topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => onOpenGuide(topic.id)}
              className="flex w-full items-start justify-between gap-3 bg-background p-4 text-left transition-colors hover:bg-accent"
            >
              <div>
                <span className="text-xs text-primary">{topic.number}</span>
                <h3 className="mt-2 text-lg font-semibold">{topic.cardTitle}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{topic.blurb}</p>
              </div>
              <ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
        <Button variant="outline" size="lg" className="mt-6 w-full" onClick={onOpenFinalPlan}>
          Shareable plan <ArrowRight />
        </Button>
      </div>
    </main>
  );
}
