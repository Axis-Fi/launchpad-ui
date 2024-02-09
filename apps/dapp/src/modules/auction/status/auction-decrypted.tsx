import { axisContracts } from "@repo/contracts";
import { Button } from "@repo/ui";
import { Auction } from "src/types";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function AuctionDecrypted({ auction }: { auction: Auction }) {
  const axisAddresses = axisContracts.addresses[auction.chainId];
  const settle = useWriteContract();
  const decryptReceipt = useWaitForTransactionReceipt({ hash: settle.data });

  const isLoading = settle.isPending || decryptReceipt.isLoading;

  const handleSettle = () => {
    settle.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "settle",
      args: [parseUnits(auction.lotId, 0)],
    });
  };

  return (
    <div className="flex justify-center">
      <Button onClick={handleSettle}>Settle Auction</Button>

      {isLoading && <p>Loading... </p>}
      {settle.isError && <p>{settle.error?.message}</p>}
      {decryptReceipt.isSuccess && <p>Success!</p>}
    </div>
  );
}
