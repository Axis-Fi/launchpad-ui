import { Avatar } from "@repo/ui";
import { activeChains } from "config/chains";

type ChainIconProps = {
  chainId: number;
};

export function ChainIcon(props: ChainIconProps) {
  const chain = activeChains.find((c) => c.id === props.chainId);
  const icon = typeof chain?.iconUrl === "string" ? chain?.iconUrl : "";

  return <Avatar src={icon} alt={chain?.name + " Logo"} />;
}
