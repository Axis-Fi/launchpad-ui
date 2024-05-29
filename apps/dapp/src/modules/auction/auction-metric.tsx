import {
  AtomicAuction,
  Auction,
  BatchAuction,
  PropsWithAuction,
} from "@repo/types";
import { Metric, MetricProps } from "@repo/ui";
import { abbreviateNumber, trimCurrency } from "utils/currency";
import { formatPercentage } from "utils/number";

const handlers = {
  targetRaise: {
    label: "Target Raise",
    handler: (auction: Auction) => {
      const _auction = auction as BatchAuction;
      const targetRaise =
        Number(auction.capacityInitial) *
        Number(_auction.encryptedMarginalPrice?.minPrice);

      return `${trimCurrency(targetRaise)} ${auction.quoteToken.symbol}`;
    },
  },
  minRaise: {
    label: "Minimum Raise",
    handler: (auction: Auction) => {
      const _auction = auction as BatchAuction;
      const minRaise =
        Number(_auction.encryptedMarginalPrice?.minFilled) *
        Number(_auction.encryptedMarginalPrice?.minPrice);

      return `${trimCurrency(minRaise)} ${auction.quoteToken.symbol}`;
    },
  },

  minPrice: {
    label: "Minimum Price",
    handler: (auction: Auction) => {
      //TODO: revamp this
      if ("encryptedMarginalPrice" in auction) {
        return (
          trimCurrency(
            (auction as BatchAuction).encryptedMarginalPrice!.minPrice,
          ) + ` ${auction.quoteToken.symbol}`
        );
      }
    },
  },

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
      //TODO: improve types here
      `${(auction as AtomicAuction).fixedPriceSale?.price} ${auction.formatted
        ?.tokenPairSymbols}`,
  },

  sold: {
    label: "Sold",
    handler: (auction: Auction) =>
      `${auction.formatted?.sold} ${auction.baseToken.symbol}`,
  },

  auctionnedSupply: {
    label: "Auctionned Supply",
    handler: (auction: Auction) => {
      const res =
        (Number(auction.capacityInitial) /
          Number(auction.baseToken.totalSupply)) *
        100;

      return `${formatPercentage(res)}%`;
    },
  },
  vestingDuration: {
    label: "Vesting",
    handler: (auction: Auction) => {
      // TODO: move to formatters
      const duration = Math.floor(
        (Number(auction.linearVesting?.expiryTimestamp) -
          Number(auction.linearVesting?.startTimestamp)) /
          86400,
      );

      return `${duration} days`;
    },
  },
  minPriceFDV: {
    label: "Min. Price FDV",
    handler: (auction: Auction) => {
      const _auction = auction as BatchAuction;
      const fdv =
        Number(auction.baseToken.totalSupply) *
        Number(_auction.encryptedMarginalPrice?.minPrice);
      return `${abbreviateNumber(fdv)} ${auction.quoteToken.symbol}`;
    },
  },
};

type AuctionMetricsProps = Partial<PropsWithAuction> & {
  id: keyof typeof handlers;
} & Pick<MetricProps, "metricSize">;

export function AuctionMetric(props: AuctionMetricsProps) {
  const element = handlers[props.id];

  if (!props.auction) throw new Error("No auction provided");

  const value = element.handler(props.auction);

  return (
    <Metric metricSize={props.metricSize} label={element.label}>
      {value}
    </Metric>
  );
}
