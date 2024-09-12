import { DataTable } from "@repo/ui";
import { createColumnHelper } from "@tanstack/react-table";
import { useLeaderboard } from "./hooks/use-leaderboard";
import { UserProfile } from "@repo/points";

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
          className="max-h-[32px] max-w-[32px]"
          src={row.original.profileImageUrl}
          alt="User profile image"
        />
        {row.original.username}
      </div>
    ),
  }),
  columnHelper.accessor("bidPoints", {
    header: "Bid points",
  }),
  columnHelper.accessor("refPoints", {
    header: "Referral points",
  }),
  columnHelper.accessor("totalPoints", {
    header: "Total",
    cell: ({ getValue: totalPoints }) => (
      <span className="font-bold">{totalPoints()}</span>
    ),
  }),
];

// const mockLeaderboard: UserProfile[] = [
//   {
//     rank: 1,
//     username: "0xZero",
//     profileImageUrl: "todo",
//     referrer: "0xAlice",
//     bidPoints: 100,
//     refPoints: 50,
//     totalPoints: 150,
//   },
//   {
//     rank: 2,
//     username: "0xAlice",
//     profileImageUrl: "todo",
//     referrer: "",
//     bidPoints: 50,
//     refPoints: 25,
//     totalPoints: 125,
//   },
//   {
//     rank: 3,
//     username: "0xBob",
//     profileImageUrl: "todo",
//     bidPoints: 75,
//     refPoints: 12,
//     totalPoints: 112,
//   },
//   {
//     rank: 4,
//     username: "0xCharlie",
//     profileImageUrl: "todo",
//     bidPoints: 25,
//     refPoints: 75,
//     totalPoints: 175,
//   },
//   {
//     rank: 5,
//     username: "0xDaniel",
//     profileImageUrl: "todo",
//     bidPoints: 10,
//     refPoints: 50,
//     totalPoints: 150,
//   },
//   {
//     rank: 6,
//     username: "0xEve",
//     profileImageUrl: "todo",
//     bidPoints: 5,
//     refPoints: 25,
//     totalPoints: 175,
//   },
//   {
//     rank: 7,
//     username: "0xFelix",
//     profileImageUrl: "todo",
//     bidPoints: 15,
//     refPoints: 75,
//     totalPoints: 225,
//   },
//   {
//     rank: 8,
//     username: "0xGrace",
//     profileImageUrl: "todo",
//     bidPoints: 20,
//     refPoints: 50,
//     totalPoints: 275,
//   },
// ];

export function Leaderboard() {
  const leaderboard = useLeaderboard();

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
