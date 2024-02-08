import { getBuiltGraphSDK } from "@repo/subgraph-client";
import { useQuery } from "@tanstack/react-query";

const subgraph = getBuiltGraphSDK();

export default function useAuctions() {
  const { data, ...query } = useQuery({
    queryKey: ["auctions"],
    queryFn: () => subgraph.GetAuctions(),
  });

  const auctions = data?.auctionCreateds ?? [];

  return {
    ...query,
    data: auctions,
    getAuction: (chainId?: number | string, id?: number | string) =>
      auctions.find((a) => a.id === id),
  };
}

// TODO this can probably be removed
