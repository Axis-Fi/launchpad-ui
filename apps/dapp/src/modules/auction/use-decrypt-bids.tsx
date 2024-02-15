import { axisContracts } from "@repo/contracts";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SubgraphAuctionWithEvents } from "loaders/subgraphTypes";
import { useEffect } from "react";
import { cloakClient } from "src/services/cloak";
import { Address, ByteArray, fromHex, toHex } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

/** Used manage decrypting the next set of bids */
export const useDecryptBids = (auction: SubgraphAuctionWithEvents) => {
  const contracts = axisContracts.addresses[auction.chainId];

  const nextBidsQuery = useQuery({
    queryKey: ["decrypt", auction.id, auction.chainId],
    queryFn: () =>
      cloakClient.keysApi.decryptsLotIdGet({
        xChainId: auction.chainId,
        xAuctionHouse: contracts.auctionHouse,
        lotId: Number(auction.lotId),
      }),
    placeholderData: keepPreviousData,
    enabled: auction.bids.length > auction.bidsDecrypted.length,
  });

  const decrypt = useWriteContract();
  const decryptReceipt = useWaitForTransactionReceipt({ hash: decrypt.data });

  const nextBids =
    nextBidsQuery.data?.map((d) => ({
      amountOut: fromHex(d.amountOut as Address, "bigint"),
      /* @ts-expect-error TODO: remove*/
      seed: toHex(d.seed as ByteArray),
    })) ?? [];

  const handleDecryption = () => {
    decrypt.writeContract({
      address: contracts.localSealedBidBatchAuction,
      abi: axisContracts.abis.localSealedBidBatchAuction,
      functionName: "decryptAndSortBids",
      args: [BigInt(auction.lotId), nextBids],
    });
  };

  useEffect(() => {
    if (decryptReceipt.isSuccess && !nextBidsQuery.isRefetching) {
      nextBidsQuery.refetch();
    }
  }, [decryptReceipt.isSuccess, nextBidsQuery]);

  return {
    nextBids: nextBidsQuery,
    decryptTx: decrypt,
    decryptReceipt,
    handleDecryption,
  };
};
