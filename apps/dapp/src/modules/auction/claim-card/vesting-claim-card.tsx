import { BatchAuction, PropsWithAuction } from "@repo/types";
import { Badge, Button, Card, Metric, Progress, Text } from "@repo/ui";
import { RequiresChain } from "components/requires-chain";
import { trimCurrency } from "utils/currency";
import { shorten } from "utils/number";
import { useAccount } from "wagmi";
import { useDerivativeData } from "../hooks/use-derivative-data";

const calculateVestingProgress = (start?: number, end?: number): number => {
  if (!start || !end) return 0;

  // Return the percentage of time elapsed between the start and end, expressed as 0-100
  const now = Date.now();
  const elapsed = now - start;
  const total = end - start;

  return Math.min(100, (elapsed / total) * 100);
};

export function VestingClaimCard({ auction: _auction }: PropsWithAuction) {
  const auction = _auction as BatchAuction;
  const { address } = useAccount();
  // const [setTxnDialogOpen] = useState(false);

  const { data: linearVestingData } = useDerivativeData({
    chainId: auction.chainId,
    lotId: auction.lotId,
    auctionType: auction.auctionType,
  });

  // If the auction does not have vesting enabled, return early
  if (!auction.linearVesting) {
    return (
      <Card title="Claim" className="w-[496px]">
        <Text size="sm">No vesting enabled for this auction</Text>
      </Card>
    );
  }

  const userBids = auction.bids.filter(
    (bid) => bid.bidder.toLowerCase() === address?.toLowerCase(),
  );
  const userTotalSuccessfulBidAmount = userBids.reduce(
    (acc, bid) => acc + Number(bid.settledAmountIn ?? 0),
    0,
  );
  const userTotalTokensObtained = userBids.reduce(
    (acc, bid) => acc + Number(bid.settledAmountOut ?? 0),
    0,
  );

  const vestingProgress = calculateVestingProgress(
    linearVestingData?.start,
    linearVestingData?.expiry,
  );

  const claimedAmount = 2500;
  const claimableAmount = 10000;

  return (
    <div className="gap-y-md flex flex-col">
      <Card
        title="Claim"
        className="w-[496px]"
        headerRightElement={<Badge color="blue">Vesting</Badge>}
      >
        <div className="gap-y-md flex flex-col">
          <div>
            <Metric size="s" label="Ended At">
              {auction.formatted?.endFormatted}
            </Metric>
          </div>
          <div className="bg-surface-tertiary p-sm rounded">
            <Metric size="l" label="You Bid">
              {shorten(userTotalSuccessfulBidAmount)}{" "}
              {auction.quoteToken.symbol}
            </Metric>
          </div>

          <div className="bg-surface-tertiary p-sm rounded">
            <Metric size="l" label="You Get">
              {shorten(userTotalTokensObtained)} {auction.baseToken.symbol}
            </Metric>
          </div>

          <div>
            <Text size="xs">Vesting Progress</Text>
            <Progress value={vestingProgress} className="mt-1">
              {/* TODO left-align this */}
              <Metric size="s" label="Term">
                6M
              </Metric>
            </Progress>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="">
              {/* TODO spacing between label and content */}
              <Metric size="s" label="Claimable">
                {trimCurrency(claimableAmount)} {auction.baseToken.symbol}
              </Metric>
            </div>
            <div>
              <Metric size="s" label="Claimed">
                {trimCurrency(claimedAmount)} {auction.baseToken.symbol}
              </Metric>
            </div>
          </div>

          <RequiresChain chainId={auction.chainId}>
            <div>
              <Button
                size="lg"
                className="w-full"
                disabled={!claimableAmount}
                // onClick={() => setTxnDialogOpen(true)}
              >
                Claim {auction.baseToken.symbol}
              </Button>
            </div>
          </RequiresChain>
        </div>
      </Card>
    </div>
  );
}
