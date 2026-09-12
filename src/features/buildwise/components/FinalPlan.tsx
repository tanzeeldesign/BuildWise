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
      setStatus(result === "shared" ? "Shared with your device share sheet." : "Plan copied to clipboard.");
    } catch {
      setStatus("Could not share — try Save my plan instead.");
    }
  };

  const onSave = () => {
    downloadPlanText(plan.planText);
    setStatus("Downloaded buildwise-plan.txt");
  };

  return (
    <main className="flex min-h-full flex-1 flex-col bg-foreground text-background">
      <ScreenHeader title="Your plan" onBack={onBack} inverse />
      <section className="plan-grid flex-1 px-5 py-8">
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-background/55">BuildWise</p>
        <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight">Your smarter home starts here.</h1>
        <p className="mt-4 text-sm text-background/60">A personalized planning guide based on your priorities.</p>
        <div className="mt-10">
          <p className="text-sm text-background/60">{plan.discussList.length} things to discuss before you build</p>
          <div className="mt-4 border-t border-background/20">
            {plan.discussList.map((label, i) => (
              <div key={label} className="flex items-center gap-4 border-b border-background/20 py-5">
                <span className="w-8 text-xs text-background/45">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="text-xl font-semibold">{label}</h2>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3">
          <Button variant="secondary" size="lg" className="w-full" onClick={onShare}>
            Share with your architect <ArrowRight />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-background hover:bg-background/10 hover:text-background"
            onClick={onSave}
          >
            Save my plan
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
        {status && <p className="mt-4 text-sm text-background/70">{status}</p>}
      </section>
    </main>
  );
}
