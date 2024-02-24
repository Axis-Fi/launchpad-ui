import { useAccount } from "wagmi";
import { useFormContext } from "react-hook-form";
import { Address } from "viem";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Button, Tooltip } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import { CreateAuctionForm } from "pages/create-auction-page";
import { axisContracts } from "@repo/contracts";
import { RequiresWalletConnection } from "components/requires-wallet-connection";
import { LoadingIndicator } from "modules/app/loading-indicator";

type SubmitterProps = React.PropsWithChildren;

export function CreateAuctionSubmitter({ children }: SubmitterProps) {
  const { address } = useAccount();
  const form = useFormContext<CreateAuctionForm>();
  const [payoutToken, amount] = form.watch(["payoutToken", "capacity"]);

  const axisAddresses = axisContracts.addresses[payoutToken?.chainId];

  const {
    isSufficientAllowance,
    execute,
    approveReceipt: approveTx,
  } = useAllowance({
    ownerAddress: address,
    spenderAddress: axisAddresses?.auctionHouse,
    tokenAddress: payoutToken?.address as Address,
    decimals: payoutToken?.decimals,
    chainId: payoutToken?.chainId,
    amount: Number(amount),
  });

  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      <RequiresWalletConnection>
        {isSufficientAllowance ? (
          children
        ) : (
          <div className="flex">
            <Button
              className="w-full max-w-md"
              type="submit"
              disabled={approveTx.isLoading}
              onClick={() => execute()}
            >
              {approveTx.isLoading ? (
                <div className="flex justify-center gap-x-1">
                  Waiting <LoadingIndicator />
                </div>
              ) : (
                "APPROVE"
              )}
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
