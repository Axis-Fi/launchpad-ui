import React from "react";
import { Button, Card } from "@repo/ui";
import type { BatchAuction, PropsWithAuction } from "@repo/types";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { useDecryptBids } from "../hooks/use-decrypt-auction";
import { ProjectInfoCard } from "../project-info-card";
import { AuctionMetric } from "../auction-metric";
import { AuctionMetrics } from "../auction-metrics";
import { RequiresChain } from "components/requires-chain";
import { LoadingIndicator } from "modules/app/loading-indicator";

export function EncryptedMarginalPriceAuctionConcluded({
  auction,
}: PropsWithAuction) {
  const [open, setOpen] = React.useState(false);
  const decrypt = useDecryptBids(auction as BatchAuction);

  const isWaiting =
    decrypt.decryptTx.isPending || decrypt.decryptReceipt.isLoading;
  // removed totalBids === 0 from this because an auction that has no bids must either be decrypted + settled
  // or aborted so that the seller gets a refund

  const totalBidsRemaining =
    (auction.formatted?.totalBids ?? 0) -
    (auction.formatted?.totalBidsClaimed ?? 0);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex w-1/2 flex-col gap-y-4">
          <Card title="Launch Info">
            <AuctionMetrics>
              <AuctionMetric auction={auction} id="totalBids" />
              <AuctionMetric auction={auction} id="totalBidAmount" />
              <AuctionMetric auction={auction} id="started" />
              <AuctionMetric auction={auction} id="ended" />
            </AuctionMetrics>
          </Card>
          <ProjectInfoCard auction={auction} />
        </div>

        <div className="w-[40%]">
          <TransactionDialog
            signatureMutation={decrypt.decryptTx}
            disabled={isWaiting}
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
          <Card title="Concluded">
            <div className="bg-secondary text-foreground flex justify-center gap-x-2 rounded-sm">
              The bids must be decrypted before the auction can be settled.
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
                  disabled={isWaiting}
                  onClick={() => setOpen(true)}
                >
                  {isWaiting ? (
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
