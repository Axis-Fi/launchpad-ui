import { Address } from "viem";

export type Token = {
  chainId: number;
  address: Address;
  decimals: number;
  symbol: string;
  name: string;
};
