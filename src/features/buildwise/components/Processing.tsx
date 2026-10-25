import { useEffect, useState } from "react";
import { Lottie } from "lottie-react";
import aiWorkingAnimation from "@/assets/ai-working-animation.json";

type ProcessingProps = {
  onDone: () => void;
};

const DURATION_MS = 15_000;

/** Normalized timeline: plateaus create intentional pauses between fills. */
const KEYFRAMES: { t: number; p: number }[] = [
  { t: 0, p: 0 },
  { t: 0.08, p: 12 },
  { t: 0.15, p: 12 },
  { t: 0.26, p: 28 },
  { t: 0.34, p: 28 },
  { t: 0.46, p: 45 },
  { t: 0.54, p: 45 },
  { t: 0.66, p: 62 },
  { t: 0.74, p: 62 },
  { t: 0.85, p: 81 },
  { t: 0.92, p: 81 },
  { t: 1, p: 100 },
];

function progressAt(elapsedRatio: number): number {
  const r = Math.min(1, Math.max(0, elapsedRatio));
  for (let i = 1; i < KEYFRAMES.length; i++) {
    const a = KEYFRAMES[i - 1]!;
    const b = KEYFRAMES[i]!;
    if (r <= b.t) {
      const span = b.t - a.t || 1;
      const local = (r - a.t) / span;
      return Math.round(a.p + (b.p - a.p) * local);
    }
  }
  return 100;
}

export function Processing({ onDone }: ProcessingProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const ratio = (now - started) / DURATION_MS;
      setProgress(progressAt(ratio));
      if (ratio < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setProgress(100);
      }
    };

    frame = window.requestAnimationFrame(tick);
    const done = window.setTimeout(onDone, DURATION_MS);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <main className="bw-page plan-grid items-center justify-center bw-pad-x">
      <div className="reveal-up flex w-full max-w-sm flex-col items-center text-center">
        <div className="size-16 shrink-0 overflow-hidden" aria-hidden>
          <Lottie
            src={aiWorkingAnimation}
            autoplay
            loop
            className="size-full"
          />
        </div>

        <h1 className="bw-title mt-8 max-w-[16ch]">
          BuildWise AI
          <br />
          is building for you...
        </h1>

        <p className="bw-body mt-4 max-w-[34ch]">
          Shaping a recommendation guide from your location, climate, lifestyle
          and priorities.
        </p>

        <div className="mt-12 flex w-full items-center gap-3">
          <div
            className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border/80"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Building recommendations"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
            {progress}%
          </p>
        </div>
      </div>
    </main>
  );
}
