import { chains } from "@axis-finance/env";
import { AuctionType } from "@axis-finance/types";
import { Card, Select } from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import { CuratableAuctionList } from "modules/auction/curatable-auction-list";
import { CuratorFeeManager } from "modules/auction/curator-fee-manager";
import { auctionMetadata } from "modules/auction/metadata";
import React from "react";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { CuratorCard } from "./curator-list-page";
import { getCurator } from "modules/app/curators";

const auctionModuleOptions = Object.values(auctionMetadata);
const auctionModules = Object.keys(auctionMetadata) as AuctionType[];
import { environment } from "utils/environment";

const activeChains = chains.activeChains(environment.isTestnet);

export function CuratorPage() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [type, setType] = React.useState<AuctionType>(
    auctionModuleOptions[0].value,
  );

  const curator = getCurator(address ?? "");

  const options = activeChains.map((c) => ({
    label: c.name,
    imgURL: c.iconUrl as string,
    value: c.id.toString(),
  }));

  return (
    <PageContainer id="__AXIS_CURATOR_PAGE__" containerClassName="mt-8">
      {curator && (
        <div className="px-4">
          <CuratorCard curator={curator} />
        </div>
      )}
      <div className="flex gap-x-4 px-4">
        <Card
          className="w-1/4"
          tooltip="Click the Current Fee field below to update your fee."
          title="Curator Fees"
        >
          <Select
            triggerClassName="mt-4"
            defaultValue={chainId.toString()}
            onChange={(v) => switchChain({ chainId: Number(v) })}
            options={options}
          />
          <Select
            triggerClassName="mt-4"
            defaultValue={auctionModuleOptions[0].value}
            onChange={(value: string) => setType(value as AuctionType)}
            options={auctionModuleOptions}
          />

          <CuratorFeeManager
            className="mt-4"
            modules={auctionModules}
            auctionType={type}
          />
        </Card>
        <Card title="Launches" className="w-3/4 grow">
          <CuratableAuctionList />
        </Card>
      </div>
      <div></div>
    </PageContainer>
  );
}
