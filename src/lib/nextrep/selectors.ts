import type { AppState, ExerciseTarget, Meal, SetLog, WorkoutSession } from "./types";

export function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getLastPerformance(sessions: WorkoutSession[], exerciseId: string): SetLog[] | undefined {
  for (const s of sessions) {
    const logs = s.logs[exerciseId];
    if (logs && logs.some((l) => l.completed)) return logs.filter((l) => l.completed);
  }
  return undefined;
}

export function summarizeLast(logs?: SetLog[]) {
  if (!logs || logs.length === 0) return null;
  const weight = Math.max(...logs.map((l) => l.weightKg));
  const topReps = Math.max(...logs.map((l) => l.reps));
  return { weight, reps: topReps, sets: logs.length };
}

export function consecutiveFailures(sessions: WorkoutSession[], ex: ExerciseTarget): number {
  let count = 0;
  for (const s of sessions) {
    const logs = s.logs[ex.id];
    if (!logs) continue;
    const done = logs.filter((l) => l.completed);
    if (done.length === 0) continue;
    const failed = done.some((l) => l.reps < ex.targetRepsMin);
    if (failed) count++;
    else break;
  }
  return count;
}

export function deloadRecommendation(sessions: WorkoutSession[], ex: ExerciseTarget) {
  const fails = consecutiveFailures(sessions, ex);
  if (fails >= 2) {
    return { deload: true, suggestedKg: Math.round(ex.targetWeightKg * 0.9 * 2) / 2 };
  }
  return { deload: false, suggestedKg: ex.targetWeightKg };
}

export function computePRs(sessions: WorkoutSession[]) {
  const map = new Map<string, { id: string; name: string; weight: number; reps: number; date: string }>();
  for (const s of sessions) {
    for (const [exId, logs] of Object.entries(s.logs)) {
      for (const l of logs) {
        if (!l.completed) continue;
        const cur = map.get(exId);
        if (!cur || l.weightKg > cur.weight) {
          const name = findNameForExercise(sessions, exId) ?? prettyName(exId);
          map.set(exId, { id: exId, name, weight: l.weightKg, reps: l.reps, date: s.date });
        }
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => b.weight - a.weight);
}

function findNameForExercise(_sessions: WorkoutSession[], _id: string): string | null {
  return null;
}

export function prettyName(id: string) {
  return id.replace(/-[a-z0-9]{4}$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ---------- Nutrition selectors ----------
export function todayMeals(meals: Meal[] | undefined, date = todayStr()): Meal[] {
  return (meals ?? []).filter((m) => m.date === date);
}

export function totalsFor(meals: Meal[]) {
  return meals.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      proteinG: acc.proteinG + m.proteinG,
      carbsG: acc.carbsG + m.carbsG,
      fatG: acc.fatG + m.fatG,
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
}

export function waterFor(state: AppState, date = todayStr()) {
  return state.water?.find((w) => w.date === date)?.ml ?? 0;
}

export function recoveryFor(state: AppState, date = todayStr()) {
  return state.recovery?.find((r) => r.date === date);
}

// ---------- Strength history ----------
export function strengthSeries(sessions: WorkoutSession[], exerciseId: string) {
  const points: { date: string; weight: number }[] = [];
  for (const s of [...sessions].reverse()) {
    const logs = s.logs[exerciseId]?.filter((l) => l.completed) ?? [];
    if (logs.length === 0) continue;
    points.push({ date: s.date.slice(0, 10), weight: Math.max(...logs.map((l) => l.weightKg)) });
  }
  return points;
}

export function frequencyByWeek(sessions: WorkoutSession[], weeks = 8) {
  const now = new Date();
  const buckets: { week: string; count: number }[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    buckets.push({ week: label, count: 0 });
  }
  for (const s of sessions) {
    const t = new Date(s.date).getTime();
    const diffWeeks = Math.floor((now.getTime() - t) / (7 * 86400000));
    if (diffWeeks < 0 || diffWeeks >= weeks) continue;
    buckets[weeks - 1 - diffWeeks].count += 1;
  }
  return buckets;
}

export function weightSeries(state: AppState) {
  return (state.weightLogs ?? []).map((w) => ({ date: w.date, weight: w.weightKg }));
}