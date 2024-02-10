import Navbar from "components/navbar";
import ConnectButton from "./components/connect-button";
import { Providers } from "./context/providers";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@repo/ui";

function App() {
  const navigate = useNavigate();
  return (
    <Providers>
      <div className="font-aeonfono mx-auto h-screen max-w-[1137px] py-2">
        <div className="mx-auto flex justify-between">
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

        <Outlet />
      </div>
    </Providers>
  );
}

export default App;
