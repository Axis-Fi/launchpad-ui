import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { Auction } from "@repo/types";
import { getAuctionHouse } from "utils/contracts";

export function useClaimProceeds(auction: Auction) {
  const auctionHouse = getAuctionHouse(auction);
  const { data, ...claimCall } = useSimulateContract({
    address: auctionHouse.address,
    abi: auctionHouse.abi,
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
