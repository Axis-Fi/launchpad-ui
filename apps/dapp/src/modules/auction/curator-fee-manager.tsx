import { Button, InfoLabel, Badge, Tooltip } from "@repo/ui";
import { useCuratorFees } from "./hooks/use-curator-fees";
import { useChainId } from "wagmi";
import React from "react";
import { useFees } from "./hooks/use-fees";
import { CheckIcon } from "lucide-react";
import { parsePercent } from "utils/number";
import { AuctionType } from "@repo/types";
import { getAuctionHouse } from "utils/contracts";

type CuratorFeeManagerProps = {
  chainId?: number;
};
export function CuratorFeeManager(props: CuratorFeeManagerProps) {
  const connectedChainId = useChainId();
  const chainId = props.chainId ?? connectedChainId;
  const auctionType = AuctionType.SEALED_BID; //TODO: add type picker
  const ah = getAuctionHouse({ chainId, auctionType });

  const {
    data: { maxCuratorFee },
  } = useFees(chainId, ah.address);

  const [fee, setFee] = React.useState<string>("");
  const curatorFees = useCuratorFees(chainId, parseFloat(fee), auctionType);
  const parsedAmount = parseFloat(fee);

  return (
    <div className="gap-x-8">
      <div className="flex items-end justify-start">
        <InfoLabel
          editable
          label="Your Fee"
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
    </div>
  );
}
