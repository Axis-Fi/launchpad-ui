import * as abis from "./generated";

export default {
  auctionHouse: abis.auctionHouseAbi,
  catalogue: abis.catalogueAbi,
  linearVesting: abis.linearVestingAbi,
  localSealedBidBatchAuction: abis.localSealedBidBatchAuctionAbi,
} as const;
