import { createFileRoute } from "@tanstack/react-router";
import { Trophy, TrendingUp, Calendar } from "lucide-react";
import { TabShell } from "@/components/nextrep/BottomNav";
import { useAppState } from "@/hooks/useAppState";
import type { WorkoutSession } from "@/lib/nextrep/types";

export const Route = createFileRoute("/progress")({
  component: Progress,
  ssr: false,
});

function Progress() {
  const state = useAppState();
  const now = Date.now();
  const sessionsThisWeek = state.sessions.filter((s) => now - new Date(s.date).getTime() < 7 * 86400000).length;

  return (
    <TabShell>
      <header className="mb-6">
        <div className="text-xs uppercase tracking-widest text-primary font-medium mb-1">Overview</div>
        <h1 className="text-3xl font-bold tracking-tight">Progress</h1>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <Stat icon={<Calendar className="w-4 h-4" />} label="This week" value={`${sessionsThisWeek}`} sub="workouts" />
        <Stat icon={<TrendingUp className="w-4 h-4" />} label="Total" value={`${state.sessions.length}`} sub="sessions" />
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-5">
      <div className="glass rounded-3xl p-5 mb-5 md:mb-0 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-primary" />
          <div className="text-xs uppercase tracking-widest text-primary font-medium">Personal records</div>
        </div>
        {state.sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Complete workouts to unlock PRs.</p>
        ) : (
          <div className="space-y-2">
            {computePRs(state.sessions).slice(0, 5).map((pr) => (
              <div key={pr.name} className="flex items-center justify-between py-1.5">
                <div className="font-medium text-sm">{pr.name}</div>
                <div className="font-bold tabular-nums text-primary">{pr.weight} kg × {pr.reps}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass rounded-3xl p-5 shadow-[var(--shadow-card)]">
        <div className="text-xs uppercase tracking-widest text-primary font-medium mb-3">Recent sessions</div>
        {state.sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sessions yet.</p>
        ) : (
          <div className="space-y-2">
            {state.sessions.slice(0, 6).map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="font-medium text-sm">{s.dayName}</div>
                  <div className="text-xs text-muted-foreground">{new Date(s.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div>
                </div>
                <div className="text-xs text-muted-foreground tabular-nums">{Math.round((s.durationSec ?? 0) / 60)} min</div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </TabShell>
  );
}

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="glass rounded-3xl p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">{icon}<span className="text-xs">{label}</span></div>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function computePRs(sessions: WorkoutSession[]) {
  const map = new Map<string, { name: string; weight: number; reps: number }>();
  for (const s of sessions) {
    for (const [exId, logs] of Object.entries(s.logs)) {
      for (const l of logs) {
        if (!l.completed) continue;
        const cur = map.get(exId);
        if (!cur || l.weightKg > cur.weight) map.set(exId, { name: prettyName(exId), weight: l.weightKg, reps: l.reps });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.weight - a.weight);
}

function prettyName(id: string) {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}