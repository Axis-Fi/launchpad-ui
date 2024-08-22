import { blastSepolia } from "viem/chains";
import { describe, it, expect } from "vitest";
import { getContractAddresses, getChainById } from "./utils";
import type { AxisDeployments } from "@repo/deployments";

const mockDeployments = {
  0: {
    addresses: {
      batchAuctionHouse: "0x1",
      batchCatalogue: "0x2",
      batchLinearVesting: "0x3",
      encryptedMarginalPrice: "0x4",
      fixedPriceBatch: "0x5",
    },
  },
} as unknown as AxisDeployments;

describe("getContractAddresses()", () => {
  it("returns the contract addresses for the given chainId", () => {
    const addresses = getContractAddresses(0, mockDeployments);

    expect(addresses).toMatchInlineSnapshot(`
      {
        "batchAuctionHouse": "0x1",
        "batchCatalogue": "0x2",
        "batchLinearVesting": "0x3",
        "encryptedMarginalPrice": "0x4",
        "fixedPriceBatch": "0x5",
      }
    `);
  });

  it("returns undefined when chainId is not found", () => {
    expect(getContractAddresses(1, mockDeployments)).toBeUndefined();
  });

  it("returns undefined when chainId is not supplied", () => {
    // @ts-expect-error deliberately calling with no args
    expect(getContractAddresses(undefined, mockDeployments)).toBeUndefined();
  });
});

describe("getChainById()", () => {
  it("returns the chain with the given chainId", () => {
    const chains = { blastSepolia };
    const chain = getChainById(chains, blastSepolia.id);

    expect(chain).toBe(blastSepolia);
  });

  it("returns undefined when chainId is not found", () => {
    const chains = { blastSepolia };
    expect(getChainById(chains, 0)).toBeUndefined();
  });

  it("returns undefined when chainId is not supplied", () => {
    const chains = { blastSepolia };
    // @ts-expect-error deliberately calling with no args
    expect(getChainById(chains)).toBeUndefined();
  });

  it("returns undefined when chains is empty", () => {
    const chains = {};
    expect(getChainById(chains, blastSepolia.id)).toBeUndefined();
  });

  it("returns undefined when chains is not supplied", () => {
    // @ts-expect-error deliberately calling with no args
    expect(getChainById()).toBeUndefined();
  });
});
