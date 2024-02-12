import { useAccount } from "wagmi";
import ConnectButton from "./connect-button";

/** Renders a Connect Button if no connection detected, renders children otherwise */
export function RequiresWalletConnection(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const account = useAccount();

  return account.isConnected ? <>{props.children}</> : <ConnectButton />;
}
