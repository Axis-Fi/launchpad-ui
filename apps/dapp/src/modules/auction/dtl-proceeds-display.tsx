import { PropsWithAuction } from "@repo/types";
import { useBaseDTLCallback } from "./hooks/use-base-dtl-callback";

export function DtlProceedsDisplay({ auction }: PropsWithAuction) {
  const { data: dtlCallbackConfiguration } = useBaseDTLCallback({
    chainId: auction.chainId,
    lotId: auction.lotId,
    baseTokenDecimals: auction.baseToken.decimals,
    callback: auction.callbacks,
  });
  const utilizationAmount =
    dtlCallbackConfiguration?.proceedsUtilisationPercent ?? 0;

  return `${utilizationAmount * 100}%`;
}
