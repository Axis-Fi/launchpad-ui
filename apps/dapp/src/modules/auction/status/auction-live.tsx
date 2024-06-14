import { Button, Card, Metric, Text } from "@repo/ui";
import { parseUnits } from "viem";
import { AuctionBidInput } from "../auction-bid-input";
import { Auction, AuctionType, PropsWithAuction } from "@repo/types";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { LockIcon } from "lucide-react";
import { shorten } from "utils";
import { useBidAuction } from "../hooks/use-bid-auction";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RequiresChain } from "components/requires-chain";
import React, { useEffect, useState } from "react";
import { AuctionMetricsContainer } from "../auction-metrics-container";
import { AuctionLaunchMetrics } from "../auction-launch-metrics";
import { AuctionMetric } from "../auction-metric";
import { ProjectInfoCard } from "../project-info-card";
import { AuctionBidInputSingle } from "../auction-bid-input-single";
import { useAccount, useChainId } from "wagmi";
import { useAllowlist } from "../hooks/use-allowlist";
import { useBaseDTLCallback } from "../hooks/use-base-dtl-callback";
import useERC20Balance from "loaders/use-erc20-balance";

const schema = z.object({
  baseTokenAmount: z.string(),
  quoteTokenAmount: z.string(),
  bidPrice: z.string().optional(), // Only used for bids that require the bid price to be specified
});

export type BidForm = z.infer<typeof schema>;

export function AuctionLive({ auction }: PropsWithAuction) {
  const [open, setOpen] = React.useState(false);
  const currentChainId = useChainId();
  const walletAccount = useAccount();

  const isFixedPriceBatch =
    auction.auctionType === AuctionType.FIXED_PRICE_BATCH;
  const auctionFormatted = auction.formatted || undefined;

  const [maxBidAmount, setMaxBidAmount] = useState<bigint | undefined>();

  // Cache the max bid amount
  useEffect(() => {
    // Only for FPB, since we don't know the amount out for each bid in EMP
    if (!isFixedPriceBatch || !auctionFormatted) {
      setMaxBidAmount(undefined);
      return;
    }

    // Calculate the remaining capacity in terms of quote tokens
    const capacityInQuoteTokens =
      (parseUnits(auction.capacityInitial, auction.baseToken.decimals) *
        parseUnits(
          (auctionFormatted.price ?? "0").replace(/,/g, ""),
          auction.quoteToken.decimals,
        )) /
      parseUnits("1", auction.baseToken.decimals);

    const remainingQuoteTokens =
      capacityInQuoteTokens -
      parseUnits(
        (auctionFormatted.totalBidAmountFormatted ?? "0").replace(/,/g, ""),
        auction.quoteToken.decimals,
      );

    setMaxBidAmount(remainingQuoteTokens);
  }, [
    auction.capacityInitial,
    auctionFormatted,
    auctionFormatted?.totalBidAmountFormatted,
    isFixedPriceBatch,
    auction.baseToken.decimals,
    auction.quoteToken.decimals,
  ]);

  // Allowlist callback support
  // Handles determining if an allowlist callback is being used
  // and provides variables for displaying on the UI and submitting the bid transaction
  const {
    canBid,
    amountLimited: allowlistLimitsAmount,
    limit: allowlistLimit,
    criteria,
    callbackData,
  } = useAllowlist(auction);

  const form = useForm<BidForm>({
    mode: "onTouched",
    resolver: zodResolver(
      schema
        .refine(
          (data) =>
            parseUnits(data.quoteTokenAmount, auction.quoteToken.decimals) >
            BigInt(0),
          {
            message: "Amount must be greater than 0",
            path: ["quoteTokenAmount"],
          },
        )
        .refine(
          (data) =>
            isFixedPriceBatch ||
            parseUnits(data.bidPrice ?? "0", auction.quoteToken.decimals) >
              BigInt(0),
          {
            message: "Bid price must be greater than 0",
            path: ["bidPrice"],
          },
        )
        .refine(
          (data) =>
            isFixedPriceBatch ||
            parseUnits(data.quoteTokenAmount, auction.quoteToken.decimals) >=
              parseUnits(
                auction.formatted?.minBidSize ?? "0",
                auction.quoteToken.decimals,
              ),
          {
            message: `Minimum bid is ${auction.formatted?.minBidSize}`,
            path: ["quoteTokenAmount"],
          },
        )
        .refine(
          (data) =>
            isFixedPriceBatch ||
            parseUnits(data.bidPrice ?? "0", auction.quoteToken.decimals) >=
              parseUnits(
                auction.formatted?.minPrice ?? "0",
                auction.quoteToken.decimals,
              ),
          {
            message: `Min rate is ${auction.formatted?.minPrice} ${auction.quoteToken.symbol}/${auction.baseToken.symbol}`,
            path: ["bidPrice"],
          },
        )
        .refine(
          (data) =>
            parseUnits(data.quoteTokenAmount, auction.quoteToken.decimals) <=
            (quoteTokenBalance ?? BigInt(0)),
          {
            message: `Insufficient balance`,
            path: ["quoteTokenAmount"],
          },
        )
        .refine(
          (data) =>
            parseUnits(data.baseTokenAmount, auction.baseToken.decimals) <=
            parseUnits(auction.capacity, auction.baseToken.decimals),
          {
            message: "Amount out exceeds capacity",
            path: ["baseTokenAmount"],
          },
        )
        .refine(
          (data) =>
            !allowlistLimitsAmount ||
            (allowlistLimitsAmount &&
              parseUnits(data.quoteTokenAmount, auction.quoteToken.decimals) <=
                allowlistLimit),
          {
            message: `Exceeds your remaining allocation of ${allowlistLimit} ${auction.quoteToken.symbol}`,
            path: ["quoteTokenAmount"],
          },
        )
        .refine(
          (data) =>
            !isFixedPriceBatch ||
            maxBidAmount === undefined ||
            parseUnits(data.quoteTokenAmount, auction.quoteToken.decimals) <=
              maxBidAmount,
          {
            message: `Exceeds remaining capacity of ${maxBidAmount} ${auction.quoteToken.symbol}`,
            path: ["quoteTokenAmount"],
          },
        ),
    ),
  });

  const [amountIn, minAmountOut] = form.watch([
    "quoteTokenAmount",
    "baseTokenAmount",
  ]);

  // const parsedAmountIn = Number(amountIn);
  // const parsedMinAmountOut = Number(minAmountOut);

  const parsedAmountIn = amountIn
    ? parseUnits(amountIn, auction.quoteToken.decimals)
    : BigInt(0);
  const parsedMinAmountOut = minAmountOut
    ? parseUnits(minAmountOut, auction.baseToken.decimals)
    : BigInt(0);

  const { ...bid } = useBidAuction(
    auction.id,
    auction.auctionType,
    parsedAmountIn,
    parsedMinAmountOut,
    callbackData,
  );

  const { balance: quoteTokenBalance } = useERC20Balance({
    chainId: auction.chainId,
    tokenAddress: auction.quoteToken.address,
    balanceAddress: walletAccount.address,
  });

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
  const actionKeyword = "Bid";

  const { data: dtlCallbackConfiguration } = useBaseDTLCallback({
    chainId: auction.chainId,
    lotId: auction.lotId,
    baseTokenDecimals: auction.baseToken.decimals,
    callback: auction.callbacks,
  });

  const amountInInvalid =
    parsedAmountIn > (quoteTokenBalance ?? BigInt(0)) || // greater than balance
    parsedAmountIn === undefined ||
    parsedAmountIn === BigInt(0); // zero or empty

  const amountOutInvalid =
    minAmountOut === undefined ||
    parsedMinAmountOut === BigInt(0) || // zero or empty
    parsedMinAmountOut >
      parseUnits(auction.capacity, auction.baseToken.decimals) || // exceeds capacity
    (isEMP &&
      (parsedAmountIn * parseUnits("1", auction.baseToken.decimals)) /
        parsedMinAmountOut <
        parseUnits(
          auction.formatted?.minPrice ?? "0",
          auction.quoteToken.decimals,
        )); // less than min price

  const isWalletChainIncorrect =
    auction.chainId !== currentChainId || !walletAccount.isConnected;

  const [bidPrice] = form.watch(["bidPrice"]);
  // Calculate FDV based on the bid
  const [bidFdv, setBidFdv] = useState<string>("");
  useEffect(() => {
    if (!bidPrice || !auction.baseToken.totalSupply) {
      setBidFdv("");
      return;
    }

    const fdv = Number(auction.baseToken.totalSupply) * Number(bidPrice);
    setBidFdv(`${shorten(fdv)} ${auction.quoteToken.symbol}`);
  }, [bidPrice, auction.baseToken.totalSupply, auction.quoteToken.symbol]);

  // Calculate the limit for the user as the minimum of the allowlist limit (where applicable) and the max bid amount
  // Truth table
  // Allowlist limit | Max bid amount | Bid limit
  //      true      |     true       | min(allowlistLimit, maxBidAmount)
  //      true      |     false      | allowlistLimit
  //      false     |     true       | maxBidAmount
  //      false     |     false      | none (undefined)
  const bidLimit =
    allowlistLimitsAmount && maxBidAmount !== undefined
      ? allowlistLimit > maxBidAmount
        ? maxBidAmount
        : allowlistLimit
      : allowlistLimitsAmount
        ? allowlistLimit
        : maxBidAmount;

  // TODO display "waiting" in modal when the tx is waiting to be signed by the user

  return (
    <div className="flex justify-between gap-x-8">
      <div className="w-2/3 space-y-4">
        <AuctionLaunchMetrics auction={auction} />

        <Card title="Token Info">
          {isEMP && (
            <AuctionMetricsContainer className="mt-4" auction={auction}>
              <AuctionMetric id="minPriceFDV" />
              <AuctionMetric id="totalSupply" />
              <AuctionMetric id="auctionedSupply" />
              <AuctionMetric id="vestingDuration" />
              {dtlCallbackConfiguration && (
                // TODO fix alignment of metric title
                <Metric
                  label="Direct to Liquidity"
                  size="m"
                  tooltip="The percentage of proceeds that will be automatically deposited into the liquidity pool"
                  className=""
                >
                  {dtlCallbackConfiguration.proceedsUtilisationPercent * 100}%
                </Metric>
              )}
            </AuctionMetricsContainer>
          )}
          {isFixedPriceBatch && (
            <AuctionMetricsContainer className="mt-4" auction={auction}>
              <AuctionMetric id="fixedPriceFDV" />
              <AuctionMetric id="totalSupply" />
              <AuctionMetric id="auctionedSupply" />
              <AuctionMetric id="vestingDuration" />
              {dtlCallbackConfiguration && (
                // TODO fix alignment of metric title
                <Metric
                  label="Direct to Liquidity"
                  size="m"
                  tooltip="The percentage of proceeds that will be automatically deposited into the liquidity pool"
                  className=""
                >
                  {dtlCallbackConfiguration.proceedsUtilisationPercent * 100}%
                </Metric>
              )}
            </AuctionMetricsContainer>
          )}
        </Card>
        <ProjectInfoCard auction={auction} />
      </div>

      <div className="w-1/3">
        {canBid ? (
          <FormProvider {...form}>
            <form onSubmit={(e) => e.preventDefault()}>
              <Card
                title={
                  isFixedPriceBatch
                    ? `Buy ${auction.baseToken.symbol}`
                    : `Place your bid`
                }
              >
                {isFixedPriceBatch ? (
                  <AuctionBidInputSingle
                    balance={quoteTokenBalance}
                    limit={bidLimit}
                    auction={auction}
                    disabled={isWalletChainIncorrect}
                  />
                ) : (
                  <AuctionBidInput
                    balance={quoteTokenBalance}
                    limit={bidLimit}
                    auction={auction}
                    disabled={isWalletChainIncorrect}
                  />
                )}
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
                        `APPROVE TO ${actionKeyword.toUpperCase()}`
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
                          <p>Bid stored successfully!</p>
                        )}
                      </div>
                    ),
                    title: "Transaction Confirmed",
                  },
                }}
              />
            </form>
          </FormProvider>
        ) : (
          <Card title="Private Sale">
            <p>This sale is restricted to {criteria}.</p>
            <p>The connected wallet is not approved to bid.</p>
          </Card>
        )}
        {canBid && isEMP && (
          <div className="mt-4">
            <Card title="Bid Info">
              <div className="gap-y-md flex">
                <div className="p-sm rounded">
                  <Metric size="s" label="Your Estimated FDV">
                    {bidFdv || "-"}
                  </Metric>
                </div>
                <div className="p-sm rounded">
                  <Metric size="s" label="Est. Coin Rank">
                    {"-"}
                  </Metric>
                </div>
              </div>
            </Card>
          </div>
        )}
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
  const fpText = `You're about to place a bid of ${amountOut} ${auction.baseToken.symbol} for ${amountIn} ${auction.quoteToken.symbol}`;
  return isEMP ? empText : fpText;
}
