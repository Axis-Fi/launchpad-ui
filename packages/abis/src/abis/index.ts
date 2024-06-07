import * as abis from "./generated";

export default {
  atomicAuctionHouse: abis.atomicAuctionHouseAbi,
  atomicCatalogue: abis.atomicCatalogueAbi,
  batchAuctionHouse: abis.batchAuctionHouseAbi,
  batchCatalogue: abis.batchCatalogueAbi,
  encryptedMarginalPrice: abis.encryptedMarginalPriceAbi,
  fixedPriceSale: abis.fixedPriceSaleAbi,
  fixedPriceBatch: abis.fixedPriceBatchAbi,
  atomicLinearVesting: abis.linearVestingAbi,
  batchLinearVesting: abis.linearVestingAbi,
  merkleAllowlist: abis.merkleAllowlistAbi,
  cappedMerkleAllowlist: abis.cappedMerkleAllowlistAbi,
  tokenAllowlist: abis.tokenAllowlistAbi,
  allocatedMerkleAllowlist: abis.allocatedMerkleAllowlistAbi,
} as const;
