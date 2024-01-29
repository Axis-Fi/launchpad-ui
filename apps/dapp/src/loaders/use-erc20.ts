import { Address, erc20Abi as abi } from "viem";
import { useReadContracts } from "wagmi";

/** Reads ERC20 details onchain */
export default function useERC20({
  chainId,
  address,
}: {
  chainId: number;
  address?: Address;
}) {
  const contract = { abi, address, chainId };

  const response = useReadContracts({
    contracts: [
      { ...contract, functionName: "decimals" },
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "name" },
    ],
  });

  const [decimals, symbol, name] = response.data?.map((d) => d.result) ?? [];

  return {
    status: response,
    token: {
      decimals,
      symbol,
      name,
    },
  };
}
