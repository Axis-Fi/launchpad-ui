import { ColumnDef } from "@tanstack/react-table";
import { SortButton } from "components/sort-button";
import { AuctionLotSnapshot } from "loaders/useAuctionLatestSnapshot";

export const columns: ColumnDef<AuctionLotSnapshot>[] = [
  {
    accessorKey: "quoteToken",
    accessorFn: (row) => row.lot.quoteToken.symbol,
    header: ({ column }) => (
      <SortButton column={column}>Quote Token</SortButton>
    ),
  },
  {
    accessorKey: "baseToken",
    accessorFn: (row) => row.lot.baseToken.symbol,
    header: ({ column }) => (
      <SortButton column={column}>Payout Token</SortButton>
    ),
  },
  {
    accessorKey: "deadline",
    accessorFn: (row) => row.lot.conclusion,
    header: ({ column }) => <SortButton column={column}>Deadline</SortButton>,
  },
  {
    accessorKey: "capacity",
    accessorFn: (row) => row.capacity,
    header: ({ column }) => <SortButton column={column}>Capacity</SortButton>,
  },
  {
    accessorKey: "status",
  },
];
