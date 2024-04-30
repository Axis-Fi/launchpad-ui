import { type Address } from "viem";
import type { TokenList } from "@repo/types";
import { getTokenFromTokenLists, getTokenDecimalsOnChain } from ".";

const getTokenDecimals = async ({
  chainId,
  address,
  tokenLists,
}: {
  address: Address;
  chainId: number;
  tokenLists: TokenList[];
}): Promise<number | undefined> => {
  const token = getTokenFromTokenLists({ chainId, address, tokenLists });

  if (token) {
    return token.decimals;
  }

  return getTokenDecimalsOnChain({ chainId, address });
};

export { getTokenDecimals };
