import {
  Address,
  AuctionInfo,
  RawSubgraphAuctionWithEvents,
  Token,
  TokenBase,
} from "@repo/types";
import { getChainId } from "utils/chain";

type AuctionTokens = Pick<
  RawSubgraphAuctionWithEvents,
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
    //@ts-expect-error ignore for debug
    quoteToken: parseToken(quoteToken, chainId),
  };
}

export function parseToken(
  token: Omit<RawSubgraphAuctionWithEvents["baseToken"], "decimals"> & {
    decimals: number | string;
  },
  chainId: number,
): Token {
  return {
    ...token,
    decimals: Number(token.decimals),
    address: token.address as Address,
    chainId,
  };
}
