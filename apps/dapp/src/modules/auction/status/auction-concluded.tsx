import { useDecryptBids } from "../hooks/use-decrypt-auction";
import { AuctionInputCard } from "../auction-input-card";
import { InfoLabel } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { PropsWithAuction } from "src/types";
import { MutationDialog } from "modules/transaction/mutation-dialog";
import { RequiresWalletConnection } from "components/requires-wallet-connection";
import React from "react";

export function AuctionConcluded({ auction }: PropsWithAuction) {
  const [open, setOpen] = React.useState(false);
  const decrypt = useDecryptBids(auction);

  const disableButton =
    auction.formatted?.totalBids === 0 || decrypt.decryptTx.isPending;

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
          <MutationDialog
            disabled={disableButton}
            chainId={auction.chainId}
            hash={decrypt.decryptTx.data!}
            onConfirm={decrypt.handleDecryption}
            mutation={decrypt.decryptReceipt}
            open={open}
            onOpenChange={(open) => {
              setOpen(open);
              if (decrypt.decryptReceipt.isSuccess) {
                decrypt.decryptTx.reset();
              }
            }}
          />
          <AuctionInputCard
            auction={auction}
            onClick={() => setOpen(true)}
            submitText="Decrypt"
            showTrigger={true}
            disabled={disableButton}
          >
            <RequiresWalletConnection>
              <div className="bg-secondary text-foreground flex justify-center gap-x-2 rounded-sm p-4">
                <div>
                  <h1 className="text-4xl">
                    {auction.formatted?.totalBidsDecrypted}
                  </h1>
                  <p>Bids Decrypted</p>
                </div>

                <p className="text-6xl">/</p>

                <div>
                  <h1 className="text-4xl">{auction.formatted?.totalBids}</h1>
                  <p>Total Bids</p>
                </div>
              </div>
            </RequiresWalletConnection>
          </AuctionInputCard>
        </div>
      </div>
    </div>
  );
}
