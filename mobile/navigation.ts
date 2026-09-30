import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import type { getRouter } from "../src/router";

export async function installAndroidBackButton(router: ReturnType<typeof getRouter>) {
  if (Capacitor.getPlatform() !== "android") return;
  await App.addListener("backButton", () => {
    // Radix sheets/dialogs handle Escape, including their focus restoration.
    if (document.querySelector('[role="dialog"], [role="alertdialog"]')) {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      return;
    }
    const path = router.state.location.pathname;
    if (["/", "/home", "/auth", "/onboarding"].includes(path)) {
      void App.minimizeApp();
    } else if (router.history.canGoBack()) {
      router.history.back();
    } else {
      void router.navigate({ to: "/home", replace: true });
    }
  });
}
