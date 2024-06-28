import { BatchAuction, PropsWithAuction } from "@repo/types";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { useClaimBids } from "modules/auction/hooks/use-claim-bids";

type ClaimVestingDervivativeTxnProps = {
  onClose: () => void;
} & PropsWithAuction;

export function ClaimVestingDervivativeTxn({
  auction: _auction,
  onClose,
}: ClaimVestingDervivativeTxnProps) {
  const auction = _auction as BatchAuction;
  const claimBidsTxn = useClaimBids(auction);

  return (
    <TransactionDialog
      open={true}
      signatureMutation={claimBidsTxn.claimTx}
      error={claimBidsTxn.claimCall.error || claimBidsTxn.claimTx.error}
      onConfirm={claimBidsTxn.handleClaim}
      mutation={claimBidsTxn.claimReceipt}
      chainId={auction.chainId}
      onOpenChange={(open: boolean) => {
        if (!open) {
          claimBidsTxn.claimTx.reset();
          onClose();
        }
      }}
      hash={claimBidsTxn.claimTx.data}
      disabled={claimBidsTxn.isWaiting}
      screens={{
        idle: {
          Component: () => (
            <>
              <div className="text-center">
                You&apos;re claiming your vesting derivative token for this
                auction.
              </div>
              <div className="text-center">
                After this transaction confirms, you&apos;ll be able to redeem
                your vested tokens.
              </div>
            </>
          ),
          title: `Claim ${auction.baseToken.symbol} vesting derivative`,
        },
        success: {
          Component: () => (
            <div className="flex justify-center text-center">
              <p>Vesting derivative claimed successfully!</p>
            </div>
          ),
          title: "Transaction Confirmed",
        },
      }}
    />
  );
}
