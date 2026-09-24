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
