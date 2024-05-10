import { useSdk } from "@repo/sdk/react";
import type { PropsWithAuction } from "@repo/types";
import { UsdToggle } from "@repo/ui";

export const SettledAuctionChartOverlay = ({ auction }: PropsWithAuction) => {
  const sdk = useSdk();
  const isTokenAlreadyUsd = sdk.isUsdToken(auction.quoteToken.symbol);

  if (isTokenAlreadyUsd) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        zIndex: 1,
      }}
    >
      <div className="mr-8 mt-4 flex justify-end">
        <UsdToggle currencySymbol={auction.quoteToken.symbol} />
      </div>
    </div>
  );
};
