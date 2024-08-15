import { activeChains } from "@repo/env/src/chains";
import { AuctionType } from "@repo/types";
import { Card, CardTitle, Select, Tooltip } from "@repo/ui";
import { InfoIcon } from "lucide-react";
import { PageContainer } from "modules/app/page-container";
import { CuratableAuctionList } from "modules/auction/curatable-auction-list";
import { CuratorFeeManager } from "modules/auction/curator-fee-manager";
import { auctionMetadata } from "modules/auction/metadata";
import React from "react";
import { useChainId, useSwitchChain } from "wagmi";

const auctionModuleOptions = Object.values(auctionMetadata);
const auctionModules = Object.keys(auctionMetadata) as AuctionType[];

export function CuratorPage() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [type, setType] = React.useState<AuctionType>(
    auctionModuleOptions[0].value,
  );

  const options = activeChains.map((c) => ({
    label: c.name,
    imgURL: c.iconUrl as string,
    value: c.id.toString(),
  }));

  return (
    <PageContainer containerClassName="mt-12">
      <div className="flex gap-x-4 px-4">
        <Card
          className="w-1/4"
          title={
            <div className="gap-x-4">
              <Tooltip content="Click percentage field below to edit your fee and the checkmark to submit the transaction.">
                <CardTitle className="flex items-center gap-x-2">
                  Curator Fees <InfoIcon className="size-4" />
                </CardTitle>
              </Tooltip>
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
            </div>
          }
        >
          <div className="flex">
            <CuratorFeeManager modules={auctionModules} auctionType={type} />
          </div>
        </Card>
        <Card title="Launches" className="w-3/4 grow">
          <CuratableAuctionList />
        </Card>
      </div>
      <div></div>
    </PageContainer>
  );
}
