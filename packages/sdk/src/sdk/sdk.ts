import {
  type CloakClient,
  createCloakClient,
  Configuration,
} from "@repo/cloak";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { type AxisDeployments, deployments } from "@repo/deployments";
import { getCloakServer, getMetadataServer } from "@repo/env";
import * as core from "../core";
import type { MetadataClient, MetadataRouter, OriginConfig } from "../types";
import type {
  Core,
  BidParams,
  BidConfig,
  ClaimBidsParams,
  ClaimBidsConfig,
  RefundBidParams,
  RefundBidConfig,
  SettleParams,
  SettleConfig,
  AbortParams,
  AbortConfig,
  GetTokenPriceParams,
  CancelConfig,
  CancelParams,
  CreateConfig,
  CreateParams,
} from "../core";

const defaultConfig: OriginConfig = {
  cloak: {
    url: getCloakServer().url,
  },
  metadata: {
    url: getMetadataServer().url,
  },
};

/**
 * OriginSdk provides convenience helpers for interacting with Axis Origin protocol.
 *
 * @example
 * import { OriginSdk } from "@axis-fi/sdk";
 *
 * const sdk = new OriginSdk({
 *   cloak: {
 *     url: "https://cloak.example.com/api"
 *   }
 * })
 */
class OriginSdk {
  config: OriginConfig;
  core: Core;
  deployments: AxisDeployments;
  cloakClient: CloakClient;
  metadataClient: MetadataClient;

  constructor(
    _config: OriginConfig = defaultConfig,
    _core: Core = core,
    _deployments: AxisDeployments = deployments,
  ) {
    this.config = _config;
    this.core = _core;
    this.deployments = _deployments;

    this.cloakClient = createCloakClient(
      new Configuration({ basePath: _config.cloak.url }),
    );

    this.metadataClient = createTRPCProxyClient<MetadataRouter>({
      links: [
        httpBatchLink({
          url: _config.metadata.url,
        }),
      ],
    });
  }

  async getTokenPrice(params: GetTokenPriceParams): Promise<number> {
    return this.core.tokens.functions.getTokenPrice(
      params.token,
      params.timestamp,
    );
  }

  isUsdToken(symbol: string): boolean {
    return this.core.tokens.functions.isUsdToken(symbol);
  }

  /**
   * Gets the contract config required to execute a bid transaction on the auction house smart contract from unprimed parameters.
   *
   * @side_effects
   * - Encrypts the bid via the cloak service
   *
   * @todo
   * - Add cloak service repo link in side effect text above
   *
   * @param params - Unprimed bid parameters
   * @returns Contract config for the bid transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = await sdk.bid({
   *     lotId: 1,
   *     chainId: 1,
   *     amountIn: 100,
   *     amountOut: 100,
   *     auctionType: AuctionType.SEALED_BID,
   *     bidderAddress: "0x123...",
   *     referrerAddress: "0x456...",
   *     signedPermit2Approval: "0x789...",
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  async bid(params: BidParams): Promise<BidConfig> {
    return this.core.bid.getConfig(params, this.cloakClient);
  }

  /**
   * Gets the contract config required to execute a claimBids transaction on the auction house smart contract.
   *
   * @param params claimBids parameters
   * @returns Contract config for the claimBids transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.claimBids({
   *     lotId: 1,
   *     bids: [1, 2, 3],
   *     chainId: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  claimBids(params: ClaimBidsParams): ClaimBidsConfig {
    return this.core.claimBids.getConfig(params);
  }

  /**
   * Gets the contract config required to execute a refundBid transaction on the auction house smart contract.
   *
   * @param params refundBid parameters
   * @returns Contract config for the refundBid transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.refundBid({
   *     lotId: 1,
   *     bidId: 10,
   *     bidIndex: 1,
   *     chainId: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  refundBid(params: RefundBidParams): RefundBidConfig {
    return this.core.refundBid.getConfig(params);
  }

  /**
   * Gets the contract config required to execute a settle transaction on the auction house smart contract.
   *
   * @param params settle parameters
   * @returns Contract config for the settle transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.settle({
   *     lotId: 1,
   *     chainId: 1,
   *     numBids: 10,
   *     callbackData: "0x...",
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  settle(params: SettleParams): SettleConfig {
    return this.core.settle.getConfig(params);
  }

  /**
   * Gets the contract config required to execute an abort transaction on the auction house smart contract.
   * Aborting an auction ends it and enables bidders to reclaim their bids.
   *
   * @param params abort parameters
   * @returns Contract config for the abort transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.abort({
   *     lotId: 1,
   *     chainId: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  abort(params: AbortParams): AbortConfig {
    return this.core.abort.getConfig(params);
  }

  /**
   * Gets the contract config required to execute a cancel transaction on the auction house smart contract.
   * Cancelling an auction ends the auction, and is only possible before a bidder has bid on it.
   *
   * @param params cancel parameters
   * @returns Contract config for the cancel transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.cancel({
   *     lotId: 1,
   *     chainId: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  cancel(params: CancelParams): CancelConfig {
    return this.core.cancel.getConfig(params);
  }

  /**
   * // TODO
   * todo
   *
   * @param params create parameters
   * @returns Contract config for the create transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = await sdk.create({
   *     //TODO: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  async create(params: CreateParams): Promise<CreateConfig> {
    return this.core.create.getConfig(params, this.metadataClient);
  }
}

const createSdk = (config?: OriginConfig) => new OriginSdk(config);

export { OriginSdk, createSdk };

export type * from "../core";
