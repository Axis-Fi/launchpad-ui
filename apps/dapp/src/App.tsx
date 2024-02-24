import { Providers } from "./context/providers";
import { Outlet } from "react-router-dom";
import { AppFooter } from "modules/app/app-footer";
import { AppHeader } from "modules/app/app-header";
import ScrollToTop from "modules/app/scroll-to-top";

function App() {
  return (
    <Providers>
      <ScrollToTop />
      <div className="mx-auto flex h-screen max-w-[1300px] flex-col justify-between">
        <div>
          <AppHeader />
          <div className="mx-auto mt-10 w-full max-w-[1137px]">
            <Outlet />
          </div>
        </div>
        <AppFooter />
      </div>
    </Providers>
  );
}

export default App;
