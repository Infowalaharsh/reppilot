import type { ExerciseTarget, Plan, Profile, SetLog, WorkoutDay } from "./types";

function ex(
  id: string,
  name: string,
  muscle: string,
  equipment: string,
  baseKg: number,
  reps: [number, number],
  sets = 3,
  rest = 90,
): ExerciseTarget {
  return {
    id,
    name,
    muscle,
    equipment,
    targetWeightKg: baseKg,
    targetRepsMin: reps[0],
    targetRepsMax: reps[1],
    sets,
    restSec: rest,
  };
}

function scale(bw: number, exp: Profile["experience"]) {
  const expMul = exp === "beginner" ? 0.55 : exp === "intermediate" ? 0.85 : 1.15;
  return (ratio: number) => Math.round(bw * ratio * expMul * 2) / 2;
}

export function generatePlan(p: Profile): Plan {
  const s = scale(p.weightKg, p.experience);

  const push: WorkoutDay = {
    id: "push",
    name: "Push Day",
    focus: "Chest \u00b7 Shoulders \u00b7 Triceps",
    exercises: [
      ex("bench", "Bench Press", "Chest", "Barbell", s(0.9), [6, 8], 4, 120),
      ex("ohp", "Overhead Press", "Shoulders", "Barbell", s(0.55), [6, 8], 3, 120),
      ex("incline-db", "Incline DB Press", "Chest", "Dumbbell", s(0.35), [8, 12], 3, 90),
      ex("lateral", "Lateral Raise", "Shoulders", "Dumbbell", s(0.12), [12, 15], 3, 60),
      ex("tricep-rope", "Triceps Rope Pushdown", "Triceps", "Cable", s(0.35), [10, 15], 3, 60),
    ],
  };
  const pull: WorkoutDay = {
    id: "pull",
    name: "Pull Day",
    focus: "Back \u00b7 Biceps \u00b7 Rear delts",
    exercises: [
      ex("deadlift", "Deadlift", "Back", "Barbell", s(1.4), [4, 6], 3, 180),
      ex("pullup", "Pull-Up", "Back", "Bodyweight", 0, [6, 10], 3, 120),
      ex("row", "Barbell Row", "Back", "Barbell", s(0.75), [6, 10], 3, 90),
      ex("facepull", "Face Pull", "Rear delts", "Cable", s(0.2), [12, 15], 3, 60),
      ex("curl", "Barbell Curl", "Biceps", "Barbell", s(0.3), [8, 12], 3, 60),
    ],
  };
  const legs: WorkoutDay = {
    id: "legs",
    name: "Leg Day",
    focus: "Quads \u00b7 Hamstrings \u00b7 Glutes",
    exercises: [
      ex("squat", "Back Squat", "Quads", "Barbell", s(1.2), [5, 8], 4, 150),
      ex("rdl", "Romanian Deadlift", "Hamstrings", "Barbell", s(1.0), [8, 10], 3, 120),
      ex("legpress", "Leg Press", "Quads", "Machine", s(1.8), [10, 12], 3, 90),
      ex("legcurl", "Leg Curl", "Hamstrings", "Machine", s(0.45), [10, 12], 3, 60),
      ex("calf", "Standing Calf Raise", "Calves", "Machine", s(0.7), [12, 15], 4, 45),
    ],
  };
  const upper: WorkoutDay = {
    id: "upper",
    name: "Upper Body",
    focus: "Chest \u00b7 Back \u00b7 Arms",
    exercises: [
      ex("bench", "Bench Press", "Chest", "Barbell", s(0.9), [6, 8], 4, 120),
      ex("row", "Barbell Row", "Back", "Barbell", s(0.75), [6, 10], 3, 90),
      ex("ohp", "Overhead Press", "Shoulders", "Barbell", s(0.55), [6, 8], 3, 120),
      ex("pullup", "Pull-Up", "Back", "Bodyweight", 0, [6, 10], 3, 90),
      ex("curl", "DB Curl", "Biceps", "Dumbbell", s(0.15), [10, 12], 3, 60),
    ],
  };
  const lower: WorkoutDay = {
    id: "lower",
    name: "Lower Body",
    focus: "Quads \u00b7 Hamstrings \u00b7 Glutes",
    exercises: [
      ex("squat", "Back Squat", "Quads", "Barbell", s(1.2), [5, 8], 4, 150),
      ex("rdl", "Romanian Deadlift", "Hamstrings", "Barbell", s(1.0), [8, 10], 3, 120),
      ex("lunges", "Walking Lunges", "Legs", "Dumbbell", s(0.3), [10, 12], 3, 90),
      ex("legcurl", "Leg Curl", "Hamstrings", "Machine", s(0.45), [10, 12], 3, 60),
      ex("calf", "Calf Raise", "Calves", "Machine", s(0.7), [12, 15], 4, 45),
    ],
  };
  const full: WorkoutDay = {
    id: "full",
    name: "Full Body",
    focus: "Total body strength",
    exercises: [
      ex("squat", "Back Squat", "Quads", "Barbell", s(1.2), [5, 8], 3, 120),
      ex("bench", "Bench Press", "Chest", "Barbell", s(0.9), [6, 8], 3, 120),
      ex("row", "Barbell Row", "Back", "Barbell", s(0.75), [6, 10], 3, 90),
      ex("ohp", "Overhead Press", "Shoulders", "Barbell", s(0.55), [6, 8], 2, 90),
      ex("curl", "DB Curl", "Biceps", "Dumbbell", s(0.15), [10, 12], 2, 60),
    ],
  };

  let days: WorkoutDay[];
  if (p.split === "ppl") days = [push, pull, legs];
  else if (p.split === "upperlower") days = [upper, lower];
  else days = [full];

  return { split: p.split, days, createdAt: new Date().toISOString() };
}

export function nextTarget(target: ExerciseTarget, last?: SetLog[]): ExerciseTarget {
  if (!last || last.length === 0) return target;
  const done = last.filter((s) => s.completed);
  if (done.length === 0) return target;
  const hitTop = done.length >= target.sets && done.every((s) => s.reps >= target.targetRepsMax);
  const hitMin = done.every((s) => s.reps >= target.targetRepsMin);
  const failed = done.some((s) => s.reps < target.targetRepsMin - 2);
  const inc = target.targetWeightKg < 30 ? 1 : 2.5;
  let w = target.targetWeightKg;
  if (hitTop) w += inc;
  else if (failed) w = Math.max(0, w - inc);
  else if (!hitMin) w = w;
  return { ...target, targetWeightKg: Math.round(w * 2) / 2, lastPerformance: last };
}

export function todayDay(plan: Plan, sessionsCount: number): WorkoutDay {
  return plan.days[sessionsCount % plan.days.length];
}