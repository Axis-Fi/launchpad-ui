import { Badge, Card, Text } from "@repo/ui";
import type { BatchAuction, PropsWithAuction } from "@repo/types";
import { RequiresChain } from "components/requires-chain";

export function NotConnectedClaimCard({ auction: _auction }: PropsWithAuction) {
  const auction = _auction as BatchAuction;

  return (
    <Card
      title="Claim"
      className="w-[496px]"
      headerRightElement={<Badge>Auction Closed</Badge>}
    >
      <div className="flex flex-col gap-y-4">
        <div className="auction-ended-gradient w-fill flex h-[464px] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <img
              className="w-[92.351]px h-[80px]"
              src="/images/axis-logo.svg"
              alt="Axis Logo"
            />
            <Text size="xl">Auction has ended</Text>
            <Text>Claim your tokens</Text>
          </div>
        </div>
        <RequiresChain className="w-full max-w-lg" chainId={auction.chainId} />
      </div>
    </Card>
  );
}
