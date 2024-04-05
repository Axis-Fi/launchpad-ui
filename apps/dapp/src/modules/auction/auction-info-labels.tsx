import { Auction, PropsWithAuction } from "@repo/types";
import { InfoLabel } from "@repo/ui";

const handlers = {
  totalBidAmount: {
    label: "Total Bid Amount",
    handler: (auction: Auction) =>
      `${auction.formatted?.totalBidAmount} ${auction.quoteToken.symbol}`,
  },

  capacity: {
    label: "Capacity",
    handler: (auction: Auction) =>
      `${auction.formatted?.capacity} ${auction.baseToken.symbol}`,
  },

  totalSupply: {
    label: "Total Supply",
    handler: (auction: Auction) =>
      `${auction.formatted?.totalSupply} ${auction.baseToken.symbol}`,
  },

  price: {
    label: "Price",
    handler: (auction: Auction) =>
      `${auction.formatted?.price} ${auction.formatted?.tokenPairSymbols}`,
  },

  sold: {
    label: "Sold",
    handler: (auction: Auction) =>
      `${auction.formatted?.sold} ${auction.baseToken.symbol}`,
  },
};

type AuctionInfoLabelProps = Partial<PropsWithAuction> & {
  id: keyof typeof handlers;
};

export function AuctionInfoLabel(props: AuctionInfoLabelProps) {
  const element = handlers[props.id];

  if (!props.auction) throw new Error("No auction provided");

  const value = element.handler(props.auction);
  return <InfoLabel label={element.label} value={value} />;
}
