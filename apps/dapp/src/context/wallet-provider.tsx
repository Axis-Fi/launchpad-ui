import "@rainbow-me/rainbowkit/styles.css";

import { PropsWithChildren } from "react";
import {
  RainbowKitProvider,
  connectorsForWallets,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { activeChains } from "../config/chains";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

export const connectors = connectorsForWallets(
  [
    {
      groupName: "Common",
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
        disclaimer: () => (
          <p>
            This application is in beta, Axis is not resposible for the loss of
            your funds. Thread carefully.
          </p>
        ),
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
