import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { loadState } from "@/lib/nextrep/storage";

export const Route = createFileRoute("/")({
  component: Index,
  ssr: false,
});

function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    const s = loadState();
    navigate({ to: s.profile ? "/home" : "/onboarding", replace: true });
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <div className="w-14 h-14 rounded-2xl grid place-items-center shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
          <Dumbbell className="w-7 h-7 text-primary-foreground" />
        </div>
        <div className="text-lg font-semibold tracking-tight">Nextrep</div>
      </div>
    </div>
  );
}
