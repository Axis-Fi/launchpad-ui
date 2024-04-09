import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import { Address, Hex, WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { Chain } from "viem";
import { activeChains } from "config/chains";
import type { TokenConfig } from "pages/deploy-token-page";
import { testnetERC20 as ERC20 } from "@repo/abis";

const deploy = (
  walletClient: WalletClient,
  account: Address,
  chain: Chain,
  values: TokenConfig,
) => {
  return walletClient.deployContract({
    account,
    abi: ERC20.abi,
    bytecode: ERC20.bytecode.object as Hex,
    args: [values.name, values.symbol, 18],
    chain,
  });
};

export function useDeployToken() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const chainId = useChainId();
  const chain = activeChains.find((c) => c.id === chainId);

  const mutation = useMutation({
    mutationFn: (values: TokenConfig) =>
      deploy(walletClient!, address!, chain!, values),
  });

  const receipt = useWaitForTransactionReceipt({
    hash: mutation.data,
  });

  const handleDeploy = (values: TokenConfig) => {
    if (walletClient && address && chain) {
      mutation.mutate(values);
    }
  };

  return {
    handleDeploy,
    receipt,
    mutation,
  };
}
