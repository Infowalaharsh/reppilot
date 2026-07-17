import { useEffect, useState } from "react";
import { loadState } from "@/lib/nextrep/storage";
import type { AppState } from "@/lib/nextrep/types";

export function useAppState(): AppState {
  const [state, setState] = useState<AppState>(() => loadState());
  useEffect(() => {
    const sync = () => setState(loadState());
    sync();
    window.addEventListener("nextrep:state", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("nextrep:state", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return state;
}