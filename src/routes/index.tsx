import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Dumbbell } from "lucide-react";
import { loadState } from "@/lib/nextrep/storage";
import { useSession } from "@/hooks/useSession";

export const Route = createFileRoute("/")({
  component: Index,
  ssr: false,
});

function Index() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/auth", replace: true });
      return;
    }
    // Give cloud pull a beat to hydrate localStorage before deciding.
    const t = setTimeout(() => {
      const s = loadState();
      navigate({ to: s.profile ? "/home" : "/onboarding", replace: true });
    }, 400);
    return () => clearTimeout(t);
  }, [navigate, session, loading]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 animate-pulse">
        <div className="w-14 h-14 rounded-2xl grid place-items-center shadow-[var(--shadow-glow)]" style={{ background: "var(--gradient-primary)" }}>
          <Dumbbell className="w-7 h-7 text-primary-foreground" />
        </div>
        <div className="text-lg font-semibold tracking-tight">Reppilot</div>
      </div>
    </div>
  );
}
