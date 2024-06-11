import { createColumnHelper } from "@tanstack/react-table";
import {
  BatchAuctionBid,
  Auction,
  PropsWithAuction,
  BatchAuction,
} from "@repo/types";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { trimCurrency } from "src/utils/currency";
import { Button, Card, DataTable, Text, Tooltip } from "@repo/ui";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { LoadingIndicator } from "modules/app/loading-indicator";
import React from "react";
import { useAuction } from "./hooks/use-auction";
import { getAuctionHouse } from "utils/contracts";
import { useBidIndex } from "./hooks/use-bid-index";
import { format } from "date-fns";
import { useStorageBids } from "state/bids/handlers";
import { CSVDownloader } from "components/csv-downloader";
import { arrayToCSV } from "utils/csv";

const column = createColumnHelper<BatchAuctionBid & { auction: Auction }>();

const cols = [
  column.accessor("blockTimestamp", {
    header: "Date",
    enableSorting: true,
    cell: (info) => {
      // Convert to Date
      const date = new Date(Number(info.getValue()) * 1000);

      // Format to YYYY.MM.DD
      const dateString = format(date, "yyyy.MM.dd");
      const timeString = format(date, "HH:mm z");

      return (
        <div className="flex flex-col items-start">
          <Text size="sm">{dateString}</Text>
          <Text size="xs" color="secondary">
            {timeString}
          </Text>
        </div>
      );
    },
  }),
  column.accessor("amountIn", {
    header: "Amount In",
    enableSorting: true,
    cell: (info) =>
      `${trimCurrency(info.getValue())} ${
        info.row.original.auction.quoteToken.symbol
      }`,
  }),
  column.accessor("submittedPrice", {
    header: "Bid Price",
    enableSorting: true,

    cell: (info) => {
      let value = Number(info.getValue());
      const bid = info.row.original;
      const auction = bid.auction;
      //@ts-expect-error update type
      const amountOut = bid.amountOut;

      const isUserBid = amountOut && auction.status === "live";
      if (isUserBid) {
        value = Number(bid.amountIn) / amountOut;
      }

      const display = value
        ? `${trimCurrency(value)} ${
            info.row.original.auction.quoteToken.symbol
          }`
        : "-";

      return (
        <Tooltip
          content={
            isUserBid ? (
              <>
                Your estimate payout out at this price is{" "}
                {trimCurrency(amountOut)} {auction.baseToken.symbol}.<br />
                (Only you can see your bids&apos; price.)
              </>
            ) : null
          }
        >
          {display}
        </Tooltip>
      );
    },
  }),
  column.accessor("bidder", {
    header: "Bidder",
    enableSorting: true,
    cell: (info) => {
      // Define the outcome or status of the bid
      const bidStatus = info.row.original.status;
      const bidOutcome = info.row.original.outcome;
      const amountOut = info.row.original.settledAmountOut;
      const isRefunded = bidStatus === "claimed" && !amountOut;
      const status = isRefunded ? "refunded" : bidOutcome;
      const statusColour =
        status === "won" || status === "won - partial fill"
          ? "text-green-500"
          : "text-red-500";

      return (
        <div className="flex flex-col items-end">
          <BlockExplorerLink
            chainId={info.row.original.auction.chainId}
            address={info.getValue()}
            icon={true}
            trim
          />
          <Text size="xs" className={statusColour}>
            {status}
          </Text>
        </div>
      );
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
  const { address } = useAccount();

  const userBids = useStorageBids({
    auctionId: props.auction.id,
    address,
  });

  const auction = props.auction as BatchAuction;

  const auctionHouse = getAuctionHouse(props.auction);
  const encryptedBids = auction?.bids ?? [];

  const { refetch: refetchAuction } = useAuction(
    props.auction.id,
    props.auction.auctionType,
  );

  const refund = useWriteContract();
  const refundReceipt = useWaitForTransactionReceipt({ hash: refund.data });
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [bidToRefund, setBidToRefund] = React.useState<BatchAuctionBid>();
  const { index: bidIndex } = useBidIndex(
    props.auction,
    BigInt(bidToRefund?.bidId ?? -1),
  );

  const mappedBids = React.useMemo(
    () =>
      encryptedBids.map((bid) => {
        //Checks if its a user bid and in local storage
        const storedBid =
          userBids.find(
            (storageBid) =>
              storageBid.bidId === bid.bidId &&
              bid.bidder.toLowerCase() === address?.toLowerCase(),
          ) ?? {};

        return {
          ...bid,
          ...storedBid,
          auction: props.auction,
        };
      }) ?? [],
    [props.auction, address],
  );

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
          // Can refund if the auction is live, other "refunds" are handled by claim bids after the auction ends

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

  //Format bids for CSV download
  const [headers, body] = React.useMemo(() => {
    const values = auction.bids.map((b) => ({
      date: b.date,
      amountIn: b.amountIn,
      settledAmountOut: b.settledAmountOut,
      submittedPrice: b.submittedPrice,
      bidder: b.bidder,
    }));

    return arrayToCSV(values ?? []);
  }, [auction]);

  return (
    <Card
      title={"Bid History"}
      headerRightElement={
        <CSVDownloader
          tooltip="Download this bid history in CSV format."
          filename={`bids-${auction.auctionType}-${auction.id}`}
          headers={headers}
          data={body}
        />
      }
    >
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
    </Card>
  );
}
