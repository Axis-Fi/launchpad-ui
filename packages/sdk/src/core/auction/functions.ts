import { abis } from "@repo/abis";
import { createClient, getContractAddresses } from "..";
import { getToken } from "./utils";
import type {
  GetAuctionParams,
  GetAuctionTokensParams,
  GetAuctionResult,
  GetAuctionTokensResult,
} from "./types";
import { SdkError } from "../../types";

const getAuctionTokens = async (
  params: GetAuctionTokensParams,
): Promise<GetAuctionTokensResult> => {
  const { chainId, lotId } = params;
  const { baseToken: baseTokenAddress, quoteToken: quoteTokenAddress } =
    await getAuction({ chainId, lotId });
  const baseToken = getToken({ chainId, address: baseTokenAddress });
  const quoteToken = getToken({ chainId, address: quoteTokenAddress });

  if (!baseToken) {
    throw new SdkError(
      `Couldn't find base token for auction ${lotId} with token address ${baseTokenAddress} on chain ${chainId}`,
    );
  }

  if (!quoteToken) {
    throw new SdkError(
      `Couldn't find quote token for auction ${lotId} with token address ${quoteTokenAddress} on chain ${chainId}`,
    );
  }

  return { baseToken, quoteToken };
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

export { getAuction, getAuctionTokens };
