import { describe, it, expect, vi } from "vitest";
import type { Address } from "viem";
import type { CloakClient } from "@repo/cloak";
import * as utils from "./utils";

const mockEncryptedBid = { ciphertext: "1", x: "1", y: "1" };
const mockCloakClient = {
  keysApi: {
    encryptLotIdPost: vi.fn(() => mockEncryptedBid),
  },
} as unknown as CloakClient;

const mockBid = {
  lotId: 1,
  amountIn: 100,
  amountOut: 100,
  chainId: 1,
  bidderAddress: "0x1" as Address,
  quoteTokenDecimals: 18,
  baseTokenDecimals: 18,
  auctionHouseAddress: "0x2" as Address,
  referrerAddress: "0x3" as Address,
};

describe("encryptBid()", () => {
  it("returns the given amountOut encrypted", async () => {
    const result = await utils.encryptBid(mockBid, mockCloakClient);

    expect(result).toStrictEqual(mockEncryptedBid);
  });

  it("throws an error if the cloakClient.keysApi.encryptLotIdPost() rejects", async () => {
    vi.spyOn(mockCloakClient.keysApi, "encryptLotIdPost").mockRejectedValue(
      undefined,
    );

    const encryptBidPromise = utils.encryptBid(mockBid, mockCloakClient);

    expect(encryptBidPromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Failed to encrypt bid via cloak service]`,
    );
  });

  it("throws an error if the cloakClient.keysApi.encryptLotIdPost() returns an unexpected response", async () => {
    const invalidResponse = { foo: "bar" };
    // @ts-expect-error deliberately returning an unexpected shape
    vi.spyOn(mockCloakClient.keysApi, "encryptLotIdPost").mockResolvedValue(
      invalidResponse,
    );

    const encryptBidPromise = utils.encryptBid(mockBid, mockCloakClient);

    expect(encryptBidPromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Failed to encrypt bid via cloak service]`,
    );
  });
});

describe("encodeEncryptedBid()", () => {
  it("returns the encoded encrypted bid", () => {
    const result = utils.encodeEncryptedBid(mockEncryptedBid);

    expect(result).toBe(
      "0x000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000001",
    );
  });
});
