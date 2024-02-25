import { Button, InfoLabel, Badge, Tooltip } from "@repo/ui";
import { useCuratorFees } from "./hooks/use-curator-fees";
import { useChainId } from "wagmi";
import React from "react";
import { useFees } from "./hooks/use-fees";
import { CheckIcon } from "lucide-react";
import { parsePercent } from "./use-percentage-input";

type CuratorFeeManagerProps = {
  chainId?: number;
};
export function CuratorFeeManager(props: CuratorFeeManagerProps) {
  const connectedChainId = useChainId();
  const chainId = props.chainId ?? connectedChainId;

  const {
    data: { maxCuratorFee },
  } = useFees(chainId);

  const [amount, setAmount] = React.useState<string>("");

  const curatorFees = useCuratorFees(chainId, parseFloat(amount));

  return (
    <div className="gap-x-8">
      <div className="flex items-end justify-start">
        <InfoLabel
          editable
          label="Your Fee"
          value={amount || curatorFees.fee + "%"}
          inputClassName="w-24 min-w-0 pl-0"
          onChange={(e) => {
            parsePercent(e);
            setAmount(e.target.value);
          }}
          onBlur={(e) => {
            if (!isFinite(parseFloat(e.target.value))) {
              setAmount(curatorFees.fee + "%");
            }
          }}
          reverse
        />

        <Button size="icon" variant="ghost">
          {parseFloat(amount) !== curatorFees.fee && (
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
          onClick={() => setAmount(maxCuratorFee + "%")}
          className="mt-4 h-min"
        >
          Max: {maxCuratorFee}%
        </Badge>
      </Tooltip>
    </div>
  );
}
