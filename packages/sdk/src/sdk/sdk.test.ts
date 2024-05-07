import { describe, it, expect, vi } from "vitest";
import { CloakClient } from "@repo/cloak";
import { OriginSdk } from "./sdk";
import type { Core } from "../core";
import * as cloakDep from "@repo/cloak";

const mockConfig = {
  cloak: {
    url: "https://cloak.example.com/api",
  },
};

const mockCore = {
  bid: { functions: { getConfig: vi.fn() } },
  auction: { functions: { getAuction: vi.fn() } },
} as unknown as Core;

const mockParams = { foo: "bar" };

describe("OriginSdk", () => {
  it("returns an OriginSdk instance with supplied params", () => {
    const sdk = new OriginSdk(mockConfig, mockCore);
    expect(sdk).toBeInstanceOf(OriginSdk);
    expect(sdk.config).toBe(mockConfig);
  });

  it("creates a cloak client", () => {
    const sdk = new OriginSdk(mockConfig, mockCore);
    expect(sdk.cloakClient).toBeInstanceOf(CloakClient);
  });

  it("calls Configuration() with the supplied cloak config", () => {
    const mockConfigurationClass = class {
      constructor() {}
    } as unknown as cloakDep.Configuration;
    const configurationSpy = vi
      .spyOn(cloakDep, "Configuration")
      .mockReturnValue(mockConfigurationClass);

    new OriginSdk(mockConfig, mockCore);

    expect(configurationSpy).toHaveBeenCalledWith({
      basePath: mockConfig.cloak.url,
    });
  });

  it("calls createCloakClient() with the supplied cloak config", () => {
    const mockConfigurationClass = class {
      constructor() {}
    } as unknown as cloakDep.Configuration;

    vi.spyOn(cloakDep, "Configuration").mockReturnValue(mockConfigurationClass);

    const createCloakClientSpy = vi.spyOn(cloakDep, "createCloakClient");

    new OriginSdk(mockConfig, mockCore);

    expect(createCloakClientSpy).toHaveBeenCalledWith(mockConfigurationClass);
  });

  // TODO - autogenerated cloakClient doesn't expose its config
  it.skip("creates a cloak client with the supplied cloak config", () => {
    // const sdk = new OriginSdk(mockConfig);
    // expect(sdk.cloakClient.config).toEqual({ basePath: mockConfig.cloak.url });
  });
});

describe("OriginSdk: bid()", () => {
  it("calls bid module's getConfig() with the correct params", async () => {
    const sdk = new OriginSdk(mockConfig, mockCore);
    // @ts-expect-error - params shape is irrelevant for this test
    await sdk.bid(mockParams);

    expect(mockCore.bid.functions.getConfig).toHaveBeenCalledWith(
      mockParams,
      sdk.cloakClient,
      mockCore.auction,
      sdk.deployments,
    );
  });
});

describe("OriginSdk: getAuction()", () => {
  it("calls auction module's getAuction() with correct params", async () => {
    const sdk = new OriginSdk(mockConfig, mockCore);
    // @ts-expect-error - params shape is irrelevant for this test
    await sdk.getAuction(mockParams);

    expect(mockCore.auction.functions.getAuction).toHaveBeenCalledWith(
      mockParams,
    );
  });
});
