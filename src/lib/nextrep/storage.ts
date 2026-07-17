import type { AppState, NutritionGoals, Plan, Profile, WorkoutSession } from "./types";

const KEY = "nextrep_state_v1";

const empty: AppState = {
  profile: null,
  plan: null,
  sessions: [],
  goals: null,
  streak: 0,
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
    return { ...s, sessions: [session, ...s.sessions], streak, lastSessionDate: session.date };
  });
}

export function resetAll() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("nextrep:state"));
}