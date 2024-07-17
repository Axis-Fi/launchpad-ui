import type { Chain } from "viem";
import type { Address, AuctionId } from "@repo/types";
import { getChainName } from "./get-chain-name";

const getAuctionId = (
  chain: Chain,
  auctionHouseAddress: Address,
  lotId: number,
): AuctionId => {
  const chainName = getChainName(chain);
  return `${chainName}-${auctionHouseAddress.toLowerCase()}-${lotId}`;
};

export { getAuctionId };
