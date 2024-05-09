import {
  type CloakClient,
  createCloakClient,
  Configuration,
} from "@repo/cloak";
import * as core from "../core";
import { type AxisDeployments, deployments } from "@repo/deployments";
import { type OriginConfig } from "../types";
import type { BidParams, BidConfig } from "../core/bid";
import type { GetAuctionParams, GetAuctionResult } from "../core/auction";
import type { Core } from "../core";
import type { GetTokenPriceParams } from "../core/tokens";

/**
 * OriginSdk provides convenience helpers for interacting with Axis Origin protocol.
 *
 * @remarks
 * This SDK is web3 client agnostic and doesn't perform transactions on behalf of the consumer.
 * Instead, the SDK functions return smart contract data to enable the consumer
 * to execute the transaction inside their own web3 client.
 *
 * TODO: Web3 client SDK adapters are available for Wagmi and Ethers. See: @axis/origin-sdk/wagmi and @axis/origin-sdk/ethers.
 *
 * @example
 * import { OriginSdk } from "@axis-fi/origin-sdk";
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

  constructor(
    _config: OriginConfig,
    _core: Core = core,
    _deployments: AxisDeployments = deployments,
  ) {
    this.config = _config;
    this.core = _core;
    this.deployments = _deployments;

    this.cloakClient = createCloakClient(
      new Configuration({ basePath: _config.cloak.url }),
    );
  }

  /**
   * Gets the auction details for a given lot.
   *
   * @param params - The lot ID to get the auction details for
   * @returns The auction details for the given lot
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const auction = await sdk.getAuction({ lotId: 1, chainId: 1, auctionType: AuctionType.SEALED_BID })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  async getAuction(params: GetAuctionParams): Promise<GetAuctionResult> {
    return this.core.auction.functions.getAuction(params);
  }

  async getTokenPrice(params: GetTokenPriceParams): Promise<number> {
    return this.core.tokens.functions.getTokenPrice(
      params.token,
      params.timestamp,
    );
  }

  /**
   * Gets the contract config required to execute a bid transaction on the auction house smart contract from unprimed parameters.
   *
   * @side_effects
   * - Encrypts the bid via the cloak service
   *
   * @todo
   * - Add cloak service link in side effect text above
   *
   * @param params - Unprimed bid parameters
   * @returns Primed contract config for the bid transaction
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
    return this.core.bid.functions.getConfig(
      params,
      this.cloakClient,
      this.core.auction,
      this.deployments,
    );
  }
}

export { OriginSdk };
