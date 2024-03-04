import { axisContracts } from "@repo/deployments";
import { Auction } from "@repo/types";
import { parseUnits } from "viem";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

/** Used to settle an auction after decryption*/
export function useSettleAuction(auction: Auction) {
  const axisAddresses = axisContracts.addresses[auction.chainId];

  const { data: settleCall } = useSimulateContract({
    abi: axisContracts.abis.auctionHouse,
    address: axisAddresses.auctionHouse,
    functionName: "settle",
    chainId: auction.chainId,
    args: [parseUnits(auction.lotId, 0)],
  });

  const settleTx = useWriteContract();
  const settleReceipt = useWaitForTransactionReceipt({ hash: settleTx.data });

  const handleSettle = () => settleTx.writeContract(settleCall!.request);

  return {
    handleSettle,
    settleTx,
    settleReceipt,
  };
}
