import { Check, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_TIERS, getTier } from "../subscription";
import type { SubscriptionId, SubscriptionRecord } from "../types";
import { ScreenHeader } from "./ScreenHeader";

type ChoosePlanProps = {
  mode: "onboarding" | "settings";
  current?: SubscriptionRecord | null;
  onSelect: (tierId: SubscriptionId) => void;
  onBack?: () => void;
  onSkipFree?: () => void;
};

export function ChoosePlan({
  mode,
  current,
  onSelect,
  onBack,
  onSkipFree,
}: ChoosePlanProps) {
  const [selected, setSelected] = useState<SubscriptionId>(
    current?.tierId ?? "home-planning",
  );
  const tier = getTier(selected);
  const isCurrent = current?.tierId === selected;
  const isSettings = mode === "settings";

  return (
    <main className="bw-page fade-in">
      {isSettings && onBack ? <ScreenHeader title="Your plan" onBack={onBack} /> : null}

      <div className={`bw-pad-x ${isSettings ? "pt-1" : "pt-8"}`}>
        <h1 className="bw-title">
          {isSettings ? "Manage your package" : "Choose how to plan"}
        </h1>
        <p className="bw-body mt-3 max-w-[36ch]">
          {isSettings
            ? "Change your package anytime. Checkout is simulated in this demo."
            : "Start free, or unlock the full home planning package."}
        </p>
      </div>

      <div className="bw-pad-x mt-4 space-y-2.5" role="radiogroup" aria-label="Subscription plan">
        {SUBSCRIPTION_TIERS.map((option) => {
          const active = selected === option.id;
          const owned = current?.tierId === option.id;
          const isPaid = option.highlight;

          return (
            <div
              key={option.id}
              className={`overflow-hidden rounded-xl border-2 transition-[border-color,box-shadow,background,opacity] duration-200 ${
                active
                  ? isPaid
                    ? "border-primary bg-gradient-to-br from-primary/[0.16] via-accent/45 to-card shadow-[var(--shadow-lift)] ring-2 ring-primary/20"
                    : "border-primary bg-card shadow-[var(--shadow-soft)] ring-2 ring-primary/15"
                  : isPaid
                    ? "border-primary/25 bg-gradient-to-br from-primary/[0.05] via-accent/15 to-card opacity-80"
                    : "border-border/80 bg-card/70 opacity-75"
              }`}
            >
              <button
                type="button"
                role="radio"
                aria-checked={active}
                aria-expanded={active}
                onClick={() => setSelected(option.id)}
                className="bw-press w-full p-3 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <span
                      aria-hidden
                      className={`grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-transparent"
                      }`}
                    >
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {isPaid && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground shadow-sm">
                        <Sparkles className="size-2.5" strokeWidth={2.25} />
                        Recommended
                      </span>
                    )}
                    {active && (
                      <span className="rounded-md bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                        Selected
                      </span>
                    )}
                    {owned && !active && (
                      <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="shrink-0 text-right leading-tight">
                    <p
                      className={`tabular-nums tracking-tight ${
                        isPaid ? "text-lg font-bold text-primary" : "text-base font-semibold"
                      }`}
                    >
                      {option.priceLabel}
                    </p>
                    <p
                      className={`text-[10px] font-medium ${
                        isPaid ? "text-primary/80" : "text-muted-foreground"
                      }`}
                    >
                      {option.priceNote}
                    </p>
                  </div>
                </div>

                <p
                  className={`mt-2 leading-snug tracking-tight ${
                    isPaid ? "text-[0.95rem] font-bold" : "text-sm font-semibold"
                  }`}
                >
                  {option.name}
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">
                  {option.tagline}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
                  {option.audience}
                </p>

                <div
                  className={`mt-2 flex items-center justify-between border-t pt-2 ${
                    active ? "border-primary/25" : "border-border/70"
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${
                      active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    What’s included
                  </span>
                  <span
                    className={`grid size-6 place-items-center rounded-full transition-transform duration-200 ${
                      active
                        ? "rotate-180 bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <ChevronDown className="size-3.5" strokeWidth={2.25} />
                  </span>
                </div>
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <ul
                    className={`space-y-1.5 px-3 pb-3 ${
                      active ? "border-t border-primary/20" : "border-t border-border/60"
                    }`}
                  >
                    {option.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex gap-2 pt-1.5 text-[13px] leading-snug text-foreground"
                      >
                        <span
                          className={`mt-px grid size-4 shrink-0 place-items-center rounded-full ${
                            isPaid
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Check className="size-2.5" strokeWidth={2.5} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <footer className="sticky bottom-0 z-20 mt-5 border-t-[0.8px] border-border bg-card bw-pad-x pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="bw-cta">
          <Button
            size="lg"
            className="w-full"
            disabled={isSettings && isCurrent}
            onClick={() => onSelect(selected)}
          >
            {isSettings && isCurrent
              ? "This is your current plan"
              : selected === "home-planning"
                ? isSettings
                  ? "Upgrade to Home Planning"
                  : "Continue with Rs. 4,999"
                : tier.ctaLabel}
          </Button>
          {!isSettings && onSkipFree && selected !== "free" && (
            <Button variant="ghost" size="lg" className="w-full" onClick={onSkipFree}>
              Start with Free
            </Button>
          )}
        </div>
      </footer>
    </main>
  );
}
