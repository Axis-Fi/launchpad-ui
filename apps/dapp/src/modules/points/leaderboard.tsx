import { DataTable } from "@repo/ui";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useLeaderboard } from "./hooks/use-leaderboard";
import { UserProfile } from "@repo/points";
import { Format } from "modules/token/format";

const columnHelper = createColumnHelper<UserProfile>();

const cols = [
  columnHelper.accessor("rank", {
    header: "Rank",
  }),
  columnHelper.display({
    header: "Username",
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-x-2">
        <img
          className="h-[32px] w-[32px]"
          src={row.original.profileImageUrl}
          alt="User avatar"
        />
        {row.original.username}
      </div>
    ),
  }),
  columnHelper.accessor("bidPoints", {
    header: "Bid points",
    cell: ({ row }) => <Format value={row.original.bidPoints ?? 0} />,
  }),
  columnHelper.accessor("refPoints", {
    header: "Referral points",
    cell: ({ row }) => <Format value={row.original.refPoints ?? 0} />,
  }),
  columnHelper.accessor("totalPoints", {
    header: "Total",
    cell: ({ row }) => <Format value={row.original.totalPoints ?? 0} />,
  }),
] as ColumnDef<UserProfile, unknown>[];

export function Leaderboard() {
  const { leaderboard } = useLeaderboard();

  return (
    <DataTable
      title="Leaderboard"
      subtitle="Bid on launches, refer your friends and climb the leaderboard"
      titleRightElement={<div>{/*search icon here*/}</div>}
      data={leaderboard || []}
      columns={cols}
    />
  );
}
