import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { asStringList } from "../answers";
import { questions, TOTAL_STEPS } from "../questions";
import type { Answers, MultiAnswerKey } from "../types";

type PlannerProps = {
  step: number;
  setStep: (n: number) => void;
  answers: Answers;
  setAnswers: (a: Answers) => void;
  onExit: () => void;
  onDone: () => void;
};

function isMultiKey(key: string): key is MultiAnswerKey {
  return key === "climate" || key === "priorities";
}

export function Planner({ step, setStep, answers, setAnswers, onExit, onDone }: PlannerProps) {
  const q = questions[step];
  if (!q) return null;

  const maxSelect = q.maxSelect ?? q.options.length;
  const selectedMulti = q.multi && isMultiKey(q.key) ? asStringList(answers[q.key]) : [];
  const selectedSingle = !q.multi && !isMultiKey(q.key) ? answers[q.key] : undefined;
  const canContinue = q.multi ? selectedMulti.length > 0 : Boolean(selectedSingle);

  const chooseSingle = (value: string) => {
    setAnswers({ ...answers, [q.key]: value });
  };

  const toggleMulti = (value: string) => {
    if (!isMultiKey(q.key)) return;
    const current = asStringList(answers[q.key]);
    if (current.includes(value)) {
      setAnswers({ ...answers, [q.key]: current.filter((v) => v !== value) });
      return;
    }
    if (current.length >= maxSelect) return;
    setAnswers({ ...answers, [q.key]: [...current, value] });
  };

  return (
    <main className="bw-page plan-grid">
      <header className="sticky top-0 z-20 flex items-center justify-between bg-background/90 px-5 py-3 backdrop-blur-xl">
        <p className="text-sm font-semibold tracking-tight">BuildWise</p>
        <button
          type="button"
          onClick={onExit}
          aria-label="Close planner"
          className="grid size-10 place-items-center rounded-full border border-border bg-card shadow-sm transition-colors hover:bg-muted active:scale-95"
        >
          <X className="size-4" />
        </button>
      </header>
      <div className="bw-pad-x pt-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="tabular-nums tracking-tight">
            {String(step + 1).padStart(2, "0")}/{String(TOTAL_STEPS).padStart(2, "0")}
          </span>
          <span className="tabular-nums text-muted-foreground">
            {Math.round(((step + 1) / TOTAL_STEPS) * 100)}%
          </span>
        </div>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-border/80"
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
      <section key={step} className="reveal-up flex flex-1 flex-col bw-pad-x pb-28 pt-8">
        <h1 className="bw-title">{q.title}</h1>
        <p className="bw-body mt-3">{q.text}</p>
        {q.multi && (
          <p className="mt-3 text-sm font-medium text-primary">
            {selectedMulti.length} of {maxSelect} selected
          </p>
        )}
        <div className="mt-6 grid gap-3">
          {q.options.map((opt) => {
            const active = q.multi
              ? selectedMulti.includes(opt.value)
              : selectedSingle === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => (q.multi ? toggleMulti(opt.value) : chooseSingle(opt.value))}
                className={`bw-press flex min-h-[84px] items-center justify-between gap-3 rounded-2xl border p-4 text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "border-primary bg-accent shadow-[0_0_0_1px_var(--primary)]"
                    : "border-border bg-card hover:border-foreground/20"
                }`}
              >
                <div>
                  <h2 className="text-base font-semibold tracking-tight">{opt.value}</h2>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">
                    {opt.description}
                  </p>
                </div>
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full border transition-colors ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background"
                  }`}
                >
                  {active && <Check className="size-4" />}
                </span>
              </button>
            );
          })}
        </div>
      </section>
      <footer className="sticky bottom-0 z-20 flex items-center justify-between gap-3 border-t border-border/50 bg-background/95 px-5 py-3 backdrop-blur-xl pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button variant="ghost" className="rounded-2xl" onClick={() => (step === 0 ? onExit() : setStep(step - 1))}>
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
