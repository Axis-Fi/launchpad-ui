import React from "react";
import { Card } from "@repo/ui";
import { AuctionInputCard } from "../auction-input-card";
import { PropsWithAuction } from "@repo/types";
import { useSettleAuction } from "../hooks/use-settle-auction";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { ProjectInfoCard } from "../project-info-card";
import { AuctionMetric } from "../auction-metric";
import { AuctionMetrics } from "../auction-metrics";

export function AuctionDecrypted({ auction }: PropsWithAuction) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const settle = useSettleAuction(auction);

  return (
    <div className="flex justify-between">
      <div className="flex w-[50%] flex-col justify-between gap-y-4">
        <Card title="Launch Info">
          <AuctionMetrics>
            <AuctionMetric auction={auction} id="totalBidAmount" />
            <AuctionMetric auction={auction} id="rate" />
          </AuctionMetrics>
        </Card>

        <ProjectInfoCard auction={auction} />
      </div>

      <div className="w-[40%]">
        <AuctionInputCard
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
