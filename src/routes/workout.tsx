import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Dumbbell } from "lucide-react";
import { TabShell } from "@/components/nextrep/BottomNav";
import { useAppState } from "@/hooks/useAppState";

export const Route = createFileRoute("/workout")({
  component: WorkoutIndex,
  ssr: false,
});

function WorkoutIndex() {
  const state = useAppState();
  if (!state.plan) return null;
  const splitLabel = state.plan.split === "ppl" ? "Push Pull Legs" : state.plan.split === "upperlower" ? "Upper / Lower" : "Full Body";
  return (
    <TabShell>
      <header className="mb-6">
        <div className="text-xs uppercase tracking-widest text-primary font-medium mb-1">Your plan</div>
        <h1 className="text-3xl font-bold tracking-tight">{splitLabel}</h1>
      </header>

      <div className="space-y-3">
        {state.plan.days.map((d) => (
          <Link key={d.id} to="/workout/$dayId" params={{ dayId: d.id }} className="glass rounded-2xl p-4 flex items-center gap-4 active:scale-[0.99] transition-transform shadow-[var(--shadow-card)]">
            <div className="w-12 h-12 rounded-2xl grid place-items-center bg-primary/10">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-semibold">{d.name}</div>
              <div className="text-xs text-muted-foreground">{d.focus} \u00b7 {d.exercises.length} exercises</div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </TabShell>
  );
}