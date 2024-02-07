import Navbar from "components/navbar";
import ConnectButton from "./components/connect-button";
import { Providers } from "./context/providers";
import { Outlet } from "react-router-dom";
import { ThemeSwitcher } from "@repo/ui";

function App() {
  return (
    <Providers>
      <div className="font-aeonfono mx-auto h-screen max-w-[1137px] py-4">
        <div className="mx-auto flex justify-between">
          <div className="w-1/3 text-4xl">
            <img className="h-12 w-12" src="/favicon.svg" />
          </div>
          <Navbar />

          <div className="flex w-1/3 items-center justify-end gap-x-2">
            <ConnectButton />
            <ThemeSwitcher />
          </div>
        </div>

        <Outlet />
      </div>
    </Providers>
  );
}

export default App;
