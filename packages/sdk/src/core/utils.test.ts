import { blastSepolia } from "viem/chains";
import { describe, it, expect } from "vitest";
import { deployments } from "@repo/deployments";
import { getContractAddresses, getChainById } from "./utils";

describe("getContractAddresses()", () => {
  it("returns the contract addresses for the given chainId", () => {
    const addresses = getContractAddresses(blastSepolia.id, deployments);

    expect(addresses).toMatchInlineSnapshot(`
      {
        "atomicAuctionHouse": "0xAA000000721026c5B83e3b3d969DC5A7Dac20B7F",
        "atomicCatalogue": "0xEa25Ea0EC643826Ac99077c84934FEee3B735332",
        "atomicLinearVesting": "0xfF0FE629C1a515437A9c939509769A7b6842778f",
        "batchAuctionHouse": "0xBA00000073E5050EE216afbcE08ca4666DB37232",
        "batchCatalogue": "0x963385faC528159E0771091e656De5666e8A0776",
        "batchLinearVesting": "0x58F17242Ab609c7561fe72Dc89b6A56999e227Cd",
        "encryptedMarginalPrice": "0x8dA4D2f56d6f353E36220f567221aD4e1E84cB04",
        "fixedPriceSale": "0x296Dc8a6d40D819bFE7E4da7133961C8B007FC42",
      }
    `);
  });

  it("returns undefined when chainId is not found", () => {
    expect(getContractAddresses(0, deployments)).toBeUndefined();
  });

  it("returns undefined when chainId is not supplied", () => {
    // @ts-expect-error deliberately calling with no args
    expect(getContractAddresses(undefined, deployments)).toBeUndefined();
  });
});

describe("getChainById()", () => {
  it("returns the chain with the given chainId", () => {
    const chains = { blastSepolia: blastSepolia };
    const chain = getChainById(chains, blastSepolia.id);

    expect(chain).toBe(blastSepolia);
  });

  it("returns undefined when chainId is not found", () => {
    const chains = { blastSepolia: blastSepolia };
    expect(getChainById(chains, 0)).toBeUndefined();
  });

  it("returns undefined when chainId is not supplied", () => {
    const chains = { blastSepolia: blastSepolia };
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
