import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Auction } from "@repo/types";
import { axisContracts } from "@repo/deployments";

export function useClaimProceeds(auction: Auction) {
  const { data, ...claimCall } = useSimulateContract({
    address: axisContracts.addresses[auction.chainId].auctionHouse,
    abi: axisContracts.abis.auctionHouse,
    chainId: auction.chainId,
    functionName: "claimProceeds",
    args: [BigInt(auction.lotId), "0x"],
  });

  const claimTx = useWriteContract();
  const claimReceipt = useWaitForTransactionReceipt({ hash: claimTx.data });

  const handleClaim = () => {
    if (data) {
      claimTx.writeContract(data.request!);
    }
  };

  return {
    handleClaim,
    claimCall,
    claimTx,
    claimReceipt,
  };
}
