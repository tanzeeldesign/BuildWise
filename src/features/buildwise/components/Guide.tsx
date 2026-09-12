import { ArrowLeft, ArrowRight } from "lucide-react";
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
  onBack: () => void;
  openGuide: (id: TopicId) => void;
};

export function Guide({ answers, plan, topicId, onBack, openGuide }: GuideProps) {
  const topic = getTopic(topicId, answers);
  const image =
    topicId === "materials" || topicId === "design-direction" || topicId === "spatial"
      ? homeImage
      : ventilationImage;

  return (
    <main className="flex min-h-full flex-1 flex-col bg-background">
      <ScreenHeader title="Guide" onBack={onBack} />
      <article className="pb-8">
        <div className="px-5 pt-6">
          <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">{topic.label}</p>
          <h1 className="mt-3 text-balance text-3xl font-semibold leading-tight">{topic.hero}</h1>
        </div>
        <img src={image} alt={topic.cardTitle} className="mt-6 h-48 w-full object-cover" />
        <div className="plan-grid space-y-10 px-5 py-10">
          <div>
            <h2 className="text-xl font-semibold">Why this matters</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{topic.why}</p>
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">Things worth discussing</p>
            <div className="mt-4 border-t">
              {topic.discuss.map((item, i) => (
                <div key={item} className="flex items-center gap-4 border-b py-4">
                  <span className="text-xs text-primary">0{i + 1}</span>
                  <span className="text-base font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-accent px-5 py-10">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">BuildWise tip</p>
          <blockquote className="mt-4 text-balance text-2xl font-semibold leading-tight">“{topic.tip}”</blockquote>
          <div className="mt-8 flex flex-col gap-3">
            <Button size="lg" className="w-full" onClick={() => openGuide(nextTopicId(topicId, plan))}>
              Next consideration <ArrowRight />
            </Button>
            <Button variant="ghost" size="lg" className="w-full" onClick={onBack}>
              <ArrowLeft /> Back to plan
            </Button>
          </div>
        </div>
      </article>
    </main>
  );
}
