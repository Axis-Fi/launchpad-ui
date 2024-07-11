import { type AuctionStatus, AuctionType } from "@repo/types";
import type { GetBatchAuctionLotQuery } from "@repo/subgraph-client";
import { getAuctionType } from "modules/auction/utils/get-auction-type";

const AUCTION_TYPE_PROPERTY_MAP = {
  [AuctionType.SEALED_BID]: "encryptedMarginalPrice",
  [AuctionType.FIXED_PRICE_BATCH]: "fixedPrice",
} as const;

const updateStatus = (
  cachedAuction: GetBatchAuctionLotQuery,
  status: AuctionStatus,
): GetBatchAuctionLotQuery => {
  const auctionType = getAuctionType(
    cachedAuction.batchAuctionLot?.auctionType,
  ) as AuctionType;
  const auctionTypePropertyName = AUCTION_TYPE_PROPERTY_MAP[auctionType];

  return {
    ...cachedAuction,
    batchAuctionLot: {
      ...cachedAuction.batchAuctionLot!,
      [auctionTypePropertyName]: {
        ...cachedAuction.batchAuctionLot![auctionTypePropertyName],
        status,
      },
    },
  } satisfies GetBatchAuctionLotQuery;
};

export { updateStatus };
