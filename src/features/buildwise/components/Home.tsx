import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ventilationImage from "@/assets/buildwise-ventilation.jpg";
import type { BuiltPlan, Session, TopicId } from "../types";

type HomeProps = {
  session: Session;
  plan: BuiltPlan;
  hasPlan: boolean;
  onStartPlanning: () => void;
  onOpenPlan: () => void;
  onOpenGuide: (id: TopicId) => void;
};

export function Home({ session, plan, hasPlan, onStartPlanning, onOpenPlan, onOpenGuide }: HomeProps) {
  const firstName = session.name.split(" ")[0] || session.name;

  if (!hasPlan) {
    return (
      <main className="flex min-h-full flex-1 flex-col bg-background px-5 pb-6 pt-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Home</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight">Good morning, {firstName}.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Your smarter home plan starts with a few focused questions about place, climate and how you live.
        </p>
        <div className="mt-8 space-y-3">
          {(
            [
              ["01", "Tell us about home", "Location, plot and lifestyle."],
              ["02", "See what matters", "Dummy recommendations shaped for you."],
              ["03", "Share with confidence", "A guide for your architect."],
            ] as const
          ).map(([n, t, d]) => (
            <div key={n} className="border bg-card p-4">
              <span className="text-xs text-primary">{n}</span>
              <h2 className="mt-3 text-lg font-semibold">{t}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <Button size="lg" className="mt-auto w-full" onClick={onStartPlanning}>
          Start planning <ArrowRight />
        </Button>
      </main>
    );
  }

  return (
    <main className="flex min-h-full flex-1 flex-col bg-background pb-6">
      <div className="px-5 pt-8">
        <p className="text-sm text-muted-foreground">Good morning, {firstName}.</p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight">Your plan is taking shape.</h1>
        <p className="mt-3 text-sm font-medium">{plan.profileStrip}</p>
        <div className="mt-4 inline-flex items-center rounded-full border border-primary/30 bg-accent px-3 py-1 text-xs font-semibold text-primary">
          Plan ready
        </div>
      </div>

      <button
        type="button"
        onClick={() => onOpenGuide(plan.topTopicId)}
        className="mx-5 mt-8 overflow-hidden border text-left"
      >
        <img src={ventilationImage} alt="" className="h-36 w-full object-cover" />
        <div className="bg-foreground p-5 text-background">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-background/55">Top consideration</p>
          <h2 className="mt-2 text-2xl font-semibold">{plan.topTitle}</h2>
          <p className="mt-2 line-clamp-2 text-sm text-background/65">{plan.topSummary}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
            Explore <ChevronRight className="size-4" />
          </span>
        </div>
      </button>

      <div className="mt-6 flex flex-col gap-3 px-5">
        <Button size="lg" className="w-full" onClick={onOpenPlan}>
          View full plan <ArrowRight />
        </Button>
        <Button variant="outline" size="lg" className="w-full" onClick={onStartPlanning}>
          Update answers
        </Button>
      </div>
    </main>
  );
}
