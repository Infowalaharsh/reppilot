import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Dumbbell, Apple, TrendingUp, User } from "lucide-react";
import markAsset from "@/assets/reppilot-mark.png.asset.json";

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
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)] md:hidden">
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

export function SideNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60 flex-col border-r border-white/5 bg-background/40 backdrop-blur-xl px-4 py-6">
      <div className="flex items-center gap-2 px-2 mb-8">
        <img src={markAsset.url} alt="Reppilot logo" className="w-8 h-8 object-contain" />
        <div className="text-lg font-bold tracking-tight">Reppilot</div>
      </div>
      <nav className="flex flex-col gap-1">
        {tabs.map((t) => {
          const active = path.startsWith(t.to);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function TabShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-28 md:pb-10 md:pl-60">
      <SideNav />
      <div className="mx-auto w-full max-w-md md:max-w-5xl px-5 md:px-10 pt-8">{children}</div>
      <BottomNav />
    </div>
  );
}