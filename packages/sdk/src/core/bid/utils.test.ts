import { describe, it, expect, vi } from "vitest";
import { parseUnits, type Address } from "viem";
import { AuctionType } from "@repo/types";
import type { CloakClient } from "@repo/cloak";
import * as utils from "./utils";
import type { EncryptBidParams } from "./types";

const mockEncryptedBid = { ciphertext: "1", x: "1", y: "1" };
const mockCloakClient = {
  keysApi: {
    encryptLotIdPost: vi.fn(() => mockEncryptedBid),
  },
} as unknown as CloakClient;

const mockBid = {
  lotId: 1,
  amountIn: parseUnits("100", 18),
  amountOut: parseUnits("50", 18),
  auctionType: AuctionType.SEALED_BID,
  chainId: 168587773,
  bidderAddress: "0x1111111111111111111111111111111111111111" as Address,
} satisfies EncryptBidParams;

describe("encryptBid()", () => {
  it("returns the given amountOut encrypted", async () => {
    const result = await utils.getEncryptedBid(mockBid, mockCloakClient);

    expect(result).toStrictEqual(mockEncryptedBid);
  });

  it("throws an error if the cloakClient.keysApi.encryptLotIdPost() rejects", async () => {
    vi.spyOn(mockCloakClient.keysApi, "encryptLotIdPost").mockRejectedValue(
      undefined,
    );

    const encryptBidPromise = utils.getEncryptedBid(mockBid, mockCloakClient);

    expect(encryptBidPromise).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Failed to encrypt bid via cloak service]`,
    );
  });

  it("throws an error if cloakClient.keysApi.encryptLotIdPost() returns an unexpected response", async () => {
    const invalidResponse = { foo: "bar" };
    vi.spyOn(mockCloakClient.keysApi, "encryptLotIdPost").mockResolvedValue(
      // @ts-expect-error deliberately returning an unexpected shape
      invalidResponse,
    );

    const encryptBidPromise = utils.getEncryptedBid(mockBid, mockCloakClient);

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
