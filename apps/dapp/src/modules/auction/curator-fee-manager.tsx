import { Button, InfoLabel, Badge, Tooltip } from "@repo/ui";
import { useCuratorFees } from "./hooks/use-curator-fees";
import { useChainId } from "wagmi";
import React from "react";
import { useFees } from "./hooks/use-fees";
import { CheckIcon } from "lucide-react";
import { parsePercent } from "utils/number";
import { AuctionType } from "@repo/types";
import { getAuctionHouse } from "utils/contracts";
import { activeChains } from "@repo/env/src/chains";
import { auctionMetadata } from "./metadata";

type CuratorFeeManagerProps = {
  chainId?: number;
  auctionType: AuctionType;
  modules: AuctionType[];
};
export function CuratorFeeManager({
  auctionType,
  ...props
}: CuratorFeeManagerProps) {
  const connectedChainId = useChainId();
  const chainId = props.chainId ?? connectedChainId;
  const ah = getAuctionHouse({ chainId, auctionType });
  const isAtomicAH = auctionType === AuctionType.FIXED_PRICE;
  const modules = props.modules.map((m) => auctionMetadata[m].label);

  const chain = activeChains.find((c) => c.id === chainId);

  const {
    data: { maxCuratorFee },
  } = useFees(chainId, ah.address, auctionType);

  const [fee, setFee] = React.useState<string>("");
  const curatorFees = useCuratorFees(chainId, auctionType, parseFloat(fee));
  const parsedAmount = parseFloat(fee);

  return (
    <div className="gap-x-8">
      <div className="flex items-end justify-start">
        <Tooltip
          content={`Your current fee for the ${
            isAtomicAH ? "Atomic" : "Batch"
          } Auction House on ${chain?.name}. It includes the following auction modules:\n${modules.join(
            " ,",
          )}`}
        >
          <InfoLabel
            editable
            label={isAtomicAH ? "Atomic Auctions" : "Batch Auctions"}
            value={fee || curatorFees.fee + "%"}
            inputClassName="w-24 min-w-0 pl-0"
            onChange={(e) => {
              parsePercent(e);
              setFee(e.target.value);
            }}
            onBlur={(e) => {
              if (!isFinite(parseFloat(e.target.value))) {
                setFee(curatorFees.fee + "%");
              }
            }}
            reverse
          />
        </Tooltip>

        <Button size="icon" variant="ghost">
          {isFinite(parsedAmount) && parsedAmount !== curatorFees.fee && (
            <div>
              <Button size="icon" variant="ghost">
                <CheckIcon onClick={() => curatorFees.handleSetFee()} />
              </Button>
            </div>
          )}
        </Button>
      </div>
      <Tooltip content="The contract's maximum allowed curator's fee">
        <Badge
          onClick={() => setFee(maxCuratorFee + "%")}
          className="mt-4 h-min"
        >
          Max: {maxCuratorFee}%
        </Badge>
      </Tooltip>
      {curatorFees.isError && <p>Something went wrong</p>}
      {curatorFees.feeTx.isPending && <p>Waiting signature..</p>}
      {curatorFees.feeTx.isSuccess && curatorFees.feeReceipt.isPending && (
        <p>Updating fee..</p>
      )}
      {!curatorFees.feeReceipt.isPending &&
        curatorFees.feeReceipt.isSuccess && <p>Fee updated!</p>}
    </div>
  );
}
