import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  LogOut,
  Pencil,
  Target,
  Zap,
  User as UserIcon,
  RotateCcw,
  Scale,
  Ruler,
  CalendarDays,
  Flame,
  TrendingUp,
  Mail,
} from "lucide-react";
import { TabShell } from "@/components/nextrep/BottomNav";
import { useAppState } from "@/hooks/useAppState";
import { resetAll } from "@/lib/nextrep/storage";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProfileEditDrawer, useProfileRecord } from "@/components/nextrep/AccountEditor";

export const Route = createFileRoute("/profile")({
  component: Profile,
  ssr: false,
});

function Profile() {
  const state = useAppState();
  const nav = useNavigate();
  const { user } = useSession();
  const { record, refresh } = useProfileRecord();
  const [editing, setEditing] = useState(false);
  const p = state.profile;
  if (!p) return null;

  const name = record.displayName ?? p.name;

  return (
    <TabShell>
      <div className="animate-fade-in">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] glass shadow-[var(--shadow-card)] mb-4">
          <div
            className="absolute inset-x-0 -top-24 h-56 opacity-40 blur-2xl pointer-events-none"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-7">
            <div
              className="w-28 h-28 md:w-32 md:h-32 rounded-[1.75rem] overflow-hidden grid place-items-center shrink-0 border border-white/10 shadow-[var(--shadow-glow)]"
              style={record.avatarUrl ? undefined : { background: "var(--gradient-primary)" }}
            >
              {record.avatarUrl ? (
                <img src={record.avatarUrl} alt={`${name} profile photo`} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 text-primary-foreground" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight truncate">{name}</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{user?.email ?? "Not signed in"}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip icon={<Target className="w-3 h-3" />} text={p.goal.replace("_", " ")} />
                <Chip icon={<TrendingUp className="w-3 h-3" />} text={p.experience} />
                <Chip icon={<Zap className="w-3 h-3" />} text={splitLabel(p.split)} />
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="h-11 px-5 rounded-2xl font-medium text-primary-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shrink-0"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Pencil className="w-4 h-4" /> Edit profile
            </button>
          </div>
        </section>

        {/* Bio */}
        <InfoCard title="About">
          <p className="text-sm leading-relaxed text-foreground/90">
            {record.bio?.trim() ? record.bio : "No bio yet — tap Edit profile to add one."}
          </p>
        </InfoCard>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard icon={<Scale className="w-4 h-4" />} label="Weight" value={`${p.weightKg}`} unit="kg" />
          <StatCard icon={<Ruler className="w-4 h-4" />} label="Height" value={`${p.heightCm}`} unit="cm" />
          <StatCard icon={<CalendarDays className="w-4 h-4" />} label="Age" value={`${p.age}`} unit="yrs" />
          <StatCard icon={<Flame className="w-4 h-4" />} label="Target" value={`${p.targetWeightKg}`} unit="kg" />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <InfoCard title="Training">
            <Row icon={<Zap className="w-4 h-4" />} label="Split" value={splitLabel(p.split)} />
            <Row icon={<Target className="w-4 h-4" />} label="Frequency" value={`${p.frequency} days/wk`} />
            <Row icon={<TrendingUp className="w-4 h-4" />} label="Progression" value={p.progression} />
          </InfoCard>

          <InfoCard title="Goals">
            <Row icon={<Scale className="w-4 h-4" />} label="Current weight" value={`${p.weightKg} kg`} />
            <Row icon={<Flame className="w-4 h-4" />} label="Target weight" value={`${p.targetWeightKg} kg`} />
            <Row icon={<Target className="w-4 h-4" />} label="Goal" value={p.goal.replace("_", " ")} />
          </InfoCard>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              toast.success("Signed out");
              nav({ to: "/auth", replace: true });
            }}
            className="w-full h-12 rounded-2xl border border-white/10 bg-white/[0.03] text-foreground font-medium flex items-center justify-center gap-2 hover:bg-white/[0.06] active:scale-[0.99] transition-all"
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
            className="w-full h-12 rounded-2xl border border-destructive/30 text-destructive font-medium flex items-center justify-center gap-2 hover:bg-destructive/10 active:scale-[0.99] transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset & start over
          </button>
        </div>
      </div>

      <ProfileEditDrawer
        open={editing}
        onOpenChange={setEditing}
        localName={p.name}
        record={record}
        onSaved={refresh}
      />
    </TabShell>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-wider text-muted-foreground capitalize">
      {icon}
      {text}
    </span>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="glass rounded-2xl p-4 shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5">
      <div className="w-8 h-8 rounded-xl grid place-items-center bg-primary/15 text-primary mb-3">{icon}</div>
      <div className="text-2xl font-bold tabular-nums leading-none">
        {value}
        <span className="text-xs font-medium text-muted-foreground ml-1">{unit}</span>
      </div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1.5">{label}</div>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-2 mb-4 shadow-[var(--shadow-card)]">
      <div className="text-xs uppercase tracking-widest text-muted-foreground px-4 pt-3 pb-2">{title}</div>
      <div className="px-4 pb-3 md:px-2">{children}</div>
    </div>
  );
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-0 md:px-2 py-3 border-t border-white/5 first:border-0">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="flex-1 text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium capitalize">{value}</div>
    </div>
  );
}

function splitLabel(s: string) {
  if (s === "ppl") return "Push Pull Legs";
  if (s === "upperlower") return "Upper / Lower";
  return "Full Body";
}
