import Navbar from "components/navbar";
import ConnectButton from "./components/connect-button";
import { Providers } from "./context/providers";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@repo/ui";

function App() {
  const navigate = useNavigate();
  return (
    <Providers>
      <div className="mx-auto max-w-[1300px]">
        <div className="mx-auto flex max-h-[88px] justify-between py-6">
          <div className="flex cursor-pointer items-center gap-x-4 text-4xl">
            <div className="flex gap-x-2" onClick={() => navigate("/#/")}>
              <img width={80} height={26} src="/images/wordmark.svg" />
              <img width={30} height={26} src="/images/logo.svg" />
            </div>
            <Navbar />
          </div>

          <div className="flex items-center justify-end gap-x-2">
            <Button
              onClick={() => navigate("/create/auction")}
              className="uppercase"
            >
              Create Auction
            </Button>
            <ConnectButton />
          </div>
        </div>
      </div>

      <div className="font-aeonfono mx-auto max-w-[1137px]">
        <Outlet />
      </div>
    </Providers>
  );
}

export default App;
