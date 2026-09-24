import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";
import { App } from "@capacitor/app";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const isNativeApp = Capacitor.isNativePlatform();
export const nativeGoogleEnabled = import.meta.env.VITE_NATIVE_GOOGLE_AUTH === "true";
export const nativeAuthRedirect = "app.reppilot.mobile://auth/callback";

// A separate PKCE client avoids changing Lovable's web OAuth integration.
let oauthClient: ReturnType<typeof createClient> | undefined;
function getOAuthClient() {
  return (oauthClient ??= createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        flowType: "pkce",
        storageKey: "reppilot-native-oauth",
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  ));
}

export async function signInWithNativeGoogle() {
  const { data, error } = await getOAuthClient().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: nativeAuthRedirect, skipBrowserRedirect: true },
  });
  if (error) throw error;
  if (!data.url) throw new Error("Google sign-in could not start.");
  await Browser.open({ url: data.url });
}

export async function listenForNativeAuth(onError: (message: string) => void) {
  if (!isNativeApp || !nativeGoogleEnabled) return;
  const active = new Set<string>();
  async function receive(url: string) {
    const parsed = new URL(url);
    if (`${parsed.protocol}//${parsed.host}${parsed.pathname}` !== nativeAuthRedirect) return;
    if (active.has(url)) return;
    active.add(url);
    try {
      const error = parsed.searchParams.get("error_description");
      if (error) throw new Error(error);
      const code = parsed.searchParams.get("code");
      if (!code) throw new Error("Sign-in callback did not contain a code.");
      const result = await getOAuthClient().auth.exchangeCodeForSession(code);
      if (result.error) throw result.error;
      if (!result.data.session) throw new Error("Sign-in did not return a session.");
      const { error: sessionError } = await supabase.auth.setSession(result.data.session);
      if (sessionError) throw sessionError;
      // The main client now owns refresh and persistence.
      localStorage.removeItem("reppilot-native-oauth");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Google sign-in failed.");
    } finally {
      await Browser.close().catch(() => {});
    }
  }
  await App.addListener("appUrlOpen", ({ url }) => {
    void receive(url);
  });
  const launch = await App.getLaunchUrl();
  if (launch?.url) await receive(launch.url);
}
