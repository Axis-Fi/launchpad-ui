import { Button, cn } from "@repo/ui";
import { featureToggles } from "@repo/env";
import ConnectButton from "../../components/connect-button";
import { trimCurrency } from "utils/currency";
import { useProfile } from "modules/points/hooks/use-profile";
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const { profile, isUserRegistered, isUserSignedIn, ...profileActions } =
    useProfile();
  const navigate = useNavigate();
  const isRegistered = isUserRegistered.data;

  if (!featureToggles.POINTS_PHASE_1) {
    return <ConnectButton className="hidden md:block" size="md" />;
  }

  const handleClick = () => {
    if (!isRegistered) return navigate("/points/claim");

    if (!isUserSignedIn) return profileActions.signIn.mutate();

    return navigate("/points");
  };

  const points = profile?.points?._1?.totalPoints;

  return (
    <div className="flex items-center justify-center gap-x-4">
      <div className={cn("auction-ended-gradient rounded-md p-[2px]")}>
        <div className="bg-background flex items-center justify-between gap-x-2 rounded-md p-1">
          <img className="size-8" src="/points-logo.png" />
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClick}
            className={cn(
              "text-foreground-highlight px-0 py-0 text-center leading-none",
              !isRegistered && "text-nowrap",
            )}
          >
            {isUserSignedIn
              ? `${points !== undefined ? trimCurrency(points) : "???"} points`
              : isRegistered
                ? "Sign In"
                : "Claim Profile"}
          </Button>
        </div>
      </div>

      <ConnectButton className="hidden w-auto md:block" size="md" />
    </div>
  );
}
