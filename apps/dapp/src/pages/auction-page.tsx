import { useParams } from "react-router-dom";
import useAuctions from "../loaders/use-auctions";

/** Displays Auction details and status*/
export default function AuctionPage() {
  const params = useParams();
  const { getAuction } = useAuctions();
  const auction = getAuction(params.chainId, params.id);

  return (
    <div>
      <h1>
        Auction {params.chainId}:{params.id}
      </h1>
      {auction?.quoteToken}
    </div>
  );
}
