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
import { useState } from "react";
import { useVestingRedeem } from "../hooks/use-vesting-redeem";
import { TransactionDialog } from "modules/transaction/transaction-dialog";

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

  const termDays = Math.floor((end - start) / 60 / 60 / 24);

  // If less than a month, return days
  if (termDays < 30) return `${termDays}D`;

  // Return months
  return `${Math.floor(termDays / 30)}M`;
};

export function VestingClaimCard({ auction: _auction }: PropsWithAuction) {
  const auction = _auction as BatchAuction;
  const { address } = useAccount();
  const [isTxnDialogOpen, setTxnDialogOpen] = useState(false);

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
    address: address,
    token: auction.baseToken.address,
    chainId: auction.chainId,
  });

  const claimVestedTokensTx = useVestingRedeem({
    vestingTokenId: vestingTokenId,
    chainId: auction.chainId,
    derivativeModuleAddress: vestingModuleAddress,
  });
  const isTxWaiting =
    claimVestedTokensTx.redeemTx.isPending ||
    claimVestedTokensTx.redeemReceipt.isLoading;

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
  const vestingTerm = calculateVestingTerm(
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
                onClick={() => setTxnDialogOpen(true)}
              >
                Claim {auction.baseToken.symbol}
              </Button>
            </div>
          </RequiresChain>

          <TransactionDialog
            open={isTxnDialogOpen}
            signatureMutation={claimVestedTokensTx.redeemTx}
            error={
              claimVestedTokensTx.redeemCall.error ||
              claimVestedTokensTx.redeemTx.error
            } // Catch both simulation and execution errors
            onConfirm={claimVestedTokensTx.handleRedeem}
            mutation={claimVestedTokensTx.redeemReceipt}
            chainId={auction.chainId}
            onOpenChange={(open: boolean) => {
              if (!open) {
                claimVestedTokensTx.redeemTx.reset();
              }
              setTxnDialogOpen(open);
            }}
            hash={claimVestedTokensTx.redeemTx.data}
            disabled={isTxWaiting}
            screens={{
              idle: {
                Component: () => (
                  <div className="text-center">
                    You&apos;re about to claim all of the redeemable vesting
                    tokens from this auction.
                  </div>
                ),
                title: `Confirm Claim ${auction.baseToken.symbol}`,
              },
              success: {
                Component: () => (
                  <div className="flex justify-center text-center">
                    <p>Vesting tokens claimed successfully!</p>
                  </div>
                ),
                title: "Transaction Confirmed",
              },
            }}
          />
        </div>
      </Card>
    </div>
  );
}
