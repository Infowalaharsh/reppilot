import { createFileRoute } from "@tanstack/react-router";
import { Plus, Camera, Search } from "lucide-react";
import { TabShell } from "@/components/nextrep/BottomNav";
import { Ring } from "@/components/nextrep/Ring";
import { useAppState } from "@/hooks/useAppState";

export const Route = createFileRoute("/nutrition")({
  component: Nutrition,
  ssr: false,
});

function Nutrition() {
  const state = useAppState();
  const g = state.goals;
  if (!g) return null;
  const macros = [
    { label: "Protein", target: g.proteinG, color: "oklch(0.72 0.19 155)", suffix: "g" },
    { label: "Carbs", target: g.carbsG, color: "oklch(0.78 0.17 60)", suffix: "g" },
    { label: "Fat", target: g.fatG, color: "oklch(0.65 0.24 25)", suffix: "g" },
  ];
  return (
    <TabShell>
      <header className="mb-6">
        <div className="text-xs uppercase tracking-widest text-primary font-medium mb-1">Today</div>
        <h1 className="text-3xl font-bold tracking-tight">Nutrition</h1>
      </header>

      <div className="glass rounded-3xl p-6 mb-4 flex flex-col items-center shadow-[var(--shadow-card)]">
        <Ring value={0} size={180} stroke={14}>
          <div className="text-4xl font-bold tabular-nums">0</div>
          <div className="text-xs text-muted-foreground">/ {g.calories} kcal</div>
        </Ring>
        <div className="mt-3 text-sm text-muted-foreground">{g.calories} kcal remaining</div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {macros.map((m) => (
          <div key={m.label} className="glass rounded-2xl p-3 flex flex-col items-center shadow-[var(--shadow-card)]">
            <Ring value={0} size={64} stroke={6} color={m.color}>
              <div className="text-xs font-bold tabular-nums">0</div>
            </Ring>
            <div className="text-[10px] text-muted-foreground mt-1">{m.label} \u00b7 {m.target}{m.suffix}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        {["Breakfast", "Lunch", "Dinner", "Snacks"].map((meal) => (
          <div key={meal} className="glass rounded-2xl p-4 flex items-center gap-3 shadow-[var(--shadow-card)]">
            <div className="flex-1">
              <div className="font-semibold">{meal}</div>
              <div className="text-xs text-muted-foreground">0 kcal \u00b7 Tap to add</div>
            </div>
            <button className="w-10 h-10 rounded-full grid place-items-center bg-primary/10 text-primary"><Plus className="w-4 h-4" /></button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="glass rounded-2xl p-4 flex items-center gap-3 shadow-[var(--shadow-card)] active:scale-[0.98] transition-transform">
          <Search className="w-5 h-5 text-primary" /><span className="text-sm font-medium">Search foods</span>
        </button>
        <button className="glass rounded-2xl p-4 flex items-center gap-3 shadow-[var(--shadow-card)] active:scale-[0.98] transition-transform">
          <Camera className="w-5 h-5 text-primary" /><span className="text-sm font-medium">Snap meal</span>
        </button>
      </div>
    </TabShell>
  );
}

export default Nutrition;