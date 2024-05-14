import { useAuctions } from "modules/auction/hooks/use-auctions";
import { useAccount } from "wagmi";

/** Utility to read Curator data for the connected address*/
export function useCurator() {
  const { address, isConnected } = useAccount();
  const { data } = useAuctions();

  const auctionsCuratedByUser = data.filter(
    (a) => a.curator?.toLocaleLowerCase() === address?.toLocaleLowerCase(),
  );

  const pendingCurations = auctionsCuratedByUser.filter(
    (a) =>
      !a.curatorApproved &&
      ["live", "created"].includes(a.status.toLocaleLowerCase()),
  );

  return {
    isCurator: isConnected && !!auctionsCuratedByUser.length,
    hasPendingCurations: !!pendingCurations.length,
    pendingCurationsCount: pendingCurations.length,
  };
}
