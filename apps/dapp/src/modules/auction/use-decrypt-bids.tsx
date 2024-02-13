import { axisContracts } from "@repo/contracts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SubgraphAuctionWithEvents } from "loaders/subgraphTypes";
import { useEffect } from "react";
import { cloakClient } from "src/services/cloak";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

// TODO fetch a batch of bids to decrypt (getNextBidsToDecrypt), decrypt off-chain, pass back to contract (decryptAndSortBids). Repeat until none left.

/** Used manage decrypting the next set of bids */
export const useDecryptBids = (auction: SubgraphAuctionWithEvents) => {
  const contracts = axisContracts.addresses[auction.chainId];

  const nextBids = useQuery({
    queryKey: ["decrypt", auction.id, auction.chainId],
    queryFn: () =>
      cloakClient.keysApi.decryptsLotIdGet({
        xChainId: auction.chainId,
        xAuctionHouse: contracts.auctionHouse,
        lotId: Number(auction.lotId),
      }),
    placeholderData: keepPreviousData,
  });

  const decrypt = useWriteContract();
  const decryptReceipt = useWaitForTransactionReceipt({ hash: decrypt.data });

  const handleDecryption = () => {
    decrypt.writeContract({
      address: contracts.localSealedBidBatchAuction,
      abi: axisContracts.abis.localSealedBidBatchAuction,
      functionName: "decryptAndSortBids",
      //@ts-expect-error TS is failing to infer but type is correct?
      args: [BigInt(auction.lotId), nextBids.data], //TODO: is this the correct type/value?
    });
  };

  useEffect(() => {
    if (decryptReceipt.isSuccess && !nextBids.isRefetching) {
      nextBids.refetch();
    }
  }, [decryptReceipt.isSuccess, nextBids]);

  return {
    nextBids,
    bidsLeft: 1234, //TODO: check if we can get this value
    totalBids: 3234, //TODO: check if we can get this value
    decryptTx: decrypt,
    decryptReceipt,
    handleDecryption,
  };
};
