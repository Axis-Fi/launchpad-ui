import { Button } from "@repo/ui";
import { environment } from "@repo/env";
import { Wizard, useWizard } from "react-use-wizard";
import { ConnectStep } from "./claim-steps/connect-step";
import { CreateProfileStep } from "./claim-steps/create-profile-step";
import { ViewPointsStep } from "./claim-steps/view-points-step";
import { LinkWalletStep } from "./claim-steps/link-wallet-step";

export function ClaimPointsWizard() {
  return (
    <div className="max-w-[384px]">
      <Wizard footer={<Footer />}>
        <ConnectStep />
        <CreateProfileStep />
        <ViewPointsStep />
        <LinkWalletStep />
      </Wizard>
    </div>
  );
}

//debug only
function Footer() {
  const { nextStep, previousStep } = useWizard();
  if (!environment.isDevelopment) return null;

  return (
    <div className="mt-4 flex justify-center gap-x-4 *:w-full">
      <Button size="sm" variant="secondary" onClick={previousStep}>
        Previous step
      </Button>
      <Button size="sm" variant="secondary" onClick={nextStep}>
        Next step
      </Button>
    </div>
  );
}
