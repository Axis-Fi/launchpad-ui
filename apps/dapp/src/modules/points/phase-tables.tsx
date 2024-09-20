import { Link } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  Button,
  Metric,
} from "@/components";
import { Format } from "modules/token/format";
import type { FullUserProfile } from "@repo/points";
import { ActivityTable } from "./activity-table";
import { useMediaQueries } from "loaders/use-media-queries";

const PhaseCTAs = ({ profile }: PhaseTablesProps) => {
  return (
    <div className="flex w-full justify-center">
      {profile && (
        <Button
          variant="secondary"
          className="w-full md:w-[33%] lg:w-[20%]"
          asChild
        >
          <Link to="/points/refer">Share referral link</Link>
        </Button>
      )}
    </div>
  );
};

type PhaseTablesProps = {
  profile?: FullUserProfile;
};

export function PhaseTables({ profile }: PhaseTablesProps) {
  const { isTabletOrMobile } = useMediaQueries();
  return (
    <Tabs defaultValue="phase1">
      <TabsList>
        <TabsTrigger value="phase1" className="uppercase">
          Phase 1
        </TabsTrigger>
        <TabsTrigger value="phase2" className="uppercase">
          Phase 2
        </TabsTrigger>
      </TabsList>
      <TabsContent value="phase1" className="mt-0">
        <Card>
          <ActivityTable
            title="Phase 1 activity"
            activities={profile?.activities?._1 ?? []}
            titleRightElement={
              <div className="grow justify-end gap-x-40 pl-4 lg:flex">
                <Metric label="Bid points" size={isTabletOrMobile ? "s" : "l"}>
                  <Format value={profile?.points?._1?.bidPoints ?? 0} />
                </Metric>
                <Metric
                  label="Referral points"
                  size={isTabletOrMobile ? "s" : "l"}
                >
                  <Format value={profile?.points?._1?.refPoints ?? 0} />
                </Metric>
              </div>
            }
          />
          <PhaseCTAs profile={profile} />
        </Card>
      </TabsContent>
      <TabsContent value="phase2" className="mt-0">
        <Card>
          <ActivityTable
            title="Phase 2 activity"
            activities={profile?.activities?._2 ?? []}
            titleRightElement={
              <div className="flex grow justify-end gap-x-40 pl-4">
                <Metric label="Bid points" size={isTabletOrMobile ? "s" : "l"}>
                  <Format value={profile?.points?._2?.bidPoints ?? 0} />
                </Metric>
                <Metric
                  label="Referral points"
                  size={isTabletOrMobile ? "s" : "l"}
                >
                  <Format value={profile?.points?._2?.refPoints ?? 0} />
                </Metric>
              </div>
            }
          />
          <PhaseCTAs profile={profile} />
        </Card>
      </TabsContent>
    </Tabs>
  );
}
