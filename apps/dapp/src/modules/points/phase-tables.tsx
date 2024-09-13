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

type PhaseTablesProps = {
  profile?: FullUserProfile;
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
            activities={profile?.activities?._1 ?? []}
            titleRightElement={
              <div className="flex grow justify-end gap-x-40">
                <Metric label="Bid points" size="l">
                  <Format value={profile?.points?._1?.bidPoints ?? 0} />
                </Metric>
                <Metric label="Referral points" size="l">
                  <Format value={profile?.points?._1?.refPoints ?? 0} />
                </Metric>
              </div>
            }
          />
          <PhaseCTAs profile={profile} />
        </Card>
      </TabsContent>
      <TabsContent value="phase2">
        <Card>
          <ActivityTable
            title="Phase 2 activity"
            activities={profile?.activities?._2 ?? []}
            titleRightElement={
              <div className="flex grow justify-end gap-x-40">
                <Metric label="Bid points" size="l">
                  <Format value={profile?.points?._2?.bidPoints ?? 0} />
                </Metric>
                <Metric label="Referral points" size="l">
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
