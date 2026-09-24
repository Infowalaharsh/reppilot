import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.reppilot.mobile",
  appName: "Reppilot",
  webDir: "dist-android",
  plugins: { SystemBars: { style: "DARK" } },
  android: { backgroundColor: "#0D0D0D" },
  ios: { backgroundColor: "#0D0D0D", contentInset: "always" },
};

export default config;
