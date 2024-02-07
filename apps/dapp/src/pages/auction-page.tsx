import { useParams } from "react-router-dom";
import useAuctions from "../loaders/use-auctions";
import { Auction, AuctionStatus } from "src/types";
import {
  AuctionConcluded,
  AuctionCreated,
  AuctionDecrypted,
  AuctionLive,
  AuctionSettled,
} from "modules/auction/status";

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
  const { getAuction } = useAuctions();
  const auction = getAuction(params.chainId, params.id);

  if (!auction) throw new Error("Auction not found");

  const AuctionElement = statuses[auction.status];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="my-12 text-8xl">
            {auction?.quoteToken.symbol} Auction
          </h1>
        </div>

        <h2>{auction?.status}</h2>
      </div>
      <div className="rounded-sm border p-2">
        <AuctionElement auction={auction} />
      </div>
    </div>
  );
}
