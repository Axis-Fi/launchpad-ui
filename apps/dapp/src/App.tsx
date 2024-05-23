import { Providers } from "./context/providers";
import { Outlet } from "react-router-dom";
import { AppFooter } from "modules/app/app-footer";
import { AppHeader } from "modules/app/app-header";
import ScrollToTop from "modules/app/scroll-to-top";
import { ReferrerChecker } from "modules/app/referrer-checker";

function App() {
  return (
    <Providers>
      <ScrollToTop />
      <ReferrerChecker />
      <div className="flex h-dvh flex-col justify-between">
        <div className="mx-auto w-full">
          <AppHeader />
          <div className="mx-auto mt-10 w-full">
            <Outlet />
          </div>
        </div>
        <AppFooter />
      </div>
    </Providers>
  );
}

export default App;
