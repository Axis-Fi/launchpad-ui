import { Button, cn } from "@repo/ui";
import { featureToggles } from "@repo/env";
import ConnectButton from "../../components/connect-button";
import { trimCurrency } from "utils/currency";
import { useProfile } from "modules/points/hooks/use-profile";
import { useNavigate } from "react-router-dom";
import { useMediaQueries } from "loaders/use-media-queries";
import { shorten } from "utils/number";

export function UserProfile() {
  const { profile, isUserRegistered, isUserSignedIn, ...profileActions } =
    useProfile();
  const navigate = useNavigate();
  const isRegistered = isUserRegistered.data;
  const { isTabletOrMobile } = useMediaQueries();

  if (!featureToggles.POINTS_PHASE_1) {
    return <ConnectButton className="hidden md:block" size="md" />;
  }

  const isLoading = isUserRegistered.isLoading;

  const handleClick = () => {
    if (!isRegistered) return navigate("/points/claim");

    if (!isUserSignedIn) return profileActions.signIn.mutate(undefined);

    return navigate("/points");
  };

  const points = profile?.points?._0?.totalPoints;

  const formattedPoints = points
    ? isTabletOrMobile
      ? shorten(points)
      : trimCurrency(points)
    : null;

  return (
    <div className="flex items-center justify-center gap-x-4">
      <div className="bg-background px-md green-gradient-border flex h-[48px] items-center justify-between gap-x-2 rounded-md p-1">
        <img className="size-8" src="/points-logo.png" />
        {!isLoading && (
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
              ? `${points != null ? formattedPoints : "???"} points`
              : isRegistered
                ? "Sign In"
                : "Claim Points"}
          </Button>
        )}
      </div>

      <ConnectButton className="hidden w-auto md:block" size="md" />
    </div>
  );
}
