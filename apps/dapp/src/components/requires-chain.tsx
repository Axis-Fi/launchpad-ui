import { useChainId, useSwitchChain } from "wagmi";
import { RequiresWalletConnection } from "./requires-wallet-connection";
import { activeChains } from "config/chains";
import { Button, cn } from "@repo/ui";

export function RequiresChain({
  chainId,
  children,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & { chainId: number }) {
  const currentChainId = useChainId();
  const isCorrectChain = currentChainId === chainId;
  const chainName = activeChains.find((c) => c.id === chainId)?.name;
  const { switchChain } = useSwitchChain();

  return (
    <RequiresWalletConnection className={props.className}>
      {isCorrectChain ? (
        <>{children}</>
      ) : (
        <Button
          className={cn("w-full uppercase", props.className)}
          onClick={() => switchChain({ chainId })}
        >
          Switch to {chainName}
        </Button>
      )}
    </RequiresWalletConnection>
  );
}
