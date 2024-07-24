import { activeChains } from "@repo/env/src/chains";
import { AuctionType } from "@repo/types";
import { Card, CardTitle, Select, Tooltip } from "@repo/ui";
import { InfoIcon } from "lucide-react";
import { PageContainer } from "modules/app/page-container";
import { CuratableAuctionList } from "modules/auction/curatable-auction-list";
import { CuratorFeeManager } from "modules/auction/curator-fee-manager";
import { useChainId, useSwitchChain } from "wagmi";

export function CuratorPage() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const options = activeChains.map((c) => ({
    label: c.name,
    imgURL: c.iconUrl as string,
    value: c.id.toString(),
  }));

  return (
    <PageContainer title="Curator">
      <div className="flex gap-x-4 px-4">
        <Card
          title={
            <div className="gap-x-4">
              <Tooltip content="Click percentage field below to edit your fee and the checkmark to submit the transaction.">
                <CardTitle className="flex items-center gap-x-2">
                  Fees <InfoIcon className="size-4" />
                </CardTitle>
              </Tooltip>
              <Select
                triggerClassName="mt-4"
                defaultValue={chainId.toString()}
                onChange={(v) => switchChain({ chainId: Number(v) })}
                options={options}
              />
            </div>
          }
        >
          <div className="flex">
            <CuratorFeeManager
              modules={[AuctionType.FIXED_PRICE_BATCH, AuctionType.SEALED_BID]}
              auctionType={AuctionType.FIXED_PRICE_BATCH}
            />
          </div>
        </Card>
        <Card title="Auctions" className="grow">
          <CuratableAuctionList />
        </Card>
      </div>
      <div></div>
    </PageContainer>
  );
}
