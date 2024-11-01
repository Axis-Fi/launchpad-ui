import { describe, it, expect, vi } from "vitest";
import { parseUnits, zeroAddress } from "viem";
import { abis } from "@repo/abis";
import { AuctionType } from "@repo/types";
import * as deployments from "@repo/deployments";
import type { CloakClient } from "@repo/cloak";
import type { AxisDeployments } from "@repo/deployments";
import { getConfig } from "./get-config";
import type { AuctionModule } from "../auction";
import { getEncryptedBid, encodeEncryptedBid } from "./utils";
import * as deps from "./prepare-config";
import type { BidParams } from "./types";

const mockAddress = zeroAddress;
const mockTokenDecimals = 18;
const mockEncryptedBid = { ciphertext: "1", x: "1", y: "1" };
const mockEncodedEncryptedBid = "0x1";
const mockCallbackData = "0x2";

vi.mock("./utils", () => ({
  getEncryptedBid: vi.fn(() => mockEncryptedBid),
  encodeEncryptedBid: vi.fn(() => mockEncodedEncryptedBid),
}));

vi.mock("@repo/deployments", () => ({
  getAuctionHouse: vi.fn(() => getAuctionHouseMock),
}));

const getAuctionHouseMock = {
  abi: abis.batchAuctionHouse,
  address: mockAddress,
};

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

const mockParams = {
  lotId: 1,
  amountIn: parseUnits("100", mockTokenDecimals),
  amountOut: parseUnits("50", mockTokenDecimals),
  referrerAddress: mockAddress,
  auctionType: AuctionType.SEALED_BID,
  chainId: 1,
  bidderAddress: mockAddress,
  signedPermit2Approval: "0x",
} satisfies BidParams;

describe("getConfig()", () => {
  it("returns contract configuration", async () => {
    const result = await getConfig(
      mockParams,
      mockCallbackData,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(result).toStrictEqual({
      abi: abis.batchAuctionHouse,
      address: mockAddress,
      functionName: "bid",
      args: [
        {
          lotId: BigInt(mockParams.lotId),
          bidder: mockAddress,
          referrer: mockAddress,
          amount: BigInt(100000000000000000000),
          auctionData: mockEncodedEncryptedBid,
          permit2Data: "0x",
        },
        mockCallbackData,
      ],
    });
  });

  it("calls getAuctionTokenDecimals with correct params", async () => {
    await getConfig(
      mockParams,
      mockCallbackData,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(mockAuction.functions.getAuctionTokenDecimals).toHaveBeenCalledWith(
      {
        lotId: mockParams.lotId,
        chainId: mockParams.chainId,
        auctionType: mockParams.auctionType,
      },
      mockDeployments,
    );
  });

  it("calls getEncryptedBid() with correct params", async () => {
    await getConfig(
      mockParams,
      mockCallbackData,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(getEncryptedBid).toHaveBeenCalledWith(
      {
        lotId: mockParams.lotId,
        amountIn: mockParams.amountIn,
        amountOut: mockParams.amountOut,
        chainId: mockParams.chainId,
        bidderAddress: mockParams.bidderAddress,
        quoteTokenDecimals: mockTokenDecimals,
        baseTokenDecimals: mockTokenDecimals,
        auctionHouseAddress: mockAddress,
      },
      mockCloak,
    );
  });

  it("calls encodeEncryptedBid() with correct params", async () => {
    await getConfig(
      mockParams,
      mockCallbackData,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(encodeEncryptedBid).toHaveBeenCalledWith(mockEncryptedBid);
  });

  // TODO: you can't spy or mock a dep that is included in the same file as the function under test
  it("calls prepareConfig with correct params", async () => {
    const prepareConfigSpy = vi.spyOn(deps, "prepareConfig");

    await getConfig(
      mockParams,
      mockCallbackData,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(prepareConfigSpy).toHaveBeenCalledWith(
      {
        lotId: mockParams.lotId,
        amountIn: mockParams.amountIn,
        referrerAddress: mockParams.referrerAddress,
        bidderAddress: mockParams.bidderAddress,
        auctionHouseAddress: mockAddress,
        quoteTokenDecimals: mockTokenDecimals,
        auctionData: mockEncodedEncryptedBid,
      },
      mockCallbackData,
    );
  });

  it("throws an error if invalid params are supplied", async () => {
    const invalidParams = { ...mockParams, lotId: "invalid" };

    const result = getConfig(
      // @ts-expect-error - deliberately testing invalid params
      invalidParams,
      mockCallbackData,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Invalid parameters supplied to getConfig()]`,
    );
  });

  it("throws an error if auction house address is not found", async () => {
    // @ts-expect-error - deliberately testing invalid params
    vi.spyOn(deployments, "getAuctionHouse").mockReturnValue(undefined);

    const paramsWithChainIdWithNoCorrespondingDeployment = {
      ...mockParams,
      chainId: 0,
    };

    const result = getConfig(
      paramsWithChainIdWithNoCorrespondingDeployment,
      mockCallbackData,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Auction house contract address not found for chainId 0 and auctionType EMPA]`,
    );
  });
});
