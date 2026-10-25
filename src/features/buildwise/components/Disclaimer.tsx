import { Button } from "@/components/ui/button";
import { ScreenHeader } from "./ScreenHeader";

type DisclaimerProps = {
  onBack: () => void;
};

export function Disclaimer({ onBack }: DisclaimerProps) {
  return (
    <main className="bw-page fade-in">
      <ScreenHeader title="Disclaimer" onBack={onBack} />
      <section className="bw-pad-x flex flex-1 flex-col pb-10 pt-6">
        <h1 className="bw-title">Please note</h1>

        <div className="mt-6 space-y-4 text-[15px] leading-[1.4] text-muted-foreground">
          <p>
            BuildWise is a <strong className="font-bold text-foreground">prototype</strong>.
            Recommendations are illustrative — not verified engineering or climate data.
          </p>
          <p>
            This guide does <strong className="font-bold text-foreground">not replace</strong>{" "}
            professional architectural or engineering advice.
          </p>
          <p>Focused on homes in selected Pakistani cities.</p>
          <p>Your answers stay on this device. Nothing is sent to a server.</p>
        </div>

        <div className="mt-auto pt-10">
          <Button className="w-full" size="lg" onClick={onBack}>
            Got it
          </Button>
        </div>
      </section>
    </main>
  );
}
