import { axisContracts } from "@repo/deployments";
import { Auction } from "@repo/types";
import React from "react";
import { parseUnits } from "viem";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useAuction } from "./use-auction";

/** Used to settle an auction after decryption*/
export function useSettleAuction(auction: Auction) {
  const axisAddresses = axisContracts.addresses[auction.chainId];
  const { refetch } = useAuction(auction.lotId, auction.chainId);

  const { data: settleCall, ...settleCallStatus } = useSimulateContract({
    abi: axisContracts.abis.auctionHouse,
    address: axisAddresses.auctionHouse,
    functionName: "settle",
    chainId: auction.chainId,
    args: [parseUnits(auction.lotId, 0)],
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
