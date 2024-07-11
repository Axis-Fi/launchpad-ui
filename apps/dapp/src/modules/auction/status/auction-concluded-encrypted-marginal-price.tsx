import React from "react";
import { Badge, Button, Card, Metric, Progress, Text } from "@repo/ui";
import type { PropsWithAuction } from "@repo/types";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { useDecryptBids } from "../hooks/use-decrypt-auction";
import { ProjectInfoCard } from "../project-info-card";
import { AuctionMetric } from "../auction-metric";
import { AuctionMetrics } from "../auction-metrics";
import { RequiresChain } from "components/requires-chain";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { calculateAuctionProgress } from "../utils/get-auction-progress";
import { useBaseDTLCallback } from "../hooks/use-base-dtl-callback";

export function EncryptedMarginalPriceAuctionConcluded({
  auction,
}: PropsWithAuction) {
  const [open, setOpen] = React.useState(false);
  const decrypt = useDecryptBids(auction);

  const progress = calculateAuctionProgress(auction);
  const { data: dtlCallbackConfiguration } = useBaseDTLCallback({
    chainId: auction.chainId,
    lotId: auction.lotId,
    baseTokenDecimals: auction.baseToken.decimals,
    callback: auction.callbacks,
  });

  const totalBidsRemaining =
    (auction.formatted?.totalBids ?? 0) -
    (auction.formatted?.totalBidsClaimed ?? 0);

  return (
    <div>
      <div className="flex justify-between gap-x-8">
        <div className="flex w-full flex-col gap-y-4">
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
              <AuctionMetric auction={auction} id="maxTokensLaunched" />
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

        <div>
          <TransactionDialog
            signatureMutation={decrypt.decryptTx}
            disabled={decrypt.isWaiting}
            chainId={auction.chainId}
            hash={decrypt.decryptTx.data!}
            error={decrypt.error}
            onConfirm={decrypt.handleDecryption}
            mutation={decrypt.decryptReceipt}
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
              if (
                decrypt.decryptReceipt.isSuccess ||
                decrypt.decryptTx.isError
              ) {
                decrypt.decryptTx.reset();
              }
            }}
          />
          <Card
            title="Concluded"
            className="w-[496px]"
            headerRightElement={<Badge>Auction Closed</Badge>}
          >
            <div className="auction-ended-gradient w-fill flex h-[464px] items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <img
                  className="w-[92.351]px h-[80px]"
                  src="/images/axis-logo.svg"
                  alt="Axis Logo"
                />
                <Text size="xl" className="text-center">
                  Decrypt bids before settling the auction
                </Text>
              </div>
            </div>
            <div className="bg-secondary text-foreground flex justify-center gap-x-2 rounded-sm p-4">
              <div>
                <h1 className="text-4xl">
                  {auction.formatted?.totalBidsDecrypted}
                </h1>
                <p>Bids Decrypted</p>
              </div>

              <p className="text-6xl">/</p>

              <div>
                <h1 className="text-4xl">{totalBidsRemaining}</h1>
                <p>Total Remaining Bids</p>
              </div>
            </div>
            <RequiresChain chainId={auction.chainId} className="mt-4">
              <div className="mt-4 w-full">
                <Button
                  className="w-full"
                  disabled={decrypt.isWaiting}
                  onClick={() => setOpen(true)}
                >
                  {decrypt.isWaiting ? (
                    <div className="flex">
                      Waiting for confirmation...
                      <div className="w-1/2"></div>
                      <LoadingIndicator />
                    </div>
                  ) : (
                    "Decrypt Bids"
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
