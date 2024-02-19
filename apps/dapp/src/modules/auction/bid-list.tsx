import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "components/data-table";
import { AuctionEncryptedBid, Auction } from "src/types";
import { PropsWithAuction } from "src/types";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { trimCurrency } from "src/utils/currency";
import { Tooltip } from "@repo/ui";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { axisContracts } from "@repo/contracts";
import { parseUnits } from "viem";
import { MutationDialog } from "modules/transactions/mutation-dialog";
import { LoadingIndicator } from "modules/app/loading-indicator";

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

type BidListProps = PropsWithAuction & {
  address?: `0x${string}`;
};

export function BidList(props: BidListProps) {
  const axisAddresses = axisContracts.addresses[props.auction.chainId];
  const addressLower = props.address ? props.address.toLowerCase() : undefined;
  const encrypted = props.auction?.bids ?? [];

  const refund = useWriteContract();
  const refundReceipt = useWaitForTransactionReceipt({ hash: refund.data });

  const mappedBids = encrypted.map((bid) => {
    return {
      ...bid,
      auction: props.auction,
    };
  });
  const allBids = [...mappedBids];

  console.log({ props });
  // TODO after a tx, this does not update. Requires refresh.
  const isLoading = refund.isPending || refundReceipt.isLoading;

  const handleRefund = (bidId: string) => {
    console.log("Refunding bid", bidId);

    refund.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "refundBid",
      args: [parseUnits(props.auction.lotId, 0), parseUnits(bidId, 0)],
    });
  };

  // Add a refund button to the columns
  const columns = [
    ...cols,
    column.display({
      id: "actions",
      cell: (info) => {
        const bid = info.row.original;
        if (!addressLower) return;
        if (bid.bidder.toLowerCase() !== addressLower) return;
        if (bid.status === "refunded") return;

        // Can refund if the bid did not win and the auction is settled
        const isSettledBidNotWon =
          props.auction.status === "settled" && bid.status !== "won";
        // Can refund if the auction is live
        const isLive = props.auction.status === "live";

        if (isSettledBidNotWon || isLive) {
          return (
            <MutationDialog
              onConfirm={() => handleRefund(bid.bidId)}
              mutation={refundReceipt}
              chainId={props.auction.chainId}
              hash={refund.data}
              error={refundReceipt.error}
              triggerContent={
                isLoading ? (
                  <div className="flex">
                    Waiting...
                    <LoadingIndicator />
                  </div>
                ) : (
                  "Refund"
                )
              }
              disabled={isLoading}
              screens={{
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
                  Component: () => (
                    <div className="text-center">Bid refunded!</div>
                  ),
                },
              }}
            />
          );
        }
      },
    }),
  ];

  return (
    <DataTable
      emptyText={
        props.auction.status == "created" || props.auction.status == "live"
          ? "No bids yet"
          : "No bids received"
      }
      columns={columns}
      data={allBids}
    />
  );
}
