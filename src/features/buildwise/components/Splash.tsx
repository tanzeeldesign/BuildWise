import { useEffect } from "react";
import { Logo } from "./Logo";

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
        <Logo className="size-[140px]" />
        <p className="mt-3 text-[15px] font-semibold leading-snug tracking-[0.04em] text-foreground">
          Smarter Homes For Pakistan
        </p>
      </div>
    </main>
  );
}
