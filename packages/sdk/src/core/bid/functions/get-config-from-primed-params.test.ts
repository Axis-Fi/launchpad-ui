import { describe, it, expect, vi } from "vitest";
import { parseUnits } from "viem";
import { abis } from "@repo/abis";
import type { Address } from "@repo/types";
import { getConfigFromPrimedParams } from "./get-config-from-primed-params";

const mockTokenDecimals = 18;
const mockEncryptedBid = { ciphertext: "1", x: "1", y: "1" };
const mockEncodedEncryptedBid = "0x";

vi.mock("../utils", () => ({
  encryptBid: vi.fn(() => mockEncryptedBid),
  encodeEncryptedBid: vi.fn(() => mockEncodedEncryptedBid),
}));

const mockParams = {
  lotId: 1,
  amountIn: parseUnits("100", mockTokenDecimals),
  bidderAddress: "0x1" as Address,
  referrerAddress: "0x2" as Address,
  auctionHouseAddress: "0x3" as Address,
  quoteTokenDecimals: mockTokenDecimals,
  encryptedBid: mockEncryptedBid,
};

const mockCallbackData = "0x";

describe("getConfigFromPrimedParams()", () => {
  it("returns contract configuration", () => {
    const result = getConfigFromPrimedParams(mockParams, mockCallbackData);

    expect(result).toStrictEqual({
      abi: abis.batchAuctionHouse,
      address: mockParams.auctionHouseAddress,
      functionName: "bid",
      args: [
        {
          lotId: BigInt(mockParams.lotId),
          referrer: mockParams.referrerAddress,
          bidder: mockParams.bidderAddress,
          amount: mockParams.amountIn,
          auctionData: mockEncodedEncryptedBid,
          permit2Data: "0x", // TODO: permit2 to be implemented
        },
        mockCallbackData,
      ],
    });
  });
});
