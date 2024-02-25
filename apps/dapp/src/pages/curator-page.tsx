import { Card } from "@repo/ui";
import { PageContainer } from "modules/app/page-container";
import { CuratableAuctionList } from "modules/auction/curatable-auction-list";
import { CuratorFeeManager } from "modules/auction/curator-fee-manager";

export function CuratorPage() {
  return (
    <PageContainer title="Curator">
      <div className="flex ">
        <Card title="Fees">
          <CuratorFeeManager />
        </Card>
        <Card title="Auctions" className="grow">
          <CuratableAuctionList />
        </Card>
      </div>
    </PageContainer>
  );
}
