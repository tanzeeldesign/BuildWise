import { useEffect, useState } from "react";

type ProcessingProps = {
  onDone: () => void;
};

export function Processing({ onDone }: ProcessingProps) {
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const tick = window.setInterval(() => {
      setProgress((p) => Math.min(p + 12, 100));
    }, 220);
    const done = window.setTimeout(onDone, 2600);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <main className="plan-grid flex min-h-full flex-1 flex-col items-center justify-center bg-background px-5">
      <div className="reveal-up w-full">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">BuildWise</p>
        <h1 className="mt-6 text-balance text-3xl font-semibold leading-tight">
          Building your personalized recommendations…
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Shaping a dummy guide from your location, climate, lifestyle and priorities.
        </p>
        <div className="mt-10 h-px bg-border">
          <div className="h-[3px] bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-4 text-xs font-semibold text-muted-foreground">{progress}%</p>
      </div>
    </main>
  );
}
