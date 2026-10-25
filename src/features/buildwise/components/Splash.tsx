import { useEffect } from "react";
import { Leaf } from "lucide-react";

type SplashProps = {
  onContinue: () => void;
};

export function Splash({ onContinue }: SplashProps) {
  useEffect(() => {
    const id = window.setTimeout(onContinue, 3000);
    return () => window.clearTimeout(id);
  }, [onContinue]);

  return (
    <main className="bw-page plan-grid items-center justify-center px-6">
      <div className="reveal-up flex flex-col items-center text-center">
        <span className="grid size-16 place-items-center rounded-2xl border border-primary/40 bg-card text-primary shadow-sm">
          <Leaf className="size-7" strokeWidth={1.75} />
        </span>
        <h1 className="mt-7 text-[2.35rem] font-semibold tracking-tight">BuildWise</h1>
        <p className="bw-eyebrow mt-4">Smarter homes for Pakistan</p>
      </div>
    </main>
  );
}
