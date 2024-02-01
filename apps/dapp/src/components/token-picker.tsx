import {
  Avatar,
  ComboBox,
  IconedLabel,
  Input,
  DialogInputProps,
  Skeleton,
} from "@repo/ui";
import { activeChains } from "config/chains";
import useERC20 from "loaders/use-erc20";
import React from "react";
import { Token } from "src/types";
import { Address } from "viem";
import { useChainId } from "wagmi";

export function TokenPicker({
  onValueChange,
  onChainChange,
}: {
  onValueChange?: NonNullable<
    DialogInputProps<Token>["children"]
  >["props"]["onValueChange"];
  onChainChange?: (chainId: number) => void;
}) {
  const [address, setAddress] = React.useState<string>();
  const [newChain, setNewChain] = React.useState<number>();

  const chainId = useChainId();
  const chain = activeChains.find((c) =>
    newChain ? c.id === Number(newChain) : c.id === chainId,
  );

  const { token, isError, response } = useERC20({
    address: address as Address,
    chainId,
  });

  const { isLoading, isSuccess } = response;

  React.useEffect(() => {
    if (isSuccess) {
      onValueChange(token, { label: token.symbol });
    }
  }, [isSuccess, onValueChange, token]);

  return (
    <div>
      <div className="flex items-center gap-x-2 space-y-4">
        <Input
          label="Token Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <ComboBox
          label="Chain"
          defaultValue={chainId}
          onChange={(value) => {
            const chainId = Number(value);
            setNewChain(chainId);
            onChainChange?.(chainId);
          }}
          options={activeChains.map((c) => ({
            value: c.id.toString(),
            label: c.name,
          }))}
          triggerElement={
            <Avatar className="mb-4 cursor-pointer" alt={chain?.name} />
          }
        />
      </div>

      <div className="flex flex-col items-center justify-center pt-4">
        {isLoading && <Skeleton className="h-[20px] w-[80px]" />}
        {isSuccess && <IconedLabel label={token.symbol?.toString() ?? ""} />}
        {isError && <h4>Token not found</h4>}
      </div>
    </div>
  );
}
