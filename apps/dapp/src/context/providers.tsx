import { ThemeProvider, ToggleProvider, TooltipProvider } from "@repo/ui";
import { BlockchainProvider } from "./blockchain-provider";
import { PointsProvider } from "./points-provider";
import { OriginSdkProvider } from "@axis-finance/sdk/react";
import { createSdk } from "@axis-finance/sdk";
import { getCloakServer, getMetadataServer } from "@axis-finance/env";
import { DialogProvider } from "./dialog-provider";

const sdk = createSdk({
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
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
