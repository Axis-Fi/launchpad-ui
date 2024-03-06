import * as abis from "./generated";

export default {
  auctionHouse: abis.auctionHouseAbi,
  catalogue: abis.catalogueAbi,
  linearVesting: abis.linearVestingAbi,
  localSealedBidBatchAuction: abis.localSealedBidBatchAuctionAbi,
  permit2: abis.permit2Abi,
} as const;
