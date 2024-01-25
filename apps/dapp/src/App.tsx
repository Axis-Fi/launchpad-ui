import ConnectButton from "./components/connect-button";

import { BlockchainProvider } from "./context/blockchain-provider";
import "./index.css";

function App() {
  return (
    <BlockchainProvider>
      <div className="h-full mt-4 mx-auto flex justify-between max-w-[1137px]">
        <h1 className="text-4xl">Axis App</h1>
        <div className="h-min">
          <ConnectButton />
        </div>
      </div>
    </BlockchainProvider>
  );
}

export default App;
