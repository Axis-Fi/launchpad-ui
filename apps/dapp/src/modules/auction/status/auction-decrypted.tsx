import { InfoLabel } from "@repo/ui";
import { AuctionMetricsContainer } from "../auction-metrics-container";
import { AuctionInputCard } from "../auction-input-card";
import { PropsWithAuction } from "@repo/types";
import { useSettleAuction } from "../hooks/use-settle-auction";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import React from "react";

export function AuctionDecrypted({ auction }: PropsWithAuction) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const settle = useSettleAuction(auction);

  return (
    <div className="flex justify-between">
      <AuctionMetricsContainer auction={auction}>
        <InfoLabel
          label="Total Bid Amount"
          value={`${auction.formatted?.totalBidAmount} ${auction.quoteToken.symbol}`}
        />
        <InfoLabel
          label="Rate"
          value={`${auction.formatted?.rate} ${auction.formatted?.tokenPairSymbols}`}
        />
      </AuctionMetricsContainer>
      <div className="w-[50%]">
        <AuctionInputCard
          showTrigger
          submitText="SETTLE AUCTION"
          onClick={() => setIsDialogOpen(true)}
          auction={auction}
        >
          <div className="bg-secondary text-foreground flex justify-center rounded-sm p-2">
            <h3>All bids have been decrypted</h3>
          </div>
        </AuctionInputCard>
      </div>
      <TransactionDialog
        signatureMutation={settle.settleTx}
        error={settle.error}
        mutation={settle.settleReceipt}
        chainId={auction.chainId}
        hash={settle.settleTx.data!}
        onConfirm={settle.handleSettle}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);

          if (settle.settleTx.isError) {
            settle.settleTx.reset();
          }
        }}
      />
    </div>
  );
}
