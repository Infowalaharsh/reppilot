export type SplitType = "ppl" | "upperlower" | "fullbody" | "bro";
export type Goal = "lose_fat" | "gain_muscle" | "get_stronger" | "recomp";
export type Experience = "beginner" | "intermediate" | "advanced";
export type Gender = "male" | "female" | "other";
export type Progression = "double" | "linear" | "percentage";

export interface Profile {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  gender: Gender;
  experience: Experience;
  goal: Goal;
  frequency: number; // days/week
  split: SplitType;
  progression: Progression;
  unit: "metric" | "imperial";
  createdAt: string;
}

export interface ExerciseTarget {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  targetWeightKg: number;
  targetRepsMin: number;
  targetRepsMax: number;
  sets: number;
  restSec: number;
  lastPerformance?: SetLog[];
}

export interface SetLog {
  weightKg: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutDay {
  id: string;
  name: string; // "Push Day"
  focus: string;
  exercises: ExerciseTarget[];
}

export interface Plan {
  split: SplitType;
  days: WorkoutDay[];
  createdAt: string;
}

export interface WorkoutSession {
  id: string;
  dayId: string;
  dayName: string;
  date: string;
  logs: Record<string, SetLog[]>; // exerciseId -> sets
  durationSec?: number;
  completed: boolean;
}

export interface NutritionGoals {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
}

export interface AppState {
  profile: Profile | null;
  plan: Plan | null;
  sessions: WorkoutSession[];
  goals: NutritionGoals | null;
  streak: number;
  lastSessionDate?: string;
}