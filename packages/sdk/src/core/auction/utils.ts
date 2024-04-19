import { type Address, erc20Abi } from "viem";
import { defaultTokenlist } from "@repo/deployments";
import type { Token } from "@repo/types";
import { createClient } from "../public-client";

const getTokenFromTokenLists = ({
  chainId,
  address,
}: {
  address: Address;
  chainId: number;
}): Token | undefined => {
  return [defaultTokenlist] // TODO: does this need to support multiple token lists?
    .flatMap((t) => t.tokens)
    .find(
      (t) =>
        t.address.toLocaleLowerCase().includes(address.toLocaleLowerCase()) &&
        t.chainId == chainId,
    );
};

const getTokenDecimalsOnChain = async ({
  chainId,
  address,
}: {
  address: Address;
  chainId: number;
}): Promise<number | undefined> => {
  const client = createClient(chainId);

  return client.readContract({
    address,
    abi: erc20Abi,
    functionName: "decimals",
  });
};

const getTokenDecimals = async ({
  chainId,
  address,
}: {
  address: Address;
  chainId: number;
}): Promise<number | undefined> => {
  const token = getTokenFromTokenLists({ chainId, address });

  if (token) {
    return token.decimals;
  }

  return getTokenDecimalsOnChain({ chainId, address });
};

export { getTokenDecimals };
