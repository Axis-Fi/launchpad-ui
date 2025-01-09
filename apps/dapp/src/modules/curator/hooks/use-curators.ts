import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { curatorRegistryDeployment } from "../deployment";
import { verifiedFetch } from "utils/verified-fetch";
import type { CuratorProfile } from "@repo/ipfs-api/src/types";

const curatorRegisteredEvent = parseAbiItem(
  "event CuratorRegistered(address curator, uint256 xId, string ipfsCID)",
);

const curatorUpdatedEvent = parseAbiItem(
  "event CuratorUpdated(uint256 xId, string ipfsCID)",
);

type UseCuratorEventsReturn = UseQueryResult<CuratorProfile[]> | null;

const useCurators = (): UseCuratorEventsReturn => {
  const publicClient = usePublicClient();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["curators"],
    enabled: publicClient != null,
    queryFn: async () => {
      const [registrations, updates] = await Promise.all([
        publicClient!.getLogs({
          address: curatorRegistryDeployment.address,
          event: curatorRegisteredEvent,
          fromBlock: curatorRegistryDeployment.blockNumber,
          toBlock: "latest",
        }),
        publicClient!.getLogs({
          address: curatorRegistryDeployment.address,
          event: curatorUpdatedEvent,
          fromBlock: curatorRegistryDeployment.blockNumber,
          toBlock: "latest",
        }),
      ]);

      const latestProfileCid = new Map<bigint, string>();

      registrations.forEach((event) => {
        latestProfileCid.set(event.args.xId!, event.args.ipfsCID!);
      });

      // Handle any profile updates
      updates.forEach((event) => {
        latestProfileCid.set(event.args.xId!, event.args.ipfsCID!);
      });

      const profileCids = Array.from(latestProfileCid.entries())
        .map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, ipfsCID]) => ipfsCID,
        )
        .reverse(); // Order latest to oldest

      const ipfsQueries = profileCids.map((cid) =>
        verifiedFetch(`ipfs://${cid}`).then((r) => r.json()),
      );

      return Promise.all(ipfsQueries);
    },
    refetchInterval: 300000, // refetch every 5 mins
  });
};

export { useCurators };
