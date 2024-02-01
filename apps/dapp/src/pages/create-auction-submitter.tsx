import { Dialog } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import { CreateAuctionState } from "modules/auction/create-auction-reducer";
import { useAccount } from "wagmi";

export function CreateAuctionSubmitter({
  state,
}: {
  state: CreateAuctionState;
}) {
  const { address } = useAccount();
  console.log({ state });

  const allowance = useAllowance({
    ownerAddress: address,
    spenderAddress: "0x1F0b003674f05C140DC6e885066F4751EC4bFe20",
    tokenAddress: state.payoutToken?.address,
    decimals: state.payoutToken?.decimals,
    chainId: state.chainId,
    amount: state.amount,
  });

  return (
    <div className="mt-4 flex justify-center">
      <Dialog
        onSubmit={() => allowance.execute()}
        title="Confirm"
        triggerContent="Create Auction"
      >
        Create Auction
      </Dialog>
    </div>
  );
}
