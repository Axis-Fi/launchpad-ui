import { Text, Card } from "@repo/ui";
import React from "react";
import { useWizard } from "react-use-wizard";
import { useAccount } from "wagmi";
import ConnectButton from "components/connect-button";
import { PointsHeader } from "../claim-points-header";

export function ConnectStep() {
  const { isConnected } = useAccount();
  const { nextStep } = useWizard();

  React.useEffect(() => {
    if (isConnected) nextStep();
  }, [isConnected, nextStep]);

  return (
    <Card className="bg-surface w-[304px]">
      <PointsHeader />
      <div className="mt-6 space-y-2">
        <Text>Welcome to the Axis Points Claim!</Text>
        <Text>Create a user profile to claim your points.</Text>
        <Text>Link addresses and refer friends to multiply your points.</Text>
        <ConnectButton size="md" />
      </div>
    </Card>
  );
}
