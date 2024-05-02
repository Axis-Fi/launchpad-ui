import { axisContracts } from "@repo/deployments";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Auction } from "@repo/types";
import { useEffect } from "react";
import { cloakClient } from "@repo/cloak";
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
  const privateKeyQuery = useQuery({
    queryKey: [
      "decrypt",
      auction.chainId,
      auction.lotId,
      contracts.auctionHouse,
    ],
    queryFn: () =>
      cloakClient.keysApi.privateKeyLotIdGet({
        xChainId: auction.chainId,
        xAuctionHouse: contracts.auctionHouse,
        lotId: Number(auction.lotId),
      }),
    placeholderData: keepPreviousData,
    enabled:
      auction.bids.length - auction.refundedBids.length >
      auction.bidsDecrypted.length,
  });

  //Send bids to the contract for decryption
  const { data: decryptCall, ...decryptCallQuery } = useSimulateContract({
    address: contracts.empam,
    abi: axisContracts.abis.empam,
    functionName: "submitPrivateKey",
    chainId: auction.chainId,
    args: [BigInt(auction.lotId), BigInt(privateKeyQuery.data ?? 0n), 100n],
    query: { enabled: privateKeyQuery.isSuccess },
  });

  const decrypt = useWriteContract();
  const decryptReceipt = useWaitForTransactionReceipt({ hash: decrypt.data });

  const handleDecryption = () => decrypt.writeContract(decryptCall!.request);

  useEffect(() => {
    if (decryptReceipt.isSuccess && !privateKeyQuery.isRefetching) {
      privateKeyQuery.refetch();
      refetchAuction();
    }
  }, [decryptReceipt.isSuccess, privateKeyQuery]);

  const error = [
    privateKeyQuery,
    decrypt,
    decryptCallQuery,
    decryptReceipt,
  ].find((tx) => tx.isError)?.error;

  return {
    nextBids: privateKeyQuery,
    decryptTx: decrypt,
    decryptReceipt,
    handleDecryption,
    error,
  };
};
