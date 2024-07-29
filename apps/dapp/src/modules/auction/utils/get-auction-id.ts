import type { Chain } from "viem";
import type { Address, AuctionId } from "@repo/types";
import { getDeploymentByChainId } from "utils/chain";
import { formatChainName } from "./format-chain-name";

const formatAuctionId = (
  chain: Chain,
  auctionHouseAddress: Address,
  lotId: number,
): AuctionId => {
  const chainName = formatChainName(chain);
  return `${chainName}-${auctionHouseAddress.toLowerCase()}-${lotId}`;
};

const getAuctionId = (chainId: string | number, lotId: string | number) => {
  const deployment = getDeploymentByChainId(Number(chainId));
  return formatAuctionId(
    deployment.chain,
    deployment.addresses.batchAuctionHouse,
    Number(lotId),
  );
};

export { formatAuctionId, getAuctionId };
