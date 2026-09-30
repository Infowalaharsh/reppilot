import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { fileURLToPath } from "node:url";

// A separate client-only build: the website keeps its TanStack Start server.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  for (const key of ["VITE_SUPABASE_URL", "VITE_SUPABASE_PUBLISHABLE_KEY"]) {
    if (!(process.env[key] || env[key])) throw new Error(`Missing ${key}`);
  }
  return {
    root: "mobile",
    define: { "import.meta.env.VITE_ANDROID_BUILD": "true" },
    envDir: "..",
    publicDir: "../public",
    resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
    plugins: [
      tanstackRouter({
        target: "react",
        routesDirectory: fileURLToPath(new URL("./src/routes", import.meta.url)),
        generatedRouteTree: fileURLToPath(new URL("./src/routeTree.gen.ts", import.meta.url)),
        autoCodeSplitting: false,
        addFileFooter: [
          "import type { getRouter } from './router.tsx'",
          "import type { startInstance } from './start.ts'",
          "declare module '@tanstack/react-start' { interface Register { ssr: true; router: Awaited<ReturnType<typeof getRouter>>; config: Awaited<ReturnType<typeof startInstance.getOptions>> } }",
        ],
      }),
      react(),
      tailwindcss(),
    ],
    build: { outDir: "../dist-android", emptyOutDir: true },
  };
});
