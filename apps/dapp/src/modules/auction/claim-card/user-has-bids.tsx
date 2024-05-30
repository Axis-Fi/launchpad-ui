import { useState } from "react";
import { useAccount } from "wagmi";
import { Button, Card } from "@repo/ui";
import type { Auction, BatchAuction } from "@repo/types";
import { RequiresChain } from "components/requires-chain";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { useClaimBids } from "../hooks/use-claim-bids";

type ClaimProps = {
  auction: Auction;
};

export function Claim({ auction: _auction }: ClaimProps) {
  const auction = _auction as BatchAuction;
  const { address } = useAccount();
  const [isTxnDialogOpen, setTxnDialogOpen] = useState(false);
  const claimBids = useClaimBids(auction);

  const isAuctionCleared = _auction.formatted?.cleared;
  const userHasBids = auction.bids.some(
    (b) =>
      b.bidder.toLowerCase() === address?.toLowerCase() &&
      b.status !== "claimed" &&
      b.status !== "refunded",
  );

  const isWaiting =
    claimBids.claimTx.isPending || claimBids.claimReceipt.isLoading;

  return (
    <Card title="Claim" className="w-[496px]">
      <div className="text-center">
        {isAuctionCleared ? (
          <h4>Payout for this auction can be claimed!</h4>
        ) : (
          <h4>Auction could not be settled. Refunds may be claimed.</h4>
        )}
      </div>
      <RequiresChain chainId={auction.chainId}>
        {userHasBids && (
          <div className="flex justify-center">
            <Button onClick={() => setTxnDialogOpen(true)} className="mt-4">
              {isAuctionCleared ? "CLAIM WINNINGS" : "REFUND"}
            </Button>
          </div>
        )}
      </RequiresChain>
      <TransactionDialog
        open={isTxnDialogOpen}
        signatureMutation={claimBids.claimTx}
        error={claimBids.claimTx.error}
        onConfirm={claimBids.handleClaim}
        mutation={claimBids.claimReceipt}
        chainId={auction.chainId}
        onOpenChange={(open: boolean) => {
          if (!open) {
            claimBids.claimTx.reset();
          }
          setTxnDialogOpen(open);
        }}
        hash={claimBids.claimTx.data}
        disabled={isWaiting}
        screens={{
          idle: {
            Component: () => (
              <div className="text-center">
                You&apos;re about to claim all of your outstanding refunds and
                payouts for this auction.
              </div>
            ),
            title: `Confirm Claim Bids`,
          },
          success: {
            Component: () => (
              <div className="flex justify-center text-center">
                <p>Bids claimed successfully!</p>
              </div>
            ),
            title: "Transaction Confirmed",
          },
        }}
      />
    </Card>
  );
}
