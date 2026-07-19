import { useMemo, useState } from "react";
import { Search, Star, Plus, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EXERCISE_CATEGORIES, EXERCISE_LIBRARY } from "@/lib/nextrep/library";
import type { ExerciseLibraryItem } from "@/lib/nextrep/types";
import { useAppState } from "@/hooks/useAppState";
import {
  deleteCustomExercise,
  markRecentExercise,
  saveCustomExercise,
  toggleFavoriteExercise,
} from "@/lib/nextrep/storage";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onPick: (item: ExerciseLibraryItem) => void;
}

export function ExerciseLibrarySheet({ open, onOpenChange, onPick }: Props) {
  const state = useAppState();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [creating, setCreating] = useState(false);

  const customs = state.customExercises ?? [];
  const favs = state.favoriteExerciseIds ?? [];
  const recents = state.recentExerciseIds ?? [];

  const all = useMemo(() => [...EXERCISE_LIBRARY, ...customs], [customs]);
  const filtered = useMemo(() => {
    const lq = q.toLowerCase().trim();
    return all.filter((e) => {
      if (cat !== "All" && cat !== "Favorites" && cat !== "Recent" && e.category !== cat) return false;
      if (cat === "Favorites" && !favs.includes(e.id)) return false;
      if (cat === "Recent" && !recents.includes(e.id)) return false;
      if (lq && !e.name.toLowerCase().includes(lq) && !e.muscle.toLowerCase().includes(lq)) return false;
      return true;
    });
  }, [all, q, cat, favs, recents]);

  const pick = (item: ExerciseLibraryItem) => {
    markRecentExercise(item.id);
    onPick(item);
    onOpenChange(false);
  };

  const chips = ["All", "Favorites", "Recent", ...EXERCISE_CATEGORIES];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[92vh] flex flex-col rounded-t-3xl border-white/10 bg-card p-0">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle>Exercise library</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercises" className="pl-9 h-11 rounded-xl" />
          </div>
          <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`shrink-0 px-3 h-8 rounded-full text-xs font-medium transition-colors ${
                  cat === c ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          <button
            onClick={() => setCreating(true)}
            className="w-full glass rounded-2xl p-3 flex items-center gap-3 shadow-[var(--shadow-card)]"
          >
            <div className="w-10 h-10 rounded-xl grid place-items-center bg-primary/10 text-primary">
              <Plus className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold">Create custom exercise</div>
              <div className="text-[11px] text-muted-foreground">Add your own movement</div>
            </div>
          </button>
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-8">No exercises found.</div>
          )}
          {filtered.map((e) => (
            <div key={e.id} className="glass rounded-2xl p-3 flex items-center gap-3 shadow-[var(--shadow-card)]">
              <button className="flex-1 flex items-center gap-3 text-left" onClick={() => pick(e)}>
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-primary/10 text-primary text-xs font-bold">
                  {e.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{e.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{e.muscle} · {e.equipment}</div>
                </div>
              </button>
              <button
                onClick={() => toggleFavoriteExercise(e.id)}
                className={`w-9 h-9 rounded-lg grid place-items-center ${favs.includes(e.id) ? "text-primary" : "text-muted-foreground"}`}
                aria-label="Favorite"
              >
                <Star className={`w-4 h-4 ${favs.includes(e.id) ? "fill-current" : ""}`} />
              </button>
              {e.custom && (
                <button
                  onClick={() => {
                    deleteCustomExercise(e.id);
                    toast.success("Custom exercise deleted");
                  }}
                  className="w-9 h-9 rounded-lg grid place-items-center text-destructive"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {creating && (
          <CreateCustom
            onClose={() => setCreating(false)}
            onCreated={(item) => {
              setCreating(false);
              pick(item);
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function CreateCustom({ onClose, onCreated }: { onClose: () => void; onCreated: (i: ExerciseLibraryItem) => void }) {
  const [name, setName] = useState("");
  const [muscle, setMuscle] = useState("");
  const [equipment, setEquipment] = useState("");
  const [category, setCategory] = useState<ExerciseLibraryItem["category"]>("Chest");
  return (
    <div className="absolute inset-0 bg-card p-5 z-10 flex flex-col">
      <div className="text-lg font-semibold mb-4">New custom exercise</div>
      <div className="space-y-3 flex-1">
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" />
        <Input placeholder="Muscle" value={muscle} onChange={(e) => setMuscle(e.target.value)} className="h-11 rounded-xl" />
        <Input placeholder="Equipment" value={equipment} onChange={(e) => setEquipment(e.target.value)} className="h-11 rounded-xl" />
        <div className="flex gap-2 flex-wrap">
          {EXERCISE_CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={`px-3 h-8 rounded-full text-xs font-medium ${category === c ? "bg-primary text-primary-foreground" : "bg-white/5"}`}>{c}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <Button variant="ghost" className="flex-1 h-12 rounded-2xl" onClick={onClose}>Cancel</Button>
        <Button
          className="flex-1 h-12 rounded-2xl"
          onClick={() => {
            if (!name.trim()) {
              toast.error("Name is required");
              return;
            }
            const item: ExerciseLibraryItem = {
              id: `custom-${Date.now().toString(36)}`,
              name: name.trim(),
              muscle: muscle.trim() || "General",
              equipment: equipment.trim() || "None",
              category,
              custom: true,
            };
            saveCustomExercise(item);
            toast.success("Custom exercise saved");
            onCreated(item);
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}