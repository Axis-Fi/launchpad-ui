import {
  type CloakClient,
  createCloakClient,
  Configuration,
} from "@repo/cloak";
import { type OriginConfig } from "../types";
import { type Config } from "./types";
import type { BidParams, BidConfig } from "./bid";
import type { GetAuctionParams, GetAuctionResult } from "./auction";
import * as bid from "./bid";
import * as auction from "./auction";
import { config } from "./utils";

/**
 * OriginSdk provides convenience helpers for interacting with Axis Origin protocol.
 *
 * @remarks
 * This SDK is web3 client agnostic and doesn't perform the transactions on behalf of the dapp.
 * Instead, the SDK functions return the required smart contract configuration to execute
 * the transaction in any web3 client.
 *
 * Web3 client SDK wrappers are available for Wagmi and Ethers. See: @axis/origin-sdk/wagmi and @axis/origin-sdk/ethers.
 *
 * @example
 * const sdk = new OriginSdk({
 *   cloak: {
 *     url: "https://cloak.blah/api"
 *   }
 * })
 */
class OriginSdk {
  cloakClient: CloakClient;

  constructor(config: OriginConfig) {
    this.cloakClient = createCloakClient(
      new Configuration({ basePath: config.cloak.url }),
    );
  }

  async getAuction(params: GetAuctionParams): Promise<GetAuctionResult> {
    return auction.getAuction(params);
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
   * try {
   *   const { config } = await sdk.bid({
   *     lotId: 1,
   *     amountIn: 100,
   *     amountOut: 100,
   *     chainId: 1,
   *     bidderAddress: "0x123",
   *     referrerAddress: "0x456",
   *     signedPermit2Approval: "0x789",
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  async bid(params: BidParams): Promise<Config<BidConfig>> {
    return config(await bid.bid(params, this.cloakClient));
  }
}

export { OriginSdk };
