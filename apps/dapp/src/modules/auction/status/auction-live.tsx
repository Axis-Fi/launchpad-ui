import { Button, InfoLabel, trimAddress } from "@repo/ui";
import { formatUnits } from "viem";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionBidInput } from "../auction-bid-input";
import { AuctionInfoCard } from "../auction-info-card";
import {
  Auction,
  AuctionType,
  BatchAuction,
  PropsWithAuction,
} from "@repo/types";
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
import { AuctionInfoLabel } from "../auction-info-labels";

const schema = z.object({
  baseTokenAmount: z.string(),
  quoteTokenAmount: z.string(),
});

export type BidForm = z.infer<typeof schema>;

export function AuctionLive({ auction }: PropsWithAuction) {
  const [open, setOpen] = React.useState(false);
  const isFixedPrice = auction.auctionType === AuctionType.FIXED_PRICE;

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
    <div className="flex justify-between">
      <div className="w-1/2">
        <AuctionInfoCard>
          <InfoLabel
            label="Capacity"
            value={`${auction.formatted?.capacity} ${auction.baseToken.symbol}`}
          />
          <InfoLabel
            label="Total Supply"
            value={`${auction.formatted?.totalSupply} ${auction.baseToken.symbol}`}
          />
          <InfoLabel label="Deadline" value={auction.formatted?.endFormatted} />
          <InfoLabel label="Creator" value={trimAddress(auction.seller)} />
          {auction.linearVesting && (
            <AuctionInfoLabel auction={auction} id="vestingDuration" />
          )}
          {auction.curatorApproved && (
            <InfoLabel
              label="Curator"
              value={
                auction.curated ? trimAddress(auction.curated.curator!) : ""
              }
            />
          )}
          {isEMP ? (
            <>
              <InfoLabel
                label="Minimum Price"
                value={`${auction.formatted?.minPrice} ${auction.formatted?.tokenPairSymbols}`}
              />
              <InfoLabel
                label="Minimum Quantity"
                value={`${auction.formatted?.minBidSize} ${auction.quoteToken.symbol}`}
              />
              <InfoLabel
                label="Total Bids"
                value={(auction as BatchAuction).bids.length}
              />
              <InfoLabel
                label="Total Bid Amount"
                value={`${auction.formatted?.totalBidAmount} ${auction.quoteToken.symbol}`}
              />
            </>
          ) : (
            <>
              <InfoLabel
                label="Price"
                value={`${auction.formatted?.price} ${auction.formatted?.tokenPairSymbols}`}
              />
            </>
          )}
        </AuctionInfoCard>
      </div>

      <div className="w-[40%]">
        <FormProvider {...form}>
          <form onSubmit={(e) => e.preventDefault()}>
            <AuctionInputCard
              disabled={shouldDisable}
              auction={auction}
              onClick={handleSubmit}
              submitText={""}
            >
              <>
                <AuctionBidInput
                  singleInput={isFixedPrice}
                  balance={trimCurrency(formattedBalance)}
                  auction={auction}
                />
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
                          <LoadingIndicator />
                        </div>
                      ) : (
                        "APPROVE"
                      )}
                    </Button>
                  </div>
                </RequiresChain>
              </>
            </AuctionInputCard>
            <TransactionDialog
              open={open}
              signatureMutation={bid.bidTx}
              error={bid.error}
              onConfirm={() => bid.handleBid()}
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
