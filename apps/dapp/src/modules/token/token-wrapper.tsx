import React from "react";
import { Button, Card, Text } from "@repo/ui";
import { TokenAmountInput } from "./token-amount-input";
import { useAccount, useBalance, useChainId } from "wagmi";
import { getDeployment } from "@repo/deployments";
import { Chain } from "@repo/types";
import { ArrowDownUpIcon } from "lucide-react";
import useWrapperContract from "./use-wrap-token";
import { formatUnits, parseUnits } from "viem";
import useERC20Balance from "loaders/use-erc20-balance";
import { trimCurrency } from "utils/currency";

export function TokenWrapper() {
  const { address: userAddress } = useAccount();
  const chainId = useChainId();
  const deployment = getDeployment(chainId);
  const chain = deployment?.chain;
  const [amount, setAmount] = React.useState<string>();
  const [isWrapping, setWrapping] = React.useState(true);
  const wrapperContractAddress = chain?.nativeCurrency.wrapperContract;

  const wrapper = useWrapperContract({
    contractAddress: wrapperContractAddress,
    amount: parseUnits(amount ?? "0", chain?.nativeCurrency.decimals ?? 0),
    isWrapping,
  });

  const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({
    address: userAddress,
    chainId,
  });

  const { balance: wrapperBalance, refetch: refetchWrapperBalance } =
    useERC20Balance({
      chainId,
      tokenAddress: wrapperContractAddress,
      balanceAddress: userAddress,
    });

  React.useEffect(() => {
    if (wrapper.currentReceipt.isSuccess) {
      refetchWrapperBalance();
      refetchNativeBalance();
    }
  }, [wrapper.currentReceipt.isSuccess]);

  if (!chain || !chain.nativeCurrency.wrapperContract) {
    return (
      <div className="flex">
        <Text size="xl">
          {" "}
          Wrapping is not currently available on this chain
        </Text>
      </div>
    );
  }

  const nativeToken = chain.nativeCurrency;
  const wrapperToken = getWrappedTokenDetails(chain);
  const decimals = chain.nativeCurrency.decimals;

  const method = isWrapping ? wrapper.wrap : wrapper.unwrap;

  const inputToken = isWrapping ? nativeToken : wrapperToken;
  const outputToken = isWrapping ? wrapperToken : nativeToken;

  const inputTokenBalance =
    (isWrapping ? nativeBalance?.value : wrapperBalance) ?? 0n;
  const outputTokenBalance =
    (isWrapping ? wrapperBalance : nativeBalance?.value) ?? 0n;

  const inputLabel = `${isWrapping ? "Wrap" : "Unwrap"} ${inputToken.symbol}`;
  const outputLabel = `Get ${outputToken.symbol}`;

  const amountInWei = parseUnits(amount ?? "0", decimals);

  const disableButton =
    inputTokenBalance <= 0n ||
    !isFinite(Number(amount)) ||
    amountInWei >= inputTokenBalance;

  return (
    <Card className="mx-auto max-w-sm">
      <div className="flex flex-col items-center justify-center gap-y-3">
        <TokenAmountInput
          balance={formatBalance(inputTokenBalance ?? 0n, decimals)}
          label={inputLabel}
          value={amount}
          //@ts-expect-error
          onChange={(e) => setAmount(e.target.value!)}
          token={inputToken}
          disableMaxButton
        />
        <ArrowDownUpIcon
          size="24"
          className="text-primary cursor-pointer"
          onClick={() => setWrapping((prev) => !prev)}
        />

        <TokenAmountInput
          balance={formatBalance(outputTokenBalance ?? 0n, decimals)}
          onChange={() => {}}
          disableMaxButton
          label={outputLabel}
          token={outputToken}
          value={amount}
        />
        <Button
          className="mx-4 w-[80%]"
          onClick={method}
          disabled={disableButton}
        >
          {isWrapping ? "Wrap" : "Unwrap"}
        </Button>
        <Text>
          {wrapper.currentTx.isPending && "Confirm transaction in your wallet."}
          {wrapper.currentReceipt.isLoading && "Waiting for confirmation"}
          {wrapper.currentReceipt.isSuccess && "Transaction succesful!"}
        </Text>
      </div>
    </Card>
  );
}

function getWrappedTokenDetails(chain: Chain) {
  return {
    decimals: chain.nativeCurrency.decimals,
    address: chain.nativeCurrency.wrapperContract!,
    symbol: `W${chain.nativeCurrency.symbol}`,
    name: `Wrapped ${chain.nativeCurrency.name}`,
    chainId: chain.id,
  };
}

function formatBalance(balance: bigint, decimals: number) {
  return trimCurrency(formatUnits(balance, decimals));
}
