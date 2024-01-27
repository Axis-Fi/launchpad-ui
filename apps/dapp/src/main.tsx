import "./polyfills.ts";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "./context/router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider />
  </React.StrictMode>,
);
