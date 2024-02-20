import {
  IconedLabel,
  Input,
  DialogInputProps,
  Skeleton,
  LabelWrapper,
} from "@repo/ui";
//import { activeChains } from "config/chains";
import useERC20 from "loaders/use-erc20";
import React from "react";
import { Token } from "src/types";
import { Address } from "viem";
import { useChainId } from "wagmi";

type TokenPickerProps = {
  onChange?: NonNullable<
    DialogInputProps<Token>["children"]
  >["props"]["onChange"];
  onChainChange?: (chainId: number) => void;
};

export function TokenPicker({
  onChange,
}: React.PropsWithChildren<TokenPickerProps>) {
  const [address, setAddress] = React.useState<string>();
  //const [newChain, setNewChain] = React.useState<number>();

  const chainId = useChainId();
  //const chain = activeChains.find((c) => newChain ? c.id === Number(newChain) : c.id === chainId,);

  const { token, isError, response } = useERC20({
    address: address as Address,
    chainId,
  });

  const { isLoading, isSuccess } = response;

  React.useEffect(() => {
    if (isSuccess) {
      onChange(token, { label: token.symbol });
    }
  }, [isSuccess, onChange, token]);

  return (
    <div>
      <div className="flex items-center gap-x-2 space-y-4">
        <LabelWrapper content="Token Address">
          <Input
            id="token-address"
            placeholder="Paste token address"
            onChange={(e) => setAddress(e.target.value)}
          />
        </LabelWrapper>
        {/* <ComboBox
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
            <Avatar className="cursor-pointer" alt={chain?.name} />
          }
        />
 */}
      </div>
      <div className="flex flex-col items-center justify-center pt-4">
        {isLoading && <Skeleton className="h-[20px] w-[80px]" />}
        {isSuccess && <IconedLabel label={token.symbol?.toString() ?? ""} />}
        {isError && <h4>Token not found</h4>}
      </div>
    </div>
  );
}
