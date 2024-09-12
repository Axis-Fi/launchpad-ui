import { Text, Card } from "@repo/ui";
import React from "react";
import { useWizard } from "react-use-wizard";
import { useAccount } from "wagmi";
import ConnectButton from "components/connect-button";
import { ClaimPointsHeader } from "./claim-points-header";

export function ConnectStep() {
  const { isConnected } = useAccount();
  const { nextStep } = useWizard();

  React.useEffect(() => {
    if (isConnected) nextStep();
  }, [isConnected, nextStep]);

  return (
    <Card className="bg-surface max-w-[304px]">
      <ClaimPointsHeader />
      <div className="mt-6 space-y-2">
        <Text>Welcome to the Axis Points Claim!</Text>
        <Text>Create a user profile to claim your points!</Text>
        <Text>Link addresses and refer friends to multiply your points.</Text>
        <ConnectButton size="md" />
        <Text uppercase mono size="sm" className="text-foreground-secondary">
          By using Axis, you agree to our{" "}
          <span className="font-bold">Terms of Services</span> and our{" "}
          <span className="font-bold">Privacy Policy </span>
        </Text>
      </div>
    </Card>
  );
}
