import { type Address, erc20Abi } from "viem";
import { createClient } from "../../public-client";

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

export { getTokenDecimalsOnChain };
