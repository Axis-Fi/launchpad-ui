import { useParams } from "react-router-dom";
import useAuctions from "../loaders/use-auctions";

/** Displays Auction details and status*/
export default function AuctionPage() {
  const params = useParams();
  const { getAuction } = useAuctions();
  const auction = getAuction(params.chainId, params.id);

  if (!auction) throw new Error("Auction not found");

  return (
    <div>
      <div className="flex">
        <div>
          <h1 className="my-12 text-8xl">{auction?.quoteToken} Auction</h1>
          {auction?.quoteToken}
        </div>
        <div>{auction?.status}</div>
      </div>
    </div>
  );
}
