import { axisContracts } from "@repo/deployments";
import { useReadContract } from "wagmi";
import { toKeycode } from "utils/hex";
import { AuctionType } from "@repo/types";
import { fromBasisPoints } from "utils/number";
import { Address } from "viem";

//TODO: Figure out how to read fee percetange per curator
/** Reads current AuctionHouse fees */
export function useFees(chainId: number, auctionHouse: Address) {
  const currentFees = useReadContract({
    chainId,
    abi: axisContracts.abis.batchAuctionHouse,
    address: auctionHouse,
    functionName: "fees",
    args: [toKeycode(AuctionType.SEALED_BID)],
    query: { enabled: !!chainId },
  });

  return {
    ...currentFees,
    data: parseFees(currentFees.data),
  };
}

/** Parses fees from AuctionHouse/FeeManager */
function parseFees(fees?: readonly [number, number, number]) {
  if (!fees) return {};
  const [protocol, referrer, maxCuratorFee] = fees.map(fromBasisPoints); //Convert from basis points

  return {
    protocol,
    referrer,
    maxCuratorFee,
  };
}
