import { axisContracts } from "@repo/contracts";
import { Button } from "@repo/ui";
import { Auction } from "src/types";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function AuctionSettled({ auction }: { auction: Auction }) {
  const contracts = axisContracts[auction.chainId];

  const refund = useWriteContract();
  const refundReceipt = useWaitForTransactionReceipt({ hash: refund.data });

  const isLoading = refund.isPending || refundReceipt.isLoading;

  const handleRefund = () => {
    refund.writeContract({
      abi: contracts.auctionHouse.abi,
      address: contracts.auctionHouse.address,
      functionName: "settle",
      args: [auction.lotId],
    });
  };

  return (
    <div className="flex justify-center">
      <Button onClick={handleRefund}>Claim Refund</Button>

      {isLoading && <p>Loading... </p>}
      {refund.isError && <p>{refund.error?.message}</p>}
      {refundReceipt.isSuccess && <p>Success!</p>}
    </div>
  );
}
