import { DataTable, Text } from "@repo/ui";
import { createColumnHelper } from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";

type RecentJoinsEntry = {
  username: string;
  user_img: string;
  joined_date: string;
  referred_by: null | string;
};

const formatJoinDate = (datetimestamp: number) =>
  `${formatDistanceToNow(new Date(datetimestamp))} ago`.replace("about ", "");

const columnHelper = createColumnHelper<RecentJoinsEntry>();

const cols = [
  columnHelper.display({
    header: "Username",
    cell: ({ row }) => {
      const { username, referred_by } = row.original;
      return (
        <div className="flex flex-row items-center gap-x-2">
          <img
            className="max-h-[32px] max-w-[32px]"
            src="/placeholder-img.jpg"
            alt="User profile image"
          />
          <div className="flex flex-col">
            <div>{username}</div>
            {referred_by != null && (
              <div>
                <Text size="xs">Referred by {referred_by}</Text>
              </div>
            )}
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("joined_date", {
    header: "Joined",
  }),
];

const mockRecentJoins: RecentJoinsEntry[] = [
  {
    username: "0xZero",
    user_img: "todo",
    joined_date: formatJoinDate(1725380000389),
    referred_by: null,
  },
  {
    username: "0xAlice",
    user_img: "todo",
    joined_date: formatJoinDate(1725380327389),
    referred_by: "0xZero",
  },
  {
    username: "0xBob",
    user_img: "todo",
    joined_date: formatJoinDate(1725380527389),
    referred_by: "0xZero",
  },
  {
    username: "0xCharlie",
    user_img: "todo",
    joined_date: formatJoinDate(1725380627389),
    referred_by: "0xZero",
  },
  {
    username: "0xDaniel",
    user_img: "todo",
    joined_date: formatJoinDate(1725380727389),
    referred_by: "0xZero",
  },
  {
    username: "0xEve",
    user_img: "todo",
    joined_date: formatJoinDate(1725380827389),
    referred_by: "0xZero",
  },
  {
    username: "0xFelix",
    user_img: "todo",
    joined_date: formatJoinDate(1725380927389),
    referred_by: "0xZero",
  },
  {
    username: "0xGrace",
    user_img: "todo",
    joined_date: formatJoinDate(1725381988389),
    referred_by: "0xZero",
  },
].reverse();

export function RecentJoins() {
  return (
    <DataTable title="Recent Joins" data={mockRecentJoins} columns={cols} />
  );
}
