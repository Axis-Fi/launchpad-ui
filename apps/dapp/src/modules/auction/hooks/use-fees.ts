import { axisContracts } from "@repo/deployments";
import { useReadContract } from "wagmi";
import { toKeycode } from "utils/hex";
import { AuctionType } from "@repo/types";
import { fromBasisPoints } from "utils/number";
import { Address } from "viem";

//TODO: Figure out how to read fee percetange per curator
/** Reads current AuctionHouse fees */
export function useFees(
  chainId: number,
  auctionHouse: Address,
  auctionType: AuctionType,
) {
  const currentFees = useReadContract({
    chainId,
    abi: axisContracts.abis.batchAuctionHouse, // ok since both atomic and batch have the same ABI for fees
    address: auctionHouse,
    functionName: "fees",
    args: [toKeycode(auctionType)],
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
