import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings, Target, Zap, User as UserIcon, RotateCcw } from "lucide-react";
import { TabShell } from "@/components/nextrep/BottomNav";
import { useAppState } from "@/hooks/useAppState";
import { resetAll } from "@/lib/nextrep/storage";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: Profile,
  ssr: false,
});

function Profile() {
  const state = useAppState();
  const nav = useNavigate();
  const { user } = useSession();
  const p = state.profile;
  if (!p) return null;

  return (
    <TabShell>
      <header className="mb-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl grid place-items-center shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
          <UserIcon className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{p.name}</h1>
          <div className="text-xs text-muted-foreground capitalize">{p.experience} \u00b7 {p.goal.replace("_", " ")}</div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <MiniStat label="Weight" value={`${p.weightKg}`} unit="kg" />
        <MiniStat label="Height" value={`${p.heightCm}`} unit="cm" />
        <MiniStat label="Age" value={`${p.age}`} unit="yrs" />
      </div>

      <Section title="Training">
        <Row icon={<Zap className="w-4 h-4" />} label="Split" value={splitLabel(p.split)} />
        <Row icon={<Target className="w-4 h-4" />} label="Frequency" value={`${p.frequency} days/wk`} />
        <Row icon={<Settings className="w-4 h-4" />} label="Progression" value={p.progression} />
      </Section>

      <Section title="Goals">
        <Row label="Current weight" value={`${p.weightKg} kg`} />
        <Row label="Target weight" value={`${p.targetWeightKg} kg`} />
      </Section>

      {user && (
        <Section title="Account">
          <Row label="Signed in as" value={user.email ?? "—"} />
        </Section>
      )}

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          toast.success("Signed out");
          nav({ to: "/auth", replace: true });
        }}
        className="w-full h-12 rounded-2xl border border-white/10 text-foreground font-medium flex items-center justify-center gap-2 active:scale-[0.99] transition-transform mb-3"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>

      <button
        onClick={() => {
          if (confirm("Reset all data and start over?")) {
            resetAll();
            nav({ to: "/onboarding", replace: true });
          }
        }}
        className="w-full h-12 rounded-2xl border border-destructive/30 text-destructive font-medium flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
      >
        <RotateCcw className="w-4 h-4" /> Reset & start over
      </button>
    </TabShell>
  );
}

function MiniStat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="glass rounded-2xl p-3 text-center shadow-[var(--shadow-card)]">
      <div className="text-xl font-bold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label} \u00b7 {unit}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-2 mb-4 shadow-[var(--shadow-card)]">
      <div className="text-xs uppercase tracking-widest text-muted-foreground px-3 pt-2 pb-1">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 border-t border-white/5 first:border-0">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="flex-1 text-sm">{label}</div>
      <div className="text-sm font-medium capitalize">{value}</div>
    </div>
  );
}

function splitLabel(s: string) {
  if (s === "ppl") return "Push Pull Legs";
  if (s === "upperlower") return "Upper / Lower";
  return "Full Body";
}