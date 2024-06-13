import React from "react";
import { Badge, Button, Card, Metric, Progress, Text } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { useSettleAuction } from "../hooks/use-settle-auction";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { ProjectInfoCard } from "../project-info-card";
import { AuctionMetric } from "../auction-metric";
import { AuctionMetrics } from "../auction-metrics";
import { RequiresChain } from "components/requires-chain";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { calculateAuctionProgress } from "../utils/get-auction-progress";

export function AuctionDecrypted({ auction }: PropsWithAuction) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const settle = useSettleAuction(auction);

  const progress = calculateAuctionProgress(auction);

  const isWaiting = settle.settleTx.isPending || settle.settleReceipt.isLoading;

  return (
    <div className="flex justify-between gap-x-8">
      <div className="flex w-full flex-col justify-between gap-y-4">
        <Card
          title="Launch Info"
          headerRightElement={
            <div className="flex gap-x-2">
              <Metric size="s" label="Token Address">
                <BlockExplorerLink
                  trim
                  chainId={auction.chainId}
                  address={auction.baseToken.address}
                />
              </Metric>
            </div>
          }
        >
          <div className="mb-4">
            <Text uppercase size="xs" spaced>
              Auction Concluded
            </Text>
            <Progress value={progress} className="mt-1" />
          </div>
          <AuctionMetrics>
            <AuctionMetric auction={auction} id="targetRaise" />
            <AuctionMetric auction={auction} id="minRaise" />
            <AuctionMetric auction={auction} id="totalBids" />
            <AuctionMetric auction={auction} id="totalBidAmount" />
            <AuctionMetric auction={auction} id="result" />
            <AuctionMetric auction={auction} id="minTokensLaunched" />
            <AuctionMetric auction={auction} id="started" />
            <AuctionMetric auction={auction} id="ended" />
          </AuctionMetrics>
        </Card>

        <ProjectInfoCard auction={auction} />
      </div>

      <div className="w-full max-w-lg">
        <TransactionDialog
          signatureMutation={settle.settleTx}
          disabled={isWaiting}
          chainId={auction.chainId}
          hash={settle.settleTx.data!}
          error={settle.error}
          onConfirm={settle.handleSettle}
          mutation={settle.settleReceipt}
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (settle.settleReceipt.isSuccess || settle.settleTx.isError) {
              settle.settleTx.reset();
            }
          }}
        />
        <Card
          title="Decrypted"
          className="w-[496px]"
          headerRightElement={<Badge color="ghost">Auction Closed</Badge>}
        >
          <div className="auction-ended-gradient w-fill flex h-[464px] items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <img
                className="w-[92.351]px h-[80px]"
                src="/images/axis-logo.svg"
                alt="Axis Logo"
              />
              <Text size="xl">All bids have been decrypted</Text>
            </div>
          </div>
          <RequiresChain chainId={auction.chainId} className="mt-4">
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
