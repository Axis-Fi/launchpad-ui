import Navbar from "components/navbar";
import ConnectButton from "./components/connect-button";
import { Providers } from "./context/providers";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Providers>
      <div className="mx-auto h-screen max-w-[1137px] py-4">
        <div className="mx-auto flex justify-between">
          <h1 className="w-1/3 text-4xl">Axis</h1>
          <Navbar />

          <div className="flex w-1/3 justify-end">
            <ConnectButton />
          </div>
        </div>

        <Outlet />
      </div>
    </Providers>
  );
}

export default App;
