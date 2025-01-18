import { getAuctionHouse } from "@axis-finance/deployments";
import { AuctionType } from "@axis-finance/types";
import { toKeycode } from "utils/hex";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export function useGetCuratorFee(
  chainId: number,
  auctionType: AuctionType,
  address: Address,
) {
  const auctionHouse = getAuctionHouse({ chainId, auctionType });

  return useReadContract({
    chainId,
    abi: auctionHouse.abi,
    address: auctionHouse.address,
    functionName: "getCuratorFee",
    args: [toKeycode(auctionType), address],
    query: { enabled: !!chainId && !!address },
  });
}
