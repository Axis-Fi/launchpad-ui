import { ToggleProvider, TooltipProvider } from "@repo/ui";
import { BlockchainProvider } from "./blockchain-provider";
import { AuthProvider } from "./auth-provider";
import { OriginSdkProvider } from "@repo/sdk/react";
import { OriginSdk } from "@repo/sdk";
import { getCloakServer } from "@repo/env";
import { DialogProvider } from "./dialog-provider";

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
        <AuthProvider>
          <OriginSdkProvider sdk={sdk}>
            <TooltipProvider delayDuration={350}>
              <DialogProvider>{props.children}</DialogProvider>
            </TooltipProvider>
          </OriginSdkProvider>
        </AuthProvider>
      </BlockchainProvider>
    </ToggleProvider>
  );
}
