import { Text, Button, cn } from "@repo/ui";
import { Wizard, useWizard } from "react-use-wizard";
import { ConnectStep } from "./claim-steps/connect-step";
import { CreateProfileStep } from "./claim-steps/create-profile-step";
import { ViewPointsStep } from "./claim-steps/view-points-step";

export function ClaimPointsWizard() {
  return (
    <div className="max-w-sm">
      <Wizard footer={<Footer />}>
        <ConnectStep />
        <CreateProfileStep />
        <ViewPointsStep />

        <div>Configure </div>
      </Wizard>
    </div>
  );
}

//debug only
function Footer() {
  const { nextStep, previousStep } = useWizard();

  return (
    <div className="mt-4 flex justify-center gap-x-4 *:w-full">
      <Button size="sm" onClick={previousStep}>
        Previous step
      </Button>
      <Button size="sm" onClick={nextStep}>
        Next step
      </Button>
    </div>
  );
}

export function AxisPointsHeader({
  title = "Axis Drop",
  subtitle = "Points Claiming",
  subtitleClassName,
}: {
  title?: string;
  subtitle?: string;
  subtitleClassName?: string;
}) {
  return (
    <div className="text-right">
      <Text
        size="sm"
        mono
        uppercase
        className="text-foreground-tertiary tracking-widest"
      >
        {title}
      </Text>
      <Text
        className={cn(
          "ml-auto mt-1 w-2/3 font-light leading-none tracking-wide",
          subtitleClassName,
        )}
        size="xl"
        mono
      >
        {subtitle}
      </Text>
    </div>
  );
}
