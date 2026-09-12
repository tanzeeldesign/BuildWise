import { useEffect } from "react";
import { Leaf } from "lucide-react";

type SplashProps = {
  onContinue: () => void;
};

export function Splash({ onContinue }: SplashProps) {
  useEffect(() => {
    const id = window.setTimeout(onContinue, 2200);
    return () => window.clearTimeout(id);
  }, [onContinue]);

  return (
    <main className="plan-grid flex h-full min-h-full flex-1 flex-col items-center justify-center bg-background px-6">
      <div className="reveal-up flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center border border-primary text-primary">
          <Leaf className="size-6" />
        </span>
        <h1 className="mt-8 text-4xl font-semibold tracking-normal">BuildWise</h1>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
          Helping Pakistanis Build Smarter Homes
        </p>
      </div>
    </main>
  );
}
