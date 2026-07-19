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
  notes?: string;
  rpe?: number;
  tempo?: string;
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

export interface FoodItem {
  id: string;
  name: string;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  custom?: boolean;
}

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  date: string; // YYYY-MM-DD
  slot: MealSlot;
  name: string;
  grams: number;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  createdAt: string;
}

export interface WaterLog {
  date: string; // YYYY-MM-DD
  ml: number;
}

export interface WeightLog {
  date: string; // YYYY-MM-DD
  weightKg: number;
}

export interface Measurement {
  id: string;
  date: string;
  kind: "chest" | "waist" | "arms" | "thighs" | "hips";
  cm: number;
}

export interface RecoveryCheck {
  date: string; // YYYY-MM-DD
  sleep: number; // 1-5
  stress: number; // 1-5
  fatigue: number; // 1-5
  score: number; // 0-100
}

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  muscle: string;
  category: "Chest" | "Back" | "Shoulders" | "Legs" | "Arms" | "Core" | "Cardio";
  equipment: string;
  custom?: boolean;
}

export interface AppState {
  profile: Profile | null;
  plan: Plan | null;
  sessions: WorkoutSession[];
  goals: NutritionGoals | null;
  streak: number;
  lastSessionDate?: string;
  meals?: Meal[];
  water?: WaterLog[];
  weightLogs?: WeightLog[];
  measurements?: Measurement[];
  recovery?: RecoveryCheck[];
  customExercises?: ExerciseLibraryItem[];
  favoriteExerciseIds?: string[];
  recentExerciseIds?: string[];
  draftSession?: { dayId: string; logs: Record<string, SetLog[]>; startedAt: number } | null;
}