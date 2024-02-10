import { Button } from "@repo/ui";

//TODO: implement
export default function AuctionListPage() {
  return (
    <div>
      <h1>Blind Auctions</h1>

      <div className="flex justify-between">
        <h3>Liquidity Bootstrapping</h3>
        <div>
          <Button>Search</Button>
          <Button>Sort</Button>
        </div>
      </div>
    </div>
  );
}
