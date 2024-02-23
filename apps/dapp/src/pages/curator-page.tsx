import { PageContainer } from "modules/app/page-container";
import { CuratableAuctionList } from "modules/auction/curatable-auction-list";

export function CuratorPage() {
  return (
    <PageContainer title="Curator">
      <CuratableAuctionList />
    </PageContainer>
  );
}
