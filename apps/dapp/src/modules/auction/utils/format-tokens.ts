import type { Address, AuctionInfo, Token, TokenBase } from "@repo/types";
import { Token as SubgraphToken } from "@repo/subgraph-client/src/generated";
import { getChainId } from "utils/chain";
import { formatUnits } from "viem";

type InputToken = Omit<SubgraphToken, "id" | "decimals" | "totalSupply"> & {
  decimals: number | string;
  totalSupply?: bigint | string | undefined;
};

type AuctionTokens = {
  quoteToken: InputToken;
  baseToken: InputToken;
  chain: string;
};

export function formatAuctionTokens(
  auction: AuctionTokens,
  getToken: (token: TokenBase) => Token | undefined,
  info?: AuctionInfo,
) {
  const chainId = getChainId(auction.chain);

  const quoteToken =
    getToken({ address: auction.quoteToken.address as Address, chainId }) ??
    auction.quoteToken;

  const baseToken = {
    ...auction.baseToken,
    logoURI: info?.links?.payoutTokenLogo,
  };

  return {
    baseToken: parseToken(baseToken, chainId),
    quoteToken: parseToken(quoteToken, chainId),
  };
}

export function parseToken(
  token: InputToken & {
    logoURI?: string | undefined;
  },
  chainId: number,
): Token {
  const totalSupply = token.totalSupply?.toString();

  return {
    ...token,
    totalSupply: totalSupply
      ? formatUnits(BigInt(totalSupply ?? ""), Number(token.decimals))
      : undefined,
    decimals: Number(token.decimals),
    address: token.address as Address,
    chainId,
  };
}
