import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Dumbbell, Check } from "lucide-react";
import { setProfile, setPlan, setGoals } from "@/lib/nextrep/storage";
import { generatePlan } from "@/lib/nextrep/plan";
import { calcGoals } from "@/lib/nextrep/nutrition";
import type { Experience, Gender, Goal, Profile, SplitType } from "@/lib/nextrep/types";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
  ssr: false,
});

type Draft = Partial<Profile>;
const STEPS = 7;

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ unit: "metric", frequency: 4, progression: "double" });
  const set = (p: Draft) => setDraft((d) => ({ ...d, ...p }));
  const next = () => setStep((s) => Math.min(STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));
  const finish = () => {
    const profile = { ...draft, createdAt: new Date().toISOString() } as Profile;
    setProfile(profile);
    setPlan(generatePlan(profile));
    setGoals(calcGoals(profile));
    navigate({ to: "/home", replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-6 pt-12 pb-8">
      <div className="flex items-center gap-3 mb-8">
        <button onClick={back} disabled={step === 0} className="w-10 h-10 rounded-full grid place-items-center glass disabled:opacity-30">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS) * 100}%`, background: "var(--gradient-primary)" }} />
        </div>
        <div className="text-xs text-muted-foreground tabular-nums">{step + 1}/{STEPS}</div>
      </div>

      <div className="flex-1 flex flex-col">
        {step === 0 && <Welcome onNext={() => { set({ name: "Athlete" }); next(); }} />}
        {step === 1 && <BasicsStep draft={draft} set={set} />}
        {step === 2 && <BodyStep draft={draft} set={set} />}
        {step === 3 && <ExpStep draft={draft} set={set} />}
        {step === 4 && <GoalStep draft={draft} set={set} />}
        {step === 5 && <FreqStep draft={draft} set={set} />}
        {step === 6 && <SplitStep draft={draft} set={set} />}
      </div>

      <div className="pt-6">
        <button
          onClick={step === STEPS - 1 ? finish : next}
          disabled={!canProceed(step, draft)}
          className="w-full h-14 rounded-2xl font-semibold text-primary-foreground shadow-[var(--shadow-glow)] disabled:opacity-40 disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          style={{ background: "var(--gradient-primary)" }}
        >
          {step === STEPS - 1 ? "Generate my plan" : "Continue"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function canProceed(step: number, d: Draft) {
  if (step === 0) return true;
  if (step === 1) return !!d.gender && !!d.age && d.age >= 12;
  if (step === 2) return !!d.heightCm && !!d.weightKg && !!d.targetWeightKg;
  if (step === 3) return !!d.experience;
  if (step === 4) return !!d.goal;
  if (step === 5) return !!d.frequency;
  if (step === 6) return !!d.split;
  return false;
}

function Welcome({ onNext: _onNext }: { onNext: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 rounded-3xl grid place-items-center shadow-[var(--shadow-glow)] mb-8" style={{ background: "var(--gradient-primary)" }}>
        <Dumbbell className="w-10 h-10 text-primary-foreground" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight mb-3">Welcome to <span className="text-gradient">Reppilot</span></h1>
      <p className="text-muted-foreground max-w-xs mb-8 leading-relaxed">Stop guessing. We'll tell you exactly what to lift, when to push, and when to rest.</p>
      <div className="w-full space-y-3 text-left">
        {["Automatic progressive overload","Personalized workout plans","Smart nutrition targets"].map((f) => (
          <div key={f} className="flex items-center gap-3 glass rounded-2xl px-4 py-3">
            <div className="w-6 h-6 rounded-full grid place-items-center bg-primary/20"><Check className="w-3.5 h-3.5 text-primary" /></div>
            <span className="text-sm">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8">
      <div className="text-xs uppercase tracking-widest text-primary font-medium mb-2">{eyebrow}</div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

function Choice<T extends string>({ value, active, onClick, children }: { value: T; active: boolean; onClick: (v: T) => void; children: React.ReactNode }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`w-full text-left rounded-2xl px-5 py-4 border transition-all active:scale-[0.98] ${active ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]" : "border-white/5 bg-card hover:bg-card-elevated"}`}
    >
      {children}
    </button>
  );
}

function NumInput({ label, value, onChange, suffix }: { label: string; value?: number; onChange: (v: number) => void; suffix: string }) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground mb-2">{label}</div>
      <div className="flex items-center gap-2 rounded-2xl bg-card border border-white/5 px-4 py-3 focus-within:border-primary transition-colors">
        <input type="number" inputMode="numeric" value={value ?? ""} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 bg-transparent outline-none text-2xl font-semibold tabular-nums" placeholder="0" />
        <span className="text-sm text-muted-foreground">{suffix}</span>
      </div>
    </label>
  );
}

function BasicsStep({ draft, set }: { draft: Draft; set: (p: Draft) => void }) {
  return (
    <div>
      <StepTitle eyebrow="About you" title="Let's get the basics." />
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {(["male", "female", "other"] as Gender[]).map((g) => (
            <Choice key={g} value={g} active={draft.gender === g} onClick={(v) => set({ gender: v })}>
              <div className="text-center capitalize font-medium">{g}</div>
            </Choice>
          ))}
        </div>
        <NumInput label="Age" value={draft.age} onChange={(age) => set({ age })} suffix="yrs" />
      </div>
    </div>
  );
}

function BodyStep({ draft, set }: { draft: Draft; set: (p: Draft) => void }) {
  return (
    <div>
      <StepTitle eyebrow="Your body" title="Your stats today." />
      <div className="space-y-3">
        <NumInput label="Height" value={draft.heightCm} onChange={(heightCm) => set({ heightCm })} suffix="cm" />
        <NumInput label="Weight" value={draft.weightKg} onChange={(weightKg) => set({ weightKg })} suffix="kg" />
        <NumInput label="Target weight" value={draft.targetWeightKg} onChange={(targetWeightKg) => set({ targetWeightKg })} suffix="kg" />
      </div>
    </div>
  );
}

function ExpStep({ draft, set }: { draft: Draft; set: (p: Draft) => void }) {
  const opts: { v: Experience; t: string; d: string }[] = [
    { v: "beginner", t: "Beginner", d: "Less than 1 year lifting" },
    { v: "intermediate", t: "Intermediate", d: "1–3 years, know the basics" },
    { v: "advanced", t: "Advanced", d: "3+ years, chasing PRs" },
  ];
  return (
    <div>
      <StepTitle eyebrow="Experience" title="How long have you trained?" />
      <div className="space-y-3">
        {opts.map((o) => (
          <Choice key={o.v} value={o.v} active={draft.experience === o.v} onClick={(v) => set({ experience: v })}>
            <div className="font-semibold">{o.t}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{o.d}</div>
          </Choice>
        ))}
      </div>
    </div>
  );
}

function GoalStep({ draft, set }: { draft: Draft; set: (p: Draft) => void }) {
  const opts: { v: Goal; t: string; d: string }[] = [
    { v: "lose_fat", t: "Lose fat", d: "Get lean, keep strength" },
    { v: "gain_muscle", t: "Gain muscle", d: "Build size in a surplus" },
    { v: "get_stronger", t: "Get stronger", d: "Focus on the big lifts" },
    { v: "recomp", t: "Recomp", d: "Slow, sustainable body change" },
  ];
  return (
    <div>
      <StepTitle eyebrow="Goal" title="What are we chasing?" />
      <div className="space-y-3">
        {opts.map((o) => (
          <Choice key={o.v} value={o.v} active={draft.goal === o.v} onClick={(v) => set({ goal: v })}>
            <div className="font-semibold">{o.t}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{o.d}</div>
          </Choice>
        ))}
      </div>
    </div>
  );
}

function FreqStep({ draft, set }: { draft: Draft; set: (p: Draft) => void }) {
  return (
    <div>
      <StepTitle eyebrow="Schedule" title="How many days per week?" />
      <div className="grid grid-cols-5 gap-2">
        {[2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => set({ frequency: n })}
            className={`aspect-square rounded-2xl border transition-all font-bold text-2xl tabular-nums ${draft.frequency === n ? "border-primary bg-primary/10 text-primary shadow-[var(--shadow-glow)]" : "border-white/5 bg-card text-foreground"}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function SplitStep({ draft, set }: { draft: Draft; set: (p: Draft) => void }) {
  const opts: { v: SplitType; t: string; d: string }[] = [
    { v: "ppl", t: "Push · Pull · Legs", d: "3-day rotation, great for 4–6 days" },
    { v: "upperlower", t: "Upper / Lower", d: "Balanced, ideal for 4 days" },
    { v: "fullbody", t: "Full Body", d: "Hit everything each session" },
  ];
  return (
    <div>
      <StepTitle eyebrow="Split" title="Pick your training style." />
      <div className="space-y-3">
        {opts.map((o) => (
          <Choice key={o.v} value={o.v} active={draft.split === o.v} onClick={(v) => set({ split: v })}>
            <div className="font-semibold">{o.t}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{o.d}</div>
          </Choice>
        ))}
      </div>
    </div>
  );
}