import { InfoLabel } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
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
      <AuctionInfoCard>
        <InfoLabel
          label="Total Raised"
          value={`${auction.formatted?.tokenAmounts.in} ${auction.quoteToken.symbol}`}
        />
        <InfoLabel
          label="Rate"
          value={`${auction.formatted?.rate} ${auction.formatted?.tokenPairSymbols}`}
        />
      </AuctionInfoCard>
      <div className="w-[50%]">
        <AuctionInputCard
          submitText="Settle Auction"
          onClick={() => setIsDialogOpen(true)}
          auction={auction}
        >
          <div className="bg-secondary text-foreground flex justify-center rounded-sm p-2">
            <h3>All bids have been decrypted</h3>
          </div>
        </AuctionInputCard>
      </div>
      <TransactionDialog
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
