import { axisContracts } from "@repo/deployments";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Auction } from "@repo/types";
import { useEffect } from "react";
import { cloakClient } from "src/services/cloak";
import { Address, ByteArray, fromHex, toHex } from "viem";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAuction } from "modules/auction/hooks/use-auction";

/** Used to manage decrypting the next set of bids */
export const useDecryptBids = (auction: Auction) => {
  const contracts = axisContracts.addresses[auction.chainId];
  const { refetch: refetchAuction } = useAuction(
    auction.lotId,
    auction.chainId,
  );

  //Get the next bids from the API
  const nextBidsQuery = useQuery({
    queryKey: [
      "decrypt",
      auction.chainId,
      auction.lotId,
      contracts.auctionHouse,
    ],
    queryFn: () =>
      cloakClient.keysApi.decryptsLotIdGet({
        xChainId: auction.chainId,
        xAuctionHouse: contracts.auctionHouse,
        lotId: Number(auction.lotId),
      }),
    placeholderData: keepPreviousData,
    enabled:
      auction.bids.length - auction.refundedBids.length >
      auction.bidsDecrypted.length,
  });

  //Map bids to the expected format
  /*eslint-disable-next-line*/
  const nextBids =
    nextBidsQuery.data?.map((d) => ({
      amountOut: fromHex(d.amountOut as Address, "bigint"),
      seed: toHex(d.seed as unknown as ByteArray),
    })) ?? [];

  //Send bids to the contract for decryption
  const { data: decryptCall, ...decryptCallQuery } = useSimulateContract({
    address: contracts.empam,
    abi: axisContracts.abis.empam,
    functionName: "decryptAndSortBids",
    chainId: auction.chainId,
    args: [BigInt(auction.lotId), 0n], //TODO: Correct parameter
  });

  const decrypt = useWriteContract();
  const decryptReceipt = useWaitForTransactionReceipt({ hash: decrypt.data });

  const handleDecryption = () => decrypt.writeContract(decryptCall!.request);

  useEffect(() => {
    if (decryptReceipt.isSuccess && !nextBidsQuery.isRefetching) {
      nextBidsQuery.refetch();
      refetchAuction();
    }
  }, [decryptReceipt.isSuccess, nextBidsQuery]);

  const error = [nextBidsQuery, decrypt, decryptCallQuery, decryptReceipt].find(
    (tx) => tx.isError,
  )?.error;

  return {
    nextBids: nextBidsQuery,
    decryptTx: decrypt,
    decryptReceipt,
    handleDecryption,
    error,
  };
};
