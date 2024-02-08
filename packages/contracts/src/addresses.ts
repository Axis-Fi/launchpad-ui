import type { AxisContractAddresses } from "./types";

const blastSepolia: AxisContractAddresses = {
  auctionHouse: "0x13B299062c5E613C304145D78dA733bF9711DfC9",
  catalogue: "0xFEbE6e75705543D94BB27AD55C767850295ed84B",
  localSealedBidBatchAuction: "0xA9AEAe1d42bbfa591F4a06945a895d75011bE6e8",
  linearVesting: "0x63Fb97Dd80060cFd70c87Aa54F594F3988B6Fc66",
};

export const addressesPerChain: Record<number, AxisContractAddresses> = {
  168587773: blastSepolia,
};
