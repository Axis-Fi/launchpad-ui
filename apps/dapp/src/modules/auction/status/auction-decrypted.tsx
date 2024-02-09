import { axisContracts } from "@repo/contracts";
import { Button } from "@repo/ui";
import { Auction } from "src/types";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

export function AuctionDecrypted({ auction }: { auction: Auction }) {
  const contract = axisContracts[auction.chainId];
  const decrypt = useWriteContract();
  const decryptReceipt = useWaitForTransactionReceipt({ hash: decrypt.data });

  const isLoading = decrypt.isPending || decryptReceipt.isLoading;

  // TODO fetch a batch of bids to decrypt (getNextBidsToDecrypt), decrypt off-chain, pass back to contract (decryptAndSortBids). Repeat until none left.

  const decryptedBids: unknown[] = []; // LocalSealedBidBatchAuction.Decrypt[]

  const handleDecryption = () => {
    decrypt.writeContract({
      abi: contract.localSealedBidBatchAuction.abi,
      address: contract.localSealedBidBatchAuction.address,
      functionName: "decryptAndSortBids",
      args: [auction.lotId, decryptedBids],
    });
  };

  return (
    <div className="flex justify-center">
      <Button onClick={handleDecryption}>Settle Auction</Button>

      {isLoading && <p>Loading... </p>}
      {decrypt.isError && <p>{decrypt.error?.message}</p>}
      {decryptReceipt.isSuccess && <p>Success!</p>}
    </div>
  );
}
