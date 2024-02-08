import { useParams } from "react-router-dom";
import { Auction, AuctionStatus } from "src/types";
import {
  AuctionConcluded,
  AuctionCreated,
  AuctionDecrypted,
  AuctionLive,
  AuctionSettled,
} from "modules/auction/status";
import { useAuction } from "loaders/useAuction";
import { useAuctionLatestSnapshot } from "loaders/useAuctionLatestSnapshot";

const statuses: Record<
  AuctionStatus,
  (props: { auction: Auction }) => JSX.Element
> = {
  created: AuctionCreated,
  live: AuctionLive,
  concluded: AuctionConcluded,
  decrypted: AuctionDecrypted,
  settled: AuctionSettled,
};

/** Displays Auction details and status*/
export default function AuctionPage() {
  const params = useParams();

  const auction = useAuction(params.id);
  if (!auction) {
    throw new Error("Auction not found");
  }

  const snapshot = useAuctionLatestSnapshot(params.id);
  if (!snapshot) {
    throw new Error("No snapshot");
  }

  const auctionStatus = "Live"; // Need to do this in-app, as it's hard to do in the subgraph. Check the start/conclusion/capacity variables from the latest snapshot.

  const AuctionElement = statuses[auction.status];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="my-12 text-8xl">
            {auction?.quoteToken.symbol} Auction
          </h1>
        </div>

        <h2>{auctionStatus}</h2>
      </div>
      <div className="rounded-sm border p-2">
        <AuctionElement auction={auction} />
      </div>
    </div>
  );
}
