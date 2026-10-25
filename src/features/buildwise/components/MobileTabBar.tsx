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
    <nav className="relative z-20 shrink-0 border-t border-border bg-background px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2">
      <div className="grid grid-cols-3 gap-1.5">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center gap-1 rounded-2xl py-2.5 text-[11px] font-semibold transition-colors duration-200 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:bg-muted/70"
              }`}
            >
              <Icon
                className={`size-5 ${isActive ? "text-primary" : ""}`}
                strokeWidth={isActive ? 2.25 : 1.75}
              />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
