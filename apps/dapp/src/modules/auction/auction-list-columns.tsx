import { ColumnDef } from "@tanstack/react-table";
import { SortButton } from "components/sort-button";
import { Auction } from "src/types";

export const columns: ColumnDef<Auction>[] = [
  {
    accessorKey: "quoteToken",
    accessorFn: (row) => row.quoteToken.symbol,
    header: ({ column }) => (
      <SortButton column={column}>Quote Token</SortButton>
    ),
  },
  {
    accessorKey: "baseToken",
    accessorFn: (row) => row.baseToken.symbol,
    header: ({ column }) => (
      <SortButton column={column}>Payout Token</SortButton>
    ),
  },
  {
    accessorKey: "deadline",
    accessorFn: (row) =>
      new Date(Number(row.conclusion) * 1000).toLocaleString(),
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
