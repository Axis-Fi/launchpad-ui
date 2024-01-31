import { Avatar, ComboBox, Input } from "@repo/ui";
import { activeChains } from "config/chains";
import useERC20 from "loaders/use-erc20";
import React from "react";
import { Address } from "viem";
import { useChainId } from "wagmi";

export function TokenPicker() {
  const [value, setValue] = React.useState<string>();
  const [newChain, setNewChain] = React.useState<number>();

  const chainId = useChainId();
  const chain = activeChains.find(
    (c) => c.id === Number(newChain) || c.id === chainId,
  );

  const { token } = useERC20({
    address: value as Address,
    chainId,
  });

  return (
    <div className="flex items-center gap-x-2 space-y-4">
      <Input label="Token Address" onChange={(e) => setValue(e.target.value)} />
      <ComboBox
        label="Chain"
        defaultValue={chainId}
        options={activeChains.map((c) => ({
          value: c.id.toString(),
          label: c.name,
        }))}
        onChange={(value) => {
          setNewChain(value);
        }}
        triggerElement={
          <Avatar className="cursor-pointer" width={64} alt={chain?.name} />
        }
      />
      {token && (
        <div>
          <p>{token.name}</p>
          <p>{token.symbol}</p>
          <p>{token.decimals}</p>
        </div>
      )}
    </div>
  );
}
