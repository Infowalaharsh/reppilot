import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FOOD_LIBRARY } from "@/lib/nextrep/library";
import { addMeal } from "@/lib/nextrep/storage";
import { todayStr } from "@/lib/nextrep/selectors";
import type { FoodItem, MealSlot } from "@/lib/nextrep/types";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  slot: MealSlot;
}

export function FoodSheet({ open, onOpenChange, slot }: Props) {
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<FoodItem | null>(null);
  const [grams, setGrams] = useState(100);
  const [customName, setCustomName] = useState("");
  const [customKcal, setCustomKcal] = useState(0);

  const filtered = useMemo(() => {
    const lq = q.toLowerCase().trim();
    return FOOD_LIBRARY.filter((f) => !lq || f.name.toLowerCase().includes(lq));
  }, [q]);

  const reset = () => {
    setQ("");
    setPicked(null);
    setGrams(100);
    setCustomName("");
    setCustomKcal(0);
  };

  const save = () => {
    if (picked) {
      const f = grams / 100;
      addMeal({
        id: crypto.randomUUID(),
        date: todayStr(),
        slot,
        name: `${picked.name} (${grams}g)`,
        grams,
        kcal: Math.round(picked.kcalPer100g * f),
        proteinG: Math.round(picked.proteinPer100g * f),
        carbsG: Math.round(picked.carbsPer100g * f),
        fatG: Math.round(picked.fatPer100g * f),
        createdAt: new Date().toISOString(),
      });
      toast.success(`Added to ${slot}`);
      reset();
      onOpenChange(false);
    } else if (customName.trim() && customKcal > 0) {
      addMeal({
        id: crypto.randomUUID(),
        date: todayStr(),
        slot,
        name: customName.trim(),
        grams: 0,
        kcal: customKcal,
        proteinG: 0,
        carbsG: 0,
        fatG: 0,
        createdAt: new Date().toISOString(),
      });
      toast.success(`Added to ${slot}`);
      reset();
      onOpenChange(false);
    } else {
      toast.error("Pick a food or enter a custom meal");
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <SheetContent side="bottom" className="h-[92vh] flex flex-col rounded-t-3xl border-white/10 bg-card p-0">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle className="capitalize">Add to {slot}</SheetTitle>
        </SheetHeader>

        {!picked ? (
          <>
            <div className="px-4 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search foods" className="pl-9 h-11 rounded-xl" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
              {filtered.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setPicked(f)}
                  className="w-full glass rounded-2xl p-3 flex items-center gap-3 shadow-[var(--shadow-card)] text-left"
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{f.name}</div>
                    <div className="text-[11px] text-muted-foreground">{f.kcalPer100g} kcal · P{f.proteinPer100g} C{f.carbsPer100g} F{f.fatPer100g} / 100g</div>
                  </div>
                </button>
              ))}
              <div className="glass rounded-2xl p-3 space-y-2 shadow-[var(--shadow-card)]">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Or add a custom meal</div>
                <Input placeholder="Name" value={customName} onChange={(e) => setCustomName(e.target.value)} className="h-10 rounded-xl" />
                <Input type="number" inputMode="numeric" placeholder="Calories" value={customKcal || ""} onChange={(e) => setCustomKcal(Number(e.target.value))} className="h-10 rounded-xl" />
                <Button className="w-full h-11 rounded-xl" onClick={save}>Add custom</Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
            <div className="glass rounded-2xl p-4">
              <div className="text-lg font-semibold">{picked.name}</div>
              <div className="text-xs text-muted-foreground">Per 100g: {picked.kcalPer100g} kcal · P{picked.proteinPer100g} C{picked.carbsPer100g} F{picked.fatPer100g}</div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Grams</label>
              <Input type="number" inputMode="numeric" value={grams} onChange={(e) => setGrams(Math.max(0, Number(e.target.value)))} className="h-12 rounded-xl text-lg" />
            </div>
            <div className="glass rounded-2xl p-4 grid grid-cols-4 gap-2 text-center">
              <Total label="kcal" value={Math.round(picked.kcalPer100g * grams / 100)} />
              <Total label="P" value={Math.round(picked.proteinPer100g * grams / 100)} />
              <Total label="C" value={Math.round(picked.carbsPer100g * grams / 100)} />
              <Total label="F" value={Math.round(picked.fatPer100g * grams / 100)} />
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1 h-12 rounded-2xl" onClick={() => setPicked(null)}>Back</Button>
              <Button className="flex-1 h-12 rounded-2xl" onClick={save}>Add</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Total({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
    </div>
  );
}