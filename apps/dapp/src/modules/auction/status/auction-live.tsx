import { Button, InfoLabel, trimAddress } from "@repo/ui";
import { formatUnits } from "viem";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionBidInput } from "../auction-bid-input";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionType, PropsWithAuction } from "@repo/types";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { LockIcon } from "lucide-react";
import { useBidAuction } from "../hooks/use-bid-auction";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RequiresChain } from "components/requires-chain";
import React from "react";

const schema = z.object({
  baseTokenAmount: z.coerce.number(),
  quoteTokenAmount: z.coerce.number(),
});

export type BidForm = z.infer<typeof schema>;

export function AuctionLive({ auction }: PropsWithAuction) {
  const [open, setOpen] = React.useState(false);
  const isFixedPrice = auction.auctionType === AuctionType.FIXED_PRICE;
  const maxPayoutPercentage = Number(
    auction.formatted?.maxPayoutPercentage ?? 0,
  ); // percentage 0.00-1.00 format
  const form = useForm<BidForm>({
    mode: "onTouched",
    resolver: zodResolver(
      schema
        .refine(
          (data) =>
            isFixedPrice ||
            data.quoteTokenAmount >= Number(auction.formatted?.minBidSize),
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
            data.quoteTokenAmount <=
              Number(auction.capacityInitial) * maxPayoutPercentage,
          {
            message: `Max bid is ${
              Number(auction.capacityInitial) * maxPayoutPercentage
            }`,
            path: ["quoteTokenAmount"],
          },
        ),
    ),
  });

  const [amountIn, minAmountOut] = form.watch([
    "quoteTokenAmount",
    "baseTokenAmount",
  ]);

  const { balance, ...bid } = useBidAuction(
    auction.lotId,
    auction.chainId,
    amountIn,
    minAmountOut,
  );

  // TODO Permit2 signature
  const handleSubmit = () => {
    bid.isSufficientAllowance ? bid.handleBid() : bid.approveCapacity();
  };

  const formattedBalance = formatUnits(
    balance.data?.value ?? 0n,
    balance.data?.decimals ?? 0,
  );

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
          <InfoLabel label="Creator" value={trimAddress(auction.owner)} />
          {auction.curatorApproved && (
            <InfoLabel label="Curator" value={trimAddress(auction.curator)} />
          )}
          {auction.auctionType === AuctionType.SEALED_BID ? (
            <>
              <InfoLabel
                label="Minimum Price"
                value={`${auction.formatted?.minPrice} ${auction.formatted?.tokenPairSymbols}`}
              />
              <InfoLabel
                label="Minimum Quantity"
                value={`${auction.formatted?.minBidSize} ${auction.quoteToken.symbol}`}
              />
              <InfoLabel label="Total Bids" value={auction.bids.length} />
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
                  balance={formattedBalance}
                  auction={auction}
                />
                <RequiresChain chainId={auction.chainId} className="mt-4">
                  <div className="mt-4 w-full">
                    <Button
                      className="w-full"
                      disabled={isWaiting || isSigningApproval}
                      onClick={() =>
                        bid.isSufficientAllowance
                          ? setOpen(true)
                          : bid.approveCapacity()
                      }
                    >
                      {bid.isSufficientAllowance ? (
                        "BID"
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
                      You&apos;re about to place a bid of {amountIn}{" "}
                      {auction.quoteToken.symbol}
                    </div>
                  ),
                  title: "Confirm Bid",
                },
                success: {
                  Component: () => (
                    <div className="flex justify-center text-center">
                      <LockIcon className="mr-1" />
                      Bid encrypted and stored successfully!
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
