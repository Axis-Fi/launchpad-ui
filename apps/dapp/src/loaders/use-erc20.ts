import React from "react";
import { Address, erc20Abi as abi, isAddress } from "viem";
import { useReadContracts } from "wagmi";

/** Reads ERC20 details onchain */
export default function useERC20({
  chainId,
  address = "0x",
}: {
  chainId: number;
  address: Address;
}) {
  const contract = { abi, address, chainId };

  const response = useReadContracts({
    query: { enabled: !!chainId && isAddress(address) },
    contracts: [
      { ...contract, functionName: "decimals" },
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "name" },
    ],
  });

  const [decimals, symbol, name] = response.data?.map((d) => d.result) ?? [];

  const token = React.useMemo(
    () => ({ decimals, symbol, name, address, chainId }),
    [decimals, symbol, name, address, chainId],
  );

  return {
    response,
    isError: response.data?.some((d) => d.error),
    token,
  };
}
