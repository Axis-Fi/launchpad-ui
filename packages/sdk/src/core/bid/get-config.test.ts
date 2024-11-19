import { describe, it, expect, vi } from "vitest";
import { parseUnits, zeroAddress } from "viem";
import { abis } from "@repo/abis";
import { Address, AuctionType } from "@repo/types";
import * as deployments from "@repo/deployments";
import type { CloakClient } from "@repo/cloak";
import { getConfig } from "./get-config";
import { getEncryptedBid, encodeEncryptedBid } from "./utils";
import type { BidParams } from "./types";

const mockAddress = zeroAddress;
const mockTokenDecimals = 18;
const mockEncryptedBid = { ciphertext: "1", x: "1", y: "1" };
const mockEncodedEncryptedBid = "0xeeb";
const mockCallbackData = "0xca11";

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

const mockParams = {
  lotId: 1,
  amountIn: parseUnits("100", mockTokenDecimals),
  amountOut: parseUnits("50", mockTokenDecimals),
  auctionType: AuctionType.SEALED_BID,
  chainId: 1,
  bidderAddress: "0x1111111111111111111111111111111111111111" as Address,
  referrerAddress: "0x2222222222222222222222222222222222222222" as Address,
  signedPermit2Approval: "0x",
  callbackData: mockCallbackData,
} satisfies BidParams;

describe("getConfig()", () => {
  it("returns contract configuration", async () => {
    const result = await getConfig(mockParams, mockCloak);

    expect(result).toStrictEqual({
      abi: abis.batchAuctionHouse,
      address: mockAddress,
      functionName: "bid",
      args: [
        {
          lotId: BigInt(mockParams.lotId),
          referrer: mockParams.referrerAddress,
          bidder: mockParams.bidderAddress,
          amount: mockParams.amountIn,
          auctionData: mockEncodedEncryptedBid,
          permit2Data: "0x",
        },
        mockCallbackData,
      ],
    });
  });

  it("calls getEncryptedBid() with correct params", async () => {
    await getConfig(mockParams, mockCloak);

    expect(getEncryptedBid).toHaveBeenCalledWith(
      {
        lotId: mockParams.lotId,
        amountIn: mockParams.amountIn,
        amountOut: mockParams.amountOut,
        chainId: mockParams.chainId,
        bidderAddress: mockParams.bidderAddress,
        auctionType: mockParams.auctionType,
      },
      mockCloak,
    );
  });

  it("calls encodeEncryptedBid() with correct params", async () => {
    await getConfig(mockParams, mockCloak);

    expect(encodeEncryptedBid).toHaveBeenCalledWith(mockEncryptedBid);
  });

  it("throws an error if invalid params are supplied", async () => {
    const invalidParams = { ...mockParams, lotId: "invalid" };

    const result = getConfig(
      // @ts-expect-error - deliberately testing invalid params
      invalidParams,
      mockCloak,
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
      mockCloak,
    );

    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Auction house contract address not found for chainId 0 and auctionType EMPA]`,
    );
  });
});
