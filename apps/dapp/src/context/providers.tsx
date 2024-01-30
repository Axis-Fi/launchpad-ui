import { TooltipProvider } from "@repo/ui";
import { BlockchainProvider } from "./blockchain-provider";

export function Providers(props: React.PropsWithChildren) {
  return (
    <BlockchainProvider>
      <TooltipProvider delayDuration={350}>{props.children}</TooltipProvider>
    </BlockchainProvider>
  );
}
