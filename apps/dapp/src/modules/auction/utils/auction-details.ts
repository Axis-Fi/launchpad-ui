import { zeroAddress } from "viem";
import { deployments } from "@repo/deployments";
import {
  type BatchAuction,
  type Auction,
  type AuctionDerivativeTypes,
  type AuctionLinkId,
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

type PartialAuction = Pick<Auction, "info">;

const getLinkUrl = (id: AuctionLinkId, auction: PartialAuction) => {
  return auction?.info?.links?.find((link) => link.linkId === id)?.url;
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

const hasAllowlist = (auction: Auction) => {
  if (auction.callbacks === zeroAddress) return false;

  const [callbackName] =
    Object.entries(deployments[auction.chainId]?.callbacks || {}).find(
      ([, address]) =>
        address.toLowerCase() === auction.callbacks.toLowerCase(),
    ) || [];

  const isAllowlistCallback = callbackName
    ?.toLowerCase()
    ?.includes("allowlist");

  return !!isAllowlistCallback;
};

export { getPrice, getMinFilled, getLinkUrl, hasDerivative, hasAllowlist };
