import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Auction } from "@repo/types";
import { useEffect } from "react";
import { cloakClient } from "src/services/cloak";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAuction } from "modules/auction/hooks/use-auction";
import { getAuctionHouse, getContractsByModuleType } from "utils/contracts";
import { Hex } from "viem";

/** Used to manage decrypting the next set of bids */
export const useDecryptBids = (auction: Auction) => {
  const auctionHouse = getAuctionHouse(auction);
  //Fixed priced auctions dont require decryption
  const emp = getContractsByModuleType(auction);

  const { refetch: refetchAuction } = useAuction(
    auction.lotId,
    auction.chainId,
  );

  const privateKeyQuery = useQuery({
    queryKey: ["get_private_key", auctionHouse.address, auction],
    queryFn: () =>
      cloakClient.keysApi.privateKeyLotIdGet({
        ...deriveParamsFromAuction(auction),
        xAuctionHouse: auctionHouse.address,
      }),
    placeholderData: keepPreviousData,
    enabled:
      auction.bids.length - auction.refundedBids.length >
      auction.bidsDecrypted.length,
  });

  const DECRYPT_NUM = 400n; //TODO: figure out if theres a magic number or a better way

  const hintsQuery = useQuery({
    queryKey: ["hints", auctionHouse.address, auction, DECRYPT_NUM],
    queryFn: () =>
      cloakClient.keysApi.hintsLotIdNumGet({
        ...deriveParamsFromAuction(auction),
        xAuctionHouse: auctionHouse.address,
        num: Number(DECRYPT_NUM),
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
      DECRYPT_NUM,
      hints,
    ],
    query: { enabled: privateKeyQuery.isSuccess },
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
