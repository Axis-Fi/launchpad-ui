import { describe, it, expect, vi } from "vitest";
import { type Address, zeroAddress } from "viem";
import { abis } from "@repo/abis";
import type { AxisDeployments } from "@repo/deployments";
import * as functions from ".";
import * as coreUtils from "../../utils";
import * as publicClient from "../../public-client";
import type { GetAuctionResult } from "../types";

const mockAddress = zeroAddress;
const mockChainId = 1;
const mockTokenDecimals = 18;

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

const mockReadContract = vi.fn(() => mockGetAuctionResult);

vi.mock("../../public-client", () => ({
  createClient: vi.fn(() => ({
    readContract: mockReadContract,
  })),
}));

describe("getAuction()", () => {
  it("returns auction details", async () => {
    const params = { chainId: mockChainId, lotId: 1 };

    const result = await functions.getAuction(params, mockDeployments);

    expect(result).toMatchInlineSnapshot(`
      {
        "auctionReference": "0x4",
        "baseToken": "0x2",
        "callbacks": "0x5",
        "derivativeParams": "0x7",
        "derivativeReference": "0x6",
        "funding": 1n,
        "quoteToken": "0x3",
        "seller": "0x1",
        "wrapDerivative": false,
      }
    `);
  });

  it("calls createClient() with correct params", async () => {
    const params = { chainId: mockChainId, lotId: 1 };

    await functions.getAuction(params, mockDeployments);

    expect(publicClient.createClient).toHaveBeenCalledWith(params.chainId);
  });

  it("calls client.readContract() with correct params", async () => {
    const params = { chainId: mockChainId, lotId: 1 };

    await functions.getAuction(params, mockDeployments);

    expect(mockReadContract).toHaveBeenCalledWith({
      address: mockAddress,
      abi: abis.catalogue,
      functionName: "getRouting",
      args: [BigInt(params.lotId)],
    });
  });

  it("calls getContractAddresses() with correct params", async () => {
    vi.spyOn(coreUtils, "getContractAddresses");

    const params = { chainId: mockChainId, lotId: 1 };

    await functions.getAuction(params, mockDeployments);

    expect(coreUtils.getContractAddresses).toHaveBeenCalledWith(
      params.chainId,
      mockDeployments,
    );
  });
});
