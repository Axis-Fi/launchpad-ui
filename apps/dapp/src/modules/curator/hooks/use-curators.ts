import { UseQueryResult, useQuery } from "@tanstack/react-query";
import type { CuratorProfile } from "@repo/ipfs-api/src/types";
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import { environment } from "utils/environment";
import { verifiedFetch } from "utils/verified-fetch";
import { useAxisFollowing } from "./use-axis-following";
import { curatorRegistryDeployment } from "../deployment";

const curatorRegisteredEvent = parseAbiItem(
  "event CuratorRegistered(address curator, uint256 xId, string ipfsCID)",
);

const curatorUpdatedEvent = parseAbiItem(
  "event CuratorUpdated(uint256 xId, string ipfsCID)",
);

type UseCuratorEventsReturn = UseQueryResult<CuratorProfile[]> | null;

const useCurators = (): UseCuratorEventsReturn => {
  const publicClient = usePublicClient();
  const { data: axisFollowing } = useAxisFollowing();

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["curators"],
    enabled: publicClient != null && axisFollowing != null,
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

      const latestIpfsProfileCid = new Map<string, string>(); // <xId, ipfsCid>

      registrations.forEach((event) => {
        const xId = event.args.xId!.toString();
        if (environment.isProduction && !axisFollowing!.includes(xId)) return;

        latestIpfsProfileCid.set(xId, event.args.ipfsCID!);
      });

      // Handle any profile updates
      updates.forEach((event) => {
        const xId = event.args.xId!.toString();
        if (environment.isProduction && !axisFollowing!.includes(xId)) return;

        latestIpfsProfileCid.set(xId, event.args.ipfsCID!);
      });

      const profileCids = Array.from(latestIpfsProfileCid.entries())
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
  });
};

export { useCurators };
