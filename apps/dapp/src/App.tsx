import { Providers } from "./context/providers";
import { Outlet } from "react-router-dom";
import { AppFooter } from "modules/app/app-footer";
import { AppControl } from "modules/app/app-control";
import ScrollToTop from "modules/app/scroll-to-top";
import { ReferrerChecker } from "modules/app/referrer-checker";

const disableDevTools =
  import.meta.env.VITE_DISABLE_REACT_QUERY_DEV_TOOLS === "true";

function App() {
  return (
    <Providers disableDevTools={disableDevTools}>
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
