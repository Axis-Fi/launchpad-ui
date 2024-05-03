import { createColumnHelper } from "@tanstack/react-table";
import {
  AuctionEncryptedBid,
  Auction,
  PropsWithAuction,
  BatchAuction,
} from "@repo/types";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { trimCurrency } from "src/utils/currency";
import { Button, DataTable, Tooltip } from "@repo/ui";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { LoadingIndicator } from "modules/app/loading-indicator";
import React from "react";
import { useAuction } from "./hooks/use-auction";
import { getAuctionHouse } from "utils/contracts";
import { useBidIndex } from "./hooks/use-bid-index";

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
  column.accessor("rawAmountOut", {
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
            style={{ width: `${size}px` }}
          >
            {" "}
          </div>
        </Tooltip>
      );
    },
  }),
  column.accessor("submittedPrice", {
    header: "Bid Price",
    enableSorting: true,
    cell: (info) => {
      const value = info.getValue();
      return value
        ? `${trimCurrency(value)} ${info.row.original.auction.baseToken.symbol}`
        : "-";
    },
  }),
  column.accessor("settledAmountOut", {
    header: "Settled Amount",
    enableSorting: true,
    cell: (info) => {
      const value = info.getValue();
      return value
        ? `${trimCurrency(value)} ${info.row.original.auction.baseToken.symbol}`
        : "-";
    },
  }),

  column.accessor("status", {
    header: "Status",
    enableSorting: true,
    cell: (info) => {
      const status = info.getValue();
      const amountOut = info.row.original.settledAmountOut;
      const isRefunded = status === "claimed" && !amountOut;
      return isRefunded ? "refunded" : status;
    },
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
  const auction = props.auction as BatchAuction;

  const auctionHouse = getAuctionHouse(props.auction);
  const address = props.address ? props.address.toLowerCase() : undefined;
  const encryptedBids = auction?.bids ?? [];
  const { refetch: refetchAuction } = useAuction(
    props.auction.id,
    props.auction.auctionType,
  );

  const refund = useWriteContract();
  const refundReceipt = useWaitForTransactionReceipt({ hash: refund.data });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [bidToRefund, setBidToRefund] = React.useState<AuctionEncryptedBid>();
  const { index: bidIndex } = useBidIndex(
    props.auction,
    BigInt(bidToRefund?.bidId ?? -1),
  );

  const mappedBids =
    encryptedBids.map((bid) => {
      return {
        ...bid,
        auction: props.auction,
      };
    }) ?? [];

  const isLoading = refund.isPending || refundReceipt.isLoading;

  const handleRefund = (bidId?: string) => {
    if (!bidId || !bidIndex) throw new Error("Unable to get bidId for refund");

    refund.writeContract({
      abi: auctionHouse.abi,
      address: auctionHouse.address,
      functionName: "refundBid",
      args: [BigInt(props.auction.lotId), BigInt(bidId), BigInt(bidIndex)],
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
          const isLive = props.auction.status === "live";
          if (!address || !isLive) return;
          if (bid.bidder.toLowerCase() !== address) return;
          if (bid.status === "claimed" && !bid.settledAmountOut) return;

          // Can refund if the bid did not win and the auction is settled
          //const isSettledBidNotWon = props.auction.status === "settled" && bid.status !== "won";
          // Can refund if the auction is live

          const isCurrentBid = bidToRefund?.bidId === bid.bidId;

          if (isLive) {
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

  React.useEffect(() => {
    if (refund.isSuccess) {
      refetchAuction();
    }
  }, [refund.isSuccess]);

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

      <TransactionDialog
        signatureMutation={refund}
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
