import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSelectedAt, getTier } from "../subscription";
import type { Session, SubscriptionRecord } from "../types";
type ProfileProps = {
  session: Session;
  subscription: SubscriptionRecord | null;
  onManageSubscription: () => void;
  onEditProfile: () => void;
  onDisclaimer: () => void;
  onSignOut: () => void;
};

export function Profile({
  session,
  subscription,
  onManageSubscription,
  onEditProfile,
  onDisclaimer,
  onSignOut,
}: ProfileProps) {
  const tier = subscription ? getTier(subscription.tierId) : null;

  return (
    <main className="bw-page fade-in relative h-full min-h-0 overflow-hidden bg-transparent pb-4">
      <div className="bw-pad-x relative z-10 pb-6 pt-8">
        <h1 className="bw-title">{session.name}</h1>
        <p className="mt-1.5 text-sm leading-snug text-muted-foreground">{session.email}</p>
        {tier ? (
          <span
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
              tier.id === "home-planning"
                ? "bg-accent text-primary"
                : "border border-border bg-card text-muted-foreground"
            }`}
          >
            {tier.id === "home-planning" ? "Home Planning" : "Free"}
          </span>
        ) : (
          <span className="mt-3 inline-flex rounded-full border border-border bg-card px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            No plan
          </span>
        )}
      </div>

      <section className="bw-pad-x relative z-10">
        <div className="bw-card">
          {tier ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                    {tier.priceNote}
                  </p>
                  <p className="mt-2 text-base font-semibold tracking-tight">{tier.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{tier.tagline}</p>
                </div>
                <p className="shrink-0 text-base font-semibold tabular-nums">{tier.priceLabel}</p>
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="size-3.5 text-primary" strokeWidth={2.5} />
                Active since {formatSelectedAt(subscription!.selectedAt)}
              </p>
            </>
          ) : (
            <div>
              <p className="text-base font-semibold tracking-tight">No plan selected</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose Free or Home Planning.
              </p>
            </div>
          )}
        </div>
        <div className="bw-cta mt-3">
          <Button variant="outline" size="lg" className="w-full" onClick={onManageSubscription}>
            {tier ? "Change plan" : "Choose a plan"}
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onEditProfile}>
            Edit profile
          </Button>
          <Button variant="outline" size="lg" className="w-full" onClick={onDisclaimer}>
            Disclaimer
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="w-full text-red-400 hover:bg-red-50 hover:text-red-500"
            onClick={onSignOut}
          >
            Sign out
          </Button>
        </div>
      </section>
    </main>
  );
}
