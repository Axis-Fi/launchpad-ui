import { axisContracts } from "@repo/contracts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { cloakClient } from "src/services/cloak";
import { Auction } from "src/types";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

// TODO fetch a batch of bids to decrypt (getNextBidsToDecrypt), decrypt off-chain, pass back to contract (decryptAndSortBids). Repeat until none left.

/** Used manage decrypting the next set of bids */
export const useDecryptBids = (auction: Auction) => {
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

  const handleDecryption = useCallback(() => {
    decrypt.writeContract({
      address: contracts.localSealedBidBatchAuction,
      abi: axisContracts.abis.localSealedBidBatchAuction,
      functionName: "decryptAndSortBids",
      args: [BigInt(auction.lotId), nextBids.data], //TODO: is this the correct type/value?
    });
  }, [nextBids.isRefetching]);

  useEffect(() => {
    if (decryptReceipt.isSuccess) {
      nextBids.refetch();
    }
  }, [decryptReceipt.isSuccess]);

  return {
    nextBids,
    decryptTx: decrypt,
    decryptReceipt,
    handleDecryption,
  };
};
