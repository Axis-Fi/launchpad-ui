export type AuctionModuleReference = "01EMPAM" | "01FPAM\x00";

export enum AuctionType {
  SEALED_BID = "EMPAM",
  FIXED_PRICE = "FPAM",
}

export enum AuctionDerivatives {
  LINEAR_VESTING = "LIV",
}
