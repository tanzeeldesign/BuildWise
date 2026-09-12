import { Button } from "@/components/ui/button";
import { ScreenHeader } from "./ScreenHeader";

type DisclaimerProps = {
  onBack: () => void;
};

export function Disclaimer({ onBack }: DisclaimerProps) {
  return (
    <main className="flex min-h-full flex-1 flex-col bg-background">
      <ScreenHeader title="Disclaimer" onBack={onBack} />
      <section className="flex-1 px-5 py-8">
        <h1 className="text-3xl font-semibold">Please note</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
          <p>
            BuildWise is a <strong className="font-semibold text-foreground">prototype</strong>. Recommendations are
            illustrative dummy content — not verified engineering or climate data.
          </p>
          <p>
            This guide does <strong className="font-semibold text-foreground">not replace</strong> professional
            architectural, structural or engineering consultation.
          </p>
          <p>Focused on residential use in selected Pakistani cities, with limited geographic coverage.</p>
          <p>Your answers and account stay on this device for this demo. Nothing is sent to a server.</p>
        </div>
        <Button className="mt-10 w-full" size="lg" onClick={onBack}>
          Got it
        </Button>
      </section>
    </main>
  );
}
