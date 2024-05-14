import { describe, it, expect, vi } from "vitest";
import { type Address, zeroAddress } from "viem";
import { AuctionType } from "@repo/types";
import type { AxisDeployments } from "@repo/deployments";
import * as functions from ".";
import type { GetAuctionResult } from "../types";
import * as utils from "../utils";

vi.mock("./get-auction", () => ({
  getAuction: vi.fn(() => mockGetAuctionResult),
}));

const mockAddress = zeroAddress;
const mockChainId = 1;
const mockTokenDecimals = 18;
const mockAuctionType = "MOCK_AUCTION_TYPE" as AuctionType;

const mockGetAuctionResult: GetAuctionResult = {
  seller: "0x1",
  funding: BigInt(1),
  baseToken: "0x2",
  quoteToken: "0x3",
  auctionReference: "0x4",
  callbacks: "0x5",
  derivativeReference: "0x6",
  wrapDerivative: false,
  derivativeParams: "0x7",
};

const mockToken = (id: string, address: Address) => ({
  decimals: mockTokenDecimals,
  symbol: id,
  name: `${id} token`,
  address,
  logoURI: "logoUri",
  chainId: mockChainId,
});

const mockTokenList = {
  tokens: [
    mockToken("AXIS", mockGetAuctionResult.baseToken),
    mockToken("USDC", mockGetAuctionResult.quoteToken),
  ],
};

const mockDeployments = {
  [mockChainId]: {
    addresses: {
      catalogue: mockAddress,
    },
    tokenList: mockTokenList,
  },
} as unknown as AxisDeployments;

describe("getAuctionTokenDecimals()", () => {
  it("returns base and quote token decimals for the supplied auction", async () => {
    const params = {
      chainId: mockChainId,
      lotId: 1,
      auctionType: mockAuctionType,
    };

    const result = await functions.getAuctionTokenDecimals(
      params,
      mockDeployments,
    );

    const [baseToken, quoteToken] =
      mockDeployments[params.chainId].tokenList.tokens;

    expect(result).toStrictEqual({
      baseTokenDecimals: baseToken.decimals,
      quoteTokenDecimals: quoteToken.decimals,
    });
  });

  it("calls getAuction with correct params", async () => {
    const params = {
      chainId: mockChainId,
      lotId: 1,
      auctionType: mockAuctionType,
    };

    await functions.getAuctionTokenDecimals(params, mockDeployments);

    expect(functions.getAuction).toHaveBeenCalledWith(params);
  });

  it("calls getTokenDecimals for base and quote token with correct params", async () => {
    const spy = vi
      .spyOn(utils, "getTokenDecimals")
      .mockResolvedValue(mockTokenDecimals);

    const params = {
      chainId: mockChainId,
      lotId: 1,
      auctionType: mockAuctionType,
    };

    await functions.getAuctionTokenDecimals(params, mockDeployments);

    expect(utils.getTokenDecimals).toHaveBeenCalledTimes(2);

    // Calls getTokenDecimals() on the baseToken
    expect(spy.mock.calls[0]).toEqual([
      {
        chainId: 1,
        address: mockGetAuctionResult.baseToken,
        tokenLists: [mockTokenList],
      },
    ]);

    // Calls getTokenDecimals() on the quoteToken
    expect(spy.mock.calls[1]).toEqual([
      {
        chainId: 1,
        address: mockGetAuctionResult.quoteToken,
        tokenLists: [mockTokenList],
      },
    ]);
  });

  it("throws an error if base token is not found", async () => {
    // 1st getTokenDecimals() call = base token
    vi.spyOn(utils, "getTokenDecimals").mockResolvedValue(undefined);

    const params = {
      chainId: mockChainId,
      lotId: 1,
      auctionType: mockAuctionType,
    };
    const fnPromise = functions.getAuctionTokenDecimals(
      params,
      mockDeployments,
    );

    expect(fnPromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Couldn't find base token for address 0x2 on chain 1 in auction 1]`,
    );
  });

  it("throws an error if quote token is not found", async () => {
    vi.spyOn(utils, "getTokenDecimals")
      .mockResolvedValueOnce(mockTokenDecimals) // 1st getTokenDecimals() call = base token
      .mockResolvedValueOnce(undefined); // 2nd getTokenDecimals() call = quote token

    const params = {
      chainId: mockChainId,
      lotId: 1,
      auctionType: mockAuctionType,
    };
    const fnPromise = functions.getAuctionTokenDecimals(
      params,
      mockDeployments,
    );

    expect(fnPromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Couldn't find quote token for address 0x3 on chain 1 in auction 1]`,
    );
  });
});
