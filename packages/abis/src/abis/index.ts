import * as abis from "./generated";

export default {
  batchAuctionHouse: abis.batchAuctionHouseAbi,
  batchCatalogue: abis.batchCatalogueAbi,
  encryptedMarginalPrice: abis.encryptedMarginalPriceAbi,
  fixedPriceBatch: abis.fixedPriceBatchAbi,
  atomicLinearVesting: abis.linearVestingAbi,
  batchLinearVesting: abis.linearVestingAbi,
  merkleAllowlist: abis.merkleAllowlistAbi,
  cappedMerkleAllowlist: abis.cappedMerkleAllowlistAbi,
  tokenAllowlist: abis.tokenAllowlistAbi,
  allocatedMerkleAllowlist: abis.allocatedMerkleAllowlistAbi,
} as const;
