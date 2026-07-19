import type {
  AppState,
  ExerciseLibraryItem,
  ExerciseTarget,
  Meal,
  Measurement,
  NutritionGoals,
  Plan,
  Profile,
  RecoveryCheck,
  SetLog,
  WeightLog,
  WorkoutDay,
  WorkoutSession,
} from "./types";

const KEY = "nextrep_state_v1";

const empty: AppState = {
  profile: null,
  plan: null,
  sessions: [],
  goals: null,
  streak: 0,
  meals: [],
  water: [],
  weightLogs: [],
  measurements: [],
  recovery: [],
  customExercises: [],
  favoriteExerciseIds: [],
  recentExerciseIds: [],
  draftSession: null,
};

export function loadState(): AppState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new Event("nextrep:state"));
}

export function updateState(mut: (s: AppState) => AppState) {
  const next = mut(loadState());
  saveState(next);
  return next;
}

export function setProfile(profile: Profile) {
  return updateState((s) => ({ ...s, profile }));
}
export function setPlan(plan: Plan) {
  return updateState((s) => ({ ...s, plan }));
}
export function setGoals(goals: NutritionGoals) {
  return updateState((s) => ({ ...s, goals }));
}
export function addSession(session: WorkoutSession) {
  return updateState((s) => {
    const today = session.date.slice(0, 10);
    const last = s.lastSessionDate?.slice(0, 10);
    let streak = s.streak;
    if (last !== today) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = y.toISOString().slice(0, 10);
      streak = last === yStr ? streak + 1 : 1;
    }
    return {
      ...s,
      sessions: [session, ...s.sessions],
      streak,
      lastSessionDate: session.date,
      draftSession: null,
    };
  });
}

export function resetAll() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("nextrep:state"));
}

// ---------- Profile ----------
export function updateProfile(patch: Partial<Profile>) {
  return updateState((s) => (s.profile ? { ...s, profile: { ...s.profile, ...patch } } : s));
}
export function updateGoals(patch: Partial<NutritionGoals>) {
  return updateState((s) => (s.goals ? { ...s, goals: { ...s.goals, ...patch } } : s));
}

// ---------- Plan / days / exercises ----------
function withPlan(s: AppState, mut: (p: Plan) => Plan): AppState {
  return s.plan ? { ...s, plan: mut(s.plan) } : s;
}
function withDay(plan: Plan, dayId: string, mut: (d: WorkoutDay) => WorkoutDay): Plan {
  return { ...plan, days: plan.days.map((d) => (d.id === dayId ? mut(d) : d)) };
}

export function addDay(day: WorkoutDay) {
  return updateState((s) => withPlan(s, (p) => ({ ...p, days: [...p.days, day] })));
}
export function updateDay(dayId: string, patch: Partial<WorkoutDay>) {
  return updateState((s) => withPlan(s, (p) => withDay(p, dayId, (d) => ({ ...d, ...patch }))));
}
export function deleteDay(dayId: string) {
  return updateState((s) => withPlan(s, (p) => ({ ...p, days: p.days.filter((d) => d.id !== dayId) })));
}
export function duplicateDay(dayId: string) {
  return updateState((s) =>
    withPlan(s, (p) => {
      const d = p.days.find((x) => x.id === dayId);
      if (!d) return p;
      const copy: WorkoutDay = {
        ...d,
        id: `${d.id}-${Date.now().toString(36)}`,
        name: `${d.name} (copy)`,
        exercises: d.exercises.map((e) => ({ ...e, id: `${e.id}-${Math.random().toString(36).slice(2, 6)}` })),
      };
      return { ...p, days: [...p.days, copy] };
    }),
  );
}
export function reorderDays(order: string[]) {
  return updateState((s) =>
    withPlan(s, (p) => ({ ...p, days: order.map((id) => p.days.find((d) => d.id === id)!).filter(Boolean) })),
  );
}

export function addExercise(dayId: string, ex: ExerciseTarget) {
  return updateState((s) =>
    withPlan(s, (p) => withDay(p, dayId, (d) => ({ ...d, exercises: [...d.exercises, ex] }))),
  );
}
export function updateExercise(dayId: string, exId: string, patch: Partial<ExerciseTarget>) {
  return updateState((s) =>
    withPlan(s, (p) =>
      withDay(p, dayId, (d) => ({
        ...d,
        exercises: d.exercises.map((e) => (e.id === exId ? { ...e, ...patch } : e)),
      })),
    ),
  );
}
export function deleteExercise(dayId: string, exId: string) {
  return updateState((s) =>
    withPlan(s, (p) =>
      withDay(p, dayId, (d) => ({ ...d, exercises: d.exercises.filter((e) => e.id !== exId) })),
    ),
  );
}
export function duplicateExercise(dayId: string, exId: string) {
  return updateState((s) =>
    withPlan(s, (p) =>
      withDay(p, dayId, (d) => {
        const idx = d.exercises.findIndex((e) => e.id === exId);
        if (idx < 0) return d;
        const src = d.exercises[idx];
        const copy: ExerciseTarget = { ...src, id: `${src.id}-${Math.random().toString(36).slice(2, 6)}` };
        const next = [...d.exercises];
        next.splice(idx + 1, 0, copy);
        return { ...d, exercises: next };
      }),
    ),
  );
}
export function moveExercise(dayId: string, exId: string, dir: -1 | 1) {
  return updateState((s) =>
    withPlan(s, (p) =>
      withDay(p, dayId, (d) => {
        const idx = d.exercises.findIndex((e) => e.id === exId);
        const to = idx + dir;
        if (idx < 0 || to < 0 || to >= d.exercises.length) return d;
        const next = [...d.exercises];
        [next[idx], next[to]] = [next[to], next[idx]];
        return { ...d, exercises: next };
      }),
    ),
  );
}

// ---------- Meals / water ----------
export function addMeal(meal: Meal) {
  return updateState((s) => ({ ...s, meals: [meal, ...(s.meals ?? [])] }));
}
export function deleteMeal(id: string) {
  return updateState((s) => ({ ...s, meals: (s.meals ?? []).filter((m) => m.id !== id) }));
}
export function updateMeal(id: string, patch: Partial<Meal>) {
  return updateState((s) => ({
    ...s,
    meals: (s.meals ?? []).map((m) => (m.id === id ? { ...m, ...patch } : m)),
  }));
}
export function addWater(date: string, ml: number) {
  return updateState((s) => {
    const list = s.water ?? [];
    const idx = list.findIndex((w) => w.date === date);
    if (idx < 0) return { ...s, water: [...list, { date, ml }] };
    const next = [...list];
    next[idx] = { date, ml: Math.max(0, next[idx].ml + ml) };
    return { ...s, water: next };
  });
}

// ---------- Weight / measurements / recovery ----------
export function logWeight(entry: WeightLog) {
  return updateState((s) => {
    const list = (s.weightLogs ?? []).filter((w) => w.date !== entry.date);
    return {
      ...s,
      weightLogs: [...list, entry].sort((a, b) => a.date.localeCompare(b.date)),
      profile: s.profile ? { ...s.profile, weightKg: entry.weightKg } : s.profile,
    };
  });
}
export function addMeasurement(m: Measurement) {
  return updateState((s) => ({ ...s, measurements: [...(s.measurements ?? []), m] }));
}
export function saveRecovery(r: RecoveryCheck) {
  return updateState((s) => {
    const list = (s.recovery ?? []).filter((x) => x.date !== r.date);
    return { ...s, recovery: [...list, r] };
  });
}

// ---------- Custom exercises / favorites / recents ----------
export function saveCustomExercise(item: ExerciseLibraryItem) {
  return updateState((s) => {
    const list = (s.customExercises ?? []).filter((x) => x.id !== item.id);
    return { ...s, customExercises: [...list, { ...item, custom: true }] };
  });
}
export function deleteCustomExercise(id: string) {
  return updateState((s) => ({ ...s, customExercises: (s.customExercises ?? []).filter((x) => x.id !== id) }));
}
export function toggleFavoriteExercise(id: string) {
  return updateState((s) => {
    const cur = s.favoriteExerciseIds ?? [];
    return { ...s, favoriteExerciseIds: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
  });
}
export function markRecentExercise(id: string) {
  return updateState((s) => {
    const cur = (s.recentExerciseIds ?? []).filter((x) => x !== id);
    return { ...s, recentExerciseIds: [id, ...cur].slice(0, 10) };
  });
}

// ---------- Draft session (autosave) ----------
export function saveDraftSession(dayId: string, logs: Record<string, SetLog[]>, startedAt: number) {
  return updateState((s) => ({ ...s, draftSession: { dayId, logs, startedAt } }));
}
export function clearDraftSession() {
  return updateState((s) => ({ ...s, draftSession: null }));
}