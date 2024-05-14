import type { AxisDeployments } from "@repo/deployments";
import type {
  GetAuctionTokenDecimalsParams,
  GetAuctionTokenDecimalsResult,
} from "../types";
import { SdkError } from "../../../types";
import { getAuction } from "./get-auction";
import { getTokenDecimals } from "../utils";

const getAuctionTokenDecimals = async (
  params: GetAuctionTokenDecimalsParams,
  deployments: AxisDeployments,
): Promise<GetAuctionTokenDecimalsResult> => {
  const { chainId, lotId, auctionType } = params;
  const tokenLists = [deployments[chainId]?.tokenList];
  const { baseToken: baseTokenAddress, quoteToken: quoteTokenAddress } =
    await getAuction({ chainId, lotId, auctionType });

  const baseTokenDecimalsPromise = getTokenDecimals({
    chainId,
    address: baseTokenAddress,
    tokenLists,
  });

  const quoteTokenDecimalsPromise = getTokenDecimals({
    chainId,
    address: quoteTokenAddress,
    tokenLists,
  });

  const [baseTokenDecimals, quoteTokenDecimals] = await Promise.all([
    baseTokenDecimalsPromise,
    quoteTokenDecimalsPromise,
  ]);

  if (!baseTokenDecimals) {
    throw new SdkError(
      `Couldn't find base token for address ${baseTokenAddress} on chain ${chainId} in auction ${lotId}`,
    );
  }

  if (!quoteTokenDecimals) {
    throw new SdkError(
      `Couldn't find quote token for address ${quoteTokenAddress} on chain ${chainId} in auction ${lotId}`,
    );
  }

  return { baseTokenDecimals, quoteTokenDecimals };
};

export { getAuctionTokenDecimals };
