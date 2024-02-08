import { ColumnDef } from "@tanstack/react-table";
import { SortButton } from "components/sort-button";
import type { Auction } from "src/types";

export const columns: ColumnDef<Auction>[] = [
  {
    accessorKey: "quoteToken",
    accessorFn: (row) => row.payoutToken.symbol,
    header: ({ column }) => (
      <SortButton column={column}>Quote Token</SortButton>
    ),
  },
  {
    accessorKey: "payoutToken",
    accessorFn: (row) => row.payoutToken.symbol,
    header: ({ column }) => (
      <SortButton column={column}>Payout Token</SortButton>
    ),
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => <SortButton column={column}>Deadline</SortButton>,
  },
  {
    accessorKey: "capacity",
    header: ({ column }) => <SortButton column={column}>Capacity</SortButton>,
  },
  {
    accessorKey: "status",
  },
];
