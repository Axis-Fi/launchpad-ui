import type { AxisContractAddresses } from "./types";

const blastSepolia: AxisContractAddresses = {
  auctionHouse: "0x00000000AD4dd7bC9077e3894225840fE1bfd6eC",
  catalogue: "0x101b502D216d27cb342e9686A2B34A1cD19B2F75",
  localSealedBidBatchAuction: "0xc20918b09dE9708d2A7997dfFc3c5ACB34d4a15b",
  linearVesting: "0x0e4996960731Fec8E7C9DBbD51383fC71174DD88",
};

export const addressesPerChain: Record<number, AxisContractAddresses> = {
  168587773: blastSepolia,
};
