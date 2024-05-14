import { useDecryptBids } from "../hooks/use-decrypt-auction";
import { AuctionInputCard } from "../auction-input-card";
import { InfoLabel } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { BatchAuction, PropsWithAuction } from "@repo/types";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import React from "react";

export function AuctionConcluded({ auction }: PropsWithAuction) {
  const [open, setOpen] = React.useState(false);
  const decrypt = useDecryptBids(auction as BatchAuction);

  const disableButton = decrypt.decryptTx.isPending;
  // removed totalBids === 0 from this because an auction that has no bids must either be decrypted + settled
  // or aborted so that the seller gets a refund

  const totalBidsRemaining =
    (auction.formatted?.totalBids ?? 0) -
    (auction.formatted?.totalBidsClaimed ?? 0);

  return (
    <div>
      <div className="flex justify-between">
        <AuctionInfoCard className="w-1/2">
          <InfoLabel label="Total Bids" value={auction.formatted?.totalBids} />
          <InfoLabel
            label="Total Bid Amount"
            value={`${auction.formatted?.totalBidAmount} ${auction.quoteToken.symbol}`}
          />
          <InfoLabel
            label="Started"
            value={`${auction.formatted?.startDistance} ago`}
          />
          <InfoLabel
            label="Ended"
            value={`${auction.formatted?.endDistance} ago`}
          />
        </AuctionInfoCard>
        <div className="w-[40%]">
          <TransactionDialog
            signatureMutation={decrypt.decryptTx}
            disabled={disableButton}
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
          <AuctionInputCard
            auction={auction}
            onClick={() => setOpen(true)}
            submitText="DECRYPT"
            showTrigger={true}
            disabled={disableButton}
          >
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
          </AuctionInputCard>
        </div>
      </div>
    </div>
  );
}
