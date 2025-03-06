import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  frameWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

const connectors = connectorsForWallets(
  [
    {
      groupName: "Common",
      wallets: [
        injectedWallet,
        rainbowWallet,
        frameWallet,
        walletConnectWallet,
      ],
    },
  ],
  { projectId, appName: "Axis Finance" },
);

export { connectors };
