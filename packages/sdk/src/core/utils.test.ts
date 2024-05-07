import { blastSepolia } from "viem/chains";
import { describe, it, expect } from "vitest";
import { deployments } from "@repo/deployments";
import { getContractAddresses, getChainById } from "./utils";

describe("getContractAddresses()", () => {
  it("returns the contract addresses for the given chainId", () => {
    const addresses = getContractAddresses(blastSepolia.id, deployments);

    expect(addresses).toMatchInlineSnapshot(`
      {
        "auctionHouse": "0x000000009DB7a64d0B3f92E2F0e026a2AF9Cf9b3",
        "catalogue": "0xc94404218178149EBeBfc1F47f0DF14B5FD881C5",
        "empam": "0xF3e2578C66071a637F06cc02b1c11DeC0784C1A6",
        "fpam": "0x9f3a5566AB27F79c0cF090f70FFc73B7F9962b36",
        "linearVesting": "0xDe6D096f14812182F434D164AD6d184cC9A150Fd",
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
