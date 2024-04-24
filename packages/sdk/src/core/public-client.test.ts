import { describe, it, expect } from "vitest";
import { createClient } from "./public-client";

describe("createClient()", () => {
  it("returns a Viem public client with the expected chain and transport", () => {
    const chainId = 1;
    const client = createClient(chainId);

    expect(client).toBeDefined();
    expect(client.chain.id).toBe(chainId);
    expect(client.transport.name).toMatchInlineSnapshot(`"HTTP JSON-RPC"`);
  });

  it("throws an error when chainId is not found", () => {
    expect(() => createClient(0)).toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Chain with id 0 not found]`,
    );
  });

  it("throws an error when chainId is not supplied", () => {
    // @ts-expect-error deliberately calling with no args
    expect(() => createClient()).toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Chain with id undefined not found]`,
    );
  });
});
