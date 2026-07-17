import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Dumbbell, Apple, TrendingUp, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/nutrition", label: "Nutrition", icon: Apple },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md px-3 pb-3">
        <div className="glass rounded-2xl px-2 py-2 shadow-[var(--shadow-card)] flex items-center justify-between">
          {tabs.map((t) => {
            const active = path.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl transition-all ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "scale-110" : ""} transition-transform`} />
                <span className="text-[10px] font-medium tracking-wide">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function TabShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-28">
      <div className="mx-auto max-w-md px-5 pt-8">{children}</div>
      <BottomNav />
    </div>
  );
}