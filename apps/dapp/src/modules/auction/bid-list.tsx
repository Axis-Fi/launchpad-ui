import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "components/data-table";
import {
  SubgraphAuctionEncryptedBid,
  SubgraphAuctionWithEvents,
} from "loaders/subgraphTypes";
import { PropsWithAuction } from ".";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { trimCurrency } from "src/utils/currency";
import { Tooltip } from "@repo/ui";

const column = createColumnHelper<
  SubgraphAuctionEncryptedBid & {
    amountOut: string;
    auction: SubgraphAuctionWithEvents;
  }
>();

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

export function BidList(props: PropsWithAuction) {
  const encrypted = props.auction?.bids ?? [];
  const decrypted = props.auction?.bidsDecrypted ?? [];

  // TODO add button triggering a modal to refund a bid if:
  // - auction is live && bid status is not refunded
  // - auction is settled && bid status is not won and not refunded

  const mappedBids = encrypted.map((bid) => {
    return {
      ...bid,
      auction: props.auction,
    };
  });

  const allBids = [...mappedBids];

  return (
    <DataTable
      emptyText={
        props.auction.status == "created" || props.auction.status == "live"
          ? "No bids yet"
          : "No bids received"
      }
      /*@ts-expect-error TODO: remove, slapped for preview*/
      columns={cols}
      data={allBids}
    />
  );
}
