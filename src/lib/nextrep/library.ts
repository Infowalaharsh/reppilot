import type { ExerciseLibraryItem, FoodItem } from "./types";

export const EXERCISE_CATEGORIES = [
  "Chest",
  "Back",
  "Shoulders",
  "Legs",
  "Arms",
  "Core",
  "Cardio",
] as const;

export const EXERCISE_LIBRARY: ExerciseLibraryItem[] = [
  // Chest
  { id: "bench", name: "Bench Press", category: "Chest", muscle: "Chest", equipment: "Barbell" },
  { id: "incline-bench", name: "Incline Bench Press", category: "Chest", muscle: "Chest", equipment: "Barbell" },
  { id: "incline-db", name: "Incline DB Press", category: "Chest", muscle: "Chest", equipment: "Dumbbell" },
  { id: "db-press", name: "Dumbbell Press", category: "Chest", muscle: "Chest", equipment: "Dumbbell" },
  { id: "chest-fly", name: "Cable Fly", category: "Chest", muscle: "Chest", equipment: "Cable" },
  { id: "pushup", name: "Push-Up", category: "Chest", muscle: "Chest", equipment: "Bodyweight" },
  { id: "dip", name: "Chest Dip", category: "Chest", muscle: "Chest", equipment: "Bodyweight" },
  // Back
  { id: "deadlift", name: "Deadlift", category: "Back", muscle: "Back", equipment: "Barbell" },
  { id: "pullup", name: "Pull-Up", category: "Back", muscle: "Back", equipment: "Bodyweight" },
  { id: "chinup", name: "Chin-Up", category: "Back", muscle: "Back", equipment: "Bodyweight" },
  { id: "row", name: "Barbell Row", category: "Back", muscle: "Back", equipment: "Barbell" },
  { id: "db-row", name: "Dumbbell Row", category: "Back", muscle: "Back", equipment: "Dumbbell" },
  { id: "lat-pulldown", name: "Lat Pulldown", category: "Back", muscle: "Back", equipment: "Cable" },
  { id: "seated-row", name: "Seated Cable Row", category: "Back", muscle: "Back", equipment: "Cable" },
  { id: "facepull", name: "Face Pull", category: "Back", muscle: "Rear delts", equipment: "Cable" },
  // Shoulders
  { id: "ohp", name: "Overhead Press", category: "Shoulders", muscle: "Shoulders", equipment: "Barbell" },
  { id: "db-ohp", name: "DB Shoulder Press", category: "Shoulders", muscle: "Shoulders", equipment: "Dumbbell" },
  { id: "lateral", name: "Lateral Raise", category: "Shoulders", muscle: "Side delts", equipment: "Dumbbell" },
  { id: "rear-fly", name: "Rear Delt Fly", category: "Shoulders", muscle: "Rear delts", equipment: "Dumbbell" },
  { id: "shrug", name: "Shrug", category: "Shoulders", muscle: "Traps", equipment: "Dumbbell" },
  { id: "arnold", name: "Arnold Press", category: "Shoulders", muscle: "Shoulders", equipment: "Dumbbell" },
  // Legs
  { id: "squat", name: "Back Squat", category: "Legs", muscle: "Quads", equipment: "Barbell" },
  { id: "front-squat", name: "Front Squat", category: "Legs", muscle: "Quads", equipment: "Barbell" },
  { id: "rdl", name: "Romanian Deadlift", category: "Legs", muscle: "Hamstrings", equipment: "Barbell" },
  { id: "legpress", name: "Leg Press", category: "Legs", muscle: "Quads", equipment: "Machine" },
  { id: "legcurl", name: "Leg Curl", category: "Legs", muscle: "Hamstrings", equipment: "Machine" },
  { id: "leg-ext", name: "Leg Extension", category: "Legs", muscle: "Quads", equipment: "Machine" },
  { id: "lunges", name: "Walking Lunges", category: "Legs", muscle: "Legs", equipment: "Dumbbell" },
  { id: "bulgarian", name: "Bulgarian Split Squat", category: "Legs", muscle: "Legs", equipment: "Dumbbell" },
  { id: "hipthrust", name: "Hip Thrust", category: "Legs", muscle: "Glutes", equipment: "Barbell" },
  { id: "calf", name: "Calf Raise", category: "Legs", muscle: "Calves", equipment: "Machine" },
  // Arms
  { id: "curl", name: "Barbell Curl", category: "Arms", muscle: "Biceps", equipment: "Barbell" },
  { id: "db-curl", name: "Dumbbell Curl", category: "Arms", muscle: "Biceps", equipment: "Dumbbell" },
  { id: "hammer-curl", name: "Hammer Curl", category: "Arms", muscle: "Biceps", equipment: "Dumbbell" },
  { id: "preacher", name: "Preacher Curl", category: "Arms", muscle: "Biceps", equipment: "Machine" },
  { id: "tricep-rope", name: "Triceps Rope Pushdown", category: "Arms", muscle: "Triceps", equipment: "Cable" },
  { id: "skullcrusher", name: "Skullcrusher", category: "Arms", muscle: "Triceps", equipment: "Barbell" },
  { id: "overhead-tri", name: "Overhead Triceps Ext.", category: "Arms", muscle: "Triceps", equipment: "Dumbbell" },
  { id: "close-bench", name: "Close-Grip Bench", category: "Arms", muscle: "Triceps", equipment: "Barbell" },
  // Core
  { id: "plank", name: "Plank", category: "Core", muscle: "Core", equipment: "Bodyweight" },
  { id: "hanging-leg", name: "Hanging Leg Raise", category: "Core", muscle: "Core", equipment: "Bodyweight" },
  { id: "cable-crunch", name: "Cable Crunch", category: "Core", muscle: "Core", equipment: "Cable" },
  { id: "russian-twist", name: "Russian Twist", category: "Core", muscle: "Core", equipment: "Dumbbell" },
  { id: "ab-wheel", name: "Ab Wheel Rollout", category: "Core", muscle: "Core", equipment: "Wheel" },
  // Cardio
  { id: "run", name: "Running", category: "Cardio", muscle: "Cardio", equipment: "None" },
  { id: "row-erg", name: "Rowing", category: "Cardio", muscle: "Cardio", equipment: "Machine" },
  { id: "bike", name: "Cycling", category: "Cardio", muscle: "Cardio", equipment: "Bike" },
  { id: "incline-walk", name: "Incline Walk", category: "Cardio", muscle: "Cardio", equipment: "Treadmill" },
  { id: "stairmaster", name: "StairMaster", category: "Cardio", muscle: "Cardio", equipment: "Machine" },
];

export function findLibraryItem(id: string, customs: ExerciseLibraryItem[] = []) {
  return EXERCISE_LIBRARY.find((e) => e.id === id) ?? customs.find((e) => e.id === id);
}

// per 100g
export const FOOD_LIBRARY: FoodItem[] = [
  { id: "chicken-breast", name: "Chicken breast", kcalPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
  { id: "beef-lean", name: "Lean beef", kcalPer100g: 217, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 12 },
  { id: "salmon", name: "Salmon", kcalPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
  { id: "tuna", name: "Tuna (canned in water)", kcalPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 1 },
  { id: "eggs", name: "Whole eggs", kcalPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11 },
  { id: "egg-whites", name: "Egg whites", kcalPer100g: 52, proteinPer100g: 11, carbsPer100g: 0.7, fatPer100g: 0.2 },
  { id: "greek-yogurt", name: "Greek yogurt (2%)", kcalPer100g: 73, proteinPer100g: 9, carbsPer100g: 4, fatPer100g: 2 },
  { id: "cottage", name: "Cottage cheese", kcalPer100g: 98, proteinPer100g: 11, carbsPer100g: 3.4, fatPer100g: 4.3 },
  { id: "milk", name: "Milk (2%)", kcalPer100g: 50, proteinPer100g: 3.3, carbsPer100g: 5, fatPer100g: 2 },
  { id: "whey", name: "Whey protein", kcalPer100g: 400, proteinPer100g: 80, carbsPer100g: 8, fatPer100g: 5 },
  { id: "rice-white", name: "White rice (cooked)", kcalPer100g: 130, proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.3 },
  { id: "rice-brown", name: "Brown rice (cooked)", kcalPer100g: 112, proteinPer100g: 2.6, carbsPer100g: 24, fatPer100g: 0.9 },
  { id: "oats", name: "Oats (dry)", kcalPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7 },
  { id: "pasta", name: "Pasta (cooked)", kcalPer100g: 131, proteinPer100g: 5, carbsPer100g: 25, fatPer100g: 1.1 },
  { id: "bread", name: "Whole wheat bread", kcalPer100g: 247, proteinPer100g: 13, carbsPer100g: 41, fatPer100g: 3.4 },
  { id: "potato", name: "Potato", kcalPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 0.1 },
  { id: "sweet-potato", name: "Sweet potato", kcalPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1 },
  { id: "banana", name: "Banana", kcalPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3 },
  { id: "apple", name: "Apple", kcalPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatPer100g: 0.2 },
  { id: "berries", name: "Berries", kcalPer100g: 43, proteinPer100g: 1, carbsPer100g: 10, fatPer100g: 0.4 },
  { id: "broccoli", name: "Broccoli", kcalPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4 },
  { id: "spinach", name: "Spinach", kcalPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4 },
  { id: "avocado", name: "Avocado", kcalPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15 },
  { id: "almonds", name: "Almonds", kcalPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50 },
  { id: "peanut-butter", name: "Peanut butter", kcalPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatPer100g: 50 },
  { id: "olive-oil", name: "Olive oil", kcalPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100 },
  { id: "cheese", name: "Cheddar cheese", kcalPer100g: 402, proteinPer100g: 25, carbsPer100g: 1.3, fatPer100g: 33 },
  { id: "tofu", name: "Tofu", kcalPer100g: 76, proteinPer100g: 8, carbsPer100g: 1.9, fatPer100g: 4.8 },
  { id: "beans", name: "Black beans (cooked)", kcalPer100g: 132, proteinPer100g: 8.9, carbsPer100g: 24, fatPer100g: 0.5 },
  { id: "quinoa", name: "Quinoa (cooked)", kcalPer100g: 120, proteinPer100g: 4.4, carbsPer100g: 21, fatPer100g: 1.9 },
];