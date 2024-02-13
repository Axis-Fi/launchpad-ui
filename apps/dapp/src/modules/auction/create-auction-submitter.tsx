import { useAccount } from "wagmi";
import { useFormContext } from "react-hook-form";
import { Address } from "viem";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, Tooltip } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import { CreateAuctionForm } from "pages/create-auction-page";
import { axisContracts } from "@repo/contracts";
import { RequiresWalletConnection } from "components/requires-wallet-connection";

type SubmitterProps = {
  isPending: boolean;
};

export function CreateAuctionSubmitter({ isPending }: SubmitterProps) {
  const { address } = useAccount();
  const form = useFormContext<CreateAuctionForm>();
  const [payoutToken, amount] = form.watch(["payoutToken", "capacity"]);

  const axisAddresses = axisContracts.addresses[payoutToken?.chainId];

  // TODO check that loading state works
  const { isSufficientAllowance, execute, approveTx, isLoading } = useAllowance(
    {
      ownerAddress: address,
      spenderAddress: axisAddresses?.auctionHouse,
      tokenAddress: payoutToken?.address as Address,
      decimals: payoutToken?.decimals,
      chainId: payoutToken?.chainId,
      amount: Number(amount),
    },
  );

  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <RequiresWalletConnection>
        {isLoading ? (
          <Button disabled>Loading...</Button>
        ) : isSufficientAllowance ? (
          <Button type="submit" disabled={isPending}>
            {isPending ? "Confirming..." : "Create Auction"}
          </Button>
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
      </RequiresWalletConnection>
    </div>
  );
}
