import { AuctionMetricsContainer } from "../auction-metrics-container";
import { Button, Card } from "@repo/ui";
import type { PropsWithAuction } from "@repo/types";
import { AuctionMetric } from "../auction-metric";
import { ProjectInfoCard } from "../project-info-card";
import React from "react";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { useSettleAuction } from "../hooks/use-settle-auction";
import { RequiresChain } from "components/requires-chain";
import { LoadingIndicator } from "modules/app/loading-indicator";

export function FixedPriceBatchAuctionConcluded(props: PropsWithAuction) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const settle = useSettleAuction(props.auction);

  const isWaiting = settle.settleTx.isPending || settle.settleReceipt.isLoading;

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex w-1/2 flex-col gap-y-4">
          <Card title="Launch Info">
            <AuctionMetricsContainer auction={props.auction}>
              <AuctionMetric auction={props.auction} id="totalBids" />
              <AuctionMetric auction={props.auction} id="totalBidAmount" />
              <AuctionMetric auction={props.auction} id="started" />
              <AuctionMetric auction={props.auction} id="ended" />
            </AuctionMetricsContainer>
          </Card>
          <ProjectInfoCard auction={props.auction} />
        </div>
        <div className="w-[40%]">
          <TransactionDialog
            signatureMutation={settle.settleTx}
            error={settle.error}
            mutation={settle.settleReceipt}
            chainId={props.auction.chainId}
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
          <Card title="Concluded">
            <RequiresChain chainId={props.auction.chainId} className="mt-4">
              <div className="mt-4 w-full">
                <Button
                  className="w-full"
                  disabled={isWaiting}
                  onClick={() => setIsDialogOpen(true)}
                >
                  {isWaiting ? (
                    <div className="flex">
                      Waiting for confirmation...
                      <div className="w-1/2"></div>
                      <LoadingIndicator />
                    </div>
                  ) : (
                    "Settle"
                  )}
                </Button>
              </div>
            </RequiresChain>
          </Card>
        </div>
      </div>
    </div>
  );
}
