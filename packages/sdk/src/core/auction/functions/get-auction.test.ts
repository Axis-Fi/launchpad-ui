import { describe, it, expect, vi } from "vitest";
import { zeroAddress } from "viem";
import * as functions from ".";
import * as publicClient from "../../public-client";
import type { GetAuctionResult } from "../types";
import { AuctionType } from "@repo/types";
import * as deploymentsDep from "@repo/deployments";

const mockAddress = zeroAddress;
const mockChainId = 1;
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

const mockReadContract = vi.fn(() => mockGetAuctionResult);

vi.mock("../../public-client", () => ({
  createClient: vi.fn(() => ({
    readContract: mockReadContract,
  })),
}));

const mockCatalogue = { abi: "MOCK_ABI", address: mockAddress };

vi.mock("@repo/deployments", () => ({
  getCatalogue: vi.fn(() => mockCatalogue),
}));

describe("getAuction()", () => {
  it("returns auction details", async () => {
    const params = {
      chainId: mockChainId,
      lotId: 1,
      auctionType: mockAuctionType,
    };

    const result = await functions.getAuction(params);

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
    const params = {
      chainId: mockChainId,
      lotId: 1,
      auctionType: mockAuctionType,
    };

    await functions.getAuction(params);

    expect(publicClient.createClient).toHaveBeenCalledWith(params.chainId);
  });

  it("calls client.readContract() with correct params", async () => {
    const params = {
      chainId: mockChainId,
      lotId: 1,
      auctionType: mockAuctionType,
    };

    await functions.getAuction(params);

    expect(mockReadContract).toHaveBeenCalledWith({
      address: mockCatalogue.address,
      abi: mockCatalogue.abi,
      functionName: "getRouting",
      args: [BigInt(params.lotId)],
    });
  });

  it("calls getCatalogue() with correct params", async () => {
    const params = {
      chainId: mockChainId,
      lotId: 1,
      auctionType: mockAuctionType,
    };

    await functions.getAuction(params);

    expect(deploymentsDep.getCatalogue).toHaveBeenCalledWith({
      chainId: params.chainId,
      auctionType: params.auctionType,
    });
  });
});
