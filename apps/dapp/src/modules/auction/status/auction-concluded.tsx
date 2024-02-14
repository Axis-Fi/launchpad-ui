import { useDecryptBids } from "../use-decrypt-bids";
import { AuctionInputCard } from "../auction-input-card";
import { InfoLabel } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { formatDistanceToNow } from "date-fns";
import { PropsWithAuction } from "..";
import {
  MutationDialog,
  MutationDialogProps,
} from "modules/transactions/mutation-dialog";

export function AuctionConcluded({ auction }: PropsWithAuction) {
  const decrypt = useDecryptBids(auction);

  const totalBids = auction?.bids.length;
  const totalBidAmount = auction.bids?.reduce(
    (total, b) => total + Number(b.amount),
    0,
  );
  const auctionEndDistance = formatDistanceToNow(
    new Date(Number(auction.conclusion) * 1000),
  );

  const auctionStartDistance = formatDistanceToNow(
    new Date(Number(auction.createdBlockTimestamp) * 1000),
  );

  const disableButton = totalBids === 0 || decrypt.decryptTx.isPending;

  return (
    <div>
      <div className="flex justify-between">
        <AuctionInfoCard className="w-1/2">
          <InfoLabel label="Total Bids" value={totalBids} />
          <InfoLabel
            label="Total Bid Amount"
            value={totalBidAmount + " " + auction.quoteToken.symbol}
          />
          <InfoLabel label="Started" value={`${auctionStartDistance} ago`} />
          <InfoLabel label="Ended" value={`${auctionEndDistance} ago`} />
        </AuctionInfoCard>
        <div className="w-[40%]">
          <AuctionInputCard
            auction={auction}
            onClick={decrypt.handleDecryption}
            submitText="Decrypt"
            showTrigger={true}
            disabled={disableButton}
            TriggerElement={(props: Partial<MutationDialogProps>) => (
              <MutationDialog
                {...props}
                disabled={disableButton}
                chainId={auction.chainId}
                hash={decrypt.decryptTx.data!}
                triggerContent={"Decrypt"}
              />
            )}
          >
            <div className="bg-secondary text-foreground flex justify-center gap-x-2 rounded-sm p-4">
              <div>
                <h1 className="text-4xl">{auction.bidsDecrypted.length}</h1>
                <p>Bids Decrypted</p>
              </div>

              <p className="text-6xl">/</p>

              <div>
                <h1 className="text-4xl">{auction.bids.length}</h1>
                <p>Total Bids</p>
              </div>
            </div>
          </AuctionInputCard>

          {decrypt.nextBids.isFetching && <p>API - NextBids: Loading</p>}
          {decrypt.nextBids.isError && (
            <p>
              API:{" "}
              {decrypt.nextBids.error.message || decrypt.nextBids.error.name}
            </p>
          )}
          {decrypt.decryptTx.isPending && <p>Confirming transaction...</p>}
          {decrypt.decryptTx.isError && (
            <p>Txn: {decrypt.decryptTx.error?.message}</p>
          )}
          {decrypt.decryptTx.isSuccess && <p>Success!</p>}
        </div>
      </div>
    </div>
  );
}
