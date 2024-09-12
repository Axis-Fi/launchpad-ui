import { Card, Text } from "@repo/ui";
import { useWizard } from "react-use-wizard";
import { EditProfile } from "../edit-profile";
import { ClaimPointsHeader } from "./claim-points-header";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useProfile } from "../hooks/use-profile";
import { Format } from "modules/token/format";

export function CreateProfileStep() {
  const wizard = useWizard();
  const { address } = useAccount();
  const { walletPoints } = useProfile();

  useEffect(() => {
    if (address == null) return;
    walletPoints.fetch(address);
  }, [address, walletPoints]);

  return (
    <Card className="bg-surface w-full">
      <ClaimPointsHeader subtitle="Create Profile" />
      <EditProfile create onSuccess={wizard.nextStep}>
        <PendingPoints points={walletPoints.data?.totalPoints ?? 0} />
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
              <Format value={props.points} />
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
