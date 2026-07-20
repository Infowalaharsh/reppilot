import { supabase } from "@/integrations/supabase/client";
import { loadState, saveState } from "./storage";
import type { AppState } from "./types";

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let currentUserId: string | null = null;
let stateListener: (() => void) | null = null;

export async function pullFromCloud(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("user_data")
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("cloud pull failed", error);
    return false;
  }
  if (data?.data && typeof data.data === "object") {
    const remote = data.data as Partial<AppState>;
    // If remote has a profile, use it; otherwise keep local for first-time onboarding.
    if (remote && Object.keys(remote).length > 0) {
      saveState({ ...loadState(), ...remote });
      return true;
    }
  }
  return false;
}

export async function pushToCloud(userId: string) {
  const state = loadState();
  const { error } = await supabase
    .from("user_data")
    .upsert({ user_id: userId, data: state as any, updated_at: new Date().toISOString() });
  if (error) console.error("cloud push failed", error);
}

function schedulePush() {
  if (!currentUserId) return;
  if (pushTimer) clearTimeout(pushTimer);
  const uid = currentUserId;
  pushTimer = setTimeout(() => pushToCloud(uid), 800);
}

export function startCloudSync(userId: string) {
  currentUserId = userId;
  if (stateListener) window.removeEventListener("nextrep:state", stateListener);
  stateListener = () => schedulePush();
  window.addEventListener("nextrep:state", stateListener);
}

export function stopCloudSync() {
  currentUserId = null;
  if (stateListener) {
    window.removeEventListener("nextrep:state", stateListener);
    stateListener = null;
  }
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
}