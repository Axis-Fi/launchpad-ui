import { describe, it, expect, vi } from "vitest";
import { erc20Abi, type Address } from "viem";
import { getTokenDecimalsOnChain } from "./get-token-decimals-on-chain";
import * as publicClient from "../../public-client";

const mockChainId = 1;
const mockTokenDecimals = 18;
const mockAddress: Address = "0x1";

const mockReadContract = vi.fn(() => mockTokenDecimals);

vi.mock("../../public-client", () => ({
  createClient: vi.fn(() => ({
    readContract: mockReadContract,
  })),
}));

describe("getTokenDecimalsOnChain()", () => {
  it("returns a token's decimals", async () => {
    const params = { chainId: mockChainId, address: mockAddress };

    const result = await getTokenDecimalsOnChain(params);

    expect(result).toBe(mockTokenDecimals);
  });

  it("calls createClient() with chainId", async () => {
    const params = {
      chainId: mockChainId,
      address: mockAddress,
    };

    await getTokenDecimalsOnChain(params);

    expect(publicClient.createClient).toBeCalledWith(params.chainId);
  });

  it("calls client.readContract() with correct params", async () => {
    const params = {
      chainId: mockChainId,
      address: mockAddress,
    };

    await getTokenDecimalsOnChain(params);

    expect(mockReadContract).toBeCalledWith({
      address: mockAddress,
      abi: erc20Abi,
      functionName: "decimals",
    });
  });
});
