// Bundle the same Poppins weights used by the website for offline Android rendering.
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "../src/router";
import "../src/styles.css";
import "./mobile.css";
import { toast } from "sonner";
import { listenForNativeAuth } from "../src/lib/native-auth";
import { installAndroidBackButton } from "./navigation";

const router = getRouter();
void installAndroidBackButton(router).catch(() =>
  toast.error("Phone navigation could not initialize."),
);
void listenForNativeAuth((message) => toast.error(message)).catch(() =>
  toast.error("Sign-in could not initialize."),
);
createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);
