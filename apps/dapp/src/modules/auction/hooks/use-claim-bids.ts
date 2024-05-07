import { BatchAuction } from "@repo/types";
import { getAuctionHouse } from "utils/contracts";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function useClaimBids(auction: BatchAuction) {
  const { address: userAddress } = useAccount();
  const { abi, address } = getAuctionHouse(auction);

  const bids = auction.bids
    .filter(
      (b) =>
        b.bidder.toLowerCase() === userAddress?.toLowerCase() &&
        b.status !== "claimed" &&
        b.status !== "refunded",
    )
    .map((b) => BigInt(b.bidId));

  // TODO get total number of refunds, refund amount, payouts, and payout amount that the user is claimed
  // Display this back to them on the settle page in the confirm dialog box.

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
