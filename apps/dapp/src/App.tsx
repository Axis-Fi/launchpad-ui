import { Providers } from "./context/providers";
import { Outlet } from "react-router-dom";
import { AppFooter } from "modules/app/app-footer";
import { AppControl } from "modules/app/app-control";
import ScrollToTop from "modules/app/scroll-to-top";
import { ReferrerChecker } from "modules/app/referrer-checker";

function App() {
  return (
    <Providers>
      <ScrollToTop />
      <ReferrerChecker />
      <div className="flex h-dvh flex-col justify-between overflow-x-hidden">
        <div className="mx-auto flex w-full flex-col-reverse lg:flex-col">
          <AppControl />
          <div className="mx-auto w-full">
            <Outlet />
          </div>
        </div>
        <AppFooter />
      </div>
    </Providers>
  );
}

export default App;
