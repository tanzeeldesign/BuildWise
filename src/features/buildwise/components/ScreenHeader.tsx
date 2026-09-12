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
      className={`flex h-14 shrink-0 items-center justify-between gap-3 border-b px-4 ${
        inverse ? "border-background/15 bg-foreground text-background" : "bg-background"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className={`grid size-10 place-items-center rounded-md transition-colors ${
              inverse ? "hover:bg-background/10" : "hover:bg-muted"
            }`}
          >
            <ArrowLeft className="size-5" />
          </button>
        )}
        {title && <h1 className="truncate text-base font-semibold">{title}</h1>}
      </div>
      {right}
    </header>
  );
}
