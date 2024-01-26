import { ColumnDef } from "@tanstack/react-table";
import { SortButton } from "components/sort-button";

export type Auctions = {
  id: number;
  chainId: number;
  quoteToken: string;
  payoutToken: string;
  deadline: number;
  capacity: number;
};

export const columns: ColumnDef<Auctions>[] = [
  {
    accessorKey: "quoteToken",
    header: ({ column }) => (
      <SortButton column={column}>Quote Token</SortButton>
    ),
  },
  {
    accessorKey: "payoutToken",
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
];
