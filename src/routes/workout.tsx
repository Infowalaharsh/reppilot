import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Dumbbell, Pencil, Play, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TabShell } from "@/components/nextrep/BottomNav";
import { ConfirmDialog } from "@/components/nextrep/ConfirmDialog";
import { useAppState } from "@/hooks/useAppState";
import { deleteDay, duplicateDay } from "@/lib/nextrep/storage";

export const Route = createFileRoute("/workout")({
  component: WorkoutIndex,
  ssr: false,
});

function WorkoutIndex() {
  const state = useAppState();
  const nav = useNavigate();
  const [toDelete, setToDelete] = useState<string | null>(null);
  if (!state.plan) return null;
  const splitLabel = state.plan.split === "ppl" ? "Push Pull Legs" : state.plan.split === "upperlower" ? "Upper / Lower" : "Full Body";
  return (
    <TabShell>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary font-medium mb-1">Your plan</div>
          <h1 className="text-3xl font-bold tracking-tight">{splitLabel}</h1>
        </div>
        <button onClick={() => nav({ to: "/workout/day/new" })} className="w-11 h-11 rounded-2xl grid place-items-center bg-primary text-primary-foreground shadow-[var(--shadow-glow)] active:scale-95 transition-transform" aria-label="New day">
          <Plus className="w-5 h-5" />
        </button>
      </header>
      <div className="space-y-3">
        {state.plan.days.map((d) => (
          <div key={d.id} className="glass rounded-2xl p-3 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <Link to="/workout/$dayId" params={{ dayId: d.id }} className="flex items-center gap-3 flex-1 min-w-0 active:opacity-80">
                <div className="w-11 h-11 rounded-2xl grid place-items-center bg-primary/10"><Dumbbell className="w-5 h-5 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{d.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{d.focus} \u00b7 {d.exercises.length} exercises</div>
                </div>
              </Link>
              <Link to="/workout/$dayId" params={{ dayId: d.id }} className="w-10 h-10 rounded-xl grid place-items-center bg-primary text-primary-foreground shadow-[var(--shadow-glow)] active:scale-95 transition-transform" aria-label="Start">
                <Play className="w-4 h-4 fill-current" />
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
              <button onClick={() => nav({ to: "/workout/day/$dayId/edit", params: { dayId: d.id } })} className="flex-1 h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 bg-white/5"><Pencil className="w-3.5 h-3.5" /> Edit</button>
              <button onClick={() => { duplicateDay(d.id); toast.success("Duplicated"); }} className="flex-1 h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 bg-white/5"><Copy className="w-3.5 h-3.5" /> Duplicate</button>
              <button onClick={() => setToDelete(d.id)} className="flex-1 h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 bg-destructive/10 text-destructive"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} title="Delete this workout day?" description="Sessions are kept; the template is removed." confirmLabel="Delete" destructive onConfirm={() => { if (toDelete) { deleteDay(toDelete); toast.success("Deleted"); } setToDelete(null); }} />
    </TabShell>
  );
}