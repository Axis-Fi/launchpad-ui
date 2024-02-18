import { Link, trimAddress } from "@repo/ui";
import { activeChains } from "config/chains";
import { ArrowUpRightIcon } from "lucide-react";
import { getBlockExplorer } from "src/utils/blockexplorer";
import { Address } from "viem";

/** Renders a link to an address or transaction hash on a blockexplorer */
export function BlockExplorerLink({
  chainId,
  address,
  trim,
  icon = true,
  ...props
}: {
  chainId: number;
  address: string | Address;
  trim?: boolean;
  icon?: boolean;
  showName?: boolean;
}) {
  const chain = activeChains.find((c) => c.id === chainId);

  if (!chain) throw new Error("Unable to find chain for BlockExplorer");
  const blockExplorer = getBlockExplorer(chain);

  return (
    <Link className="flex items-center " href={blockExplorer.url + address}>
      {trim
        ? trimAddress(address, 6)
        : props.showName
          ? blockExplorer.name
          : address}
      {icon && <ArrowUpRightIcon className="size-6 " />}
    </Link>
  );
}
