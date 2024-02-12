import { useNavigate, useParams } from "react-router-dom";
import { Auction, AuctionStatus } from "src/types";
import {
  AuctionConcluded,
  AuctionCreated,
  AuctionDecrypted,
  AuctionLive,
  AuctionSettled,
} from "modules/auction/status";
import { useAuction } from "loaders/useAuction";
import { ArrowLeft } from "lucide-react";
import { Avatar, Button } from "@repo/ui";
import { SocialRow } from "components/social-row";

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
  const navigate = useNavigate();

  const { result: auction, isLoading: isAuctionLoading } = useAuction(
    params.id,
  );

  if (isAuctionLoading) {
    return <div>Loading...</div>;
  }

  if (!auction) {
    return <div>Auction not found</div>;
  }

  const AuctionElement = statuses[auction.status];

  return (
    <div className="mt-5">
      <div>
        <Button size="icon" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
      </div>
      <div className="bg-secondary rounded-sm p-4">
        <div className="flex items-center gap-x-1">
          <Avatar
            className="h-12 w-12 text-lg"
            alt={auction.baseToken.symbol}
            src={auction.baseToken.logoURL}
          />
          <h1 className="text-[40px]">{auction.baseToken.name}</h1>
        </div>
        {/*TODO: Figure out socials*/}
        <SocialRow className="gap-x-2" />
      </div>
      <div className="mt-5">
        <AuctionElement auction={auction} />
      </div>
    </div>
  );
}
