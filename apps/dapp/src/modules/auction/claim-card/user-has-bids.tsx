import { useState } from "react";
import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";

import { Button, Card, DataTable, Metric, Text } from "@repo/ui";
import type { Auction, BatchAuction, BatchAuctionBid } from "@repo/types";
import { RequiresChain } from "components/requires-chain";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { abbreviateNumber as shorten, trimCurrency } from "utils/currency";
import { useClaimBids } from "../hooks/use-claim-bids";
import { formatUnits } from "viem";

type ClaimProps = {
  auction: Auction;
};

const column = createColumnHelper<BatchAuctionBid>();

const ColumnItem = ({ top, bottom }: { top: string; bottom: string }) => {
  return (
    <div className="flex flex-col">
      <Text mono size="md">
        {top}
      </Text>
      <Text mono size="sm" color="secondary">
        {bottom}
      </Text>
    </div>
  );
};

const ColumnHeader = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-surface-secondary flex flex-col">{children}</div>;
};

export function UserHasBids({ auction: _auction }: ClaimProps) {
  const auction = _auction as BatchAuction;
  const { address } = useAccount();
  const [isTxnDialogOpen, setTxnDialogOpen] = useState(false);
  const claimBids = useClaimBids(auction);
  const userBids = auction.bids.filter(
    (bid) => bid.bidder.toLowerCase() === address?.toLowerCase(),
  );
  const userTotalSuccessfulBidAmount = userBids.reduce(
    (acc, bid) => acc + Number(bid.settledAmountIn ?? 0),
    0,
  );
  const userTotalUnsuccessfulBidAmount = userBids.reduce(
    (acc, bid) => acc + Number(bid.settledAmountInRefunded ?? 0),
    0,
  );
  const userTotalTokensObtained = userBids.reduce(
    (acc, bid) => acc + Number(bid.settledAmountOut ?? 0),
    0,
  );
  const userHasClaimed = userBids.every(
    (bid) => bid.status === "claimed" || bid.status === "refunded",
  );

  const isWaiting =
    claimBids.claimTx.isPending || claimBids.claimReceipt.isLoading;

  const buttonText =
    userTotalSuccessfulBidAmount > 0 ? "Claim tokens" : "Claim refund";

  const columns = [
    column.accessor("amountIn", {
      header: () => <ColumnHeader>Amount</ColumnHeader>,
      cell: (info) => {
        const amountIn = Number(info.getValue() as string);
        return (
          <ColumnItem
            top={shorten(amountIn)}
            bottom={auction.quoteToken.symbol}
          />
        );
      },
    }),
    column.accessor("submittedPrice", {
      header: "Price",
      cell: (info) => {
        const submittedPrice = Number(info.getValue() as string);
        return (
          <ColumnItem
            top={trimCurrency(submittedPrice)}
            bottom={auction.quoteToken.symbol}
          />
        );
      },
    }),
    column.accessor("rawAmountOut", {
      header: "Expected",
      cell: (info) => {
        const amountOut = BigInt(info.getValue() as string);
        const prettyAmountOut = shorten(
          Number(formatUnits(amountOut, auction.baseToken.decimals)),
        );
        return (
          <ColumnItem top={prettyAmountOut} bottom={auction.baseToken.symbol} />
        );
      },
    }),
    column.accessor("settledAmountOut", {
      header: "Won",
      cell: (info) => {
        const settledAmountOut = shorten(Number(info.getValue() as string));
        return (
          <ColumnItem
            top={settledAmountOut}
            bottom={auction.baseToken.symbol}
          />
        );
      },
    }),
    column.accessor("settledAmountIn", {
      header: "Refund",
      cell: (info) => {
        const settledAmountIn = Number(info.getValue() as string);
        const bid = info.row.original as BatchAuctionBid;
        const refundAmount = shorten(Number(bid.amountIn) - settledAmountIn);
        return (
          <ColumnItem top={refundAmount} bottom={auction.quoteToken.symbol} />
        );
      },
    }),
  ];

  return (
    <div className="gap-y-md flex flex-col">
      <Card title="Claim" className="w-[496px]">
        <RequiresChain chainId={auction.chainId}>
          <div className="gap-y-md flex flex-col">
            <div className="bg-surface-tertiary p-sm rounded">
              <Metric size="l" label="Your winning bids">
                {shorten(userTotalSuccessfulBidAmount)}{" "}
                {auction.quoteToken.symbol}
              </Metric>
            </div>

            {userTotalUnsuccessfulBidAmount > 0 && (
              <div className="bg-surface-tertiary p-sm rounded">
                <Metric size="l" label="Your losing bids">
                  {shorten(userTotalUnsuccessfulBidAmount)}{" "}
                  {auction.quoteToken.symbol}
                </Metric>
              </div>
            )}

            <div className="bg-surface-tertiary p-sm rounded">
              <Metric size="l" label="Your tokens">
                {shorten(userTotalTokensObtained)} {auction.baseToken.symbol}
              </Metric>
            </div>

            {!userHasClaimed && (
              <Button
                size="lg"
                className="w-full"
                onClick={() => setTxnDialogOpen(true)}
              >
                {buttonText}
              </Button>
            )}
            {userHasClaimed && (
              <Link to="/auctions">
                <Button size="lg" variant="secondary" className="w-full">
                  View live auctions <ArrowRightIcon className="size-6" />
                </Button>
              </Link>
            )}
          </div>
        </RequiresChain>

        <TransactionDialog
          open={isTxnDialogOpen}
          signatureMutation={claimBids.claimTx}
          error={claimBids.claimTx.error}
          onConfirm={claimBids.handleClaim}
          mutation={claimBids.claimReceipt}
          chainId={auction.chainId}
          onOpenChange={(open: boolean) => {
            if (!open) {
              claimBids.claimTx.reset();
            }
            setTxnDialogOpen(open);
          }}
          hash={claimBids.claimTx.data}
          disabled={isWaiting}
          screens={{
            idle: {
              Component: () => (
                <div className="text-center">
                  You&apos;re about to claim all of your outstanding refunds and
                  payouts for this auction.
                </div>
              ),
              title: `Confirm Claim Bids`,
            },
            success: {
              Component: () => (
                <div className="flex justify-center text-center">
                  <p>Bids claimed successfully!</p>
                </div>
              ),
              title: "Transaction Confirmed",
            },
          }}
        />
      </Card>

      <Card title="Bid Info">
        {/* <Metric label="Bid Price">{shorten(userTotalSuccessfulBidAmount)} {auction.quoteToken.symbol}</Metric> */}
        <DataTable columns={columns} data={userBids}></DataTable>
      </Card>
    </div>
  );
}
