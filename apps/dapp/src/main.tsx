import "./index.css";
import "./polyfills.ts";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "./context/router.tsx";
import { ThemeProvider, Toaster } from "@repo/ui";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);
