import { Providers } from "./context/providers";
import { Outlet } from "react-router-dom";
import { Toaster } from "@repo/ui";
import { AppFooter } from "modules/app/app-footer";
import { AppControl } from "modules/app/app-control";
import ScrollToTop from "modules/app/scroll-to-top";
import { ReferrerChecker } from "modules/app/referrer-checker";

import "modules/app/analytics";
import React from "react";
import analytics from "modules/app/analytics";

const disableDevTools =
  import.meta.env.VITE_DISABLE_REACT_QUERY_DEV_TOOLS === "true";

function App() {
  React.useEffect(() => {
    analytics.enableAutoPageviews();
  }, []);

  return (
    <Providers disableDevTools={disableDevTools}>
      <ScrollToTop />
      <ReferrerChecker />
      <Toaster />
      <div className="flex h-dvh flex-col justify-between overflow-x-hidden lg:overflow-x-visible">
        <div className="flex flex-grow flex-col-reverse lg:flex-col">
          <AppControl />
          <div className="flex-grow">
            <Outlet />
          </div>
        </div>
        <AppFooter />
      </div>
    </Providers>
  );
}

export default App;
