import { axisContracts } from "@repo/deployments";

export function getAuctionHouseAddress({ chainId }: { chainId: number }) {
  if (chainId == null) return undefined;

  return axisContracts.addresses[chainId].batchAuctionHouse;
}
