import {
  type BatchAuction,
  AuctionDerivativeTypes,
  AuctionType,
} from "@repo/types";

const getPrice = (auction: BatchAuction): number | undefined => {
  if (auction.auctionType === AuctionType.FIXED_PRICE_BATCH) {
    return Number(auction.fixedPrice?.price);
  }

  if (auction.auctionType === AuctionType.SEALED_BID) {
    return Number(auction.encryptedMarginalPrice?.minPrice);
  }

  return undefined;
};

const getMinFilled = (auction: BatchAuction): number | undefined => {
  if (auction.auctionType === AuctionType.FIXED_PRICE_BATCH) {
    return Number(auction.fixedPrice?.minFilled);
  }

  if (auction.auctionType === AuctionType.SEALED_BID) {
    return Number(auction.encryptedMarginalPrice?.minFilled);
  }

  return undefined;
};

const hasDerivative = (
  derivativeType: AuctionDerivativeTypes,
  auction: BatchAuction,
): boolean => {
  if (typeof auction?.derivativeType !== "string") {
    return false;
  }

  const auctionDerivativeType = auction.derivativeType.slice(-3);
  return auctionDerivativeType.toLowerCase() === derivativeType.toLowerCase();
};

export { getPrice, getMinFilled, hasDerivative };
