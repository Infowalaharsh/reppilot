import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { ExerciseTarget } from "@/lib/nextrep/types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initial: ExerciseTarget | null;
  onSave: (ex: ExerciseTarget) => void;
}

export function ExerciseEditorSheet({ open, onOpenChange, initial, onSave }: Props) {
  const [form, setForm] = useState<ExerciseTarget | null>(initial);
  useEffect(() => setForm(initial), [initial, open]);
  if (!form) return null;
  const set = <K extends keyof ExerciseTarget>(k: K, v: ExerciseTarget[K]) => setForm({ ...form, [k]: v });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[92vh] overflow-y-auto rounded-t-3xl border-white/10 bg-card">
        <SheetHeader>
          <SheetTitle>Edit exercise</SheetTitle>
        </SheetHeader>
        <div className="space-y-3 py-4">
          <Field label="Name">
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Muscle">
              <Input value={form.muscle} onChange={(e) => set("muscle", e.target.value)} />
            </Field>
            <Field label="Equipment">
              <Input value={form.equipment} onChange={(e) => set("equipment", e.target.value)} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Sets">
              <Input type="number" inputMode="numeric" value={form.sets} onChange={(e) => set("sets", Math.max(1, Number(e.target.value)))} />
            </Field>
            <Field label="Rest (sec)">
              <Input type="number" inputMode="numeric" value={form.restSec} onChange={(e) => set("restSec", Math.max(0, Number(e.target.value)))} />
            </Field>
            <Field label="Weight (kg)">
              <Input type="number" inputMode="decimal" value={form.targetWeightKg} onChange={(e) => set("targetWeightKg", Number(e.target.value))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Reps min">
              <Input type="number" inputMode="numeric" value={form.targetRepsMin} onChange={(e) => set("targetRepsMin", Number(e.target.value))} />
            </Field>
            <Field label="Reps max">
              <Input type="number" inputMode="numeric" value={form.targetRepsMax} onChange={(e) => set("targetRepsMax", Number(e.target.value))} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="RPE (optional)">
              <Input type="number" inputMode="decimal" value={form.rpe ?? ""} placeholder="7-10" onChange={(e) => set("rpe", e.target.value ? Number(e.target.value) : undefined)} />
            </Field>
            <Field label="Tempo (optional)">
              <Input value={form.tempo ?? ""} placeholder="3-1-1" onChange={(e) => set("tempo", e.target.value || undefined)} />
            </Field>
          </div>
          <Field label="Notes">
            <Textarea value={form.notes ?? ""} rows={2} onChange={(e) => set("notes", e.target.value || undefined)} />
          </Field>
          <Button
            className="w-full h-12 rounded-2xl font-semibold"
            onClick={() => {
              onSave(form);
              onOpenChange(false);
            }}
          >
            Save exercise
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}