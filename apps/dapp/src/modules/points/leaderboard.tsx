import { DataTable } from "@repo/ui";
import { createColumnHelper } from "@tanstack/react-table";

export type LeaderboardEntry = {
  rank: number;
  user: string;
  avatar: string;
  bidding_points: number;
  referrals_points: number;
  total_points: number;
};

const columnHelper = createColumnHelper<LeaderboardEntry>();

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
          src="/placeholder-img.jpg"
          alt="User profile image"
        />
        {row.original.user}
      </div>
    ),
  }),
  columnHelper.accessor("bidding_points", {
    header: "Bid points",
  }),
  columnHelper.accessor("referrals_points", {
    header: "Referral points",
  }),
  columnHelper.accessor("total_points", {
    header: "Total",
    cell: ({ getValue: totalPoints }) => (
      <span className="font-bold">{totalPoints()}</span>
    ),
  }),
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: "0xZero",
    avatar: "todo",
    bidding_points: 100,
    referrals_points: 50,
    total_points: 150,
  },
  {
    rank: 2,
    user: "0xAlice",
    avatar: "todo",
    bidding_points: 50,
    referrals_points: 25,
    total_points: 125,
  },
  {
    rank: 3,
    user: "0xBob",
    avatar: "todo",
    bidding_points: 75,
    referrals_points: 12,
    total_points: 112,
  },
  {
    rank: 4,
    user: "0xCharlie",
    avatar: "todo",
    bidding_points: 25,
    referrals_points: 75,
    total_points: 175,
  },
  {
    rank: 5,
    user: "0xDaniel",
    avatar: "todo",
    bidding_points: 10,
    referrals_points: 50,
    total_points: 150,
  },
  {
    rank: 6,
    user: "0xEve",
    avatar: "todo",
    bidding_points: 5,
    referrals_points: 25,
    total_points: 175,
  },
  {
    rank: 7,
    user: "0xFelix",
    avatar: "todo",
    bidding_points: 15,
    referrals_points: 75,
    total_points: 225,
  },
  {
    rank: 8,
    user: "0xGrace",
    avatar: "todo",
    bidding_points: 20,
    referrals_points: 50,
    total_points: 275,
  },
];

export function Leaderboard() {
  return (
    <DataTable
      title="Leaderboard"
      subtitle="Bid on launches, refer your friends and climb the leaderboard"
      titleRightElement={<div>{/*search icon here*/}</div>}
      data={mockLeaderboard}
      columns={cols}
    />
  );
}
