import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Pause, Play, SkipForward } from "lucide-react";
import { addSession } from "@/lib/nextrep/storage";
import { useAppState } from "@/hooks/useAppState";
import { nextTarget } from "@/lib/nextrep/plan";
import type { ExerciseTarget, SetLog, WorkoutSession } from "@/lib/nextrep/types";

export const Route = createFileRoute("/workout/$dayId")({
  component: SessionPage,
  ssr: false,
});

function SessionPage() {
  const { dayId } = useParams({ from: "/workout/$dayId" });
  const nav = useNavigate();
  const state = useAppState();
  const day = state.plan?.days.find((d) => d.id === dayId);

  const targets = useMemo<ExerciseTarget[]>(() => {
    if (!day) return [];
    const lastSession = state.sessions.find((s) => s.dayId === dayId);
    return day.exercises.map((ex) => nextTarget(ex, lastSession?.logs[ex.id]));
  }, [day, dayId, state.sessions]);

  const [current, setCurrent] = useState(0);
  const [logs, setLogs] = useState<Record<string, SetLog[]>>({});
  const [restLeft, setRestLeft] = useState(0);
  const [restPaused, setRestPaused] = useState(false);
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (restLeft <= 0 || restPaused) return;
    const t = setTimeout(() => setRestLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [restLeft, restPaused]);

  if (!day) {
    return (
      <div className="min-h-screen grid place-items-center p-6 text-center">
        <div>
          <p className="text-muted-foreground mb-4">Workout not found.</p>
          <button onClick={() => nav({ to: "/workout" })} className="text-primary">Back</button>
        </div>
      </div>
    );
  }

  const ex = targets[current];
  const exLogs = logs[ex.id] ?? [];
  const done = exLogs.filter((s) => s.completed).length;

  const logSet = (i: number, patch: Partial<SetLog>) => {
    setLogs((prev) => {
      const arr = [...(prev[ex.id] ?? [])];
      while (arr.length <= i) arr.push({ weightKg: ex.targetWeightKg, reps: 0, completed: false });
      arr[i] = { ...arr[i], ...patch };
      return { ...prev, [ex.id]: arr };
    });
  };

  const completeSet = (i: number) => {
    const cur = exLogs[i] ?? { weightKg: ex.targetWeightKg, reps: ex.targetRepsMax, completed: false };
    logSet(i, { ...cur, completed: true });
    setRestLeft(ex.restSec);
    setRestPaused(false);
  };

  const finish = () => {
    const session: WorkoutSession = {
      id: crypto.randomUUID(),
      dayId,
      dayName: day.name,
      date: new Date().toISOString(),
      logs,
      durationSec: Math.round((Date.now() - startedAt) / 1000),
      completed: true,
    };
    addSession(session);
    nav({ to: "/home", replace: true });
  };

  const nextExercise = () => {
    if (current < targets.length - 1) {
      setCurrent((c) => c + 1);
      setRestLeft(0);
    } else finish();
  };

  const mins = String(Math.floor(restLeft / 60));
  const secs = String(restLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-6 pb-8 flex flex-col">
      <header className="flex items-center gap-3 mb-6">
        <button onClick={() => nav({ to: "/workout" })} className="w-10 h-10 rounded-full grid place-items-center glass">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">{day.name}</div>
          <div className="text-sm font-semibold tabular-nums">{current + 1} / {targets.length}</div>
        </div>
        <button onClick={finish} className="text-xs font-medium text-muted-foreground hover:text-foreground">Finish</button>
      </header>

      <div className="flex gap-1 mb-6">
        {targets.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < current ? "bg-primary" : i === current ? "bg-primary/50" : "bg-white/5"}`} />
        ))}
      </div>

      <div className="mb-6">
        <div className="text-xs uppercase tracking-widest text-primary font-medium mb-1">{ex.muscle}</div>
        <h1 className="text-3xl font-bold tracking-tight">{ex.name}</h1>
        <div className="text-sm text-muted-foreground mt-1">{ex.equipment}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground mb-1">Target weight</div>
          <div className="text-2xl font-bold tabular-nums">{ex.targetWeightKg}<span className="text-sm text-muted-foreground ml-1">kg</span></div>
          {ex.lastPerformance && ex.lastPerformance[0] && (
            <div className="text-[10px] mt-1" style={{ color: "oklch(0.72 0.19 155)" }}>\u2191 from {ex.lastPerformance[0].weightKg}kg</div>
          )}
        </div>
        <div className="glass rounded-2xl p-4 shadow-[var(--shadow-card)]">
          <div className="text-xs text-muted-foreground mb-1">Target reps</div>
          <div className="text-2xl font-bold tabular-nums">{ex.targetRepsMin}\u2013{ex.targetRepsMax}</div>
          <div className="text-[10px] text-muted-foreground mt-1">{ex.sets} sets</div>
        </div>
      </div>

      {restLeft > 0 && (
        <div className="glass rounded-3xl p-4 mb-5 flex items-center gap-3 shadow-[var(--shadow-glow)] border-primary/30">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-primary font-medium">Rest</div>
            <div className="text-3xl font-bold tabular-nums">{mins}:{secs}</div>
          </div>
          <button onClick={() => setRestPaused((p) => !p)} className="w-10 h-10 rounded-full grid place-items-center bg-white/5">
            {restPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button onClick={() => setRestLeft((s) => s + 30)} className="h-10 px-3 rounded-full text-xs font-semibold bg-white/5">+30s</button>
          <button onClick={() => setRestLeft(0)} className="w-10 h-10 rounded-full grid place-items-center bg-white/5">
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 space-y-2">
        {Array.from({ length: ex.sets }).map((_, i) => {
          const s = exLogs[i];
          return (
            <SetRow key={i} index={i} defaultWeight={ex.targetWeightKg} defaultReps={ex.targetRepsMax}
              log={s} completed={!!s?.completed}
              onChange={(patch) => logSet(i, { weightKg: ex.targetWeightKg, reps: ex.targetRepsMax, completed: false, ...s, ...patch })}
              onComplete={() => completeSet(i)} />
          );
        })}
      </div>

      <button
        onClick={nextExercise}
        disabled={done < ex.sets}
        className="mt-6 w-full h-14 rounded-2xl font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-40 disabled:shadow-none active:scale-[0.98] transition-all"
        style={{ background: "var(--gradient-primary)" }}
      >
        {current === targets.length - 1 ? "Finish workout" : "Next exercise"}
      </button>
    </div>
  );
}

function SetRow({ index, defaultWeight, defaultReps, log, completed, onChange, onComplete }: { index: number; defaultWeight: number; defaultReps: number; log?: SetLog; completed: boolean; onChange: (patch: Partial<SetLog>) => void; onComplete: () => void }) {
  const weight = log?.weightKg ?? defaultWeight;
  const reps = log?.reps ?? defaultReps;
  return (
    <div className={`rounded-2xl p-3 flex items-center gap-2 border transition-all ${completed ? "border-white/5 bg-white/[0.02]" : "border-white/5 bg-card"}`} style={completed ? { borderColor: "oklch(0.72 0.19 155 / 0.4)", background: "oklch(0.72 0.19 155 / 0.05)" } : undefined}>
      <div className="w-8 text-center text-sm font-semibold text-muted-foreground tabular-nums">{index + 1}</div>
      <NumField label="kg" value={weight} onChange={(v) => onChange({ weightKg: v })} disabled={completed} />
      <NumField label="reps" value={reps} onChange={(v) => onChange({ reps: v })} disabled={completed} />
      <button
        onClick={onComplete}
        disabled={completed}
        className="w-11 h-11 rounded-xl grid place-items-center transition-all active:scale-90 text-primary-foreground shadow-[var(--shadow-glow)]"
        style={{ background: completed ? "oklch(0.72 0.19 155)" : "var(--gradient-primary)" }}
      >
        <Check className="w-5 h-5" />
      </button>
    </div>
  );
}

function NumField({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div className={`flex-1 rounded-xl px-3 py-2 ${disabled ? "opacity-60" : "bg-white/5"}`}>
      <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{label}</div>
      <input type="number" inputMode="decimal" value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} className="w-full bg-transparent outline-none text-xl font-bold tabular-nums" />
    </div>
  );
}