import { describe, it, expect, vi } from "vitest";
import { abis } from "@repo/abis";
import type { Address } from "@repo/types";
import { getConfigFromPrimedParams } from "./get-config-from-primed-params";
import * as utils from "../utils";

const mockTokenDecimals = 18;
const mockEncryptedBid = { ciphertext: "1", x: "1", y: "1" };
const mockEncodedEncryptedBid = "0x";

vi.mock("../utils", () => ({
  encryptBid: vi.fn(() => mockEncryptedBid),
  encodeEncryptedBid: vi.fn(() => mockEncodedEncryptedBid),
}));

const mockParams = {
  lotId: 1,
  amountIn: 100,
  bidderAddress: "0x1" as Address,
  referrerAddress: "0x2" as Address,
  auctionHouseAddress: "0x3" as Address,
  quoteTokenDecimals: mockTokenDecimals,
  encryptedBid: mockEncryptedBid,
};

describe("getConfigFromPrimedParams()", () => {
  it("returns contract configuration", () => {
    const result = getConfigFromPrimedParams(mockParams);

    expect(result).toStrictEqual({
      abi: abis.batchAuctionHouse,
      address: mockParams.auctionHouseAddress,
      functionName: "bid",
      args: [
        {
          lotId: BigInt(1),
          referrer: mockParams.referrerAddress,
          bidder: mockParams.bidderAddress,
          amount: BigInt(100000000000000000000),
          auctionData: mockEncodedEncryptedBid,
          permit2Data: "0x", // TODO: permit2 to be implemented
        },
        "0x", //TODO: callbackData to be implemented
      ],
    });
  });

  it("calls encodeEncryptedBid() with correct params", () => {
    getConfigFromPrimedParams(mockParams);

    expect(utils.encodeEncryptedBid).toHaveBeenCalledWith(mockEncryptedBid);
  });
});
