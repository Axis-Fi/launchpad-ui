import ConnectButton from "./components/connect-button";

import { BlockchainProvider } from "./context/blockchain-provider";
import RouterProvider from "./context/router";
import "./index.css";

function App() {
  return (
    <BlockchainProvider>
      <div className="mx-auto mt-4 h-full max-w-[1137px]">
        <div className="mx-auto flex h-full justify-between">
          <h1 className="text-4xl">Axis App</h1>
          <div className="h-min">
            <ConnectButton />
          </div>
        </div>

        <RouterProvider />
      </div>
    </BlockchainProvider>
  );
}

export default App;
