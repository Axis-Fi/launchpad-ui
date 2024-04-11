import { type CloakClient, createCloakClient } from "@repo/cloak";
import { type OriginConfig } from "./types";
import type { BidParams, BidResponse, GetBidConfigParams } from "./bid";
import * as bid from "./bid";
import { success, fail } from "./utils";

/**
 * OriginSdk provides convenience helpers for interacting with Axis Origin protocol.
 *
 * @remarks
 * This SDK is web3 client agnostic and doesn't perform the transactions on behalf of the dapp.
 * Instead, the SDK functions return the required smart contract configuration to execute
 * the transaction in any web3 client.
 *
 * Client SDK wrappers are available for Wagmi and Ethers. See: @origin/sdk/wagmi and @origin/sdk/ethers.
 *
 * The SDK aheres to the following pattern:
 * - getXConfig(primedParams): A pure function that returns the required contract config for the X transaction
 * - x(unprimedParams): Convenience helper which performs side-effects to acquire primed parameters for getXConfig()
 *
 * @example
 * todo
 *
 */
class OriginSdk {
  cloakClient: CloakClient;

  constructor(config: OriginConfig) {
    this.cloakClient = createCloakClient(config.cloak);
  }

  /**
   * Gets the contract config required to execute a bid transaction on the auction house smart contract from primed parameters.
   *
   * @todo decide best way to handle all bid types (FP, EMP) etc. currently only supporting EMP.
   *
   * @param params - Primed bid parameters (e.g. encrypted bid)
   * @returns Primed contract config for the bid transaction
   *
   * @example
   * ```ts
   *  const params = {
   *    lotId: 1,
   *    amountIn: 100,
   *    amountOut: 100,
   *    chainId: 1,
   *    bidderAddress: "0x1234567890123456789012345678901234567890",
   *    referrerAddress: "0x1234567890123456789012345678901234567890"
   *  }
   *
   *  const config = sdk.getBidConfig(params);
   * ```
   */
  getBidConfig(params: GetBidConfigParams): BidResponse {
    try {
      return success(bid.getBidConfig(params));
    } catch (error: unknown) {
      return fail(error);
    }
  }

  /**
   * Gets the contract config required to execute a bid transaction on the auction house smart contract from unprimed parameters.
   *
   * @side_effects
   * - Encrypts the bid via the cloak service
   *
   * @todo
   * - Decide best way to handle all bid types (FP, EMP) etc. currently only supporting EMP.
   * - Add cloak service link in side effect text above
   *
   * @param params - Unprimed bid parameters
   * @returns Primed contract config for the bid transaction
   */
  async bid(params: BidParams): Promise<BidResponse> {
    try {
      return success(await bid.bid(params, this.cloakClient));
    } catch (error: unknown) {
      return fail(error);
    }
  }
}

export { OriginSdk };
