import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addDay } from "@/lib/nextrep/storage";
import type { WorkoutDay } from "@/lib/nextrep/types";

export const Route = createFileRoute("/workout/day/new")({ component: NewDay, ssr: false });

const templates = [
  { id: "push", name: "Push", focus: "Chest, Shoulders, Triceps" },
  { id: "pull", name: "Pull", focus: "Back, Biceps, Rear delts" },
  { id: "legs", name: "Legs", focus: "Quads, Hams, Glutes" },
  { id: "upper", name: "Upper", focus: "Chest, Back, Arms" },
  { id: "lower", name: "Lower", focus: "Quads, Hams, Glutes" },
  { id: "full", name: "Full Body", focus: "Total body strength" },
  { id: "custom", name: "Custom", focus: "Build from scratch" },
];

function NewDay() {
  const nav = useNavigate();
  const [pick, setPick] = useState("custom");
  const [name, setName] = useState("");
  const [focus, setFocus] = useState("");
  const chosen = templates.find((t) => t.id === pick)!;
  const create = () => {
    const day: WorkoutDay = {
      id: `day-${Date.now().toString(36)}`,
      name: (name || chosen.name).trim(),
      focus: (focus || chosen.focus).trim(),
      exercises: [],
    };
    addDay(day);
    toast.success("Workout day created");
    nav({ to: "/workout/day/$dayId/edit", params: { dayId: day.id }, replace: true });
  };
  return (
    <div className="min-h-screen max-w-md mx-auto px-5 pt-6 pb-8">
      <header className="flex items-center gap-3 mb-6">
        <button onClick={() => nav({ to: "/workout" })} className="w-10 h-10 rounded-full grid place-items-center glass"><ArrowLeft className="w-4 h-4" /></button>
        <div className="text-sm font-semibold">New workout day</div>
      </header>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Template</div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {templates.map((t) => (
          <button key={t.id} onClick={() => setPick(t.id)} className={`glass rounded-2xl p-4 text-left ${pick === t.id ? "border border-primary shadow-[var(--shadow-glow)]" : ""}`}>
            <div className="font-semibold">{t.name}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{t.focus}</div>
          </button>
        ))}
      </div>
      <div className="space-y-3 mb-6">
        <Input placeholder={chosen.name} value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-xl" />
        <Input placeholder={chosen.focus} value={focus} onChange={(e) => setFocus(e.target.value)} className="h-12 rounded-xl" />
      </div>
      <Button onClick={create} className="w-full h-14 rounded-2xl font-semibold" style={{ background: "var(--gradient-primary)" }}>Create day</Button>
    </div>
  );
}