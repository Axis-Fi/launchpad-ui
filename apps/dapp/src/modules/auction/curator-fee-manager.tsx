import { Button, InfoLabel, Badge, Tooltip, cn } from "@repo/ui";
import { useCuratorFees } from "./hooks/use-curator-fees";
import { useChainId } from "wagmi";
import React from "react";
import { useFees } from "./hooks/use-fees";
import { parsePercent } from "utils/number";
import { AuctionType } from "@axis-finance/types";
import { getAuctionHouse } from "utils/contracts";
import { chains } from "@axis-finance/env";
import { auctionMetadata } from "./metadata";
import type { Chain } from "@axis-finance/types";
import { environment } from "utils/environment";

const activeChains = chains.activeChains(environment.isTestnet);

type CuratorFeeManagerProps = {
  chainId?: number;
  auctionType: AuctionType;
  modules: AuctionType[];
  className?: string;
};
export function CuratorFeeManager({
  auctionType,
  ...props
}: CuratorFeeManagerProps) {
  const connectedChainId = useChainId();
  const chainId = props.chainId ?? connectedChainId;
  const ah = getAuctionHouse({ chainId, auctionType });
  const modules = props.modules.map((m) => auctionMetadata[m].label);

  const chain = activeChains.find((c: Chain) => c.id === chainId);

  const {
    data: { maxCuratorFee },
  } = useFees(chainId, ah.address, auctionType);

  const [fee, setFee] = React.useState<string>("");
  const curatorFees = useCuratorFees(chainId, parseFloat(fee), auctionType);
  const parsedAmount = parseFloat(fee);

  //Clears tx state when moving between chains after updating a fee
  React.useEffect(() => {
    curatorFees.reset();
    setFee("");
  }, [chainId, auctionType]);

  return (
    <div className={cn("gap-x-8", props.className)}>
      <div className="flex items-end justify-start gap-x-4">
        <Tooltip
          content={`Your current fee for the Batch Auction House on ${chain?.name}. It includes the following auction modules:\n${modules.join(
            ", ",
          )}.`}
        >
          <InfoLabel
            editable
            label={"Current Fee"}
            value={fee || curatorFees.fee + "%"}
            className="text-left"
            inputClassName="w-28 min-w-0 px-0 border border-surface-secondary"
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

        <Button
          size="sm"
          disabled={!isFinite(parsedAmount) || parsedAmount === curatorFees.fee}
          onClick={() => curatorFees.handleSetFee()}
        >
          Update Fee
        </Button>
      </div>
      <Tooltip content="The contract's maximum allowed curator's fee">
        <Badge
          size="s"
          onClick={() => setFee(maxCuratorFee + "%")}
          className="mt-8 h-min normal-case"
        >
          Max Allowed Fee: {maxCuratorFee}%
        </Badge>
      </Tooltip>
      {curatorFees.isError && <p>Something went wrong</p>}
      {curatorFees.feeTx.isPending && <p>Waiting for signature..</p>}
      {curatorFees.feeTx.isSuccess && curatorFees.feeReceipt.isPending && (
        <p>Updating fee..</p>
      )}
      {!curatorFees.feeReceipt.isPending &&
        curatorFees.feeReceipt.isSuccess && <p>Fee updated!</p>}
    </div>
  );
}
