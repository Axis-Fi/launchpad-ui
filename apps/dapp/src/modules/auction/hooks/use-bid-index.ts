import { axisContracts } from "@repo/deployments";
import { Auction } from "@repo/types";
import React from "react";
import { useReadContract } from "wagmi";

export function useBidIndex(auction: Auction, bidId: bigint = -1n) {
  const address = axisContracts.addresses[auction.chainId].batchCatalogue;
  const abi = axisContracts.abis.batchCatalogue;
  const [startingIndex, setStartingIndex] = React.useState(0n);
  const BID_COUNT = 100n;

  const bidsQuery = useReadContract({
    address,
    abi,
    functionName: "getBidIds",
    args: [BigInt(auction.lotId), startingIndex, BID_COUNT],
  });

  React.useEffect(() => {
    if (bidsQuery.isSuccess && !bidsQuery.data.includes(bidId)) {
      //Update query args to trigger a re-read
      setStartingIndex((index) => index + BID_COUNT);
    }
  }, [bidsQuery.isSuccess]);

  return {
    index: bidsQuery.data?.find((b) => b === bidId),
    ...bidsQuery,
  };
}
