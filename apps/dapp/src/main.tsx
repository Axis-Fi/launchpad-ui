import "./index.css";
import "./polyfills.ts";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "./context/router.tsx";
import { ThemeProvider } from "@repo/ui";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <RouterProvider />
    </ThemeProvider>
  </React.StrictMode>,
);
