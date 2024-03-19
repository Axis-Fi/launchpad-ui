import * as abis from "./generated";

export default {
  auctionHouse: abis.auctionHouseAbi,
  catalogue: abis.catalogueAbi,
  linearVesting: abis.linearVestingAbi,
  empam: abis.empamAbi,
  fpam: abis.fpamAbi,
} as const;
