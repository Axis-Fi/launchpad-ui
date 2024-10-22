import { Card, Text } from "@repo/ui";
import { useWizard } from "react-use-wizard";
import { ProfileForm } from "../profile-form";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useProfile } from "../hooks/use-profile";
import { Format } from "modules/token/format";
import { PointsHeader } from "../claim-points-header";

export function CreateProfileStep() {
  const wizard = useWizard();
  const { address } = useAccount();
  const { walletPoints, register } = useProfile();

  useEffect(() => {
    if (address == null) return;
    walletPoints.fetch(address);
  }, [address, walletPoints]);

  return (
    <Card className="bg-surface w-full">
      <ProfileForm
        header={<PointsHeader subtitle="Create profile" />}
        submitText="Create profile"
        onSubmit={(data) =>
          register.mutate({ profile: data }, { onSuccess: wizard.nextStep })
        }
        isLoading={register.isPending}
      >
        <PendingPoints points={walletPoints.data?.totalPoints ?? 0} />
      </ProfileForm>
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
