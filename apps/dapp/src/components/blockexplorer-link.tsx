import { Link, trimAddress } from "@repo/ui";
import { activeChains } from "config/chains";
import { ArrowUpRightIcon } from "lucide-react";
import { getBlockExplorer } from "src/utils/blockexplorer";
import { Address } from "viem";

export function BlockExplorerLink({
  chainId,
  address,
  trim,
  icon = true,
}: {
  chainId: number;
  address: string | Address;
  trim?: boolean;
  icon?: boolean;
}) {
  const chain = activeChains.find((c) => c.id === chainId);

  if (!chain) throw new Error("Unable to find chain for BlockExplorer");
  const blockExplorer = getBlockExplorer(chain);

  return (
    <Link
      className="group-hover:text-primary group flex items-center transition-all"
      href={blockExplorer.url + address}
    >
      {trim ? trimAddress(address, 6) : address}
      {icon && <ArrowUpRightIcon className="group size-6" />}
    </Link>
  );
}
