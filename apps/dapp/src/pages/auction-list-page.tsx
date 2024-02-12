import { Button, IconnedInput, cn } from "@repo/ui";
import { useAuctions } from "loaders/useAuctions";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { AuctionCard, AuctionCardLoading } from "modules/auction/auction-card";
import { useNavigate } from "react-router-dom";

export default function AuctionListPage() {
  const navigate = useNavigate();
  const { result: auctions, isLoading } = useAuctions();

  return (
    <div className="mt-5">
      <h1 className="mb-12">Blind Auctions</h1>

      <div className="flex items-center justify-between">
        <h3>Liquidity Bootstrapping</h3>
        <IconnedInput
          icon={<SearchIcon />}
          className="placeholder:text-foreground"
          placeholder="Search"
        />
      </div>
      <div className={cn("mt-4 grid grid-cols-3 gap-4", isLoading && "mask")}>
        {isLoading
          ? [...new Array(6)].map((_e, i) => <AuctionCardLoading key={i} />)
          : auctions.map((a) => (
              <AuctionCard
                key={a.chainId + a.id}
                //socials={} TODO: add socials
                auction={a}
                onClickView={() => navigate(`/auction/${a.chainId}/${a.id}`)}
              />
            ))}
      </div>

      <div className="flex flex-col items-center justify-center py-8">
        <p className="font-aeonpro pb-2">Want to create an auction?</p>
        <Button onClick={() => navigate("/create/auction")} variant="outline">
          Create Blind Auction <ArrowRightIcon className="w-6 pl-1" />
        </Button>
      </div>
    </div>
  );
}
