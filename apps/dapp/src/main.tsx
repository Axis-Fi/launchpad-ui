import "./index.css";
import "./polyfills.ts";

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "./context/router.tsx";
import { ThemeProvider } from "@repo/ui";
import { environment } from "@repo/env";

// Cypress tests use msw mocked backend
async function enableBackendMocking() {
  if (!environment.isMockBackend) {
    return;
  }

  const { worker } = await import("./mocks/browser.ts");

  return worker.start();
}

enableBackendMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        <RouterProvider />
      </ThemeProvider>
    </React.StrictMode>,
  );
});
