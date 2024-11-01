import { ToggleProvider, TooltipProvider } from "@repo/ui";
import { BlockchainProvider } from "./blockchain-provider";
import { PointsProvider } from "./points-provider";
import { OriginSdkProvider } from "@repo/sdk/react";
import { OriginSdk } from "@repo/sdk";
import { getCloakServer, getMetadataServer } from "@repo/env";
import { DialogProvider } from "./dialog-provider";

const sdk = new OriginSdk({
  cloak: {
    url: getCloakServer().url,
  },
  metadata: {
    url: getMetadataServer().url,
  },
});

type ProviderProps = React.PropsWithChildren<{
  disableDevTools?: boolean;
  disableDialogProvider?: boolean;
}>;

export function Providers(props: ProviderProps) {
  return (
    <ToggleProvider initialToggle={true}>
      <BlockchainProvider disableDevTools={props.disableDevTools}>
        <PointsProvider>
          <OriginSdkProvider sdk={sdk}>
            <TooltipProvider delayDuration={350}>
              <DialogProvider disabled={props.disableDialogProvider}>
                {props.children}
              </DialogProvider>
            </TooltipProvider>
          </OriginSdkProvider>
        </PointsProvider>
      </BlockchainProvider>
    </ToggleProvider>
  );
}
