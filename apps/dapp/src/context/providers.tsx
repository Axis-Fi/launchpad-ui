import { ToggleProvider, TooltipProvider } from "@repo/ui";
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

type ProviderProps = React.PropsWithChildren<{
  disableDevTools?: boolean;
}>;

export function Providers(props: ProviderProps) {
  return (
    <ToggleProvider initialToggle={true}>
      <BlockchainProvider disableDevTools={props.disableDevTools}>
        <OriginSdkProvider sdk={sdk}>
          <TooltipProvider delayDuration={350}>
            {props.children}
          </TooltipProvider>
        </OriginSdkProvider>
      </BlockchainProvider>
    </ToggleProvider>
  );
}
