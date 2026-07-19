import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveRecovery } from "@/lib/nextrep/storage";
import { todayStr } from "@/lib/nextrep/selectors";

export function RecoverySheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [sleep, setSleep] = useState(3);
  const [stress, setStress] = useState(3);
  const [fatigue, setFatigue] = useState(3);
  const score = Math.round(((sleep + (6 - stress) + (6 - fatigue)) / 15) * 100);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl border-white/10 bg-card">
        <SheetHeader><SheetTitle>Recovery check-in</SheetTitle></SheetHeader>
        <div className="py-4 space-y-5">
          <Scale label="Sleep quality" value={sleep} onChange={setSleep} lo="Poor" hi="Great" />
          <Scale label="Stress level" value={stress} onChange={setStress} lo="Calm" hi="High" />
          <Scale label="Muscle fatigue" value={fatigue} onChange={setFatigue} lo="Fresh" hi="Sore" />
          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-xs uppercase tracking-widest text-primary">Recovery score</div>
            <div className="text-4xl font-bold tabular-nums">{score}</div>
          </div>
          <Button className="w-full h-12 rounded-2xl" onClick={() => {
            saveRecovery({ date: todayStr(), sleep, stress, fatigue, score });
            toast.success("Recovery logged");
            onOpenChange(false);
          }}>Save</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Scale({ label, value, onChange, lo, hi }: { label: string; value: number; onChange: (n: number) => void; lo: string; hi: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{lo} to {hi}</span>
      </div>
      <div className="flex gap-2">
        {[1,2,3,4,5].map((n) => (
          <button key={n} onClick={() => onChange(n)} className={`flex-1 h-11 rounded-xl text-sm font-semibold ${value === n ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]" : "bg-white/5 text-muted-foreground"}`}>{n}</button>
        ))}
      </div>
    </div>
  );
}