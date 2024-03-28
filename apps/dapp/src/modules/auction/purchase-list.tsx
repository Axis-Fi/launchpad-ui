import { Auction } from "@repo/types";
import { DataTable } from "@repo/ui";
import { createColumnHelper } from "@tanstack/react-table";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { Address } from "viem";
import { formatDate } from "utils/date";

type PurchaseListProps = {
  auction: Auction;
};

const column = createColumnHelper<
  Auction["purchases"] & { auction: Auction }
>();

const cols = [
  column.accessor("buyer", {
    header: "Buyer",
    cell: (info) => (
      <BlockExplorerLink
        chainId={info.row.original.auction.chainId}
        icon={false}
        address={info.getValue() as Address}
        trim
      />
    ),
  }),

  column.accessor("amount", {
    header: "Amount",
    cell: (info) =>
      `${info.getValue()} ${info.row.original.auction.quoteToken.symbol}`,
  }),
  column.accessor("payout", {
    header: "Payout",
    cell: (info) =>
      `${info.getValue()} ${info.row.original.auction.baseToken.symbol}`,
  }),
  column.accessor("blockTimestamp", {
    header: "Date",
    cell: (info) =>
      formatDate.full(new Date((info.getValue() as number) * 1000)),
  }),
  column.accessor("transactionHash", {
    header: "Transaction Hash",
    cell: (info) => (
      <BlockExplorerLink
        chainId={info.row.original.auction.chainId}
        hash={info.getValue() as Address}
        trim
      />
    ),
  }),
];

export function PurchaseList(props: PurchaseListProps) {
  const purchases = props.auction.purchases.map((p) => ({
    ...p,
    auction: props.auction,
  }));

  return (
    <>
      {/*@ts-expect-error //TODO: fix type mismatch*/}
      <DataTable columns={cols} data={purchases} />
    </>
  );
}
