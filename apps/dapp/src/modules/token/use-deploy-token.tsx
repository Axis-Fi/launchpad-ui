import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWalletClient,
} from "wagmi";
import bytecode from "./bytecode";
import abi from "./custom-erc20.json";
import { Address, WalletClient } from "viem";
import { useMutation } from "@tanstack/react-query";
import { Chain } from "viem";
import { activeChains } from "config/chains";
import type { TokenConfig } from "pages/deploy-token-page";

const deploy = (
  walletClient: WalletClient,
  account: Address,
  chain: Chain,
  values: TokenConfig,
) => {
  return walletClient.deployContract({
    account,
    abi,
    bytecode,
    args: [account, values.name, values.symbol],
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
