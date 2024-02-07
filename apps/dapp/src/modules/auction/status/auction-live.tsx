import { Button, Input, LabelWrapper } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import React from "react";
import { Auction } from "src/types";
import { useAccount } from "wagmi";

export function AuctionLive({ auction }: { auction: Auction }) {
  const [maxPrice, setMaxPrice] = React.useState<number>();
  const [amount, setAmount] = React.useState<number>();
  const { address } = useAccount();

  const { isSufficientAllowance, approveTx, execute } = useAllowance({
    ownerAddress: address,
    spenderAddress: "0x",
    tokenAddress: auction.quoteToken.address,
    decimals: auction.quoteToken.decimals,
    chainId: auction.chainId,
    amount: Number(amount),
  });

  const handleSubmit = () => {
    maxPrice;
  };

  return (
    <div>
      <div className="flex gap-x-2">
        <LabelWrapper content="Max Price">
          <Input
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            type="number"
          />
        </LabelWrapper>

        <LabelWrapper content="Amount">
          <Input
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </LabelWrapper>
        {isSufficientAllowance ? (
          <Button onClick={handleSubmit} className="self-end">
            Bid
          </Button>
        ) : (
          <div className="flex self-end">
            <Button disabled={approveTx.isLoading} onClick={() => execute()}>
              {approveTx.isLoading ? "Waiting" : "Approve"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
