import { Card } from "@repo/ui";
import { useWizard } from "react-use-wizard";
import { EditProfile } from "../edit-profile";
import { AxisPointsHeader } from "../claim-points-wizard";

export function CreateProfileStep() {
  const wizard = useWizard();

  return (
    <Card className="pb-0">
      <AxisPointsHeader subtitle="Create Profile" />
      <EditProfile create onSuccess={wizard.nextStep} />
    </Card>
  );
}
