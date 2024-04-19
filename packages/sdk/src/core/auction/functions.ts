import { abis } from "@repo/abis";
import { createClient, getContractAddresses } from "..";
import { getTokenDecimals } from "./utils";
import type {
  GetAuctionParams,
  GetAuctionTokensParams,
  GetAuctionResult,
  GetAuctionTokensResult,
} from "./types";
import { SdkError } from "../../types";

const getAuctionTokenDecimals = async (
  params: GetAuctionTokensParams,
): Promise<GetAuctionTokensResult> => {
  const { chainId, lotId } = params;

  const { baseToken: baseTokenAddress, quoteToken: quoteTokenAddress } =
    await getAuction({ chainId, lotId });
  const baseTokenDecimals = await getTokenDecimals({
    chainId,
    address: baseTokenAddress,
  });
  const quoteTokenDecimals = await getTokenDecimals({
    chainId,
    address: quoteTokenAddress,
  });

  if (!baseTokenDecimals) {
    throw new SdkError(
      `Couldn't find base token for address ${baseTokenAddress} on chain ${chainId} in auction ${lotId}`,
    );
  }

  if (!quoteTokenDecimals) {
    throw new SdkError(
      `Couldn't find base token for address ${quoteTokenAddress} on chain ${chainId} in auction ${lotId}`,
    );
  }

  return { baseTokenDecimals, quoteTokenDecimals };
};

const getAuction = async (
  params: GetAuctionParams,
): Promise<GetAuctionResult> => {
  const { chainId, lotId } = params;
  const client = createClient(chainId);

  return client.readContract({
    address: getContractAddresses(chainId)?.catalogue,
    abi: abis.catalogue,
    functionName: "getRouting",
    args: [BigInt(lotId)],
  });
};

export { getAuction, getAuctionTokenDecimals };
