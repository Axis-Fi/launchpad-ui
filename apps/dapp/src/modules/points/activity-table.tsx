import { HandCoins, Share2Icon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Text, DataTable } from "@/components";
import { Format } from "modules/token/format";
import type { Activity } from "@repo/points";

type ActivityTableProps = {
  activities: Activity[];
  title: string;
  titleRightElement?: React.ReactNode;
};

export function ActivityTable({
  activities,
  title,
  titleRightElement,
}: ActivityTableProps) {
  return (
    <DataTable<Activity, ColumnDef<Activity>>
      title={title}
      titleRightElement={titleRightElement}
      subtitle="Refer friends to earn more points"
      data={activities}
      emptyText="You haven't earned any points in this phase yet. You can earn points by bidding on launches and referring friends."
      columns={[
        {
          header: "Event",
          cell: ({ row }) => {
            const { platform, activityType, description } = row.original;
            return (
              <div className="m-auto flex items-center gap-2">
                {activityType === "Bid" && <HandCoins className="size-6" />}
                {activityType === "Referral" && (
                  <Share2Icon className="size-6" />
                )}
                <div className="flex flex-col">
                  <div className="flex gap-x-2">
                    <Text size="sm">{description}</Text>
                  </div>
                  <Text size="sm" className="capitalize" color="secondary">
                    {platform}
                  </Text>
                </div>
              </div>
            );
          },
        },
        {
          header: "Contribution",
          accessorKey: "contribution",
          cell: ({ row }) => {
            const { activityType } = row.original;
            if (activityType === "Bid") {
              return (
                <>
                  $<Format value={row.original.contribution ?? 0} />
                </>
              );
            }
            return (
              <>
                <Format value={row.original.contribution ?? 0} /> points
              </>
            );
          },
        },
        {
          header: "Multiplier",
          accessorKey: "multiplier",
          cell: ({ row }) => `${row.original.multiplier}x`,
        },
        {
          header: "Points",
          accessorKey: "points",
          cell: ({ row }) => <Format value={row.original.points ?? 0} />,
        },
      ]}
    />
  );
}
