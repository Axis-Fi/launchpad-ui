import { Chain as RainbowkitChain } from "@rainbow-me/rainbowkit";
import { Address } from "./axis-contracts";

type NativeCurrency = {
  name: string;
  symbol: string;
  decimals: number;
  wrapperContract?: Address;
};

export interface Chain extends RainbowkitChain {
  nativeCurrency: NativeCurrency;
}
