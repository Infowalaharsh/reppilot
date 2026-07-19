import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Droplet, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { TabShell } from "@/components/nextrep/BottomNav";
import { Ring } from "@/components/nextrep/Ring";
import { FoodSheet } from "@/components/nextrep/FoodSheet";
import { useAppState } from "@/hooks/useAppState";
import { addWater, deleteMeal } from "@/lib/nextrep/storage";
import { todayMeals, todayStr, totalsFor, waterFor } from "@/lib/nextrep/selectors";
import type { MealSlot } from "@/lib/nextrep/types";

export const Route = createFileRoute("/nutrition")({
  component: Nutrition,
  ssr: false,
});

const SLOTS: { id: MealSlot; label: string }[] = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snacks" },
];

function Nutrition() {
  const state = useAppState();
  const [slot, setSlot] = useState<MealSlot | null>(null);
  const g = state.goals;
  if (!g) return null;
  const meals = todayMeals(state.meals);
  const t = totalsFor(meals);
  const water = waterFor(state);
  const macros = [
    { label: "Protein", value: t.proteinG, target: g.proteinG, color: "oklch(0.72 0.19 155)" },
    { label: "Carbs", value: t.carbsG, target: g.carbsG, color: "oklch(0.78 0.17 60)" },
    { label: "Fat", value: t.fatG, target: g.fatG, color: "oklch(0.65 0.24 25)" },
  ];
  return (
    <TabShell>
      <header className="mb-6">
        <div className="text-xs uppercase tracking-widest text-primary font-medium mb-1">Today</div>
        <h1 className="text-3xl font-bold tracking-tight">Nutrition</h1>
      </header>
      <div className="glass rounded-3xl p-6 mb-4 flex flex-col items-center shadow-[var(--shadow-card)]">
        <Ring value={t.kcal / Math.max(1, g.calories)} size={180} stroke={14}>
          <div className="text-4xl font-bold tabular-nums">{t.kcal}</div>
          <div className="text-xs text-muted-foreground">/ {g.calories} kcal</div>
        </Ring>
        <div className="mt-3 text-sm text-muted-foreground">{Math.max(0, g.calories - t.kcal)} kcal remaining</div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {macros.map((m) => (
          <div key={m.label} className="glass rounded-2xl p-3 flex flex-col items-center shadow-[var(--shadow-card)]">
            <Ring value={m.value / Math.max(1, m.target)} size={64} stroke={6} color={m.color}>
              <div className="text-xs font-bold tabular-nums">{m.value}</div>
            </Ring>
            <div className="text-[10px] text-muted-foreground mt-1">{m.label} \u00b7 {m.target}g</div>
          </div>
        ))}
      </div>
      <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3 shadow-[var(--shadow-card)]">
        <div className="w-10 h-10 rounded-xl grid place-items-center bg-primary/10 text-primary"><Droplet className="w-5 h-5" /></div>
        <div className="flex-1">
          <div className="text-sm font-semibold">Water</div>
          <div className="text-xs text-muted-foreground">{water} / {g.waterMl} ml</div>
        </div>
        <button onClick={() => addWater(todayStr(), 250)} className="h-9 px-3 rounded-xl text-xs font-semibold bg-primary/10 text-primary">+250ml</button>
        <button onClick={() => addWater(todayStr(), -250)} className="h-9 px-3 rounded-xl text-xs font-semibold bg-white/5">-250</button>
      </div>
      <div className="space-y-3 mb-6">
        {SLOTS.map((s) => {
          const items = meals.filter((m) => m.slot === s.id);
          const kcal = items.reduce((a, m) => a + m.kcal, 0);
          return (
            <div key={s.id} className="glass rounded-2xl p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-semibold">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{kcal} kcal \u00b7 {items.length} item{items.length === 1 ? "" : "s"}</div>
                </div>
                <button onClick={() => setSlot(s.id)} className="w-10 h-10 rounded-full grid place-items-center bg-primary/10 text-primary" aria-label="Add"><Plus className="w-4 h-4" /></button>
              </div>
              {items.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {items.map((m) => (
                    <div key={m.id} className="flex items-center gap-2 py-1.5 border-t border-white/5">
                      <div className="flex-1 text-sm truncate">{m.name}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">{m.kcal}kcal</div>
                      <button onClick={() => { deleteMeal(m.id); toast.success("Removed"); }} className="w-7 h-7 grid place-items-center rounded-lg text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {slot && <FoodSheet open={!!slot} onOpenChange={(o) => !o && setSlot(null)} slot={slot} />}
    </TabShell>
  );
}