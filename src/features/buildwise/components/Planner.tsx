import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { questions, TOTAL_STEPS } from "../questions";
import type { Answers } from "../types";

type PlannerProps = {
  step: number;
  setStep: (n: number) => void;
  answers: Answers;
  setAnswers: (a: Answers) => void;
  onExit: () => void;
  onDone: () => void;
};

export function Planner({ step, setStep, answers, setAnswers, onExit, onDone }: PlannerProps) {
  const q = questions[step];
  if (!q) return null;

  const maxSelect = q.maxSelect ?? 3;
  const selectedSingle = q.key === "priorities" ? undefined : answers[q.key];
  const selectedMulti = answers.priorities ?? [];
  const canContinue = q.multi ? selectedMulti.length > 0 : Boolean(selectedSingle);

  const chooseSingle = (value: string) => {
    setAnswers({ ...answers, [q.key]: value });
  };

  const toggleMulti = (value: string) => {
    const current = answers.priorities ?? [];
    if (current.includes(value)) {
      setAnswers({ ...answers, priorities: current.filter((v) => v !== value) });
      return;
    }
    if (current.length >= maxSelect) return;
    setAnswers({ ...answers, priorities: [...current, value] });
  };

  return (
    <main className="plan-grid flex min-h-full flex-1 flex-col bg-background">
      <header className="flex items-center justify-between px-4 py-3">
        <p className="text-sm font-semibold">BuildWise</p>
        <button
          type="button"
          onClick={onExit}
          aria-label="Close planner"
          className="grid size-10 place-items-center border transition-colors hover:bg-muted"
        >
          <X className="size-4" />
        </button>
      </header>
      <div className="px-5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span>
            Step {String(step + 1).padStart(2, "0")} of {String(TOTAL_STEPS).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground">{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div className="mt-3 h-px bg-border">
          <div
            className="h-[3px] bg-primary transition-all duration-700"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
      <section key={step} className="reveal-up flex flex-1 flex-col px-5 pb-28 pt-8">
        <h1 className="text-balance text-3xl font-semibold leading-tight">{q.title}</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{q.text}</p>
        {q.multi && (
          <p className="mt-3 text-sm font-medium text-primary">
            {selectedMulti.length} of {maxSelect} selected
          </p>
        )}
        <div className="mt-6 grid gap-3">
          {q.options.map((opt) => {
            const active = q.multi ? selectedMulti.includes(opt.value) : selectedSingle === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => (q.multi ? toggleMulti(opt.value) : chooseSingle(opt.value))}
                className={`flex min-h-20 items-center justify-between border p-4 text-left transition-all ${
                  active ? "border-primary bg-accent" : "bg-card"
                }`}
              >
                <div>
                  <h2 className="text-base font-semibold">{opt.value}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{opt.description}</p>
                </div>
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full border ${
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {active && <Check className="size-4" />}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <footer className="sticky bottom-0 z-20 flex items-center justify-between gap-3 border-t bg-background/95 px-4 py-3 backdrop-blur">
        <Button variant="ghost" onClick={() => (step === 0 ? onExit() : setStep(step - 1))}>
          <ArrowLeft /> Back
        </Button>
        <Button
          disabled={!canContinue}
          onClick={() => (step === TOTAL_STEPS - 1 ? onDone() : setStep(step + 1))}
        >
          Continue <ArrowRight />
        </Button>
      </footer>
    </main>
  );
}
