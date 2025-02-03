import { DataTable, Text } from "@repo/ui";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import type { UserProfile } from "@repo/points";
import { useLeaderboard } from "./hooks/use-leaderboard";

const formatJoinDate = (date: Date) =>
  `${formatDistanceToNow(date)} ago`.replace("about ", "");

const columnHelper = createColumnHelper<UserProfile>();

const cols = [
  columnHelper.display({
    header: "Username",
    cell: ({ row }) => {
      const { username, profileImageUrl, referrer } = row.original;
      return (
        <div className="flex flex-row items-center gap-x-2">
          <img
            className="h-[32px] w-[32px]"
            src={
              profileImageUrl != null && profileImageUrl.length
                ? profileImageUrl
                : "/placeholder-img.png"
            }
            alt="User avatar"
          />
          <div className="flex flex-col">
            <div>{username}</div>
            {referrer != null && referrer !== "" && (
              <Text size="xs">Referred by {referrer}</Text>
            )}
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("joined", {
    header: "Joined",
    cell: ({ row }) => {
      const { joined } = row.original;
      return (
        <div className="flex max-w-[100px] items-center gap-x-2">
          <Text size="xs">{formatJoinDate(joined ?? new Date())}</Text>
        </div>
      );
    },
  }),
] as ColumnDef<UserProfile, unknown>[];

export function RecentJoins() {
  const { recentJoins } = useLeaderboard();
  return (
    <DataTable
      title="Recent Joins"
      data={recentJoins ?? []}
      columns={cols}
      emptyText="Be the first to join!"
    />
  );
}
