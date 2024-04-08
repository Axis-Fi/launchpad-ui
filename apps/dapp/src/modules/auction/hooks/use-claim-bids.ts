import { Auction } from "@repo/types";
import { getAuctionHouse } from "utils/contracts";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function useClaimBids(auction: Auction) {
  const { address: userAddress } = useAccount();
  const { abi, address } = getAuctionHouse(auction.chainId);
  const bids = auction.bids
    .filter((b) => b.bidder.toLowerCase() === userAddress?.toLowerCase())
    .map((b) => BigInt(b.bidId));

  const claimCall = useSimulateContract({
    abi,
    address,
    chainId: auction.chainId,
    functionName: "claimBids",
    args: [BigInt(auction.lotId), bids],
  });

  const claimTx = useWriteContract();
  const claimReceipt = useWaitForTransactionReceipt({ hash: claimTx.data });

  const handleClaim = () => {
    if (claimCall.data) {
      claimTx.writeContract(claimCall.data.request!);
    }
  };

  const handleClaimSelected = (bids: bigint[]) => {
    claimTx.writeContract({
      abi,
      address,
      chainId: auction.chainId,
      functionName: "claimBids",
      args: [BigInt(auction.lotId), bids],
    });
  };

  return { handleClaim, handleClaimSelected, claimCall, claimReceipt, claimTx };
}
