import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadPlanText, sharePlanText } from "../recommendations";
import type { BuiltPlan } from "../types";
import { ScreenHeader } from "./ScreenHeader";

type FinalPlanProps = {
  plan: BuiltPlan;
  onBack: () => void;
  onDisclaimer: () => void;
};

export function FinalPlan({ plan, onBack, onDisclaimer }: FinalPlanProps) {
  const [status, setStatus] = useState<string | null>(null);

  const onShare = async () => {
    try {
      const result = await sharePlanText(plan.planText);
      setStatus(result === "shared" ? "Shared." : "Copied to clipboard.");
    } catch {
      setStatus("Couldn’t share — try Save instead.");
    }
  };

  const onSave = () => {
    downloadPlanText(plan.planText);
    setStatus("Saved buildwise-plan.txt");
  };

  return (
    <main className="bw-page fade-in bg-foreground text-background">
      <ScreenHeader title="Your plan" onBack={onBack} inverse />
      <section className="plan-grid flex-1 bw-pad-x py-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-background/55">
          BuildWise
        </p>
        <h1 className="mt-4 text-balance text-[32px] font-bold leading-[1.15] tracking-tight">
          Your smarter home starts here.
        </h1>
        <p className="mt-4 text-sm leading-snug text-background/60">
          A planning guide based on your priorities.
        </p>
        <div className="mt-10">
          <p className="text-sm text-background/60">
            {plan.discussList.length} topics to discuss
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-background/15 bg-background/5">
            {plan.discussList.map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-4 border-b border-background/15 px-4 py-5 last:border-b-0"
              >
                <span className="w-8 shrink-0 text-xs tabular-nums text-background/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-semibold tracking-tight">{label}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className="bw-cta mt-10">
          <Button variant="secondary" size="lg" className="w-full" onClick={onShare}>
            Share with architect <ArrowRight />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-background hover:bg-background/10 hover:text-background"
            onClick={onSave}
          >
            Save plan
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-background/70 hover:bg-background/10 hover:text-background"
            onClick={onDisclaimer}
          >
            Disclaimer
          </Button>
        </div>
        {status && (
          <p className="mt-4 text-sm text-background/70" role="status" aria-live="polite">
            {status}
          </p>
        )}
      </section>
    </main>
  );
}
