import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowDown, ArrowUp, Copy, Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TabShell } from "@/components/nextrep/BottomNav";
import { ExerciseEditorSheet } from "@/components/nextrep/ExerciseEditorSheet";
import { ExerciseLibrarySheet } from "@/components/nextrep/ExerciseLibrarySheet";
import { ConfirmDialog } from "@/components/nextrep/ConfirmDialog";
import { useAppState } from "@/hooks/useAppState";
import { addExercise, deleteExercise, duplicateExercise, moveExercise, updateDay, updateExercise } from "@/lib/nextrep/storage";
import type { ExerciseTarget } from "@/lib/nextrep/types";

export const Route = createFileRoute("/workout/day/$dayId/edit")({ component: EditDay, ssr: false });

function EditDay() {
  const { dayId } = useParams({ from: "/workout/day/$dayId/edit" });
  const nav = useNavigate();
  const state = useAppState();
  const day = state.plan?.days.find((d) => d.id === dayId);
  const [libOpen, setLibOpen] = useState(false);
  const [editing, setEditing] = useState<ExerciseTarget | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  if (!day) return <div className="min-h-screen grid place-items-center p-6"><button onClick={() => nav({ to: "/workout" })} className="text-primary">Back</button></div>;
  return (
    <TabShell>
      <header className="flex items-center gap-3 mb-6">
        <button onClick={() => nav({ to: "/workout" })} className="w-10 h-10 rounded-full grid place-items-center glass"><ArrowLeft className="w-4 h-4" /></button>
        <div className="flex-1"><div className="text-xs text-muted-foreground">Editing</div><div className="text-sm font-semibold">{day.name}</div></div>
      </header>
      <div className="space-y-3 mb-5">
        <div><div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Day name</div><Input value={day.name} onChange={(e) => updateDay(day.id, { name: e.target.value })} className="h-11 rounded-xl" /></div>
        <div><div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Focus</div><Input value={day.focus} onChange={(e) => updateDay(day.id, { focus: e.target.value })} className="h-11 rounded-xl" /></div>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Exercises ({day.exercises.length})</div>
        <button onClick={() => setLibOpen(true)} className="text-xs font-semibold text-primary flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
      </div>
      <div className="space-y-2">
        {day.exercises.map((ex, i) => (
          <div key={ex.id} className="glass rounded-2xl p-3 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <button disabled={i === 0} onClick={() => moveExercise(day.id, ex.id, -1)} className="w-7 h-7 grid place-items-center rounded-md disabled:opacity-20 bg-white/5"><ArrowUp className="w-3.5 h-3.5" /></button>
                <button disabled={i === day.exercises.length - 1} onClick={() => moveExercise(day.id, ex.id, 1)} className="w-7 h-7 grid place-items-center rounded-md disabled:opacity-20 bg-white/5"><ArrowDown className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{ex.name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{ex.sets} × {ex.targetRepsMin}-{ex.targetRepsMax} @ {ex.targetWeightKg}kg</div>
              </div>
              <button onClick={() => setEditing(ex)} className="w-9 h-9 grid place-items-center rounded-lg bg-white/5"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => { duplicateExercise(day.id, ex.id); toast.success("Duplicated"); }} className="w-9 h-9 grid place-items-center rounded-lg bg-white/5"><Copy className="w-4 h-4" /></button>
              <button onClick={() => setConfirmDel(ex.id)} className="w-9 h-9 grid place-items-center rounded-lg bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {day.exercises.length === 0 && (
          <button onClick={() => setLibOpen(true)} className="w-full glass rounded-2xl p-8 text-center text-sm text-muted-foreground">
            <Plus className="w-5 h-5 mx-auto mb-2 text-primary" />Add your first exercise
          </button>
        )}
      </div>
      <Button onClick={() => { toast.success("Saved"); nav({ to: "/workout" }); }} className="w-full h-14 rounded-2xl font-semibold mt-6" style={{ background: "var(--gradient-primary)" }}>Save & finish</Button>
      <ExerciseLibrarySheet open={libOpen} onOpenChange={setLibOpen} onPick={(item) => {
        const ex: ExerciseTarget = { id: `${item.id}-${Math.random().toString(36).slice(2, 6)}`, name: item.name, muscle: item.muscle, equipment: item.equipment, targetWeightKg: 20, targetRepsMin: 8, targetRepsMax: 12, sets: 3, restSec: 90 };
        addExercise(day.id, ex);
        toast.success(`${item.name} added`);
      }} />
      <ExerciseEditorSheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)} initial={editing} onSave={(patch) => { updateExercise(day.id, patch.id, patch); toast.success("Updated"); }} />
      <ConfirmDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)} title="Remove this exercise?" confirmLabel="Remove" destructive onConfirm={() => { if (confirmDel) { deleteExercise(day.id, confirmDel); toast.success("Removed"); } setConfirmDel(null); }} />
    </TabShell>
  );
}