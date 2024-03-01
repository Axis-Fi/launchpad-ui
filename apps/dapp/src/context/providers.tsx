import { TooltipProvider } from "@repo/ui";
import { BlockchainProvider } from "./blockchain-provider";
import { TokenlistProvider } from "./tokenlist-provider";

export function Providers(props: React.PropsWithChildren) {
  return (
    <BlockchainProvider>
      <TokenlistProvider>
        <TooltipProvider delayDuration={350}>{props.children}</TooltipProvider>
      </TokenlistProvider>
    </BlockchainProvider>
  );
}
