import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { parseAbiItem } from "viem";
import { usePublicClient } from "wagmi";
import type { CuratorProfile } from "modules/app/ipfs-api";
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

type CuratorRegisteredOrUpdatedEvent = {
  args: { xId?: bigint; ipfsCID?: string };
};

type UseCuratorEventsReturn = UseQueryResult<CuratorProfile[]> | null;

const useCurators = (): UseCuratorEventsReturn => {
  const publicClient = usePublicClient({
    chainId: curatorRegistryDeployment.chainId,
  });
  const shouldRestrictCurators = environment.isProduction;

  const { data: axisFollowing } = useAxisFollowing(shouldRestrictCurators);

  return useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ["curators"],
    enabled:
      (publicClient != null && axisFollowing != null) ||
      (publicClient != null && !shouldRestrictCurators),
    queryFn: async () => {
      const curatorEvents = await publicClient!.getLogs({
        address: curatorRegistryDeployment.address,
        events: [curatorRegisteredEvent, curatorUpdatedEvent],
        fromBlock: curatorRegistryDeployment.blockNumber,
        toBlock: "latest",
      });

      const latestIpfsProfileCid = new Map<string, string>(); // <xId, ipfsCid>

      curatorEvents.forEach((event: CuratorRegisteredOrUpdatedEvent) => {
        const xId = event.args.xId!.toString();
        if (shouldRestrictCurators && !axisFollowing!.includes(xId)) return;

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
