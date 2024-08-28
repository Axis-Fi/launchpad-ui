import React from "react";
import { Button, InfoLabel, Text, Badge, Tooltip, cn } from "@repo/ui";
import { useCuratorFees } from "./hooks/use-curator-fees";
import { useChainId } from "wagmi";
import { useFees } from "./hooks/use-fees";
import { AuctionType } from "@repo/types";
import { getAuctionHouse } from "utils/contracts";
import { activeChains } from "@repo/env/src/chains";
import { auctionMetadata } from "./metadata";
import { z } from "zod";

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

  const chain = activeChains.find((c) => c.id === chainId);

  const {
    data: { maxCuratorFee },
  } = useFees(chainId, ah.address, auctionType);

  const [fee, setFee] = React.useState<string | undefined>();
  const curatorFees = useCuratorFees(
    chainId,
    parseFloat(fee ?? "0"),
    auctionType,
  );

  const feeSchema = React.useMemo(() => {
    return z.coerce
      .number({ invalid_type_error: "Must be a valid number" })
      .optional()
      .refine((data) => !data || (data ?? 0) <= (maxCuratorFee ?? 0), {
        message: `Max fee is ${maxCuratorFee}%`,
      })
      .refine((data) => !data || data !== curatorFees.fee);
  }, [maxCuratorFee]);

  const result = feeSchema.safeParse(fee);
  const error = !result.success && result.error.errors[0];

  //Clears tx state when moving between chains after updating a fee
  React.useEffect(() => {
    curatorFees.reset();
    setFee(undefined);
  }, [chainId, auctionType]);

  return (
    <div className={cn("gap-x-8", props.className)}>
      <div className="flex items-end justify-start gap-x-4">
        <Tooltip
          content={`Your current fee for the Batch Auction House on ${chain?.name}. It includes the following auction modules:\n${modules.join(
            ", ",
          )}.`}
        >
          <div className="flex-col items-start justify-start">
            <div className="flex items-end">
              <InfoLabel
                defaultValue={"" + curatorFees.fee}
                value={fee === undefined ? curatorFees.fee : fee}
                label={"Current Fee Percentage"}
                className="text-left"
                inputClassName="w-28 min-w-0 px-0 border border-surface-secondary"
                onChange={(e) => setFee(e.target.value)}
                maxLength={5}
                editable
                reverse
              />
              <Button
                size="sm"
                disabled={!!error}
                onClick={() => curatorFees.handleSetFee()}
              >
                Update Fee
              </Button>
            </div>
            {error && (
              <Text size="xs" className="text-feedback-alert text-left">
                {error.message}
              </Text>
            )}
          </div>
        </Tooltip>
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
