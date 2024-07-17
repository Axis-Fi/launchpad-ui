import { AuctionMetricsContainer } from "../auction-metrics-container";
import { Badge, Button, Card, Metric, Progress, Text } from "@repo/ui";
import { type PropsWithAuction } from "@repo/types";
import { AuctionMetric } from "../auction-metric";
import { ProjectInfoCard } from "../project-info-card";
import React, { useState } from "react";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { useSettleAuction } from "../hooks/use-settle-auction";
import { RequiresChain } from "components/requires-chain";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { calculateAuctionProgress } from "../utils/get-auction-progress";
import { SettleAuctionCallbackInput } from "./settle-callback-input";
import { useBaseDTLCallback } from "../hooks/use-base-dtl-callback";
import { SettleAuctionDtlCallbackBalance } from "./settle-dtl-callback-balance";

// TODO needs story tests, given the amount of potential states

export function FixedPriceBatchAuctionConcluded(props: PropsWithAuction) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [
    hasSufficientBalanceForCallbacks,
    setHasSufficientBalanceForCallbacks,
  ] = React.useState(true);

  const hasCallbacks =
    props.auction.callbacks &&
    props.auction.callbacks != "0x0000000000000000000000000000000000000000";

  // Storage of encoded callback data for the callback contract
  const [callbackData, setCallbackData] = useState<`0x${string}` | undefined>(
    undefined,
  );
  const [callbackDataIsValid, setCallbackDataIsValid] = useState(
    hasCallbacks ? false : true,
  );

  const settle = useSettleAuction({
    auction: props.auction,
    callbackData: callbackData,
  });
  const { data: dtlCallbackConfiguration } = useBaseDTLCallback({
    chainId: props.auction.chainId,
    lotId: props.auction.lotId,
    baseTokenDecimals: props.auction.baseToken.decimals,
    callback: props.auction.callbacks,
  });

  const progress = calculateAuctionProgress(props.auction);

  const isWaiting = settle.settleTx.isPending || settle.settleReceipt.isLoading;

  return (
    <div>
      <div className="auction-action-container">
        <div className="flex w-full flex-col gap-y-4">
          <Card
            title="Launch Info"
            headerRightElement={
              <div className="flex gap-x-2">
                <Metric size="s" label="Token Address">
                  <BlockExplorerLink
                    trim
                    chainId={props.auction.chainId}
                    address={props.auction.baseToken.address}
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
            <AuctionMetricsContainer auction={props.auction}>
              <AuctionMetric auction={props.auction} id="targetRaise" />
              <AuctionMetric auction={props.auction} id="minRaise" />
              <AuctionMetric auction={props.auction} id="totalBids" />
              <AuctionMetric auction={props.auction} id="totalBidAmount" />
              <AuctionMetric auction={props.auction} id="result" />
              <AuctionMetric auction={props.auction} id="maxTokensLaunched" />
              <AuctionMetric auction={props.auction} id="started" />
              <AuctionMetric auction={props.auction} id="ended" />
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
            </AuctionMetricsContainer>
          </Card>
          <ProjectInfoCard auction={props.auction} />
        </div>
        <div>
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
          <Card
            title="Concluded"
            className="mt-4 lg:mt-0 lg:w-[496px]"
            headerRightElement={<Badge color="ghost">Auction Closed</Badge>}
          >
            <div className="flex flex-col gap-y-4">
              <div className="auction-ended-gradient w-fill flex h-[464px] items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <img
                    className="h-[80px]"
                    src="/images/axis-logo.svg"
                    alt="Axis Logo"
                  />
                  <Text size="xl">Auction has ended</Text>
                </div>
              </div>
              {hasCallbacks && (
                <div>
                  <SettleAuctionCallbackInput
                    auction={props.auction}
                    setCallbackData={setCallbackData}
                    setCallbackDataIsValid={setCallbackDataIsValid}
                  />
                </div>
              )}
              {
                <SettleAuctionDtlCallbackBalance
                  auction={props.auction}
                  setHasSufficientBalanceForCallbacks={
                    setHasSufficientBalanceForCallbacks
                  }
                />
              }
              <RequiresChain chainId={props.auction.chainId} className="mt-4">
                <div className="mt-4 w-full">
                  <Button
                    className="w-full"
                    disabled={
                      isWaiting ||
                      !callbackDataIsValid ||
                      !hasSufficientBalanceForCallbacks
                    }
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
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
