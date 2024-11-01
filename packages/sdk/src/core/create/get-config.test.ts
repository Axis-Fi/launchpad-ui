import { describe, it, expect, vi } from "vitest";
import { zeroAddress } from "viem";
import { abis } from "@repo/abis";
import { AuctionType } from "@repo/types";
import { getConfig } from "./get-config";
import type { CreateConfig, CreateParams } from "./types";

const mockAddress = zeroAddress;

vi.mock("@repo/deployments", () => ({
  getAuctionHouse: vi.fn(() => getAuctionHouseMock),
}));

const getAuctionHouseMock = {
  abi: abis.batchAuctionHouse,
  address: mockAddress,
};

const mockParams = {
  lotId: 1,
  bidId: 1,
  bidIndex: 1,
  chainId: 1,
  auctionType: AuctionType.SEALED_BID,
} satisfies CreateParams;

describe("getConfig()", () => {
  it("returns contract configuration", async () => {
    const result = getConfig(mockParams);

    expect(result).toStrictEqual({
      abi: abis.batchAuctionHouse,
      address: mockAddress,
      functionName: "refundBid",
      args: [
        BigInt(mockParams.lotId),
        BigInt(mockParams.bidId),
        BigInt(mockParams.bidIndex),
      ],
    } satisfies CreateConfig);
  });

  it("throws an error if invalid params are supplied", async () => {
    const invalidParams = { ...mockParams, lotId: "invalid" };

    expect(() =>
      getConfig(
        // @ts-expect-error - deliberately testing invalid params
        invalidParams,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Invalid parameters supplied to getConfig()]`,
    );
  });
});
