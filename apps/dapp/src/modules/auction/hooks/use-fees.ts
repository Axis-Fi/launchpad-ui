import { axisContracts } from "@repo/deployments";
import { useReadContract } from "wagmi";
import { toKeycode } from "../utils/to-keycode";
import { AuctionTypes } from "@repo/types";

//TODO: Figure out how to read fee percetange per curator
/** Reads current AuctionHouse fees */
export function useFees(chainId: number) {
  const axisAddresses = axisContracts.addresses[chainId];
  const currentFees = useReadContract({
    chainId,
    abi: axisContracts.abis.auctionHouse,
    address: axisAddresses.auctionHouse,
    functionName: "fees",
    args: [toKeycode(AuctionTypes.SEALED_BID)],
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
  const [protocol, referrer, maxCuratorFee] = fees.map((f) => f / 1000); //Convert from basis points

  return {
    protocol,
    referrer,
    maxCuratorFee,
  };
}
