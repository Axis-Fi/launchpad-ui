import "@rainbow-me/rainbowkit/styles.css";

import { PropsWithChildren } from "react";
import { RainbowKitProvider, midnightTheme } from "@rainbow-me/rainbowkit";

export default function WalletProvider(props: PropsWithChildren) {
  return (
    <RainbowKitProvider
      appInfo={{
        appName: "Axis Finance",
        learnMoreUrl: "https://docs.axis.finance",
        disclaimer: () => (
          <p>
            This application is in alpha stage, so there&apos;s obviously bugs
            and broken stuff.
          </p>
        ),
      }}
      theme={midnightTheme()}
      modalSize="compact"
    >
      {props.children}
    </RainbowKitProvider>
  );
}
