import { axisContracts } from "@repo/deployments";
import { Auction } from "@repo/types";
import React from "react";
import { useReadContract } from "wagmi";

export function useBidIndex(auction: Auction, bidId: bigint = -1n) {
  const address = axisContracts.addresses[auction.chainId].batchCatalogue;
  const abi = axisContracts.abis.batchCatalogue;
  const [startingIndex, setStartingIndex] = React.useState(0n);
  const BID_COUNT = 100n;

  // TODO using call to EMP until getNumBids is added to BatchCatalogue
  const numBidsQuery = useReadContract({
    address: axisContracts.addresses[auction.chainId].encryptedMarginalPrice,
    abi: axisContracts.abis.encryptedMarginalPrice,
    functionName: "getNumBids",
    args: [BigInt(auction.lotId)],
  });

  console.log(numBidsQuery);

  const bidsQuery = useReadContract({
    address,
    abi,
    functionName: "getBidIds",
    args: [BigInt(auction.lotId), startingIndex, BID_COUNT],
    query: {
      enabled: numBidsQuery.isSuccess,
    },
  });

  React.useEffect(() => {
    if (
      bidsQuery.isSuccess &&
      startingIndex + BID_COUNT < (numBidsQuery.data ?? 0n)
    ) {
      // Update query args to trigger a re-read
      setStartingIndex((index) => index + BID_COUNT);
    }
  }, [bidsQuery.isSuccess]);

  return {
    index: bidsQuery.data?.findIndex((b: bigint) => b === bidId),
    ...bidsQuery,
  };
}
