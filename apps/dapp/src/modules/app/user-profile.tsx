import { Text } from "@repo/ui";
import { featureToggles } from "@repo/env";
import ConnectButton from "../../components/connect-button";
import { trimCurrency } from "utils/currency";
import { useProfile } from "modules/points/use-profile";

export function UserProfile() {
  const { profile, showProfile } = useProfile();

  if (!featureToggles.POINTS_PHASE_1) {
    return <ConnectButton className="hidden md:block" size="md" />;
  }

  return (
    // TODO: make this component link to the user's profile page
    <div className="flex items-center justify-center gap-x-2">
      {showProfile && (
        <Text
          className="text-foreground-highlight text-nowrap py-0 pl-0.5 leading-none "
          size="sm"
        >
          {trimCurrency(profile.points.total)} points
        </Text>
      )}
      <ConnectButton className="hidden md:block" size="md" />
    </div>
  );
}
