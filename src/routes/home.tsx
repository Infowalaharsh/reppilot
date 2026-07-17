import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Flame, Play, TrendingUp, Zap } from "lucide-react";
import { TabShell } from "@/components/nextrep/BottomNav";
import { Ring } from "@/components/nextrep/Ring";
import { useAppState } from "@/hooks/useAppState";
import { todayDay } from "@/lib/nextrep/plan";

export const Route = createFileRoute("/home")({
  component: Home,
  ssr: false,
});

function Home() {
  const nav = useNavigate();
  const state = useAppState();
  useEffect(() => {
    if (!state.profile) nav({ to: "/onboarding", replace: true });
  }, [state.profile, nav]);
  if (!state.profile || !state.plan || !state.goals) return null;

  const day = todayDay(state.plan, state.sessions.filter((s) => s.completed).length);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <TabShell>
      <header className="mb-6">
        <div className="text-sm text-muted-foreground">{greeting} \u{1f44b}</div>
        <h1 className="text-3xl font-bold tracking-tight">{state.profile.name}</h1>
      </header>

      <div className="glass rounded-3xl p-4 mb-5 flex items-center gap-4 shadow-[var(--shadow-card)]">
        <div className="w-12 h-12 rounded-2xl grid place-items-center" style={{ background: "oklch(0.78 0.17 60 / 0.2)" }}>
          <Flame className="w-6 h-6" style={{ color: "oklch(0.78 0.17 60)" }} />
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold tabular-nums">{state.streak} day streak</div>
          <div className="text-xs text-muted-foreground">Keep the fire going</div>
        </div>
      </div>

      <div className="rounded-3xl p-5 mb-5 relative overflow-hidden shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
        <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(400px 200px at 100% 0%, white, transparent 60%)" }} />
        <div className="relative">
          <div className="text-xs uppercase tracking-widest text-primary-foreground/80 font-medium mb-1">Today's workout</div>
          <div className="text-3xl font-bold text-primary-foreground mb-1">{day.name}</div>
          <div className="text-sm text-primary-foreground/80 mb-5">{day.focus}</div>
          <Link to="/workout/$dayId" params={{ dayId: day.id }} className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white font-semibold rounded-full px-5 py-3 active:scale-95 transition-transform">
            <Play className="w-4 h-4 fill-current" /> Start workout
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Calories" value={0} total={state.goals.calories} suffix="kcal" color="oklch(0.78 0.17 60)" />
        <StatCard label="Protein" value={0} total={state.goals.proteinG} suffix="g" color="oklch(0.72 0.19 155)" />
      </div>

      <div className="glass rounded-3xl p-5 mb-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <div className="text-xs uppercase tracking-widest text-primary font-medium">Recommended</div>
        </div>
        <div className="text-lg font-semibold mb-1">Progressive overload is active</div>
        <p className="text-sm text-muted-foreground">Complete today's session and we'll auto-adjust your next targets.</p>
      </div>

      <div className="glass rounded-3xl p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <div className="text-xs uppercase tracking-widest text-primary font-medium">Weight</div>
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-bold tabular-nums">{state.profile.weightKg}</div>
          <div className="text-sm text-muted-foreground">kg</div>
          <div className="ml-auto text-xs text-muted-foreground">Target {state.profile.targetWeightKg} kg</div>
        </div>
      </div>
    </TabShell>
  );
}

function StatCard({ label, value, total, suffix, color }: { label: string; value: number; total: number; suffix: string; color: string }) {
  const pct = value / total;
  return (
    <div className="glass rounded-3xl p-4 flex flex-col items-center shadow-[var(--shadow-card)]">
      <Ring value={pct} size={90} stroke={8} color={color}>
        <div className="text-lg font-bold tabular-nums leading-none">{value}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">/ {total}{suffix}</div>
      </Ring>
      <div className="text-xs text-muted-foreground mt-2">{label}</div>
    </div>
  );
}