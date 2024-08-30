import { PageContainer } from "modules/app/page-container";
import { Points } from "modules/points/points";

export function PointsPage() {
  const isWalletConnected = true;

  if (!isWalletConnected) {
    return <div>Connect your wallet to continue</div>;
  }

  return (
    <PageContainer title="Origin Points">
      <Points />
    </PageContainer>
  );
}
