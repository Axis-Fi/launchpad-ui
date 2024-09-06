import { Link, trimAddress } from "@repo/ui";
import { chains } from "@repo/env";
import { ArrowUpRightIcon } from "lucide-react";

import { getBlockExplorer } from "src/utils/chain";
import { Address } from "viem";

const activeChains = chains.activeChains;

/** Renders a link to an address or transaction hash on a blockexplorer */
export function BlockExplorerLink({
  chainId,
  address,
  hash,
  trim,
  icon = true,
  ...props
}: {
  chainId: number;
  address?: string | Address;
  hash?: string | Address;
  trim?: boolean;
  icon?: boolean;
  showName?: boolean;
}) {
  const chain = activeChains.find((c) => c.id === chainId);

  if (!chain) return null;
  const blockExplorer = getBlockExplorer(chain);
  const target = hash ?? address ?? "";
  const path = hash ? "tx/" : "address/";

  return (
    <Link
      className="text-md inline-flex items-center leading-none"
      href={blockExplorer.url + path + target}
    >
      {trim
        ? trimAddress(target, 6)
        : props.showName
          ? blockExplorer.name
          : address}
      {icon && <ArrowUpRightIcon className="size-3" />}
    </Link>
  );
}
