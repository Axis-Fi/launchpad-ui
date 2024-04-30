import { describe, it, expect, vi } from "vitest";
import { zeroAddress } from "viem";
import { abis } from "@repo/abis";
import type { CloakClient } from "@repo/cloak";
import type { AxisDeployments } from "@repo/deployments";
import * as functions from "./functions";
import type { AuctionModule } from "../auction";
import { encryptBid } from "./utils";

const mockAddress = zeroAddress;
const mockTokenDecimals = 18;
const mockEncryptedBid = { ciphertext: "1", x: "1", y: "1" };
const mockEncodedEncryptedBid = "0x";

const getConfigFromPrimedParamsSpy = vi.spyOn(
  functions,
  "getConfigFromPrimedParams",
);

vi.mock("./utils", () => ({
  encryptBid: vi.fn(() => mockEncryptedBid),
  encodeEncryptedBid: vi.fn(() => mockEncodedEncryptedBid),
}));

const mockCloak = {
  keysApi: {
    encryptLotIdPost: vi.fn(() => mockEncryptedBid),
  },
} as unknown as CloakClient;

const mockAuction = {
  functions: {
    getAuctionTokenDecimals: vi.fn(() => ({
      quoteTokenDecimals: mockTokenDecimals,
      baseTokenDecimals: mockTokenDecimals,
    })),
  },
} as unknown as AuctionModule;

const mockDeployments = {
  1: {
    addresses: {
      auctionHouse: mockAddress,
    },
  },
} as unknown as AxisDeployments;

describe("getConfigFromPrimedParams()", () => {
  it("returns contract configuration", () => {
    const params = {
      lotId: 1,
      amountIn: 100,
      referrerAddress: mockAddress,
      auctionHouseAddress: mockAddress,
      quoteTokenDecimals: mockTokenDecimals,
      encryptedBid: mockEncryptedBid,
    };

    const result = functions.getConfigFromPrimedParams(params);

    expect(result).toStrictEqual({
      abi: abis.auctionHouse,
      address: mockAddress,
      functionName: "bid",
      args: [
        {
          lotId: BigInt(1),
          referrer: mockAddress,
          amount: BigInt(100000000000000000000),
          auctionData: mockEncodedEncryptedBid,
          permit2Data: "0x", // TODO: permit2 to be implemented
        },
        "0x", //TODO: callbackData to be implemented
      ],
    });
  });
});

describe("getConfig()", () => {
  const mockParams = {
    lotId: 1,
    amountIn: 100,
    amountOut: 50,
    referrerAddress: mockAddress,
    chainId: 1,
    bidderAddress: mockAddress,
    signedPermit2Approval: "0x",
  };

  it("returns contract configuration", async () => {
    const result = await functions.getConfig(
      mockParams,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(result).toStrictEqual({
      abi: abis.auctionHouse,
      address: mockAddress,
      functionName: "bid",
      args: [
        {
          lotId: BigInt(mockParams.lotId),
          referrer: mockAddress,
          amount: BigInt(100000000000000000000),
          auctionData: mockEncodedEncryptedBid,
          permit2Data: "0x",
        },
        "0x",
      ],
    });
  });

  it("calls getAuctionTokenDecimals with correct params", async () => {
    await functions.getConfig(
      mockParams,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(mockAuction.functions.getAuctionTokenDecimals).toHaveBeenCalledWith(
      { lotId: mockParams.lotId, chainId: mockParams.chainId },
      mockDeployments,
    );
  });

  it("calls encryptBid with correct params", async () => {
    await functions.getConfig(
      mockParams,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(encryptBid).toHaveBeenCalledWith(
      {
        ...mockParams,
        quoteTokenDecimals: mockTokenDecimals,
        baseTokenDecimals: mockTokenDecimals,
        auctionHouseAddress: mockAddress,
      },
      mockCloak,
    );
  });

  // TODO: you can't spy or mock a dep that is included in the same file as the function under test
  it.skip("calls getConfigFromPrimedParams with correct params", async () => {
    await functions.getConfig(
      mockParams,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(getConfigFromPrimedParamsSpy).toHaveBeenCalledWith({
      lotId: mockParams.lotId,
      amountIn: mockParams.amountIn,
      referrerAddress: mockParams.referrerAddress,
      auctionHouseAddress: mockAddress,
      quoteTokenDecimals: mockTokenDecimals,
      encryptedBid: mockEncryptedBid,
    });
  });

  it("throws an error if invalid params are supplied", async () => {
    const invalidParams = { ...mockParams, lotId: "invalid" };

    // @ts-expect-error - deliberately testing invalid params
    const result = functions.getConfig(
      invalidParams,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(result).rejects.toThrow("Invalid parameters supplied to getConfig");
  });

  it("throws an error if auctionHouseAddress is not found", async () => {
    const paramsWithChainIdWithNoCorrespondingDeployment = {
      ...mockParams,
      chainId: 0,
    };

    const result = functions.getConfig(
      paramsWithChainIdWithNoCorrespondingDeployment,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(result).rejects.toThrow(
      "AuctionHouse contract address not found for chainId 0",
    );
  });
});
