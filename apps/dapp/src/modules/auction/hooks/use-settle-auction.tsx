import { axisContracts } from "@repo/contracts";
import { Auction } from "src/types";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

/** Used to settle an auction after decryption*/
export function useSettleAuction(auction: Auction) {
  const axisAddresses = axisContracts.addresses[auction.chainId];

  const settleTx = useWriteContract();
  const settleReceipt = useWaitForTransactionReceipt({ hash: settleTx.data });

  const handleSettle = () => {
    settleTx.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "settle",
      args: [parseUnits(auction.lotId, 0)],
    });
  };

  return {
    handleSettle,
    settleTx,
    settleReceipt,
  };
}
