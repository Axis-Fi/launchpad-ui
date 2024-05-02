export type AuctionModuleReference = "01EMPA" | "01FPSA";

export enum AuctionType {
  SEALED_BID = "encryptedMarginalPrice",
  FIXED_PRICE = "fixedPriceSale",
}

export enum AuctionDerivatives {
  LINEAR_VESTING = "LIV",
}
