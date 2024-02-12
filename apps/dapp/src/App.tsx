import { Providers } from "./context/providers";
import { Outlet } from "react-router-dom";
import { AppFooter } from "components/app-footer";
import { AppHeader } from "components/app-header";

function App() {
  return (
    <Providers>
      <div className="mx-auto flex h-screen max-w-[1300px] flex-col justify-between">
        <div>
          <AppHeader />
          <div className="mx-auto w-full max-w-[1137px]">
            <Outlet />
          </div>
        </div>
        <AppFooter />
      </div>
    </Providers>
  );
}

export default App;
