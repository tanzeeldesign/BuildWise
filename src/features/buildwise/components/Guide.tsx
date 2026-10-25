import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import homeImage from "@/assets/buildwise-home.jpg";
import ventilationImage from "@/assets/buildwise-ventilation.jpg";
import { getTopic, nextTopicId } from "../recommendations";
import type { Answers, BuiltPlan, TopicId } from "../types";
import { ScreenHeader } from "./ScreenHeader";

type GuideProps = {
  answers: Answers;
  plan: BuiltPlan;
  topicId: TopicId;
  isComplete: boolean;
  guidesDone: number;
  guidesTotal: number;
  onToggleComplete: () => void;
  onBack: () => void;
  openGuide: (id: TopicId) => void;
};

export function Guide({
  answers,
  plan,
  topicId,
  isComplete,
  guidesDone,
  guidesTotal,
  onToggleComplete,
  onBack,
  openGuide,
}: GuideProps) {
  const topic = plan.topics.find((t) => t.id === topicId) ?? getTopic(topicId, answers);
  const topicIndex = plan.topics.findIndex((t) => t.id === topicId);
  const isFirstGuide = topicIndex <= 0;
  const isLastGuide = topicIndex >= 0 && topicIndex === plan.topics.length - 1;
  const previousTopic = !isFirstGuide ? plan.topics[topicIndex - 1] : undefined;
  const image =
    topicId === "materials" || topicId === "design-direction" || topicId === "spatial"
      ? homeImage
      : ventilationImage;

  return (
    <main className="bw-page fade-in">
      <ScreenHeader title="Guide" onBack={onBack} />
      <article className="pb-8">
        <div className="bw-pad-x pt-4">
          <div className="flex items-center justify-between gap-3">
            <p className="bw-eyebrow">{topic.label}</p>
            <p className="text-[11px] font-semibold tabular-nums text-muted-foreground">
              {String(guidesDone).padStart(2, "0")}/{String(guidesTotal).padStart(2, "0")}
            </p>
          </div>
          <h1 className="bw-title mt-3">{topic.hero}</h1>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{
                width: `${Math.max((guidesDone / Math.max(guidesTotal, 1)) * 100, guidesDone ? 6 : 0)}%`,
              }}
            />
          </div>
        </div>
        <div className="bw-pad-x mt-6">
          <img
            src={image}
            alt={topic.cardTitle}
            className="h-48 w-full rounded-2xl object-cover shadow-sm"
          />
        </div>
        <div className="plan-grid space-y-10 bw-pad-x py-10">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Why it matters</h2>
            <p className="mt-4 text-sm leading-snug text-muted-foreground">{topic.why}</p>
          </div>
          <div>
            <p className="bw-eyebrow">Discuss with your architect</p>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {topic.discuss.map((item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-4 border-b border-border px-4 py-4 last:border-b-0"
                >
                  <span className="w-6 shrink-0 text-xs font-semibold text-primary">0{i + 1}</span>
                  <span className="text-base font-semibold tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-6 rounded-3xl bg-accent px-5 py-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            BuildWise tip
          </p>
          <blockquote className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-tight">
            “{topic.tip}”
          </blockquote>
        </div>
      </article>
      <footer className="sticky bottom-0 z-20 mt-8 border-t border-border bg-background bw-pad-x pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            className="size-[52px] shrink-0"
            variant={isComplete ? "secondary" : "default"}
            aria-pressed={isComplete}
            aria-label={isComplete ? "Marked complete" : "Mark as complete"}
            onClick={onToggleComplete}
          >
            <Check className="size-5" strokeWidth={2.5} />
          </Button>
          <Button
            size="lg"
            className="flex-1"
            variant="outline"
            disabled={isFirstGuide}
            onClick={() => previousTopic && openGuide(previousTopic.id)}
          >
            <ArrowLeft /> Previous
          </Button>
          <Button
            size="lg"
            className="flex-1"
            variant="outline"
            onClick={() => (isLastGuide ? onBack() : openGuide(nextTopicId(topicId, plan)))}
          >
            {isLastGuide ? (
              "Finish"
            ) : (
              <>
                Next <ArrowRight />
              </>
            )}
          </Button>
        </div>
      </footer>
    </main>
  );
}
