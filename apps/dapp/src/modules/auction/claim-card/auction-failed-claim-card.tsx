import { useState } from "react";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

import { Badge, Button, Card, Metric, Text } from "@repo/ui";
import type { BatchAuction, PropsWithAuction } from "@repo/types";
import { RequiresChain } from "components/requires-chain";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { shorten } from "utils/number";
import { useClaimBids } from "modules/auction/hooks/use-claim-bids";
import { BidInfoCard } from "./user-bids-claim-card/bid-info-card";

export function AuctionFailedClaimCard({
  auction: _auction,
}: PropsWithAuction) {
  const auction = _auction as BatchAuction;
  const { address } = useAccount();
  const [isTxnDialogOpen, setTxnDialogOpen] = useState(false);
  const claimBidsTxn = useClaimBids(auction);
  const userBids = auction.bids.filter(
    (bid) => bid.bidder.toLowerCase() === address?.toLowerCase(),
  );
  const userTotalBidAmount = userBids.reduce(
    (acc, bid) => acc + Number(bid.amountIn ?? 0),
    0,
  );
  const userTotalSuccessfulBidAmount = userBids.reduce(
    (acc, bid) => acc + Number(bid.settledAmountIn ?? 0),
    0,
  );
  const userHasClaimed = userBids.every(
    (bid) => bid.status === "claimed" || bid.status === "refunded",
  );

  const isWaiting =
    claimBidsTxn.claimTx.isPending || claimBidsTxn.claimReceipt.isLoading;

  const buttonText =
    userTotalSuccessfulBidAmount > 0 ? "Claim tokens" : "Claim refund";

  const getFailReason = (): string => {
    if (auction.status !== "settled") {
      throw new Error("Auction is not settled");
    }

    if (auction.formatted?.cleared) {
      throw new Error("Auction settlement cleared");
    }

    // If the raised amount is below the minimum fill
    if (
      auction.formatted &&
      auction.formatted.totalBidAmountFormatted != undefined &&
      auction.formatted.minFilled != undefined &&
      Number(auction.formatted?.totalBidAmountFormatted?.replace(/,/g, "")) <
        Number(auction.formatted?.minFilled?.replace(/,/g, ""))
    ) {
      return "The auction did not raise the minimum fill amount";
    }

    return "The auction did not settle successfully";
  };
  const failReason = getFailReason();

  return (
    <div className="gap-y-md flex flex-col">
      <Card
        title="Claim"
        className="w-[496px]"
        headerRightElement={<Badge color="alert">Auction Failed</Badge>}
      >
        <RequiresChain chainId={auction.chainId}>
          <div className="gap-y-md flex flex-col">
            <div className="bg-surface-tertiary p-sm rounded">
              <Metric size="l" label="You Bid">
                {shorten(userTotalBidAmount)} {auction.quoteToken.symbol}
              </Metric>
            </div>

            <div className="bg-surface-tertiary p-sm rounded">
              <Metric size="l" label="You Get">
                0 {auction.baseToken.symbol}
              </Metric>
              <Text size="sm" className="text-red-500">
                {failReason}
              </Text>
            </div>

            {!userHasClaimed && (
              <Button
                size="lg"
                className="w-full"
                onClick={() => setTxnDialogOpen(true)}
              >
                {buttonText}
              </Button>
            )}
            {userHasClaimed && (
              <Link to="/auctions">
                <Button size="lg" variant="secondary" className="w-full">
                  View live auctions <ArrowRightIcon className="size-6" />
                </Button>
              </Link>
            )}
          </div>
        </RequiresChain>

        <TransactionDialog
          open={isTxnDialogOpen}
          signatureMutation={claimBidsTxn.claimTx}
          error={claimBidsTxn.claimTx.error}
          onConfirm={claimBidsTxn.handleClaim}
          mutation={claimBidsTxn.claimReceipt}
          chainId={auction.chainId}
          onOpenChange={(open: boolean) => {
            if (!open) {
              claimBidsTxn.claimTx.reset();
            }
            setTxnDialogOpen(open);
          }}
          hash={claimBidsTxn.claimTx.data}
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

      <BidInfoCard auction={auction} userBids={userBids} />
    </div>
  );
}
