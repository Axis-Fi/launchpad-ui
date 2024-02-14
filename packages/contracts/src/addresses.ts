import type { AxisContractAddresses } from "./types";

const blastSepolia: AxisContractAddresses = {
  auctionHouse: "0x00000000cB3c2A36dEF5Be4d3A674280eFC33498",
  catalogue: "0x0A0BA689D2D72D3f376293c534AF299B3C6Dac85",
  localSealedBidBatchAuction: "0xcE56d3E3E145b44597B61E99c64cb82FB209Da04",
  linearVesting: "0x32A7b69B9F42F0CD6306Bd897ae2664AF0eFBAbd",
};

export const addressesPerChain: Record<number, AxisContractAddresses> = {
  168587773: blastSepolia,
};
