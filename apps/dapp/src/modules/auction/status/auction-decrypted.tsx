import { InfoLabel } from "@repo/ui";
import { useAccount } from "wagmi";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionInputCard } from "../auction-input-card";
import { PropsWithAuction } from "src/types";
import { RequiresWalletConnection } from "components/requires-wallet-connection";
import { useSettleAuction } from "../hooks/use-settle-auction";

export function AuctionDecrypted({ auction }: PropsWithAuction) {
  const { address } = useAccount();
  const settle = useSettleAuction(auction);

  const userBids = auction.bidsDecrypted.filter((b) =>
    b.bid.bidder.toLowerCase().includes(address?.toLowerCase() ?? ""),
  );

  const amountBid = userBids.reduce(
    (total, b) => total + Number(b.amountIn),
    0,
  );

  const amountSecured = userBids.reduce(
    (total, b) => total + Number(b.amountOut ?? 0),
    0,
  );

  return (
    <div className="flex justify-between">
      <AuctionInfoCard>
        <InfoLabel
          label="Total Raised"
          value={auction.formatted?.tokenAmounts.in}
        />
        <InfoLabel label="Rate" value={auction.formatted?.rate} />
      </AuctionInfoCard>
      <div className="w-[50%]">
        <AuctionInputCard
          submitText="Settle Auction"
          onClick={settle.handleSettle}
          auction={auction}
        >
          <RequiresWalletConnection>
            <div className="bg-secondary text-foreground flex justify-between rounded-sm p-2">
              <InfoLabel
                label="You bid"
                value={`${amountBid} ${auction.quoteToken.symbol}`}
                className="text-5xl font-light"
              />
              <InfoLabel
                label="You got"
                value={`${amountSecured} ${auction.baseToken.symbol}`}
                className="text-5xl font-light"
              />
            </div>
          </RequiresWalletConnection>
        </AuctionInputCard>
      </div>
    </div>
  );
}
