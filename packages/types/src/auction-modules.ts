export type AuctionModuleReference = "01EMPAM" | "01FPAM\x00";

export enum AuctionType {
  SEALED_BID = "encryptedMarginalPrice",
  FIXED_PRICE = "fixedPriceSale",
}

export enum AuctionDerivatives {
  LINEAR_VESTING = "LIV",
}
