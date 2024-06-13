import React, { useState } from "react";
import { Button, Card, Metric } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { useSettleAuction } from "../hooks/use-settle-auction";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { ProjectInfoCard } from "../project-info-card";
import { AuctionMetric } from "../auction-metric";
import { AuctionMetrics } from "../auction-metrics";
import { RequiresChain } from "components/requires-chain";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { SettleAuctionCallbackInput } from "./settle-callback-input";
import { useBaseDTLCallback } from "../hooks/use-base-dtl-callback";

export function AuctionDecrypted({ auction }: PropsWithAuction) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Storage of encoded callback data for the callback contract
  const [callbackData, setCallbackData] = useState<`0x${string}` | undefined>(
    undefined,
  );
  const [callbackDataIsValid, setCallbackDataIsValid] = useState(false);

  const settle = useSettleAuction({
    auction: auction,
    callbackData: callbackData,
  });

  const { data: dtlCallbackConfiguration } = useBaseDTLCallback({
    chainId: auction.chainId,
    lotId: auction.lotId,
    baseTokenDecimals: auction.baseToken.decimals,
    callback: auction.callbacks,
  });

  const hasCallbacks =
    auction.callbacks &&
    auction.callbacks != "0x0000000000000000000000000000000000000000";

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
          <AuctionMetrics>
            <AuctionMetric auction={auction} id="totalBids" />
            <AuctionMetric auction={auction} id="totalBidAmount" />
            <AuctionMetric auction={auction} id="started" />
            <AuctionMetric auction={auction} id="ended" />
            {dtlCallbackConfiguration && (
              <Metric
                label="Direct to Liquidity"
                size="m"
                tooltip="The percentage of proceeds that will be automatically deposited into the liquidity pool"
                className=""
              >
                {dtlCallbackConfiguration.proceedsUtilisationPercent * 100}%
              </Metric>
            )}
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
        <Card title="Decrypted">
          <div className="bg-secondary text-foreground flex justify-center rounded-sm p-2">
            <p>All bids have been decrypted</p>
          </div>
          {hasCallbacks && (
            <div>
              <SettleAuctionCallbackInput
                auction={auction}
                setCallbackData={setCallbackData}
                setCallbackDataIsValid={setCallbackDataIsValid}
              />
            </div>
          )}
          <RequiresChain chainId={auction.chainId} className="mt-4">
            <div className="mt-4 w-full">
              <Button
                className="w-full"
                disabled={isWaiting || !callbackDataIsValid}
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
