import { Button } from "@/components/ui/button";
import type { BuiltPlan, Session } from "../types";

type ProfileProps = {
  session: Session;
  plan: BuiltPlan;
  hasPlan: boolean;
  onEdit: () => void;
  onStartPlanning: () => void;
  onDisclaimer: () => void;
  onSignOut: () => void;
};

export function Profile({
  session,
  plan,
  hasPlan,
  onEdit,
  onStartPlanning,
  onDisclaimer,
  onSignOut,
}: ProfileProps) {
  return (
    <main className="flex min-h-full flex-1 flex-col bg-background pb-6">
      <div className="border-b px-5 pb-6 pt-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Profile</p>
        <h1 className="mt-3 text-3xl font-semibold">{session.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{session.email}</p>
      </div>

      <section className="px-5 pt-6">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">Home profile</h2>
        {hasPlan ? (
          <div className="mt-4 border-t">
            {plan.profileRows.map(([k, v]) => (
              <div key={k} className="border-b py-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{k}</span>
                <p className="mt-1 text-base font-semibold">{v}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            No home answers yet. Start planning to build your profile.
          </p>
        )}
      </section>

      <div className="mt-auto flex flex-col gap-3 px-5 pt-8">
        {hasPlan ? (
          <Button size="lg" className="w-full" onClick={onEdit}>
            Edit home answers
          </Button>
        ) : (
          <Button size="lg" className="w-full" onClick={onStartPlanning}>
            Start planning
          </Button>
        )}
        <Button variant="outline" size="lg" className="w-full" onClick={onDisclaimer}>
          Disclaimer
        </Button>
        <Button variant="ghost" size="lg" className="w-full" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </main>
  );
}
