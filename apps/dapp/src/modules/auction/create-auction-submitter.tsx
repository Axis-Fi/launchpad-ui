import { useAccount } from "wagmi";
import { useFormContext } from "react-hook-form";
import { Address } from "viem";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, Tooltip } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import { CreateAuctionForm } from "pages/create-auction-page";

export function CreateAuctionSubmitter() {
  const { address } = useAccount();
  const form = useFormContext<CreateAuctionForm>();
  const { payoutToken, amount } = form.getValues();

  const { isSufficientAllowance, execute, approveTx } = useAllowance({
    ownerAddress: address,
    spenderAddress: "0x",
    tokenAddress: payoutToken?.address as Address,
    decimals: payoutToken?.decimals,
    chainId: payoutToken?.chainId,
    amount: Number(amount),
  });

  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      {!isSufficientAllowance ? (
        <Button type="submit">Create Auction</Button>
      ) : (
        <div className="flex">
          <Button disabled={approveTx.isLoading} onClick={() => execute()}>
            {approveTx.isLoading ? "Waiting" : "Approve"}
          </Button>
          <Tooltip
            content={`You need to allow the AuctionHouse contract to spend the configured amount of ${
              payoutToken?.symbol ?? "the payout token"
            }`}
          >
            <InfoCircledIcon className="ml-1 h-6 w-6" />
          </Tooltip>
        </div>
      )}
    </div>
  );
}
