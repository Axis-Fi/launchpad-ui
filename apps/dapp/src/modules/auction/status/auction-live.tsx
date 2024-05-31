import { Button, Card, Text } from "@repo/ui";
import { formatUnits } from "viem";
import { AuctionBidInput } from "../auction-bid-input";
import { Auction, AuctionType, PropsWithAuction } from "@repo/types";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { LockIcon } from "lucide-react";
import { trimCurrency } from "utils";
import { useBidAuction } from "../hooks/use-bid-auction";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RequiresChain } from "components/requires-chain";
import React from "react";
import { AuctionMetricsContainer } from "../auction-metrics-container";
import { AuctionLaunchMetrics } from "../auction-launch-metrics";
import { AuctionMetric } from "../auction-metric";
import { ProjectInfoCard } from "../project-info-card";

const schema = z.object({
  baseTokenAmount: z.string(),
  quoteTokenAmount: z.string(),
});

export type BidForm = z.infer<typeof schema>;

export function AuctionLive({ auction }: PropsWithAuction) {
  const [open, setOpen] = React.useState(false);
  const isFixedPrice =
    auction.auctionType === AuctionType.FIXED_PRICE ||
    auction.auctionType === AuctionType.FIXED_PRICE_BATCH;
  const isFixedPriceBatch =
    auction.auctionType === AuctionType.FIXED_PRICE_BATCH;

  const form = useForm<BidForm>({
    mode: "onTouched",
    resolver: zodResolver(
      schema
        .refine(
          (data) =>
            isFixedPrice ||
            Number(data.quoteTokenAmount) >=
              Number(auction.formatted?.minBidSize),
          {
            message: `Minimum bid is ${auction.formatted?.minBidSize}`,
            path: ["quoteTokenAmount"],
          },
        )
        .refine(
          (data) =>
            isFixedPrice ||
            Number(data.quoteTokenAmount) / Number(data.baseTokenAmount) >=
              Number(auction.formatted?.minPrice),
          {
            message: `Min rate is ${auction.formatted?.minPrice} ${auction.quoteToken.symbol}/${auction.baseToken.symbol}`,
            path: ["baseTokenAmount"],
          },
        )
        .refine(
          (data) =>
            !isFixedPrice ||
            isFixedPriceBatch ||
            Number(data.quoteTokenAmount) <=
              Number(auction.formatted?.maxAmount),
          {
            message: `Max amount is ${trimCurrency(
              auction.formatted?.maxAmount ?? 0,
            )}`,
            path: ["quoteTokenAmount"],
          },
        )
        .refine(
          (data) => Number(data.quoteTokenAmount) <= Number(formattedBalance),
          {
            message: `Insufficient balance`,
            path: ["quoteTokenAmount"],
          },
        )
        .refine(
          (data) => Number(data.baseTokenAmount) <= Number(auction.capacity),
          {
            message: "Amount out exceeds capacity",
            path: ["baseTokenAmount"],
          },
        ),
    ),
  });

  const [amountIn, minAmountOut] = form.watch([
    "quoteTokenAmount",
    "baseTokenAmount",
  ]);

  const parsedAmountIn = Number(amountIn);
  const parsedMinAmountOut = Number(minAmountOut);

  const { balance, ...bid } = useBidAuction(
    auction.id,
    auction.auctionType,
    parsedAmountIn,
    parsedMinAmountOut,
  );

  const formattedBalance = formatUnits(
    balance.data?.value ?? 0n,
    balance.data?.decimals ?? 0,
  );

  // TODO Permit2 signature
  const handleSubmit = () => {
    bid.isSufficientAllowance ? bid.handleBid() : bid.approveCapacity();
  };

  const isValidInput = form.formState.isValid;

  const shouldDisable =
    !isValidInput ||
    bid.approveReceipt.isLoading ||
    bid.bidReceipt.isLoading ||
    bid.bidTx.isPending;

  const isWaiting =
    bid.approveReceipt.isLoading ||
    bid.bidReceipt.isLoading ||
    bid.bidTx.isPending ||
    bid.bidDependenciesMutation.isPending;

  const isSigningApproval = bid.allowanceUtils.approveTx.isPending;
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;
  const actionKeyword = isEMP ? "Bid" : "Purchase";

  const amountInInvalid =
    (isFixedPrice && parsedAmountIn > Number(auction.formatted?.maxAmount)) || // greater than max amount on fixed price sale
    parsedAmountIn > Number(formattedBalance) || // greater than balance
    parsedAmountIn === undefined ||
    parsedAmountIn === 0; // zero or empty

  const amountOutInvalid =
    minAmountOut === undefined ||
    parsedMinAmountOut === 0 || // zero or empty
    parsedMinAmountOut > Number(auction.capacity) || // exceeds capacity
    (isEMP &&
      parsedAmountIn / parsedMinAmountOut <
        Number(auction.formatted?.minPrice)); // less than min price

  // TODO display "waiting" in modal when the tx is waiting to be signed by the user
  return (
    <div className="flex justify-between gap-x-8">
      <div className="w-2/3 space-y-4">
        <AuctionLaunchMetrics auction={auction} />

        <Card title="Token Info">
          <AuctionMetricsContainer className="mt-4" auction={auction}>
            <AuctionMetric id="minPriceFDV" />
            <AuctionMetric id="totalSupply" />
            <AuctionMetric id="vestingDuration" />
            <AuctionMetric id="auctionedSupply" />
          </AuctionMetricsContainer>
        </Card>
        <ProjectInfoCard auction={auction} />
      </div>

      <div className="w-1/3">
        <FormProvider {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <Card
              title={
                isFixedPrice
                  ? `Buy ${auction.baseToken.symbol}`
                  : `Place your bid`
              }
            >
              <AuctionBidInput
                singleInput={isFixedPrice}
                balance={trimCurrency(formattedBalance)}
                auction={auction}
              />
              <div className="mx-auto mt-4 w-full">
                {isEMP && (
                  <Text size="sm">
                    You’re bidding on a blind auction. Auctions can only be
                    decrypted after conclusion. Save your bid after bidding.
                    <a className="text-primary ml-1 uppercase">Learn More</a>
                  </Text>
                )}
              </div>

              <RequiresChain chainId={auction.chainId} className="mt-4">
                <div className="mt-4 w-full">
                  <Button
                    className="w-full"
                    disabled={
                      isWaiting ||
                      isSigningApproval ||
                      amountInInvalid ||
                      amountOutInvalid
                    }
                    onClick={() =>
                      bid.isSufficientAllowance
                        ? setOpen(true)
                        : bid.approveCapacity()
                    }
                  >
                    {/*TODO: simplify*/}
                    {bid.isSufficientAllowance ? (
                      actionKeyword.toUpperCase()
                    ) : isWaiting ? (
                      <div className="flex">
                        Waiting for confirmation...
                        <div className="w-1/2"></div>
                        <LoadingIndicator />
                      </div>
                    ) : (
                      "APPROVE"
                    )}
                  </Button>
                </div>
              </RequiresChain>
            </Card>

            <TransactionDialog
              open={open}
              signatureMutation={bid.bidTx}
              error={bid.error}
              onConfirm={handleSubmit}
              mutation={bid.bidReceipt}
              chainId={auction.chainId}
              onOpenChange={(open) => {
                if (!open) {
                  bid.bidTx.reset();
                }
                setOpen(open);
              }}
              hash={bid.bidTx.data}
              disabled={shouldDisable || isWaiting}
              screens={{
                idle: {
                  Component: () => (
                    <div className="text-center">
                      {getConfirmCardText(auction, amountIn, minAmountOut)}
                    </div>
                  ),
                  title: `Confirm ${actionKeyword}`,
                },
                success: {
                  Component: () => (
                    <div className="flex justify-center text-center">
                      {isEMP ? (
                        <>
                          <LockIcon className="mr-1" />
                          Bid encrypted and stored successfully!
                        </>
                      ) : (
                        <p>Purchase completed!</p>
                      )}
                    </div>
                  ),
                  title: "Transaction Confirmed",
                },
              }}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

function getConfirmCardText(
  auction: Auction,
  amountIn: string,
  amountOut: string,
) {
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;
  const empText = `You're about to place a bid of ${amountIn} ${auction.quoteToken.symbol}`;
  const fpText = `You're about to purchase ${amountOut} ${auction.baseToken.symbol} for ${amountIn} ${auction.quoteToken.symbol}`;
  return isEMP ? empText : fpText;
}
