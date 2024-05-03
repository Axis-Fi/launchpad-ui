import { AtomicAuction, AuctionPurchase } from "@repo/types";
import { DataTable } from "@repo/ui";
import { createColumnHelper } from "@tanstack/react-table";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { Address } from "viem";
import { formatDate } from "utils/date";

type PurchaseListProps = {
  auction: AtomicAuction;
};

const column = createColumnHelper<
  AtomicAuction["purchases"] & { auction: AtomicAuction }
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
  column.accessor("date", {
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
  //TODO: figure out why type is missing here
  const purchases = props.auction.purchases.map((p: AuctionPurchase) => ({
    ...p,
    auction: props.auction,
  }));

  //@ts-expect-error something wrong is not right, compiler sez its not array
  return <DataTable columns={cols} data={purchases} />;
}
