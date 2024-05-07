import { describe, it, expect } from "vitest";
import { type Address } from "viem";
import { getTokenFromTokenLists } from "./get-token-from-token-lists";

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

describe("getTokenFromTokenLists()", () => {
  it("returns a token's decimals from the given list", async () => {
    const params = {
      chainId: mockChainId,
      address: mockBaseToken.address,
      tokenLists: [mockTokenList],
    };

    const result = await getTokenFromTokenLists(params);

    expect(result?.decimals).toBe(mockBaseToken.decimals);
  });

  it("returns undefined for tokens not in the list", async () => {
    const params = {
      chainId: mockChainId,
      address: mockBaseToken.address,
      tokenLists: [],
    };

    const result = await getTokenFromTokenLists(params);

    expect(result).toBe(undefined);
  });
});
