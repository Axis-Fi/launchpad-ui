import "@rainbow-me/rainbowkit/styles.css";

import { PropsWithChildren } from "react";
import {
  RainbowKitProvider,
  connectorsForWallets,
  midnightTheme,
} from "@rainbow-me/rainbowkit";

import { activeChains } from "../config/chains";

import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [injectedWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  { projectId, appName: "Axis Finance" },
);

export default function WalletProvider(props: PropsWithChildren) {
  return (
    <RainbowKitProvider
      appInfo={{
        appName: "Axis Finance",
        learnMoreUrl: "https://docs.axis.finance",
      }}
      //@ts-expect-error typg mismatch
      chains={activeChains}
      theme={midnightTheme()}
      modalSize="compact"
    >
      {props.children}
    </RainbowKitProvider>
  );
}
