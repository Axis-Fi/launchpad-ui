import { differenceInDays } from "date-fns";
import {
  AuctionDerivatives,
  type AtomicAuction,
  type Auction,
  type BatchAuction,
  type PropsWithAuction,
} from "@repo/types";
import { Metric, MetricProps } from "@repo/ui";
import { trimCurrency } from "utils/currency";
import { shorten, formatPercentage } from "utils/number";

const handlers = {
  derivative: {
    label: "Derivative",
    handler: (auction: Auction) => {
      switch (auction.derivativeType) {
        case AuctionDerivatives.LINEAR_VESTING: {
          return "Vesting";
        }
        default:
          return "None";
      }
    },
  },
  minFill: {
    label: "Min Fill",
    handler: (auction: Auction) => {
      const _auction = auction as BatchAuction;
      const fill = Math.round(
        +_auction.encryptedMarginalPrice!.minFilled / +_auction.capacity,
      );
      return `${fill}%`;
    },
  },
  protocolFee: {
    label: "Protocol Fee",
    handler: (auction: Auction) => {
      return `${+auction.protocolFee}%`;
    },
  },
  referrerFee: {
    label: "Referrer Fee",
    handler: (auction: Auction) => {
      return `${+auction.referrerFee}%`;
    },
  },
  duration: {
    label: "Duration",
    handler: (auction: Auction) => {
      const days = differenceInDays(
        new Date(+auction.conclusion * 1000),
        new Date(+auction.start * 1000),
      );
      return `${days} days`;
    },
  },
  totalRaised: {
    label: "Total Raised",
    handler: (auction: Auction) => {
      const _auction = auction as BatchAuction;
      return `${_auction.formatted?.purchased} ${_auction.quoteToken.symbol}`;
    },
  },
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
    label: "Min Raise",
    handler: (auction: Auction) => {
      const _auction = auction as BatchAuction;
      const minRaise =
        Number(_auction.encryptedMarginalPrice?.minFilled) *
        Number(_auction.encryptedMarginalPrice?.minPrice);

      return `${trimCurrency(minRaise)} ${auction.quoteToken.symbol}`;
    },
  },

  minPrice: {
    label: "Min Price",
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
  totalBids: {
    label: "Total Bids",
    handler: (auction: Auction) => {
      return `${auction.formatted?.totalBids}`;
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
      shorten(Number(auction.baseToken.totalSupply)),
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

  auctionedSupply: {
    label: "Auctioned Supply",
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
      if (!auction.linearVesting) {
        return "None";
      }

      // TODO: move to formatters
      const duration = Math.floor(
        (Number(auction.linearVesting.expiryTimestamp) -
          Number(auction.linearVesting.startTimestamp)) /
          86400,
      );

      return `${duration} days`;
    },
  },
  minPriceFDV: {
    label: "Min Price FDV",
    handler: (auction: Auction) => {
      const _auction = auction as BatchAuction;
      const fdv =
        Number(auction.baseToken.totalSupply) *
        Number(_auction.encryptedMarginalPrice?.minPrice);
      return `${shorten(fdv)} ${auction.quoteToken.symbol}`;
    },
  },
  rate: {
    label: "Rate",
    handler: (auction: Auction) => {
      return `${auction.formatted?.rate} ${auction.formatted?.tokenPairSymbols}`;
    },
  },
  started: {
    label: "Started",
    handler: (auction: Auction) => {
      return `${auction.formatted?.startDistance} ago`;
    },
  },
  ended: {
    label: "Ended",
    handler: (auction: Auction) => {
      return `${auction.formatted?.endDistance} ago`;
    },
  },
};

type AuctionMetricProps = Partial<PropsWithAuction> & {
  id: keyof typeof handlers;
  className?: string;
} & Pick<MetricProps, "size">;

export function AuctionMetric(props: AuctionMetricProps) {
  const element = handlers[props.id];

  if (!props.auction) throw new Error("No auction provided");
  if (!element) throw new Error(`No auction metric found for ${props.id}`);

  const value = element.handler(props.auction);

  return (
    <Metric size={props.size} label={element.label}>
      {value}
    </Metric>
  );
}
