import { BatchAuction, PropsWithAuction } from "@repo/types";
import { Badge, Button, Card, Metric, Progress, Text } from "@repo/ui";
import { RequiresChain } from "components/requires-chain";
import { trimCurrency } from "utils/currency";
import { shorten } from "utils/number";
import { useAccount, useBalance } from "wagmi";
import { useDerivativeData } from "../hooks/use-derivative-data";
import { useVestingTokenId } from "../hooks/use-vesting-tokenid";
import { useVestingRedeemable } from "../hooks/use-vesting-redeemable";
import { useDerivativeModule } from "../hooks/use-derivative-module";

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

  const { data: vestingModuleAddress } = useDerivativeModule({
    lotId: auction.lotId,
    chainId: auction.chainId,
    auctionType: auction.auctionType,
  });

  const { data: vestingTokenId } = useVestingTokenId({
    linearVestingData,
    baseToken: auction.baseToken,
    derivativeModuleAddress: vestingModuleAddress,
  });

  const { data: redeemableAmount } = useVestingRedeemable({
    account: address,
    tokenId: vestingTokenId,
    chainId: auction.chainId,
    derivativeModuleAddress: vestingModuleAddress,
  });

  const { data: claimedAmount } = useBalance({
    address: auction.baseToken.address,
  });

  // TODO redeem button & dialog

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

  const vestingBadgeColour = vestingProgress >= 100 ? "active" : "blue";
  const vestingBadgeText = vestingProgress >= 100 ? "Fully Vested" : "Vesting";

  return (
    <div className="gap-y-md flex flex-col">
      <Card
        title="Claim"
        className="w-[496px]"
        headerRightElement={
          <Badge color={vestingBadgeColour}>{vestingBadgeText}</Badge>
        }
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
                {redeemableAmount
                  ? trimCurrency(Number(redeemableAmount))
                  : "-"}{" "}
                {auction.baseToken.symbol}
              </Metric>
            </div>
            <div>
              <Metric size="s" label="Claimed">
                {claimedAmount
                  ? trimCurrency(Number(claimedAmount.value))
                  : "-"}{" "}
                {auction.baseToken.symbol}
              </Metric>
            </div>
          </div>

          <RequiresChain chainId={auction.chainId}>
            <div>
              <Button
                size="lg"
                className="w-full"
                disabled={!redeemableAmount}
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
