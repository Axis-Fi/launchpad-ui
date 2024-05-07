import { type Address } from "viem";
import type { Token, TokenList } from "@repo/types";

const getTokenFromTokenLists = ({
  chainId,
  address,
  tokenLists,
}: {
  address: Address;
  chainId: number;
  tokenLists: TokenList[];
}): Token | undefined => {
  return tokenLists // TODO @aphex: does this actually need to support multiple token lists?
    .flatMap((t) => t.tokens)
    .find(
      (t) =>
        t.address.toLocaleLowerCase().includes(address.toLocaleLowerCase()) &&
        t.chainId == chainId,
    );
};

export { getTokenFromTokenLists };
