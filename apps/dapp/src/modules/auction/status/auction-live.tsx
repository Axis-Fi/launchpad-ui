import { Button, InfoLabel, trimAddress } from "@repo/ui";
import React from "react";
import { formatUnits } from "viem";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionBidInput } from "../auction-bid-input";
import { AuctionInfoCard } from "../auction-info-card";
import { PropsWithAuction } from "src/types";
import { MutationDialog } from "modules/transactions/mutation-dialog";
import { LoadingIndicator } from "modules/app/loading-indicator";
import { RequiresWalletConnection } from "components/requires-wallet-connection";
import { LockIcon } from "lucide-react";
import { useBidAuction } from "../hooks/use-bid-auction";

export function AuctionLive({ auction }: PropsWithAuction) {
  const [baseTokenAmount, setBaseTokenAmount] = React.useState<number>(0);
  const [quoteTokenAmount, setQuoteTokenAmount] = React.useState<number>(0);

  const { balance, ...bid } = useBidAuction(auction, baseTokenAmount);
  // TODO Permit2 signature

  const handleSubmit = () => {
    bid.isSufficientAllowance ? bid.handleBid() : bid.approveCapacity();
  };

  const formattedBalance = formatUnits(
    balance.data?.value ?? 0n,
    balance.data?.decimals ?? 0,
  );

  const isValidInput = baseTokenAmount && quoteTokenAmount;
  const shouldDisable =
    !isValidInput ||
    bid.approveReceipt.isLoading ||
    bid.bidReceipt.isLoading ||
    bid.bidTx.isPending;

  const isWaiting =
    bid.approveReceipt.isLoading ||
    bid.bidReceipt.isLoading ||
    bid.bidTx.isPending;

  // TODO display "waiting" in modal when the tx is waiting to be signed by the user
  return (
    <div className="flex justify-between">
      <div className="w-1/2">
        <AuctionInfoCard>
          <InfoLabel label="Creator" value={trimAddress(auction.owner)} />
          <InfoLabel
            label="Capacity"
            value={`${auction.capacity} ${auction.baseToken.symbol}`}
          />
          <InfoLabel
            label="Minimum Price"
            value={`${auction.minPrice} ${auction.quoteToken.symbol}/${auction.baseToken.symbol}`}
          />
          <InfoLabel
            label="Minimum Quantity"
            value={`${auction.minBidSize} ${auction.quoteToken.symbol}`}
          />
          <InfoLabel label="Total Bids" value={auction.bids.length} />
          <InfoLabel
            label="Total Bid Amount"
            value={`${auction.formatted?.totalBidAmount} ${auction.quoteToken.symbol}`}
          />
        </AuctionInfoCard>
      </div>

      <div className="w-[40%]">
        <AuctionInputCard
          disabled={shouldDisable}
          auction={auction}
          onClick={handleSubmit}
          submitText={""}
        >
          <>
            <AuctionBidInput
              balance={formattedBalance}
              onChangeAmountIn={(e) => setQuoteTokenAmount(Number(e))}
              onChangeMinAmountOut={(e) => setBaseTokenAmount(Number(e))}
              auction={auction}
            />
            <RequiresWalletConnection className="mt-4">
              <div className="mt-4 w-full">
                {!bid.isSufficientAllowance ? (
                  <Button
                    className="w-full"
                    onClick={() => bid.approveCapacity()}
                  >
                    {bid.isSufficientAllowance ? (
                      "Bid"
                    ) : isWaiting ? (
                      <div className="flex">
                        Waiting for confirmation...
                        <LoadingIndicator />
                      </div>
                    ) : (
                      "Approve"
                    )}
                  </Button>
                ) : (
                  <MutationDialog
                    onConfirm={() => bid.handleBid()}
                    mutation={bid.bidReceipt}
                    chainId={auction.chainId}
                    hash={bid.bidTx.data}
                    error={bid.bidDependenciesMutation.error}
                    triggerContent={"Bid"}
                    disabled={shouldDisable || isWaiting}
                    screens={{
                      idle: {
                        Component: () => (
                          <div className="text-center">
                            You&apos;re about to place a bid of{" "}
                            {quoteTokenAmount} {auction.quoteToken.symbol}
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
                )}
              </div>
            </RequiresWalletConnection>
          </>
        </AuctionInputCard>
      </div>
    </div>
  );
}
