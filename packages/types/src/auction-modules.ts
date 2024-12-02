export type AuctionModuleReference = "01EMPA" | "01FPBA" | "02FPBA";

export enum AuctionType {
  SEALED_BID = "EMPA",
  FIXED_PRICE_BATCH = "FPBA",
}

/**
 * Auction derivatives are 5 chars:
 * - 2 chars for the derivative version
 * - 3 chars for the derivative type
 * e.g. 01LIV
 *
 * For determining the derivative type, we can ignore the version and just look at the type.
 */
export enum AuctionDerivativeTypes {
  LINEAR_VESTING = "LIV",
}
