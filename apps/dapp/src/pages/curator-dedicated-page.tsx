import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useReadContract } from "wagmi";
import { verifiedFetch } from "@helia/verified-fetch";
import { allowedCurators } from "modules/app/curators";
import { baseSepolia } from "viem/chains";
import { Address } from "viem";
import { metadataRegistryAbi } from "modules/auction/hooks/axis-metadata-registry";
import type { CuratorProfile } from "@repo/ipfs-api/src/types";
import type { Curator } from "@axis-finance/types";
import CuratorLaunchPage from "./curator-launch-page";

const registryContractAddress = "0x75da61536510ba0bca0c9af21311a1fc035dcf4e";

export function CuratorDedicatedPage() {
  const params = useParams();

  const [curator, setCurator] = useState<CuratorProfile | undefined>();
  const [staticCurator, setStaticCurator] = useState<Curator | undefined>();

  const curatorIpfsCid = useReadContract({
    chainId: baseSepolia.id,
    abi: metadataRegistryAbi,
    address: registryContractAddress,
    functionName: "curatorMetadata",
    args: [
      BigInt(
        Number.isInteger(Number(params.curatorId))
          ? Number(params.curatorId)
          : 0,
      ),
    ],
    query: {
      enabled: Number.isInteger(Number(params.curatorId)),
    },
  });

  useEffect(() => {
    async function resolveCurator() {
      if (curator != null || curatorIpfsCid.isLoading) return;

      if (curatorIpfsCid.data != null) {
        const ipfsCuratorRequest = await verifiedFetch(
          `ipfs://${curatorIpfsCid.data}`,
        );

        const ipfsCurator = (await ipfsCuratorRequest.json()) as CuratorProfile;
        return setCurator(ipfsCurator);
      }

      const fromStatic = allowedCurators.find((c) => c.id === params.curatorId);
      setStaticCurator(fromStatic);
    }

    resolveCurator();
  }, [curator, curatorIpfsCid, params.curatorId]);

  if (curatorIpfsCid.isLoading) {
    return <div>Loading...</div>;
  }

  if (!curator && !staticCurator) {
    return <div>CuratorProfile not found.</div>;
  }

  return (
    <CuratorLaunchPage
      curator={
        staticCurator || {
          id: curator!.id,
          name: curator!.name,
          type: "curator",
          address: curator!.address as Address,
          twitter: curator!.twitter,
          website: curator!.links.website,
          avatar: curator!.links.avatar,
          banner: curator!.links.banner,
          description: curator!.description,
          reportURL: "todo",
          options: curator!.options,
        }
      }
    />
  );
}
