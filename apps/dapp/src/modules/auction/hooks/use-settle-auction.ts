import { Auction } from "@repo/types";
import React from "react";
import { parseUnits, toHex } from "viem";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAuction } from "./use-auction";
import { getAuctionHouse } from "utils/contracts";

type SettleAuctionProps = {
  auction: Auction;
  callbackData?: `0x${string}`;
};

/** Used to settle an auction after decryption*/
export function useSettleAuction({
  auction,
  callbackData,
}: SettleAuctionProps) {
  const { address, abi } = getAuctionHouse(auction);
  const { refetch } = useAuction(auction.id, auction.auctionType);

  const { data: settleCall, ...settleCallStatus } = useSimulateContract({
    abi,
    address,
    functionName: "settle",
    chainId: auction.chainId,
    args: [
      parseUnits(auction.lotId, 0),
      100n, // number of bids to settle at once, TODO replace with value based on chain & gas limits
      callbackData || toHex(""),
    ],
  });

  const settleTx = useWriteContract();
  const settleReceipt = useWaitForTransactionReceipt({ hash: settleTx.data });

  const handleSettle = () => settleTx.writeContract(settleCall!.request);

  React.useEffect(() => {
    if (settleReceipt.isSuccess) {
      refetch();
    }
  }, [settleReceipt.isSuccess]);

  const error = [settleCallStatus, settleTx, settleReceipt].find(
    (tx) => tx.isError,
  )?.error;

  return {
    handleSettle,
    settleTx,
    settleReceipt,
    settleCallStatus,
    error,
  };
}
