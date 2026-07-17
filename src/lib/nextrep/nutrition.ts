import type { Profile, NutritionGoals } from "./types";

export function calcGoals(p: Profile): NutritionGoals {
  const s = p.gender === "male" ? 5 : p.gender === "female" ? -161 : -78;
  const bmr = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + s;
  const activity = 1.375 + Math.max(0, p.frequency - 3) * 0.075;
  let tdee = bmr * activity;
  if (p.goal === "lose_fat") tdee -= 400;
  else if (p.goal === "gain_muscle") tdee += 300;
  const calories = Math.round(tdee / 10) * 10;
  const proteinG = Math.round(p.weightKg * (p.goal === "lose_fat" ? 2.2 : 2.0));
  const fatG = Math.round((calories * 0.25) / 9);
  const carbsG = Math.max(0, Math.round((calories - proteinG * 4 - fatG * 9) / 4));
  const waterMl = Math.round(p.weightKg * 35);
  return { calories, proteinG, carbsG, fatG, waterMl };
}