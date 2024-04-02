import { AuctionInfoContainer } from "../auction-info-card";
import { PropsWithAuction } from "@repo/types";
import { AuctionInfoLabel } from "../auction-info-labels";

export function FixedPriceAuctionConcluded(props: PropsWithAuction) {
  return (
    <div>
      <div className="flex justify-between">
        <AuctionInfoContainer auction={props.auction}>
          <AuctionInfoLabel id="sold" />
          <AuctionInfoLabel id="price" />
        </AuctionInfoContainer>
      </div>
    </div>
  );
}
