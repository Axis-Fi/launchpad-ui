import { ToggleProvider, TooltipProvider } from "@repo/ui";
import { BlockchainProvider } from "./blockchain-provider";
import { OriginSdkProvider } from "@axis-finance/sdk/react";
import { sdk } from "utils/sdk";

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
