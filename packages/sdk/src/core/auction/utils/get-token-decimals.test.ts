import { describe, it, expect, vi } from "vitest";
import type { Address } from "@repo/types";
import { getTokenDecimals } from "./get-token-decimals";
import * as utils from ".";

const mockChainId = 1;
const mockTokenDecimals = 18;

const mockToken = (id: string, address: Address) => ({
  decimals: mockTokenDecimals,
  symbol: id,
  name: `${id} token`,
  address,
  logoURI: "logoUri",
  chainId: mockChainId,
});

const mockBaseToken = mockToken("AXIS", "0x2");
const mockQuoteToken = mockToken("AXIS", "0x3");

const mockTokenList = {
  name: "mock",
  timestamp: "2021-01-01T00:00:00Z",
  version: {
    major: 1,
    minor: 1,
    patch: 1,
  },
  tokens: [mockBaseToken, mockQuoteToken],
};

describe("getTokenDecimals()", () => {
  it("returns a token's decimals from the supplied token list", async () => {
    vi.spyOn(utils, "getTokenFromTokenLists");
    vi.spyOn(utils, "getTokenDecimalsOnChain");

    const params = {
      chainId: mockChainId,
      address: mockBaseToken.address,
      tokenLists: [mockTokenList],
    };

    const result = await getTokenDecimals(params);

    expect(utils.getTokenFromTokenLists).toBeCalledWith(params);
    expect(utils.getTokenDecimalsOnChain).not.toBeCalled();
    expect(result).toBe(mockBaseToken.decimals);
  });

  it("calls getTokenDecimalsOnChain() when token isn't found in the list", async () => {
    vi.spyOn(utils, "getTokenDecimalsOnChain").mockResolvedValue(
      mockQuoteToken.decimals,
    );

    const params = {
      chainId: mockChainId,
      address: mockQuoteToken.address,
      tokenLists: [],
    };

    const result = await getTokenDecimals(params);

    expect(utils.getTokenDecimalsOnChain).toBeCalledWith({
      chainId: params.chainId,
      address: params.address,
    });
    expect(result).toBe(mockQuoteToken.decimals);
  });
});
