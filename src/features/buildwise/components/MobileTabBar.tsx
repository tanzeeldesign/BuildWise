import { ClipboardList, Home, User } from "lucide-react";
import type { Tab } from "../types";

type MobileTabBarProps = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

const tabs: Array<{ id: Tab; label: string; icon: typeof Home }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "plan", label: "Plan", icon: ClipboardList },
  { id: "profile", label: "Profile", icon: User },
];

export function MobileTabBar({ active, onChange }: MobileTabBarProps) {
  return (
    <nav className="shrink-0 border-t bg-background/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
      <div className="grid grid-cols-3 gap-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-semibold transition-colors ${
                isActive ? "bg-accent text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-5" strokeWidth={isActive ? 2.25 : 1.75} />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
