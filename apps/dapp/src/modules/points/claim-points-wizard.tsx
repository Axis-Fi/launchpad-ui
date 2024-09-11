import { Text, Button, Card } from "@repo/ui";
import React from "react";
import { Wizard, useWizard } from "react-use-wizard";
import { useAccount } from "wagmi";
import ConnectButton from "components/connect-button";

export function ClaimPointsWizard() {
  return (
    <div className="max-w-sm">
      <Wizard footer={<Footer />}>
        <ConnectStep />

        <div>Configure </div>
      </Wizard>
    </div>
  );
}

function Footer() {
  const { nextStep, previousStep } = useWizard();

  return (
    <div className="flex gap-x-4">
      <Button size="sm" onClick={previousStep}>
        Previous step
      </Button>
      <Button size="sm" onClick={nextStep}>
        Next step
      </Button>
    </div>
  );
}

function ConnectStep() {
  const { isConnected } = useAccount();
  const { nextStep } = useWizard();

  React.useEffect(() => {
    if (isConnected) nextStep();
  }, [isConnected]);

  return (
    <Card className="bg-surface max-w-[304px]">
      <AxisPointsHeader />
      <div className="mt-6 space-y-2">
        <Text>Welcome to the Axis Points Claim!</Text>
        <Text>Create a user profile and claim your gift!</Text>
        <Text>Link addresses and refer friends to multiply your points.</Text>
        <ConnectButton />
        <Text uppercase mono size="sm" className="text-foreground-secondary">
          By using Axis, you agree to our{" "}
          <span className="font-bold">Terms of Services</span> and our{" "}
          <span className="font-bold">Privacy Policy </span>
        </Text>
      </div>
    </Card>
  );
}

function AxisPointsHeader() {
  return (
    <div className="text-right">
      <Text
        size="sm"
        mono
        uppercase
        className="text-foreground-tertiary tracking-widest"
      >
        Axis Drop
      </Text>
      <Text
        className="ml-auto mt-1 w-2/3 font-light leading-none tracking-normal"
        size="xl"
        mono
      >
        Points Claiming
      </Text>
    </div>
  );
}
