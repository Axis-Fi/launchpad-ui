import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Auction, BatchAuction } from "@repo/types";
import { useEffect } from "react";
import { cloakClient } from "@repo/cloak";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAuction } from "modules/auction/hooks/use-auction";
import { getAuctionHouse, getContractsByModuleType } from "utils/contracts";
import { Hex } from "viem";

/** Used to manage decrypting the next set of bids */
export const useDecryptBids = (auction: BatchAuction) => {
  const auctionHouse = getAuctionHouse(auction);
  //Fixed priced auctions dont require decryption
  const emp = getContractsByModuleType(auction);

  const { refetch: refetchAuction } = useAuction(
    auction.id,
    auction.auctionType,
  );

  const params = deriveParamsFromAuction(auction);
  const privateKeyQuery = useQuery({
    queryKey: ["get_private_key", auction.id, auctionHouse.address, params],
    queryFn: () =>
      cloakClient.keysApi.privateKeyLotIdGet({
        ...params,
        xAuctionHouse: auctionHouse.address,
      }),
    placeholderData: keepPreviousData,
    enabled:
      auction.bids.length === 0 ||
      auction.bids.length - auction.bidsRefunded.length >
        auction.bidsDecrypted.length,
  });

  const DECRYPT_NUM = 100; // TODO determine limit on amount per chain

  const hintsQuery = useQuery({
    queryKey: ["hints", auction.id, auctionHouse.address, params, DECRYPT_NUM],
    queryFn: () =>
      cloakClient.keysApi.hintsLotIdNumGet({
        ...params,
        xAuctionHouse: auctionHouse.address,
        num: DECRYPT_NUM,
      }),
  });

  const hints = hintsQuery.data as Hex[];

  //Send bids to the contract for decryption
  const { data: decryptCall, ...decryptCallQuery } = useSimulateContract({
    address: emp.address,
    abi: emp.abi,
    functionName: "submitPrivateKey",
    chainId: auction.chainId,
    args: [
      BigInt(auction.lotId),
      BigInt(privateKeyQuery.data ?? 0),
      BigInt(hints?.length ?? 0),
      hints,
    ],
    query: { enabled: privateKeyQuery.isSuccess && hintsQuery.isSuccess },
  });

  const decrypt = useWriteContract();
  const decryptReceipt = useWaitForTransactionReceipt({ hash: decrypt.data });

  const handleDecryption = () => decrypt.writeContract(decryptCall!.request);

  useEffect(() => {
    if (decryptReceipt.isSuccess && !hintsQuery.isRefetching) {
      hintsQuery.refetch();
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

function deriveParamsFromAuction(auction: Auction) {
  return {
    xChainId: auction.chainId,
    lotId: Number(auction.lotId),
  };
}
