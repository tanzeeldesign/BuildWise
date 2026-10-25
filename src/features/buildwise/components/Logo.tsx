import logoSrc from "@/assets/Logo.svg";
import { cn } from "@/lib/utils";

/** Full stacked logo (icon + wordmark). Height drives scale. */
const fullSizeClass = {
  xs: "h-10 w-auto",
  sm: "h-14 w-auto",
  md: "h-20 w-auto",
  lg: "h-40 w-auto",
} as const;

/** Icon-only crop for tight rows next to a text label. */
const markSizeClass = {
  xs: "size-6",
  sm: "size-9",
  md: "size-12",
  lg: "size-16",
} as const;

type LogoSize = keyof typeof fullSizeClass;

type LogoProps = {
  /** `full` = icon + BuildWise wordmark. `mark` = icon crop for compact UI. */
  variant?: "full" | "mark";
  size?: LogoSize;
  className?: string;
  /** Hide from assistive tech when a nearby label already says BuildWise. */
  decorative?: boolean;
};

export function Logo({
  variant = "full",
  size = "md",
  className,
  decorative = false,
}: LogoProps) {
  const alt = decorative ? "" : "BuildWise";

  if (variant === "mark") {
    return (
      <span
        className={cn(
          "relative inline-block shrink-0 overflow-hidden",
          markSizeClass[size],
          className,
        )}
      >
        {/* Logo.svg is square: icon in the top ~79%, wordmark below — clip to the mark. */}
        <img
          src={logoSrc}
          alt={alt}
          aria-hidden={decorative || undefined}
          draggable={false}
          className="absolute inset-x-0 top-0 w-full max-w-none select-none object-cover object-top"
          style={{ height: "126%" }}
        />
      </span>
    );
  }

  return (
    <img
      src={logoSrc}
      alt={alt}
      aria-hidden={decorative || undefined}
      draggable={false}
      className={cn(
        "select-none object-contain object-center",
        fullSizeClass[size],
        className,
      )}
    />
  );
}
