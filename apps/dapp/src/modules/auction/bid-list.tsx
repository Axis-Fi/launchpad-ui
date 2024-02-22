import { createColumnHelper } from "@tanstack/react-table";
import { AuctionEncryptedBid, Auction, PropsWithAuction } from "src/types";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { trimCurrency } from "src/utils/currency";
import { Button, DataTable, Tooltip } from "@repo/ui";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { axisContracts } from "@repo/contracts";
import { parseUnits } from "viem";
import { MutationDialog } from "modules/transaction/mutation-dialog";
import { LoadingIndicator } from "modules/app/loading-indicator";
import React from "react";

const column = createColumnHelper<AuctionEncryptedBid & { auction: Auction }>();

const cols = [
  column.accessor("bidder", {
    header: "Bidder",
    enableSorting: true,
    cell: (info) => (
      <BlockExplorerLink
        chainId={info.row.original.auction.chainId}
        address={info.getValue()}
        icon={false}
        trim
      />
    ),
  }),

  column.accessor("amountIn", {
    header: "Amount In",
    enableSorting: true,
    cell: (info) =>
      `${trimCurrency(info.getValue())} ${
        info.row.original.auction.quoteToken.symbol
      }`,
  }),
  column.accessor("amountOut", {
    header: "Amount Out",
    enableSorting: true,
    cell: (info) => {
      const size = Math.random() * 80 + 60;
      const value = info.getValue();
      return value ? (
        `${trimCurrency(value)} ${info.row.original.auction.baseToken.symbol}`
      ) : (
        <Tooltip content="The amount out is not accessible until after the conclusion of the auction">
          <div
            className="w-30 bg-foreground h-5"
            style={{
              width: `${size}px`,
            }}
          >
            {" "}
          </div>
        </Tooltip>
      );
    },
  }),
  column.accessor("status", {
    header: "Status",
    enableSorting: true,
    cell: (info) => info.getValue(),
  }),
];

const screens = {
  idle: {
    title: "Refund Bid",
    Component: () => (
      <div className="text-center">
        Are you sure you want to refund this bid?
      </div>
    ),
  },
  success: {
    title: "Transaction Confirmed",
    Component: () => <div className="text-center">Bid refunded!</div>,
  },
};

type BidListProps = PropsWithAuction & {
  address?: `0x${string}`;
};

export function BidList(props: BidListProps) {
  const axisAddresses = axisContracts.addresses[props.auction.chainId];
  const address = props.address ? props.address.toLowerCase() : undefined;
  const encryptedBids = props.auction?.bids ?? [];

  const refund = useWriteContract();
  const refundReceipt = useWaitForTransactionReceipt({ hash: refund.data });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [bidToRefund, setBidToRefund] = React.useState<AuctionEncryptedBid>();

  const mappedBids =
    encryptedBids.map((bid) => {
      return {
        ...bid,
        auction: props.auction,
      };
    }) ?? [];

  const isLoading = refund.isPending || refundReceipt.isLoading;

  const handleRefund = (bidId?: string) => {
    if (!bidId) throw new Error("Unable to get bidId for refund");

    refund.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "refundBid",
      args: [parseUnits(props.auction.lotId, 0), parseUnits(bidId, 0)],
    });
  };

  // Add a refund button to the columns
  const columns = React.useMemo(
    () => [
      ...cols,
      column.display({
        id: "actions",
        cell: (info) => {
          const bid = info.row.original;
          if (!address) return;
          if (bid.bidder.toLowerCase() !== address) return;
          if (bid.status === "refunded") return;

          // Can refund if the bid did not win and the auction is settled
          const isSettledBidNotWon =
            props.auction.status === "settled" && bid.status !== "won";
          // Can refund if the auction is live
          const isLive = props.auction.status === "live";
          const isCurrentBid = bidToRefund?.bidId === bid.bidId;

          if (isSettledBidNotWon || isLive) {
            return (
              <Button
                onClick={() => {
                  setBidToRefund(bid);
                  setDialogOpen(true);
                }}
              >
                {isLoading && isCurrentBid ? (
                  <div className="flex items-center gap-x-1">
                    <p>Waiting</p>
                    <LoadingIndicator className="size-4 fill-black" />
                  </div>
                ) : (
                  "Refund"
                )}
              </Button>
            );
          }
        },
      }),
    ],
    [props.auction, address],
  );

  return (
    <>
      <DataTable
        emptyText={
          props.auction.status == "created" || props.auction.status == "live"
            ? "No bids yet"
            : "No bids received"
        }
        columns={columns}
        data={mappedBids}
      />

      <MutationDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) refund.reset();
        }}
        onConfirm={() => handleRefund(bidToRefund?.bidId)}
        mutation={refundReceipt}
        chainId={props.auction.chainId}
        hash={refund.data}
        error={refundReceipt.error}
        disabled={isLoading}
        screens={screens}
      />
    </>
  );
}
