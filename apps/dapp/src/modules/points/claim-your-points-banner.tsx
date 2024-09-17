import { ArrowRightIcon } from "lucide-react";
import { Button, Text } from "@/components";
import { useProfile } from "./hooks/use-profile";

export function ClaimYourPointsBanner() {
  const { isUserRegistered } = useProfile();

  if (isUserRegistered.isLoading || isUserRegistered.data) return null;

  return (
    <div className="bg-surface p-md gap-md green-gradient-border flex w-full items-center justify-center rounded-lg">
      <img src="points-logo.png" className="size-[160px]" />
      <Text mono size="1xl" weight="light">
        Axis is rewarding users who participated in historical launches!
      </Text>
      <Button className="w-[300px]">
        Claim your points <ArrowRightIcon className="pl-1" />
      </Button>
    </div>
  );
}
