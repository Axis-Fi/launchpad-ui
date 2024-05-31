export type AuctionModuleReference = "01EMPA" | "01FPSA" | "01FPBA";

export enum AuctionType {
  SEALED_BID = "EMPA",
  FIXED_PRICE = "FPSA",
  FIXED_PRICE_BATCH = "FPBA",
}

export enum AuctionDerivatives {
  LINEAR_VESTING = "LIV",
}
