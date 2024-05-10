import type {
  Address,
  AuctionInfo,
  SubgraphAuction,
  Token,
  TokenBase,
} from "@repo/types";
import { getChainId } from "utils/chain";
import { formatUnits } from "viem";

type AuctionTokens = Pick<
  SubgraphAuction,
  "quoteToken" | "baseToken" | "chain"
>;

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
  token: Omit<
    SubgraphAuction["quoteToken"] | SubgraphAuction["baseToken"],
    "decimals"
  > & {
    decimals: number | string;
  },
  chainId: number,
): Token {
  return {
    ...token,
    totalSupply: token.totalSupply
      ? Number(formatUnits(BigInt(token.totalSupply), Number(token.decimals)))
      : undefined,
    decimals: Number(token.decimals),
    address: token.address as Address,
    chainId,
  };
}
