import * as abis from "./generated";

export default {
  batchAuctionHouse: abis.batchAuctionHouseAbi,
  batchCatalogue: abis.batchCatalogueAbi,
  encryptedMarginalPrice: abis.encryptedMarginalPriceAbi,
  fixedPriceBatch: abis.fixedPriceBatchAbi,
  batchLinearVesting: abis.linearVestingAbi,
  merkleAllowlist: abis.merkleAllowlistAbi,
  cappedMerkleAllowlist: abis.cappedMerkleAllowlistAbi,
  tokenAllowlist: abis.tokenAllowlistAbi,
  allocatedMerkleAllowlist: abis.allocatedMerkleAllowlistAbi,
  uniV2Dtl: abis.uniV2DtlAbi,
  uniV3Dtl: abis.uniV3DtlAbi,
  uniV2Factory: abis.uniV2FactoryAbi,
  uniV3Factory: abis.uniV3FactoryAbi,
  baseline: abis.baselineAbi,
  baselineAllowlist: abis.baselineAllowlistAbi,
  baselineAllocatedAllowlist: abis.baselineAllocatedAllowlistAbi,
  baselineCappedAllowlist: abis.baselineCappedAllowlistAbi,
  baselineTokenAllowlist: abis.baselineTokenAllowlistAbi,
  bpool: abis.bpoolAbi,
} as const;
