import { Card, Text } from "@repo/ui";
import { useWizard } from "react-use-wizard";
import { EditProfile } from "../edit-profile";
import { ClaimPointsHeader } from "./claim-points-header";

export function CreateProfileStep() {
  const wizard = useWizard();

  return (
    <Card className="pb-0">
      <ClaimPointsHeader subtitle="Create Profile" />
      <EditProfile create onSuccess={wizard.nextStep}>
        <PendingPoints points={1000} />
      </EditProfile>
    </Card>
  );
}

function PendingPoints(props: { points: number }) {
  return (
    <div className="claim-points-gradient-horizontal w-full rounded-sm p-[2px]">
      <Card className="bg-surface w-full rounded-sm py-2">
        <div className="flex items-center">
          <img src="points-logo.png" className="size-[120px] py-0" />
          <div className="mx-auto">
            <Text size="xl" className="text-foreground-tertiary">
              {props.points}
            </Text>
            <Text
              uppercase
              mono
              className="text-foreground-tertiary tracking-wider"
            >
              Points pending
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
}
