import { TooltipProvider } from "@repo/ui";
import { BlockchainProvider } from "./blockchain-provider";
import { OriginSdkProvider } from "@repo/sdk/react";
import { OriginSdk } from "@repo/sdk";
import { getCloakServer } from "@repo/env";

const cloakServer = getCloakServer();

const sdk = new OriginSdk({
  cloak: {
    url: cloakServer.url,
  },
});

export function Providers(props: React.PropsWithChildren) {
  return (
    <BlockchainProvider>
      <OriginSdkProvider sdk={sdk}>
        <TooltipProvider delayDuration={350}>{props.children}</TooltipProvider>
      </OriginSdkProvider>
    </BlockchainProvider>
  );
}
