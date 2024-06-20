import { useState } from "react";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { BatchAuction, PropsWithAuction } from "@repo/types";
import { Badge, Button, Card, formatDate, Metric, Progress } from "@repo/ui";
import { RequiresChain } from "components/requires-chain";
import { trimCurrency } from "utils/currency";
import { useVestingTokenId } from "modules/auction/hooks/use-vesting-tokenid";
import { useVestingRedeemable } from "modules/auction/hooks/use-vesting-redeemable";
import { useDerivativeModule } from "modules/auction/hooks/use-derivative-module";

import { ClaimVestingDervivativeTxn } from "./claim-vesting-derivative-txn";
import { RedeemVestedTokensTxn } from "./redeem-vested-tokens-txn";
import { BidOutcome } from "../bid-outcome";

const calculateVestingProgress = (start?: number, end?: number): number => {
  if (!start || !end) return 0;

  // Return the percentage of time elapsed between the start and end, expressed as 0-100
  const now = Date.now() / 1000;
  const elapsed = now - start;
  const total = end - start;

  return Math.min(100, (elapsed / total) * 100);
};

const calculateVestingTerm = (start?: number, end?: number): string => {
  if (!start || !end) return "0";

  const termDays = (end - start) / 60 / 60 / 24;

  // If less than a day, return hours
  if (termDays < 1) return `${Math.floor(termDays * 24)}H`;

  // If less than a month, return days
  if (termDays < 31) return `${Math.floor(termDays)}D`;

  // Return months
  return `${Math.floor(termDays / 30)}M`;
};

export function VestingClaimCard({ auction: _auction }: PropsWithAuction) {
  const auction = _auction as BatchAuction;
  const { address } = useAccount();
  const [isTxnDialogOpen, setIsTxnDialogOpen] = useState(false);

  const { data: vestingModuleAddress } = useDerivativeModule({
    lotId: auction.lotId,
    chainId: auction.chainId,
    auctionType: auction.auctionType,
  });

  const { data: vestingTokenId } = useVestingTokenId({
    linearVestingStartTimestamp: Number(auction?.linearVesting?.startTimestamp),
    linearVestingExpiryTimestamp: Number(
      auction?.linearVesting?.expiryTimestamp,
    ),
    baseToken: auction.baseToken,
    derivativeModuleAddress: vestingModuleAddress,
  });

  /**
   * Gotcha: redeemableAmount will be `undefined` until the user has claimed their derivative ERC6909 token
   */
  const { data: redeemableAmount, refetch: refetchRedeemable } =
    useVestingRedeemable({
      account: address,
      tokenId: vestingTokenId,
      chainId: auction.chainId,
      derivativeModuleAddress: vestingModuleAddress,
    });

  const redeemedAmount =
    auction.linearVesting?.redemptions
      .filter(
        (redemption) =>
          redemption.bidder.toLowerCase() === address?.toLowerCase(),
      )
      .reduce((acc, redemption) => acc + Number(redemption.redeemed), 0) ?? 0;

  const userBids = auction.bids.filter(
    (bid) => bid.bidder.toLowerCase() === address?.toLowerCase(),
  );

  const userHasClaimedVestingDerivative = userBids.every(
    (bid) => bid.status === "claimed" || bid.status === "refunded",
  );

  const userTotalSuccessfulBidAmount = userBids.reduce(
    (acc, bid) => acc + Number(bid.settledAmountIn ?? 0),
    0,
  );

  const hasVestingPeriodStarted =
    Date.now() / 1000 > Number(auction?.linearVesting?.startTimestamp);

  const userHasUnvestedTokens = redeemedAmount < userTotalSuccessfulBidAmount;

  const vestingProgress = calculateVestingProgress(
    Number(auction?.linearVesting?.startTimestamp),
    Number(auction?.linearVesting?.expiryTimestamp),
  );

  const vestingTerm = calculateVestingTerm(
    Number(auction?.linearVesting?.startTimestamp),
    Number(auction?.linearVesting?.expiryTimestamp),
  );

  const redeemableAmountDecimal = Number(
    formatUnits(redeemableAmount || BigInt(0), auction.baseToken.decimals),
  );

  const userTotalTokensWon = auction.bids
    .filter((bid) => bid.bidder.toLowerCase() === address?.toLowerCase())
    .reduce((acc, bid) => acc + Number(bid.settledAmountOut ?? 0), 0);

  // LinearVesting smart contract doesn't allow you to see how much you can
  // redeem until after you've claimed the derivative ERC6909.
  // We can calculate it on the frontend proactively for improved UX.
  // i.e. don't show 0 when they have vested tokens > 0.
  const derivedRedeemableAmount =
    redeemableAmountDecimal ||
    (hasVestingPeriodStarted
      ? (vestingProgress / 100) * userTotalTokensWon
      : 0);

  const vestingBadgeColour =
    vestingProgress >= 100 ? "active" : vestingProgress < 0 ? "ghost" : "blue";

  const vestingBadgeText =
    vestingProgress >= 100
      ? "Fully Vested"
      : vestingProgress < 0
        ? "Upcoming"
        : "Vesting";

  return (
    <div className="gap-y-md flex flex-col">
      <Card
        title={`${
          !hasVestingPeriodStarted && !userHasClaimedVestingDerivative
            ? "Claim"
            : "Redeem"
        }`}
        className="w-[496px]"
        headerRightElement={
          <Badge color={vestingBadgeColour}>{vestingBadgeText}</Badge>
        }
      >
        <div className="gap-y-md flex flex-col">
          <div className="grid grid-cols-2 gap-4">
            <Metric size="s" label="Vesting Begins">
              {auction.linearVesting?.startDate &&
                formatDate.fullLocal(new Date(auction.linearVesting.startDate))}
            </Metric>
            <Metric size="s" label="Vesting Ends">
              {auction.linearVesting?.startDate &&
                formatDate.fullLocal(
                  new Date(auction.linearVesting.expiryDate),
                )}
            </Metric>
          </div>

          <BidOutcome auction={auction} />

          <div>
            <Metric size="s" label="Vesting Progress">
              <Progress value={vestingProgress} className="mt-1">
                {/* TODO left-align this */}
                <Metric size="s" label="Term">
                  {vestingTerm}
                </Metric>
              </Progress>
            </Metric>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <Metric label="Redeemable">
                {trimCurrency(derivedRedeemableAmount)}{" "}
                {auction.baseToken.symbol}
              </Metric>
            </div>
            <div>
              <Metric label="Redeemed">
                {trimCurrency(Number(redeemedAmount))}{" "}
                {auction.baseToken.symbol}
              </Metric>
            </div>
          </div>

          <RequiresChain chainId={auction.chainId}>
            <Button
              className="w-full"
              disabled={!userHasUnvestedTokens}
              onClick={() => setIsTxnDialogOpen(true)}
            >
              {
                // Allow user to eagerly claim the vesting derivative, if the vesting period hasn't started yet
                !hasVestingPeriodStarted &&
                  !userHasClaimedVestingDerivative && (
                    <>Claim vesting {auction.baseToken.symbol}</>
                  )
              }
              {
                // Otherwise, if the vesting period has started, just show "redeem" option
                // which triggers either: one txn to redeem, or, two txns to claim and redeem
                hasVestingPeriodStarted && userHasUnvestedTokens && (
                  <>Redeem {auction.baseToken.symbol}</>
                )
              }
              {!hasVestingPeriodStarted && userHasClaimedVestingDerivative && (
                <>Vesting hasn&apos;t started yet</>
              )}
              {!userHasUnvestedTokens && (
                <>You&apos;ve redeemed all your tokens</>
              )}
            </Button>
          </RequiresChain>

          {!userHasClaimedVestingDerivative && isTxnDialogOpen && (
            <ClaimVestingDervivativeTxn
              auction={auction}
              onClose={() => setIsTxnDialogOpen(false)}
            />
          )}
          {userHasClaimedVestingDerivative && isTxnDialogOpen && (
            <RedeemVestedTokensTxn
              auction={auction}
              onClose={() => setIsTxnDialogOpen(false)}
              onSuccess={() => refetchRedeemable()}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
