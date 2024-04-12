import {
  type CloakClient,
  createCloakClient,
  Configuration,
} from "@repo/cloak";
import { type OriginConfig } from "./types";
import type { BidParams, BidResponse } from "./bid";
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
 * Web3 client SDK wrappers are available for Wagmi and Ethers. See: @axis/origin-sdk/wagmi and @axis/origin-sdk/ethers.
 *
 * @example
 * todo
 *
 */
class OriginSdk {
  cloakClient: CloakClient;

  constructor(config: OriginConfig) {
    this.cloakClient = createCloakClient(
      new Configuration({ basePath: config.cloak.url }),
    );
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
