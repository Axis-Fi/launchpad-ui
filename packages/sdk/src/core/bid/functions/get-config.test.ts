import { describe, it, expect, vi } from "vitest";
import { zeroAddress } from "viem";
import { abis } from "@repo/abis";
import { AuctionType } from "@repo/types";
import * as deployments from "@repo/deployments";
import type { CloakClient } from "@repo/cloak";
import type { AxisDeployments } from "@repo/deployments";
import { getConfig } from "./get-config";
import type { AuctionModule } from "../../auction";
import { encryptBid } from "../utils";
import * as deps from "./get-config-from-primed-params";

const mockAddress = zeroAddress;
const mockTokenDecimals = 18;
const mockEncryptedBid = { ciphertext: "1", x: "1", y: "1" };
const mockEncodedEncryptedBid = "0x";

vi.mock("../utils", () => ({
  encryptBid: vi.fn(() => mockEncryptedBid),
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

describe("getConfig()", () => {
  const mockParams = {
    lotId: 1,
    amountIn: 100,
    amountOut: 50,
    referrerAddress: mockAddress,
    auctionType: AuctionType.SEALED_BID,
    chainId: 1,
    bidderAddress: mockAddress,
    signedPermit2Approval: "0x",
  };

  it("returns contract configuration", async () => {
    const result = await getConfig(
      mockParams,
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
        "0x",
      ],
    });
  });

  it("calls getAuctionTokenDecimals with correct params", async () => {
    await getConfig(mockParams, mockCloak, mockAuction, mockDeployments);

    expect(mockAuction.functions.getAuctionTokenDecimals).toHaveBeenCalledWith(
      {
        lotId: mockParams.lotId,
        chainId: mockParams.chainId,
        auctionType: mockParams.auctionType,
      },
      mockDeployments,
    );
  });

  it("calls encryptBid with correct params", async () => {
    vi.spyOn;
    await getConfig(mockParams, mockCloak, mockAuction, mockDeployments);

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
  it("calls getConfigFromPrimedParams with correct params", async () => {
    const getConfigFromPrimedParamsSpy = vi.spyOn(
      deps,
      "getConfigFromPrimedParams",
    );

    await getConfig(mockParams, mockCloak, mockAuction, mockDeployments);

    expect(getConfigFromPrimedParamsSpy).toHaveBeenCalledWith({
      lotId: mockParams.lotId,
      amountIn: mockParams.amountIn,
      referrerAddress: mockParams.referrerAddress,
      bidderAddress: mockParams.bidderAddress,
      auctionHouseAddress: mockAddress,
      quoteTokenDecimals: mockTokenDecimals,
      encryptedBid: mockEncryptedBid,
    });
  });

  it("throws an error if invalid params are supplied", async () => {
    const invalidParams = { ...mockParams, lotId: "invalid" };

    const result = getConfig(
      // @ts-expect-error - deliberately testing invalid params
      invalidParams,
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Invalid parameters supplied to getConfig]`,
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
      mockCloak,
      mockAuction,
      mockDeployments,
    );

    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Auction house contract address not found for chainId 0 and auctionType encryptedMarginalPrice]`,
    );
  });
});
