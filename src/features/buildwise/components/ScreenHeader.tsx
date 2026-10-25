import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

type ScreenHeaderProps = {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  inverse?: boolean;
};

export function ScreenHeader({ title, onBack, right, inverse }: ScreenHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b px-5 backdrop-blur-xl ${
        inverse
          ? "border-background/15 bg-foreground/90 text-background"
          : "border-border/80 bg-background/90"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className={`bw-back ${
              inverse
                ? "border-background/25 bg-background/10 text-background hover:bg-background/15"
                : ""
            }`}
          >
            <ArrowLeft className="size-[18px]" strokeWidth={2} />
          </button>
        )}
        {title && (
          <h1 className="truncate text-lg font-bold leading-tight tracking-tight">{title}</h1>
        )}
      </div>
      {right}
    </header>
  );
}
