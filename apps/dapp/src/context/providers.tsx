import { ToggleProvider, TooltipProvider } from "@repo/ui";
import { BlockchainProvider } from "./blockchain-provider";
import { PointsProvider } from "./points-provider";
import { OriginSdkProvider } from "@axis-finance/sdk/react";
import { DialogProvider } from "./dialog-provider";
import { sdk } from "utils/sdk";

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
