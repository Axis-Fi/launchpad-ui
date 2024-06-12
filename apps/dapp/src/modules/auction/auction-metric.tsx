import {
  AuctionDerivatives,
  AuctionType,
  CallbacksType,
  type Auction,
  type BatchAuction,
  type PropsWithAuction,
} from "@repo/types";
import { Metric, MetricProps, trimAddress } from "@repo/ui";
import { trimCurrency } from "utils/currency";
import { shorten, formatPercentage } from "utils/number";
import { getCallbacksType } from "./utils/get-callbacks-type";
import { getDaysBetweenDates } from "utils/date";

const getPrice = (auction: Auction): number | undefined => {
  // Fixed Price Batch
  if (auction.auctionType === AuctionType.FIXED_PRICE_BATCH) {
    return Number((auction as BatchAuction).fixedPrice?.price);
  }

  // EMP
  if (auction.auctionType === AuctionType.SEALED_BID) {
    return Number((auction as BatchAuction).encryptedMarginalPrice?.minPrice);
  }

  // Unknown
  return undefined;
};

const getMinFilled = (auction: Auction): number | undefined => {
  // Fixed Price Batch
  if (auction.auctionType === AuctionType.FIXED_PRICE_BATCH) {
    return Number((auction as BatchAuction).fixedPrice?.minFilled);
  }

  // EMP
  if (auction.auctionType === AuctionType.SEALED_BID) {
    return Number((auction as BatchAuction).encryptedMarginalPrice?.minFilled);
  }

  return undefined;
};

// TODO add DTL proceeds as a metric. Probably requires loading the callback configuration into the auction type.

const handlers = {
  derivative: {
    label: "Derivative",
    handler: (auction: Auction) => {
      if (auction.derivativeType?.endsWith(AuctionDerivatives.LINEAR_VESTING)) {
        return "Linear Vesting";
      }

      return "None";
    },
  },
  minFill: {
    label: "Min Fill",
    handler: (auction: Auction) => {
      const minFilled = getMinFilled(auction);
      if (!minFilled) return undefined;

      return `${trimCurrency(minFilled)} ${auction.baseToken.symbol}`;
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
      const days = getDaysBetweenDates(
        new Date(+auction.conclusion * 1000),
        new Date(+auction.start * 1000),
      );

      //The minimum an auction can run for is 24h
      return `${days || 1} days`;
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
      const price = getPrice(auction);
      if (!price) return undefined;

      const targetRaise = Number(auction.capacityInitial) * Number(price);

      return `${trimCurrency(targetRaise)} ${auction.quoteToken.symbol}`;
    },
  },
  minRaise: {
    label: "Min Raise",
    handler: (auction: Auction) => {
      const price = getPrice(auction);
      const minFilled = getMinFilled(auction);

      if (!price || !minFilled) return undefined;

      const minRaise = minFilled * price;

      return `${trimCurrency(minRaise)} ${auction.quoteToken.symbol}`;
    },
  },

  minPrice: {
    label: "Min Price",
    handler: (auction: Auction) => {
      const price = getPrice(auction);
      if (!price) return undefined;

      return `${trimCurrency(price)} ${auction.quoteToken.symbol}`;
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
    label: "Tokens Available",
    handler: (auction: Auction) =>
      `${auction.formatted?.capacity || shorten(Number(auction.capacity))} ${
        auction.baseToken.symbol
      }`,
  },

  totalSupply: {
    label: "Total Supply",
    handler: (auction: Auction) =>
      shorten(Number(auction.baseToken.totalSupply)),
  },

  price: {
    label: "Price",
    handler: (auction: Auction) =>
      `${getPrice(auction)} ${auction.quoteToken?.symbol}`,
  },

  fixedPrice: {
    label: "Price",
    handler: (auction: Auction) =>
      `${getPrice(auction)} ${auction.quoteToken.symbol}`,
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

      const start = new Date(+auction.linearVesting.startTimestamp * 1000);
      const end = new Date(+auction.linearVesting.expiryTimestamp * 1000);

      const duration = getDaysBetweenDates(end, start);

      return `${duration} days`;
    },
  },
  minPriceFDV: {
    label: "Min Price FDV",
    handler: (auction: Auction) => {
      const price = getPrice(auction);
      if (!price) return undefined;

      const fdv = Number(auction.baseToken.totalSupply) * price;
      return `${shorten(fdv)} ${auction.quoteToken.symbol}`;
    },
  },
  fixedPriceFDV: {
    label: "Fixed Price FDV",
    handler: (auction: Auction) => {
      const price = getPrice(auction);
      if (!price) return undefined;

      const fdv = Number(auction.baseToken.totalSupply) * price;
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
  curator: {
    label: "Curator",
    handler: (auction: Auction) => {
      if (!auction.curator) return undefined;

      return trimAddress(auction.curator, 6);
    },
  },
  saleType: {
    label: "Sale Type",
    handler: (auction: Auction) => {
      const callbacksType = getCallbacksType(auction);

      switch (callbacksType) {
        case CallbacksType.MERKLE_ALLOWLIST:
          return "Private";
        case CallbacksType.CAPPED_MERKLE_ALLOWLIST:
          return "Private (Capped)";
        case CallbacksType.ALLOCATED_MERKLE_ALLOWLIST:
          return "Private (Allocated)";
        case CallbacksType.TOKEN_ALLOWLIST:
          return "Private (Token-Gated)";
        default:
          return "Public";
      }
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
      {value || "-"}
    </Metric>
  );
}
