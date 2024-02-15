import { InfoLabel } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionInputCard } from "../auction-input-card";
import { PropsWithAuction } from "..";
import { trimCurrency } from "src/utils/currency";
import { SettledAuctionChart } from "components/settled-auction-chart";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const tokenAmounts = auction.bidsDecrypted
    .filter((b) => Number(b.amountOut) > 0)
    .reduce(
      (total, b) => {
        total.in += Number(b.amountIn);
        total.out += Number(b.amountOut);
        return total;
      },
      { in: 0, out: 0 },
    );

  const uniqueBidders = auction.bids
    .map((b) => b.bidder)
    .filter((b, i, a) => a.lastIndexOf(b) === i).length;

  const rate = trimCurrency((tokenAmounts.in / tokenAmounts.out).toString());

  return (
    <div className="flex justify-between">
      <AuctionInfoCard>
        <InfoLabel
          label="Total Raised"
          value={`${tokenAmounts.in} ${auction.quoteToken.symbol}`}
        />
        <InfoLabel
          label="Rate"
          value={`${rate} ${auction.quoteToken.symbol}/${auction.baseToken.symbol}`}
        />

        <InfoLabel label="Total Bids" value={auction.bids.length} />
        <InfoLabel label="Unique Participants" value={uniqueBidders} />
      </AuctionInfoCard>
      <div className="w-[40%]">
        <div>
          <SettledAuctionChart lotId={auction.lotId} />
        </div>
        <AuctionInputCard submitText={""} auction={auction}>
          <div className="text-center">
            <h4>Payout for this auction has been distributed!</h4>
          </div>
        </AuctionInputCard>
      </div>
    </div>
  );
}
