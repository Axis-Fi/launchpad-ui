import { Link } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DataTable,
  Text,
  Card,
  Button,
} from "@/components";
import type { Activity, UserProfile } from "./profile";
import type { ColumnDef } from "@tanstack/react-table";
import { Format } from "modules/token/format";

type ActivityTableProps = {
  activities: Activity[];
  title: string;
};

type PhaseTablesProps = {
  profile?: UserProfile;
};

const ActivityTable = ({ activities, title }: ActivityTableProps) => {
  return (
    <DataTable<Activity, ColumnDef<Activity>>
      title={title}
      subtitle="Refer friends to earn more points"
      data={activities}
      emptyText="You haven't earned any points yet. You can earn points by bidding on launches and referring friends."
      columns={[
        {
          header: "Event",
          cell: ({ row }) => {
            const { platform, target, type } = row.original;
            return (
              <div className="m-auto flex items-center gap-2">
                <img
                  className="h-[32px] w-[32px] rounded-full"
                  src="/placeholder-img.jpg"
                  alt="platform"
                />
                <div className="flex flex-col">
                  <div className="flex gap-x-2">
                    <div>
                      {type === "bid" && <>Bid on</>}
                      {type === "refer" && <>Referred user</>}
                    </div>
                    <div>
                      {type === "bid" && (
                        <Text size="sm" className="uppercase">
                          {target}
                        </Text>
                      )}
                      {type === "refer" && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-[unset] p-[unset]"
                          asChild
                        >
                          <Link to="/TODO" className="capitalize">
                            {target}
                          </Link>
                        </Button>
                      )}
                    </div>
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
            const { type } = row.original;
            if (type === "bid") {
              return (
                <>
                  $<Format value={row.original.contribution} />
                </>
              );
            }
            return (
              <Text size="sm" color="secondary">
                {row.original.contribution} points
              </Text>
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
        },
      ]}
    />
  );
};

const PhaseCTAs = ({ profile }: PhaseTablesProps) => {
  return (
    <div className="flex w-full justify-center">
      {profile && (
        <Button variant="secondary" className="w-full md:w-[33%] lg:w-[20%]">
          Share referral link
        </Button>
      )}
    </div>
  );
};

export function PhaseTables({ profile }: PhaseTablesProps) {
  return (
    <Tabs defaultValue="phase1">
      <TabsList>
        <TabsTrigger value="phase1">Phase 1</TabsTrigger>
        <TabsTrigger value="phase2">Phase 2</TabsTrigger>
      </TabsList>
      <TabsContent value="phase1">
        <Card>
          <ActivityTable
            title="Phase 1 activity"
            activities={profile ? profile.points.phase_1.activity : []}
          />
          <PhaseCTAs profile={profile} />
        </Card>
      </TabsContent>
      <TabsContent value="phase2">
        <Card>
          <ActivityTable
            title="Phase 2 activity"
            activities={profile ? profile.points.phase_2.activity : []}
          />
          <PhaseCTAs profile={profile} />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
