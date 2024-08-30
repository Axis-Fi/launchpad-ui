import { DataTable } from "@repo/ui";
import { createColumnHelper } from "@tanstack/react-table";

type LeaderboardEntry = {
  rank: number;
  user: string;
  user_img: string;
  bidding_points: number;
  referrals_points: number;
  ecosystem_points: number;
  total_points: number;
};

const columnHelper = createColumnHelper<LeaderboardEntry>();

const cols = [
  columnHelper.accessor("rank", {
    header: "Rank",
  }),
  columnHelper.display({
    header: "User",
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-x-2">
        <img
          className="max-h-[24px] max-w-[24px] rounded-full"
          src="/placeholder-img.jpg"
          alt="user profile"
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
  columnHelper.accessor("ecosystem_points", {
    header: "Ecosystem points",
  }),
  columnHelper.accessor("total_points", {
    header: "Total points",
    cell: ({ getValue: totalPoints }) => (
      <span className="font-bold">{totalPoints()}</span>
    ),
  }),
];

const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    user: "0xZero",
    user_img: "todo",
    bidding_points: 100,
    referrals_points: 50,
    ecosystem_points: 25,
    total_points: 150,
  },
  {
    rank: 2,
    user: "0xAlice",
    user_img: "todo",
    bidding_points: 50,
    referrals_points: 25,
    ecosystem_points: 10,
    total_points: 125,
  },
  {
    rank: 3,
    user: "0xBob",
    user_img: "todo",
    bidding_points: 75,
    referrals_points: 12,
    ecosystem_points: 5,
    total_points: 112,
  },
  {
    rank: 4,
    user: "0xCharlie",
    user_img: "todo",
    bidding_points: 25,
    referrals_points: 75,
    ecosystem_points: 20,
    total_points: 175,
  },
  {
    rank: 5,
    user: "0xDaniel",
    user_img: "todo",
    bidding_points: 10,
    referrals_points: 50,
    ecosystem_points: 30,
    total_points: 150,
  },
  {
    rank: 6,
    user: "0xEve",
    user_img: "todo",
    bidding_points: 5,
    referrals_points: 25,
    ecosystem_points: 40,
    total_points: 175,
  },
  {
    rank: 7,
    user: "0xFelix",
    user_img: "todo",
    bidding_points: 15,
    referrals_points: 75,
    ecosystem_points: 50,
    total_points: 225,
  },
  {
    rank: 8,
    user: "0xGrace",
    user_img: "todo",
    bidding_points: 20,
    referrals_points: 50,
    ecosystem_points: 60,
    total_points: 275,
  },
];

export function Leaderboard() {
  return <DataTable data={mockLeaderboard} columns={cols} />;
}
